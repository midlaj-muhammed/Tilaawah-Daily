import { User, ApiResponse, LoginFormData, RegisterFormData } from '@/types';
import { DEFAULT_PREFERENCES } from '@/constants';
import {
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithCredential,
} from './firebaseConfig';

// Helper to map Firebase User to local User type
export const mapFirebaseUser = (firebaseUser: any, name?: string, existingPreferences?: any): User => {
    return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
        preferences: existingPreferences
            ? { ...DEFAULT_PREFERENCES, ...existingPreferences }
            : DEFAULT_PREFERENCES,
        subscription: 'free',
    };
};

export const authService = {
    /**
     * Email/password login via Firebase Auth JS SDK
     */
    login: async (credentials: LoginFormData): Promise<ApiResponse<{ user: User }>> => {
        try {
            if (!credentials.email?.trim()) {
                return { success: false, error: 'Email is required' };
            }
            if (!credentials.password) {
                return { success: false, error: 'Password is required' };
            }

            const userCredential = await signInWithEmailAndPassword(
                auth,
                credentials.email.trim(),
                credentials.password
            );

            const user = mapFirebaseUser(userCredential.user);
            return { success: true, data: { user } };

        } catch (error: any) {
            console.error('Login error:', error.code, error.message);

            const errorMessages: Record<string, string> = {
                'auth/user-not-found': 'No account found with this email',
                'auth/wrong-password': 'Incorrect password',
                'auth/invalid-email': 'Invalid email address',
                'auth/user-disabled': 'This account has been disabled',
                'auth/too-many-requests': 'Too many failed attempts. Please try again later',
                'auth/invalid-credential': 'Invalid email or password',
            };

            return {
                success: false,
                error: errorMessages[error.code] || 'Login failed. Please try again.',
            };
        }
    },

    /**
     * Email/password registration via Firebase Auth JS SDK
     */
    register: async (data: RegisterFormData): Promise<ApiResponse<{ user: User }>> => {
        try {
            if (!data.email?.trim()) {
                return { success: false, error: 'Email is required' };
            }
            if (!data.password || data.password.length < 6) {
                return { success: false, error: 'Password must be at least 6 characters' };
            }

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                data.email.trim(),
                data.password
            );

            // Set the display name
            if (data.name) {
                await updateProfile(userCredential.user, { displayName: data.name });
            }

            const user = mapFirebaseUser(userCredential.user, data.name);
            return { success: true, data: { user } };

        } catch (error: any) {
            console.error('Register error:', error.code, error.message);

            const errorMessages: Record<string, string> = {
                'auth/email-already-in-use': 'An account with this email already exists',
                'auth/invalid-email': 'Invalid email address',
                'auth/weak-password': 'Password is too weak. Use at least 6 characters',
                'auth/operation-not-allowed': 'Email/password sign-up is disabled',
            };

            return {
                success: false,
                error: errorMessages[error.code] || 'Registration failed. Please try again.',
            };
        }
    },

    /**
     * Google Sign-In using ID token from expo-auth-session
     * Creates a Firebase credential from the Google ID token
     */
    loginWithGoogle: async (idToken: string): Promise<ApiResponse<{ user: User }>> => {
        try {
            if (!idToken) {
                return { success: false, error: 'No Google token received' };
            }

            // Create a Google credential with the ID token
            const credential = GoogleAuthProvider.credential(idToken);

            // Sign in to Firebase with the Google credential
            const userCredential = await signInWithCredential(auth, credential);
            const user = mapFirebaseUser(userCredential.user);

            return { success: true, data: { user } };

        } catch (error: any) {
            console.error('Google Sign-In error:', error.code, error.message);

            const errorMessages: Record<string, string> = {
                'auth/invalid-credential': 'Invalid Google credentials. Please try again.',
                'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method',
                'auth/user-disabled': 'This account has been disabled',
            };

            return {
                success: false,
                error: errorMessages[error.code] || 'Google Sign-In failed. Please try again.',
            };
        }
    },

    /**
     * Sign out from Firebase
     */
    logout: async (): Promise<void> => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    /**
     * Send password reset email via Firebase
     */
    requestPasswordReset: async (email: string): Promise<ApiResponse<{ message: string }>> => {
        try {
            if (!email?.trim()) {
                return { success: false, error: 'Email is required' };
            }

            await sendPasswordResetEmail(auth, email.trim());
            return { success: true, data: { message: 'Password reset email sent! Check your inbox.' } };

        } catch (error: any) {
            console.error('Password reset error:', error.code, error.message);

            const errorMessages: Record<string, string> = {
                'auth/user-not-found': 'No account found with this email',
                'auth/invalid-email': 'Invalid email address',
                'auth/too-many-requests': 'Too many requests. Please try again later',
            };

            return {
                success: false,
                error: errorMessages[error.code] || 'Failed to send reset email. Please try again.',
            };
        }
    },

    /**
     * Update user profile (display name)
     */
    updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                return { success: false, error: 'Not authenticated' };
            }

            if (data.name) {
                await updateProfile(currentUser, { displayName: data.name });
            }

            return { success: true, data: mapFirebaseUser(currentUser, data.name) };
        } catch (error: any) {
            return { success: false, error: error.message || 'Failed to update profile' };
        }
    },

    /**
     * Get current Firebase user
     */
    getCurrentUser: () => auth.currentUser,
};

export const useAuthService = () => authService;
export default authService;
