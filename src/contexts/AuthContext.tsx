"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserProfile, logout as firebaseLogout, createProfileFromAuth } from '@/lib/auth';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  login: (user: FirebaseUser, profile: UserProfile) => void;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', firebaseUser ? `User logged in: ${firebaseUser.uid}` : 'User logged out');
      
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Create profile from Firebase Auth data (Auth-only mode)
        const authProfile = createProfileFromAuth(firebaseUser);
        
        if (mounted) {
          setProfile(authProfile);
          console.log('Successfully loaded user profile from Firebase Auth');
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      
      if (mounted) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = (firebaseUser: FirebaseUser, userProfile: UserProfile) => {
    setUser(firebaseUser);
    setProfile(userProfile);
  };

  const logout = async () => {
    try {
      await firebaseLogout();
      setUser(null);
      setProfile(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      login, 
      logout, 
      updateProfile, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
