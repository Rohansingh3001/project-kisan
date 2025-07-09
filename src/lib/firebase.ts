import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, connectFirestoreEmulator, clearIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBMLbNbUiuAgmvP7qKE_VUIqGB8HQl9Gzg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "agrisaarthi2025.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "agrisaarthi2025",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "agrisaarthi2025.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "124815962859",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:124815962859:web:0d2e15897e83bc4d0ec4ae",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-C4278SV23V"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);

// Initialize Firestore with force long polling to avoid WebChannel issues
let firestoreDb: any;
try {
  console.log('Initializing Firestore with long polling...');
  firestoreDb = initializeFirestore(app, {
    experimentalForceLongPolling: true, // Force long polling instead of WebSocket
    cacheSizeBytes: 40000000, // 40MB cache 
  });
} catch (error: any) {
  console.warn('Firestore already initialized, using existing instance:', error.message);
  firestoreDb = getFirestore(app);
}

export const db = firestoreDb;

export const storage = getStorage(app);
export const functions = getFunctions(app);

// Clear any corrupted IndexedDB persistence on initialization
if (typeof window !== "undefined") {
  clearIndexedDbPersistence(db).catch((error: any) => {
    console.log('IndexedDB already cleared or not enabled:', error.code);
  });
}

// Function to clear persistence when needed
export const clearFirestorePersistence = async () => {
  try {
    await clearIndexedDbPersistence(db);
    console.log('Firestore persistence cleared successfully');
  } catch (error: any) {
    console.warn('Failed to clear Firestore persistence:', error);
  }
};

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
