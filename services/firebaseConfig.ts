import { initializeApp, getApps, getApp } from 'firebase/app';
import {
    initializeAuth,
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithCredential,
    onAuthStateChanged,
    User as FirebaseUser,
} from 'firebase/auth';
// @ts-ignore - Ignore the TypeScript error for RN persistence not being exported in node esm config mapping
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "tilaawah-daily.firebaseapp.com",
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "tilaawah-daily",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "tilaawah-daily.firebasestorage.app",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "232177874845",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:232177874845:android:caa81dd0f57cc42897a174"
};

// Initialize Firebase app (singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with React Native AsyncStorage persistence
let auth: ReturnType<typeof initializeAuth>;

try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
} catch (e: any) {
    if (e?.code === 'auth/already-initialized') {
        auth = getAuth(app) as any;
    } else {
        throw e;
    }
}

export {
    app,
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithCredential,
    onAuthStateChanged,
};

export type { FirebaseUser };
export const getFirebaseAuth = () => auth;
export default app;
