
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: "ledna-commodities-platform.firebaseapp.com",
  projectId: "ledna-commodities-platform",
  storageBucket: "ledna-commodities-platform.firebasestorage.app",
  messagingSenderId: "739150565886",
  appId: "1:739150565886:web:f5a495fb23514d1d7170af",
  measurementId: "G-EQHWRG2SR6"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
