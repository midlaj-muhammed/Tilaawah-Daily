import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '@/store';
import { Card, Button } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius, Shadows, RECITERS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

export default function ReciterSettingsScreen() {
    const router = useRouter();
    const { user, updatePreferences } = useUserStore();
    const { colors, isDark } = useTheme();

    const currentReciter = user?.preferences.preferredReciter ?? 'mishary_rashid';

    const handleSelect = (reciterId: string) => {
        updatePreferences({ preferredReciter: reciterId });
        router.back();
    };

    const isPremium = user?.subscription === 'premium';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Reciter',
                    headerStyle: { backgroundColor: colors.surface },
                    headerTintColor: colors.text,
                    headerBackTitle: 'Back',
                }}
            />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Reciter</Text>
                    <Text style={[styles.sectionDescription, { color: colors.textTertiary }]}>
                        Tap to select — saves automatically
                    </Text>
                </View>

                <View style={styles.recitersContainer}>
                    {RECITERS.map((reciter) => {
                        const isLocked = reciter.isPremium && !isPremium;
                        const isSelected = currentReciter === reciter.id;

                        return (
                            <TouchableOpacity
                                key={reciter.id}
                                style={[
                                    styles.reciterCard,
                                    { backgroundColor: colors.surface },
                                    isSelected && [styles.reciterCardSelected, { backgroundColor: isDark ? 'rgba(5,150,105,0.15)' : Colors.primary[50] }],
                                    isLocked && styles.reciterCardLocked,
                                ]}
                                onPress={() => !isLocked && handleSelect(reciter.id)}
                                disabled={isLocked}
                            >
                                <View style={styles.reciterInfo}>
                                    <Text style={[styles.reciterArabicName, { color: isDark ? Colors.primary[400] : Colors.primary[600] }]}>{reciter.arabicName}</Text>
                                    <Text style={[
                                        styles.reciterName,
                                        { color: colors.text },
                                        isSelected && { color: isDark ? Colors.primary[400] : Colors.primary[600] },
                                    ]}>
                                        {reciter.name}
                                    </Text>
                                    <Text style={[styles.reciterStyle, { color: colors.textTertiary }]}>{reciter.style}</Text>
                                </View>

                                <View style={styles.reciterActions}>
                                    {isLocked ? (
                                        <View style={styles.lockedBadge}>
                                            <Text style={styles.lockedText}>👑</Text>
                                        </View>
                                    ) : isSelected ? (
                                        <View style={styles.selectedBadge}>
                                            <Text style={styles.selectedCheck}>✓</Text>
                                        </View>
                                    ) : null}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {!isPremium && (
                    <Card style={[styles.premiumCard, { backgroundColor: isDark ? 'rgba(234,179,8,0.1)' : Colors.accent[25] }]}>
                        <Text style={styles.premiumIcon}>👑</Text>
                        <Text style={[styles.premiumTitle, { color: isDark ? Colors.accent[400] : Colors.accent[700] }]}>Unlock More Reciters</Text>
                        <Text style={[styles.premiumDescription, { color: colors.textTertiary }]}>
                            Upgrade to Premium to access all reciters including Mohammed Siddiq
                            El-Minshawi, Maher Al-Muaiqly, and Saud Al-Shuraim.
                        </Text>
                        <Button
                            title="Upgrade to Premium"
                            onPress={() => router.push('/settings/subscription')}
                            variant="primary"
                            size="md"
                            style={styles.premiumButton}
                        />
                    </Card>
                )}

                <View style={{ height: Spacing['4xl'] }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.base,
    },
    sectionTitle: {
        fontSize: Typography.fontSize['2xl'],
        fontWeight: '700',
        color: Colors.neutral[900],
        marginBottom: Spacing.xs,
    },
    sectionDescription: {
        fontSize: Typography.fontSize.base,
        color: Colors.neutral[500],
    },
    recitersContainer: {
        paddingHorizontal: Spacing.xl,
        gap: Spacing.sm,
    },
    reciterCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.base,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.light.surface,
        borderWidth: 2,
        borderColor: 'transparent',
        ...Shadows.sm,
    },
    reciterCardSelected: {
        borderColor: Colors.primary[500],
        backgroundColor: Colors.primary[50],
    },
    reciterCardLocked: {
        opacity: 0.6,
    },
    reciterInfo: {
        flex: 1,
    },
    reciterArabicName: {
        fontSize: Typography.fontSize.lg,
        color: Colors.primary[600],
        marginBottom: 2,
    },
    reciterName: {
        fontSize: Typography.fontSize.base,
        fontWeight: '600',
        color: Colors.neutral[700],
        marginBottom: 2,
    },
    reciterNameSelected: {
        color: Colors.primary[600],
    },
    reciterStyle: {
        fontSize: Typography.fontSize.sm,
        color: Colors.neutral[500],
    },
    reciterActions: {
        marginLeft: Spacing.base,
    },
    selectedBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedCheck: {
        fontSize: Typography.fontSize.base,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    lockedBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.accent[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockedText: {
        fontSize: 16,
    },
    premiumCard: {
        marginHorizontal: Spacing.xl,
        marginTop: Spacing.xl,
        alignItems: 'center',
        backgroundColor: Colors.accent[25],
        borderColor: Colors.accent[200],
        borderWidth: 1,
    },
    premiumIcon: {
        fontSize: 32,
        marginBottom: Spacing.sm,
    },
    premiumTitle: {
        fontSize: Typography.fontSize.lg,
        fontWeight: '600',
        color: Colors.accent[700],
        marginBottom: Spacing.xs,
    },
    premiumDescription: {
        fontSize: Typography.fontSize.sm,
        color: Colors.neutral[600],
        textAlign: 'center',
        marginBottom: Spacing.base,
        lineHeight: Typography.fontSize.sm * 1.5,
    },
    premiumButton: {
        minWidth: 180,
    },
    buttonContainer: {
        paddingHorizontal: Spacing.xl,
        marginTop: Spacing.xl,
    },
});