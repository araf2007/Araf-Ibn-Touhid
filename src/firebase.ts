import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc, Timestamp, getDocFromServer } from 'firebase/firestore';
import { UserProfile } from './types.js';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();

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
    return result.user;
  } catch (error) {
    console.error('Auth Popup Login Failure:', error);
    throw error;
  }
}

// Sign Out
export async function logout() {
  await signOut(auth);
}

// Run test connection
testConnection();
