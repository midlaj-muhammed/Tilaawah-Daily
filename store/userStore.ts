import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserPreferences, SubscriptionTier } from '@/types';
import { DEFAULT_PREFERENCES, STORAGE_KEYS } from '@/constants';
import { authService } from '@/services/authService';
import { zustandStorage } from './storage';

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    hasHydrated: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setHydrated: (state: boolean) => void;
    updateUser: (updates: Partial<User>) => void;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
    setSubscription: (tier: SubscriptionTier) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            hasHydrated: false,

            setHydrated: (state) => set({ hasHydrated: state }),

            setUser: (user) => {
                set({
                    user,
                    isAuthenticated: !!user,
                    isLoading: false,
                });
            },

            updateUser: (updates) =>
                set((state) => {
                    const newUser = state.user ? { ...state.user, ...updates } : null;
                    return { user: newUser };
                }),

            updatePreferences: (preferences) =>
                set((state) => {
                    const newUser = state.user
                        ? {
                            ...state.user,
                            preferences: { ...state.user.preferences, ...preferences },
                        }
                        : null;
                    return { user: newUser };
                }),

            setSubscription: (tier) =>
                set((state) => {
                    const newUser = state.user ? { ...state.user, subscription: tier } : null;
                    return { user: newUser };
                }),

            logout: async () => {
                await authService.logout();
                set({
                    user: null,
                    isAuthenticated: false,
                });
            },

            setLoading: (loading) =>
                set({ isLoading: loading }),
        }),
        {
            name: STORAGE_KEYS.USER,
            storage: createJSONStorage(() => zustandStorage),
            // Only persist user data, not transient loading state
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.setHydrated(true);
                }
            },
        }
    )
);

// Selectors
export const selectUser = (state: UserState) => state.user;
export const selectIsAuthenticated = (state: UserState) => state.isAuthenticated;
export const selectPreferences = (state: UserState) => state.user?.preferences;
export const selectSubscription = (state: UserState) => state.user?.subscription;
export const selectIsPremium = (state: UserState) => state.user?.subscription === 'premium';