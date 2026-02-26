import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { StateStorage } from 'zustand/middleware';

// On first load, clear all storage to prevent corrupted data crashes
let hasCleared = false;
const clearAllStorageOnce = async () => {
    if (hasCleared) return;
    hasCleared = true;
    try {
        const version = await AsyncStorage.getItem('app_theme_version');
        if (version !== 'purple_v2') {
            await AsyncStorage.clear();
            await AsyncStorage.setItem('app_theme_version', 'purple_v2');
        }
    } catch (e) {
        try { await AsyncStorage.clear(); } catch (_) { }
    }
};

// Run immediately on import (before Zustand rehydrates)
if (Platform.OS !== 'web') {
    clearAllStorageOnce();
}

export const zustandStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        try {
            if (Platform.OS === 'web') {
                return localStorage.getItem(name) ?? null;
            }
            return await AsyncStorage.getItem(name);
        } catch (error) {
            console.warn(`Storage read error for "${name}":`, error);
            try { await AsyncStorage.removeItem(name); } catch (_) { }
            return null;
        }
    },
    setItem: async (name: string, value: string): Promise<void> => {
        try {
            if (Platform.OS === 'web') {
                localStorage.setItem(name, value);
                return;
            }
            await AsyncStorage.setItem(name, value);
        } catch (error) {
            console.warn(`Storage write error for "${name}":`, error);
        }
    },
    removeItem: async (name: string): Promise<void> => {
        try {
            if (Platform.OS === 'web') {
                localStorage.removeItem(name);
                return;
            }
            await AsyncStorage.removeItem(name);
        } catch (error) {
            console.warn(`Storage remove error for "${name}":`, error);
        }
    },
};
