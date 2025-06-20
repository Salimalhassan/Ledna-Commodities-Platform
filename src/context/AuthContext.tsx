
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { type User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User } from '@/lib/types'; // Your rich User type
import { useRouter } from 'next/navigation';
import { ADMIN_USER_IDS } from '@/config/admin'; // Import admin UIDs

interface AuthContextType {
  currentUser: User | null; // Your rich User type
  firebaseUser: FirebaseUser | null; // Raw Firebase Auth user
  loading: boolean;
  isAdmin: boolean; // Add isAdmin flag
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // State for admin status
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // User is signed in, get their profile from Firestore
        setIsAdmin(ADMIN_USER_IDS.includes(fbUser.uid)); // Check for admin status
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCurrentUser({ uid: fbUser.uid, ...userDocSnap.data() } as User);
        } else {
          console.warn(`No Firestore document found for user ${fbUser.uid}.`);
          setCurrentUser(null);
          setIsAdmin(false);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        setIsAdmin(false);
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
      setIsAdmin(false);
      router.push('/auth/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const value = {
    currentUser,
    firebaseUser,
    loading,
    isAdmin, // Provide isAdmin in the context
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

export async function createUserProfileDocument(uid: string, data: Omit<User, 'uid'>) {
  const userDocRef = doc(db, 'users', uid);
  try {
    await setDoc(userDocRef, data);
  } catch (error) {
    console.error("Error creating user profile document:", error);
    throw error;
  }
}
