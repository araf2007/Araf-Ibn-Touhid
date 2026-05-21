import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc, Timestamp, getDocFromServer } from 'firebase/firestore';
import { UserProfile } from './types.js';
import firebaseConfig from './components/firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');

// In-memory cache for the OAuth access token
let cachedAccessToken: string | null = null;

export function getCachedToken(): string | null {
  return cachedAccessToken;
}

export function setCachedToken(token: string | null) {
  cachedAccessToken = token;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

// Helper: Save User Profile
export async function saveUserProfile(uid: string, profile: UserProfile) {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    const isNew = !docSnap.exists();
    
    const payload = {
      uid,
      degreeLevel: profile.degreeLevel,
      currentCGPA: profile.currentCGPA,
      ieltsScore: profile.ieltsScore,
      workExperienceYears: profile.workExperienceYears,
      fieldOfStudy: profile.fieldOfStudy,
      hasMoi: profile.hasMoi,
      updatedAt: Timestamp.now()
    };
    
    await setDoc(docRef, payload);
    return isNew;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Helper: Fetch User Profile
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        degreeLevel: data.degreeLevel as any,
        currentCGPA: Number(data.currentCGPA),
        ieltsScore: Number(data.ieltsScore),
        workExperienceYears: Number(data.workExperienceYears),
        fieldOfStudy: String(data.fieldOfStudy),
        hasMoi: Boolean(data.hasMoi)
      };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Helper: Fetch Bookmarks
export async function fetchUserBookmarks(userId: string): Promise<string[]> {
  const path = 'bookmarks';
  try {
    const q = query(collection(db, 'bookmarks'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const bookmarks: string[] = [];
    querySnapshot.forEach((doc) => {
      bookmarks.push(doc.data().scholarshipId);
    });
    return bookmarks;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Helper: Add Bookmark
export async function addBookmark(userId: string, scholarshipId: string) {
  const bookmarkId = `${userId}_${scholarshipId}`;
  const path = `bookmarks/${bookmarkId}`;
  try {
    await setDoc(doc(db, 'bookmarks', bookmarkId), {
      userId,
      scholarshipId,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Helper: Remove Bookmark
export async function removeBookmark(userId: string, scholarshipId: string) {
  const bookmarkId = `${userId}_${scholarshipId}`;
  const path = `bookmarks/${bookmarkId}`;
  try {
    await deleteDoc(doc(db, 'bookmarks', bookmarkId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Sign In
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }
    return result.user;
  } catch (error) {
    console.error('Auth Popup Login Failure:', error);
    throw error;
  }
}

// Sign Out
export async function logout() {
  await signOut(auth);
  cachedAccessToken = null;
}

// Helper: Fetch Payments to check if a scholarship has been unlocked
export async function checkPaymentStatus(userId: string, scholarshipId: string): Promise<boolean> {
  const path = 'payments';
  try {
    const q = query(
      collection(db, 'payments'), 
      where('userId', '==', userId), 
      where('scholarshipId', '==', scholarshipId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Payment fetch error, defaulting to false:', error);
    return false;
  }
}

// Helper: Fetch user's unlocked scholarship IDs (payments)
export async function fetchUserPayments(userId: string): Promise<string[]> {
  const path = 'payments';
  try {
    const q = query(collection(db, 'payments'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const paidScholarships: string[] = [];
    querySnapshot.forEach((doc) => {
      paidScholarships.push(doc.data().scholarshipId);
    });
    return paidScholarships;
  } catch (error) {
    console.error("Failed to load user payments:", error);
    return [];
  }
}

// Helper: Save Payment Record
export async function savePaymentRecord(userId: string, scholarshipId: string, trxId: string) {
  const paymentId = `${userId}_${scholarshipId}`;
  const path = `payments/${paymentId}`;
  try {
    await setDoc(doc(db, 'payments', paymentId), {
      userId,
      scholarshipId,
      trxId,
      amount: 10,
      createdAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Run test connection
testConnection();
