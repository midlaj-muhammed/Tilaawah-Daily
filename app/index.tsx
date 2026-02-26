import { Redirect } from 'expo-router';
import { useUserStore } from '@/store';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, Colors } from '@/constants';

export default function Index() {
    const { user, isAuthenticated, hasHydrated } = useUserStore();
    const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkOnboarding = async () => {
            try {
                const status = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
                setOnboardingComplete(status === 'true');
            } catch (error) {
                console.warn('Error checking onboarding:', error);
                setOnboardingComplete(false);
            } finally {
                setLoading(false);
            }
        };
        checkOnboarding();
    }, []);

    if (loading || !hasHydrated) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.light.background }}>
                <ActivityIndicator size="large" color={Colors.primary[600]} />
            </View>
        );
    }

    if (!onboardingComplete) {
        return <Redirect href="/welcome" />;
    }

    if (!isAuthenticated || !user) {
        return <Redirect href="/(auth)/login" />;
    }

    return <Redirect href="/(tabs)" />;
}
