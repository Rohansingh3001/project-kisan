import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: typeof process !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY : "AIzaSyBMLbNbUiuAgmvP7qKE_VUIqGB8HQl9Gzg",
  authDomain: typeof process !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN : "agrisaarthi2025.firebaseapp.com",
  projectId: typeof process !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID : "agrisaarthi2025",
  storageBucket: typeof process !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET : "agrisaarthi2025.firebasestorage.app",
  messagingSenderId: typeof process !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID : "124815962859",
  appId: typeof process !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? process.env.NEXT_PUBLIC_FIREBASE_APP_ID : "1:124815962859:web:0d2e15897e83bc4d0ec4ae",
  measurementId: typeof process !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID : "G-C4278SV23V"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Auth only
export const auth = getAuth(app);

export default app;
