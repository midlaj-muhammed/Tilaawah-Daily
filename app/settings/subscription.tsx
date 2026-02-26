import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '@/store';
import { Card, Button } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius, Shadows, SUBSCRIPTION_PRICES, PREMIUM_FEATURES, RECITERS, TRANSLATIONS } from '@/constants';
import { useSubscriptionService } from '@/services/subscriptionService';
import { useTheme } from '@/hooks/useTheme';

const PREMIUM_FEATURE_LIST = [
    { icon: '📊', title: 'Advanced Analytics', description: 'Detailed reading statistics and insights' },
    { icon: '🎙️', title: 'Premium Reciters', description: 'Access to all Quran reciters' },
    { icon: '📖', title: 'More Translations', description: 'Additional English and other language translations' },
    { icon: '🔥', title: 'Streak Protection', description: 'One day grace period for maintaining streaks' },
    { icon: '📱', title: 'Offline Mode', description: 'Download audio for offline listening' },
    { icon: '⚖️', title: 'Side-by-Side View', description: 'Compare translations simultaneously' },
];

export default function SubscriptionScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { user, updateUser } = useUserStore();
    const subscriptionService = useSubscriptionService();

    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
    const [loading, setLoading] = useState(false);
    const [isPremium, setIsPremium] = useState(user?.subscription === 'premium');

    const savings = subscriptionService.getYearlySavings();

    const handleSubscribe = async () => {
        if (isPremium) {
            Alert.alert(
                'Manage Subscription',
                'Your subscription is active.',
                [{ text: 'OK' }]
            );
            return;
        }

        setLoading(true);
        try {
            await subscriptionService.purchaseSubscription(
                selectedPlan,
                (subscription) => {
                    setIsPremium(true);
                    updateUser({ subscription: 'premium' });
                    Alert.alert('Welcome to Premium! 🎉', 'Unlocked all features.', [{ text: 'Great!', onPress: () => router.back() }]);
                },
                (error) => Alert.alert('Purchase Failed', error)
            );
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <Stack.Screen options={{ headerShown: true, headerTitle: 'Premium' }} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.premiumIcon}>👑</Text>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Upgrade to Premium</Text>
                </View>

                {!isPremium && (
                    <View style={styles.section}>
                        <View style={styles.plansContainer}>
                            <TouchableOpacity
                                style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardActive]}
                                onPress={() => setSelectedPlan('monthly')}
                            >
                                <Text style={[styles.planName, { color: colors.text }]}>Monthly</Text>
                                <Text style={[styles.planPrice, { color: colors.text }]}>${SUBSCRIPTION_PRICES.monthly}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardActive]}
                                onPress={() => setSelectedPlan('yearly')}
                            >
                                <Text style={[styles.planName, { color: colors.text }]}>Yearly</Text>
                                <Text style={[styles.planPrice, { color: colors.text }]}>${SUBSCRIPTION_PRICES.yearly}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={styles.buttonSection}>
                    <Button
                        title={loading ? 'Processing...' : isPremium ? 'Manage Subscription' : 'Subscribe'}
                        onPress={handleSubscribe}
                        loading={loading}
                        fullWidth
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { alignItems: 'center', padding: Spacing.xl },
    premiumIcon: { fontSize: 48, marginBottom: Spacing.base },
    headerTitle: { fontSize: 24, fontWeight: '700' },
    section: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
    plansContainer: { flexDirection: 'row', gap: Spacing.base },
    planCard: { flex: 1, padding: Spacing.base, borderRadius: BorderRadius.lg, borderWidth: 1, alignItems: 'center' },
    planCardActive: { borderColor: Colors.primary[600], backgroundColor: Colors.primary[50] },
    planName: { fontWeight: '600' },
    planPrice: { fontSize: 20, fontWeight: '700' },
    buttonSection: { paddingHorizontal: Spacing.xl },
});
