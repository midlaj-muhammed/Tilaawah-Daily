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
    apiKey: "AIzaSyBedmkgo120xSShmXbYlYTrvU8fxohMKLo",
    authDomain: "tilaawah-daily.firebaseapp.com",
    projectId: "tilaawah-daily",
    storageBucket: "tilaawah-daily.firebasestorage.app",
    messagingSenderId: "232177874845",
    appId: "1:232177874845:android:caa81dd0f57cc42897a174"
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
