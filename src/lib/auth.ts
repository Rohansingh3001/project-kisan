import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

// User profile interface for Auth-only mode
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  farmSize?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create profile from Firebase Auth user
export const createProfileFromAuth = (user: FirebaseUser): UserProfile => {
  return {
    id: user.uid,
    name: user.displayName || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    phone: user.phoneNumber || '',
    location: 'India',
    farmSize: '',
    photoURL: user.photoURL || '',
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Email and password login
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const profile = createProfileFromAuth(userCredential.user);
    return { user: userCredential.user, profile };
  } catch (error) {
    console.error('Email login error:', error);
    throw error;
  }
};

// Email and password signup
export const signupWithEmail = async (email: string, password: string, displayName?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    const profile = createProfileFromAuth(userCredential.user);
    return { user: userCredential.user, profile };
  } catch (error) {
    console.error('Email signup error:', error);
    throw error;
  }
};

// Google login
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const profile = createProfileFromAuth(userCredential.user);
    return { user: userCredential.user, profile };
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

// Phone login setup
export const setupRecaptcha = (elementId: string) => {
  return new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: () => {
      console.log('Recaptcha verified');
    }
  });
};

// Send OTP
export const sendOTP = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('OTP send error:', error);
    throw error;
  }
};

// Update user profile in Firebase Auth
export const updateUserProfile = async (user: FirebaseUser, updates: { displayName?: string; photoURL?: string }) => {
  try {
    await updateProfile(user, updates);
    return createProfileFromAuth(user);
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Helper function to get user-friendly error messages
export const getAuthErrorMessage = (error: { code?: string; message?: string }) => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/invalid-phone-number':
      return 'Please enter a valid phone number.';
    case 'auth/invalid-verification-code':
      return 'Invalid OTP. Please try again.';
    case 'auth/code-expired':
      return 'OTP has expired. Please request a new one.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

// Verify OTP and sign in
export const verifyOTP = async (confirmationResult: any, otp: string) => {
  try {
    const userCredential = await confirmationResult.confirm(otp);
    const profile = createProfileFromAuth(userCredential.user);
    return { user: userCredential.user, profile };
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
};

// Phone signup (for users who want to create account with phone)
export const signupWithPhone = async (confirmationResult: any, otp: string, userProfile: Partial<UserProfile>) => {
  try {
    const userCredential = await confirmationResult.confirm(otp);
    
    // Update display name if provided
    if (userProfile.name && userCredential.user) {
      await updateProfile(userCredential.user, { displayName: userProfile.name });
    }
    
    const profile = createProfileFromAuth(userCredential.user);
    return { user: userCredential.user, profile };
  } catch (error) {
    console.error('Phone signup error:', error);
    throw error;
  }
};
