
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { type User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User } from '@/lib/types'; // Your rich User type
import { useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: User | null; // Your rich User type
  firebaseUser: FirebaseUser | null; // Raw Firebase Auth user
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // User is signed in, get their profile from Firestore
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCurrentUser({ uid: fbUser.uid, ...userDocSnap.data() } as User);
        } else {
          // This case might happen if Firestore doc creation failed during signup
          // Or if user was created via Firebase console without a corresponding Firestore doc
          console.warn(`No Firestore document found for user ${fbUser.uid}. Logging out.`);
          // Potentially create a basic profile or log them out
           setCurrentUser(null); // Or handle as an error
           // await firebaseSignOut(auth); // Uncomment to force logout if profile is missing
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setFirebaseUser(null);
      router.push('/auth/login'); // Or to homepage
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle error (e.g., show toast)
    }
  };


  const value = {
    currentUser,
    firebaseUser,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper to create user profile in Firestore, typically called after signup
export async function createUserProfileDocument(uid: string, data: Omit<User, 'uid'>) {
  const userDocRef = doc(db, 'users', uid);
  try {
    await setDoc(userDocRef, data);
  } catch (error) {
    console.error("Error creating user profile document:", error);
    throw error; // Re-throw to be handled by caller
  }
}
