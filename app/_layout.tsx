import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useUserStore } from '@/store';
import { Colors, DEFAULT_PREFERENCES } from '@/constants';
import { auth, onAuthStateChanged } from '@/services/firebaseConfig';

// Prevent splash screen from auto-hiding (only on native)
if (Platform.OS !== 'web') {
    SplashScreen.preventAutoHideAsync();
}

function RootLayoutContent() {
    const colors = Colors.light;

    return (
        <>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    contentStyle: { backgroundColor: colors.background },
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="welcome" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="surah/[id]"
                    options={{
                        animation: 'slide_from_bottom',
                        presentation: 'card',
                    }}
                />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    const [loaded] = useFonts({});
    const [authChecked, setAuthChecked] = useState(false);
    const { setUser } = useUserStore();

    useEffect(() => {
        // Listen to Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in — update Zustand store
                const currentUser = useUserStore.getState().user;
                if (!currentUser || currentUser.id !== firebaseUser.uid) {
                    setUser({
                        id: firebaseUser.uid,
                        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                        email: firebaseUser.email || '',
                        createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
                        preferences: currentUser?.preferences || DEFAULT_PREFERENCES,
                        subscription: currentUser?.subscription || 'free',
                    });
                }
            }
            // Don't clear user on signOut here — let logout() handle it

            setAuthChecked(true);
            if (Platform.OS !== 'web') {
                SplashScreen.hideAsync();
            }
        });

        // Fallback: if auth check takes too long, proceed anyway
        const timeout = setTimeout(() => {
            if (!authChecked) {
                setAuthChecked(true);
                if (Platform.OS !== 'web') {
                    SplashScreen.hideAsync();
                }
            }
        }, 3000);

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    if (Platform.OS !== 'web' && !authChecked) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary[600]} />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <RootLayoutContent />
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
});
