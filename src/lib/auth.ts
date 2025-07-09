import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  ConfirmationResult,
  signOut,
  User,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, clearFirestorePersistence } from './firebase';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone: string;
  location: string;
  farmSize: string;
  cropTypes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign up with email and password
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  userProfile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ user: User; profile: UserProfile }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const profile: UserProfile = {
      ...userProfile,
      id: user.uid,
      email: user.email || email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Save user profile to Firestore
    await setDoc(doc(db, 'users', user.uid), profile);
    
    return { user, profile };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<{ user: User; profile: UserProfile | null }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user profile from Firestore
    const profileDoc = await getDoc(doc(db, 'users', user.uid));
    const profile = profileDoc.exists() ? profileDoc.data() as UserProfile : null;
    
    return { user, profile };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Initialize reCAPTCHA for phone authentication
export const initializeRecaptcha = (containerId: string): RecaptchaVerifier => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      console.log('reCAPTCHA solved');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    }
  });
};

// Send SMS verification code
export const sendSMSVerification = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

// Verify OTP code
export const verifyOTP = async (confirmationResult: ConfirmationResult, otp: string): Promise<{ user: User; profile: UserProfile | null }> => {
  try {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;
    
    // Get user profile from Firestore
    const profileDoc = await getDoc(doc(db, 'users', user.uid));
    const profile = profileDoc.exists() ? profileDoc.data() as UserProfile : null;
    
    return { user, profile };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<{ user: User; profile: UserProfile | null }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user profile exists
    const profileDoc = await getDoc(doc(db, 'users', user.uid));
    let profile: UserProfile | null = null;
    
    if (profileDoc.exists()) {
      profile = profileDoc.data() as UserProfile;
    } else {
      // Create new profile for Google sign-in users
      profile = {
        id: user.uid,
        name: user.displayName || 'User',
        email: user.email || '',
        phone: user.phoneNumber || '',
        location: 'India',
        farmSize: '',
        cropTypes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Save new profile to Firestore
      await setDoc(doc(db, 'users', user.uid), profile);
    }
    
    return { user, profile };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign up with phone number
export const signUpWithPhone = async (
  phoneNumber: string,
  otp: string,
  confirmationResult: ConfirmationResult,
  userProfile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ user: User; profile: UserProfile }> => {
  try {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;
    
    const profile: UserProfile = {
      ...userProfile,
      id: user.uid,
      phone: phoneNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Save user profile to Firestore
    await setDoc(doc(db, 'users', user.uid), profile);
    
    return { user, profile };
  } catch (error) {
    console.error('Error signing up with phone:', error);
    throw error;
  }
};

// Sign out
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get user profile
// Get user profile with comprehensive error handling and path validation
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  // Validate userId parameter
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    console.error('Invalid userId provided to getUserProfile:', userId);
    return null;
  }

  const sanitizedUserId = userId.trim();
  console.log('Getting user profile for userId:', sanitizedUserId);

  try {
    // Create document reference with validated path
    const userDocRef = doc(db, 'users', sanitizedUserId);
    
    // Set a timeout to prevent hanging
    const profilePromise = getDoc(userDocRef);
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Firestore operation timed out')), 10000)
    );

    const profileDoc = await Promise.race([profilePromise, timeoutPromise]);
    
    if (profileDoc.exists()) {
      const data = profileDoc.data() as UserProfile;
      console.log('Successfully retrieved user profile from Firestore');
      return data;
    } else {
      console.log('No user profile document found for userId:', sanitizedUserId);
      return null;
    }
    
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    
    // Handle specific Firebase errors
    if (error?.code === 'failed-precondition' || 
        error?.code === 'unavailable' ||
        error?.code === 'permission-denied' ||
        error?.message?.includes('offline') ||
        error?.message?.includes('network') ||
        error?.message?.includes('timed out')) {
      console.warn('Firebase connection issue, user profile unavailable:', error.code || error.message);
      return null;
    }
    
    // For unexpected errors, still return null but log for debugging
    console.error('Unexpected error getting user profile:', error);
    return null;
  }
};

// Clear Firestore persistence and retry connection
export const clearFirestoreAndRetry = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log('Clearing Firestore persistence and retrying...');
    await clearFirestorePersistence();
    
    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Retry getting the profile
    return await getUserProfile(userId);
  } catch (error) {
    console.error('Failed to clear persistence and retry:', error);
    return null;
  }
}

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Get Firebase Auth error message
export const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/invalid-verification-code':
      return 'Invalid OTP code. Please check and try again.';
    case 'auth/code-expired':
      return 'OTP code has expired. Please request a new one.';
    case 'auth/invalid-phone-number':
      return 'Invalid phone number format.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again.';
    default:
      return error.message || 'An error occurred. Please try again.';
  }
};
