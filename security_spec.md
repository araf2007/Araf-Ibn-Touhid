# Security Specification for Firestore Access

## 1. Domain Data Invariants

1. **Owner-Document Correspondence**: The user profile under `/users/{userId}` is strictly linked to the authenticated user. A user can only write a profile document where `{userId} == request.auth.uid` and the payload `uid` matches the `request.auth.uid`.
2. **Verified Authenticated Writers**: Only authenticated and email-verified accounts (where `request.auth.token.email_verified == true`) are permitted to register, update profiles, or manage bookmarks.
3. **Owner-Bound Bookmarks**: Any bookmark in `/bookmarks/{bookmarkId}` must have a `userId` attribute that exactly corresponds to `request.auth.uid`, preventing any user from creating, editing, or reading another user's bookmarks.
4. **Denial of Wallet Protection**: All string inputs and arrays are bounded by strict size limitations (`.size() < 128` or similar) to prevent memory allocation attacks.

---

## 2. The "Dirty Dozen" Payloads (Adversarial Playbook)

These test payloads attempt to breach domain laws, identity, integrity, and wallet security.

### Payload 1: Profile Spoofing (Identity Hijack)
*   **Target**: `/users/legit_user_abc`
*   **Agressor**: Authenticated as `hacker_xyz`
*   **Payload**: `{"uid": "hacker_xyz", "degreeLevel": "Master", "currentCGPA": 3.5, "ieltsScore": 7.0, "workExperienceYears": 2, "fieldOfStudy": "Computer Science", "hasMoi": true}`
*   **Expectation**: `PERMISSION_DENIED` - Attempt to overwrite or create another user's profile with their own uid or standard data.

### Payload 2: Ghost Field Injection (Privilege Escalation)
*   **Target**: `/users/hacker_xyz`
*   **Agressor**: Authenticated as `hacker_xyz`
*   **Payload**: `{"uid": "hacker_xyz", "degreeLevel": "Master", "currentCGPA": 3.5, "ieltsScore": 7.0, "workExperienceYears": 2, "fieldOfStudy": "Computer Engineering", "hasMoi": true, "isAdmin": true, "updatedAt": "request.time"}`
*   **Expectation**: `PERMISSION_DENIED` - The system should only allow standard fields and enforce structure.

### Payload 3: Bookmark Spoofing (Creating Bookmark for Target User)
*   **Target**: `/bookmarks/bookmark_123`
*   **Agressor**: Authenticated as `hacker_xyz`
*   **Payload**: `{"userId": "victim_abc", "scholarshipId": "chevening", "createdAt": "request.time"}`
*   **Expectation**: `PERMISSION_DENIED` - Attempt to save a bookmark on behalf of a victim.

### Payload 4: Draining Wallet Attack (Value Poisoning)
*   **Target**: `/users/hacker_xyz`
*   **Agressor**: Authenticated as `hacker_xyz`
*   **Payload**: `{"uid": "hacker_xyz", "degreeLevel": "Master", "currentCGPA": 3.5, "ieltsScore": 7.0, "workExperienceYears": 2, "fieldOfStudy": "A".repeat(10000), "hasMoi": true, "updatedAt": "request.time"}`
*   **Expectation**: `PERMISSION_DENIED` - Excessively large string size.

### Payload 5: Unverified User Bypass
*   **Target**: `/users/unverified_user`
*   **Agressor**: Authenticated but `email_verified == false`
*   **Payload**: `{"uid": "unverified_user", "degreeLevel": "Master", "currentCGPA": 3.0, "ieltsScore": 6.0, "workExperienceYears": 1, "fieldOfStudy": "Physics", "hasMoi": false, "updatedAt": "request.time"}`
*   **Expectation**: `PERMISSION_DENIED` - Email verification must be enforced.

### Payload 6: Type Safety Violation (Type Poisoning)
*   **Target**: `/users/hacker_xyz`
*   **Agressor**: Authenticated as `hacker_xyz`
*   **Payload**: `{"uid": "hacker_xyz", "degreeLevel": "Master", "currentCGPA": "Perfect Ten", "ieltsScore": 7.0, "workExperienceYears": 2, "fieldOfStudy": "Bio", "hasMoi": "YES", "updatedAt": "request.time"}`
*   **Expectation**: `PERMISSION_DENIED` - Invalid type inputs (string in double type field, string dynamic value in boolean).

### Payload 7: Immortal Field Alteration (Update CGPA and mutate Immutable fields)
*   **Target**: `/users/hacker_xyz`
*   **Agressor**: Authenticated as `hacker_xyz`
*   **Payload**: Try to update `uid` to `hacker_xyz_new`
*   **Expectation**: `PERMISSION_DENIED` - Fields like `uid` must be immutable.

### Payload 8: PII Query Scraping (Blanket Bookmark Reading)
*   **Target**: Reading `/bookmarks`
*   **Agressor**: Authenticated as `hacker_xyz`
*   **Database Query**: Get all bookmarks across all users without restrictions
*   **Expectation**: `PERMISSION_DENIED` - Collective read is bounded by relational check requiring `resource.data.userId == request.auth.uid`.

### Payload 9: Hijack Single Bookmark (Relational Read Hack)
*   **Target**: Reading `/bookmarks/victim_bookmark`
*   **Agressor**: Authenticated as `hacker_xyz` (Not containing matching auth uid)
*   **Expectation**: `PERMISSION_DENIED` - Single read fails.

### Payload 10: Client Timestamp Injection
*   **Target**: `/bookmarks/bookmark_123`
*   **Agressor**: Authenticated as `hacker_xyz`
*   **Payload**: `{"userId": "hacker_xyz", "scholarshipId": "chevening", "createdAt": "2020-01-01T00:00:00Z"}` (instead of request.time)
*   **Expectation**: `PERMISSION_DENIED` - Timestamp must match Server Time perfectly.

### Payload 11: Invalid ID Path Characters (ID Poisoning)
*   **Target**: `/users/hacker_xyz%2Fadmin%2Finject`
*   **Agressor**: Authenticated as `hacker_xyz`
*   **Expectation**: `PERMISSION_DENIED` - Document id must match alphanumeric `isValidId` pattern.

### Payload 12: Bookmark Mutator (Update Bookmark Scholarship Target)
*   **Target**: `/bookmarks/own_bookmark`
*   **Agressor**: Authenticated as `hacker_xyz`
*   **Payload**: Modifying `scholarshipId` inside an already-existing bookmark
*   **Expectation**: `PERMISSION_DENIED` - Bookmarks are write-once read-only except for deletions.

---

## 3. Test Cases (TDD Runner Structure)

```typescript
// firestore.rules.test.ts (conceptual structure of security validation tests)
describe("Firestore Security Fortress Tests", () => {
  it("denies unauthenticated writes", () => { ... });
  it("denies spoofed profiles", () => { ... });
  it("denies updates to immutable fields", () => { ... });
});
```
