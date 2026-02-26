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
import { Colors, Typography, Spacing, BorderRadius, Shadows, TRANSLATIONS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

export default function TranslationSettingsScreen() {
    const router = useRouter();
    const { user, updatePreferences } = useUserStore();
    const { colors, isDark } = useTheme();

    const currentTranslation = user?.preferences.preferredTranslation ?? 'en.sahih';

    const handleSelect = (translationId: string) => {
        updatePreferences({ preferredTranslation: translationId });
        router.back();
    };

    const isPremium = user?.subscription === 'premium';

    // Group translations by language
    const groupedTranslations = TRANSLATIONS.reduce((acc, translation) => {
        if (!acc[translation.language]) {
            acc[translation.language] = [];
        }
        acc[translation.language].push(translation);
        return acc;
    }, {} as Record<string, typeof TRANSLATIONS[number][]>);

    const languageOrder = ['Malayalam', 'English', 'Hindi', 'Urdu', 'Tamil', 'Bengali', 'French', 'Turkish', 'Malay', 'Indonesian', 'Russian', 'German', 'Spanish', 'Persian'];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Translation',
                    headerStyle: { backgroundColor: colors.surface },
                    headerTintColor: colors.text,
                    headerBackTitle: 'Back',
                }}
            />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Translation</Text>
                    <Text style={[styles.sectionDescription, { color: colors.textTertiary }]}>
                        Tap to select — saves automatically
                    </Text>
                </View>

                {languageOrder.map((language) => {
                    const translations = groupedTranslations[language];
                    if (!translations) return null;
                    return (
                        <View key={language} style={styles.languageSection}>
                            <Text style={[styles.languageHeader, { color: isDark ? Colors.primary[400] : Colors.primary[700], backgroundColor: isDark ? 'rgba(5,150,105,0.1)' : Colors.primary[50] }]}>{language}</Text>
                            <View style={styles.translationsContainer}>
                                {translations.map((translation) => {
                                    const isLocked = translation.isPremium && !isPremium;
                                    const isSelected = currentTranslation === translation.id;

                                    return (
                                        <TouchableOpacity
                                            key={translation.id}
                                            style={[
                                                styles.translationCard,
                                                { backgroundColor: colors.surface },
                                                isSelected && [styles.translationCardSelected, { backgroundColor: isDark ? 'rgba(5,150,105,0.15)' : Colors.primary[50] }],
                                                isLocked && styles.translationCardLocked,
                                            ]}
                                            onPress={() => !isLocked && handleSelect(translation.id)}
                                            disabled={isLocked}
                                        >
                                            <View style={styles.translationInfo}>
                                                <Text style={[
                                                    styles.translationName,
                                                    { color: colors.text },
                                                    isSelected && { color: isDark ? Colors.primary[400] : Colors.primary[600] },
                                                ]}>
                                                    {translation.name}
                                                </Text>
                                                <Text style={[styles.translationAuthor, { color: colors.textTertiary }]}>by {translation.author}</Text>
                                                <View style={styles.translationMeta}>
                                                    <View style={[styles.languageBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.neutral[100] }]}>
                                                        <Text style={[styles.languageText, { color: colors.textSecondary }]}>{translation.language}</Text>
                                                    </View>
                                                    {translation.isPremium && (
                                                        <View style={styles.premiumBadge}>
                                                            <Text style={styles.premiumBadgeText}>👑 Premium</Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>

                                            <View style={styles.translationActions}>
                                                {isLocked ? (
                                                    <View style={styles.lockedBadge}>
                                                        <Text style={styles.lockedText}>🔒</Text>
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
                        </View>
                    );
                })}

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
    languageSection: {
        marginBottom: Spacing.base,
    },
    languageHeader: {
        fontSize: Typography.fontSize.md,
        fontWeight: '700',
        color: Colors.primary[700],
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.sm,
        backgroundColor: Colors.primary[50],
        marginBottom: Spacing.sm,
    },
    translationsContainer: {
        paddingHorizontal: Spacing.xl,
        gap: Spacing.sm,
    },
    translationCard: {
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
    translationCardSelected: {
        borderColor: Colors.primary[500],
        backgroundColor: Colors.primary[50],
    },
    translationCardLocked: {
        opacity: 0.6,
    },
    translationInfo: {
        flex: 1,
    },
    translationName: {
        fontSize: Typography.fontSize.base,
        fontWeight: '600',
        color: Colors.neutral[700],
        marginBottom: 2,
    },
    translationNameSelected: {
        color: Colors.primary[600],
    },
    translationAuthor: {
        fontSize: Typography.fontSize.sm,
        color: Colors.neutral[500],
        marginBottom: Spacing.xs,
    },
    translationMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    languageBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
        backgroundColor: Colors.neutral[100],
    },
    languageText: {
        fontSize: Typography.fontSize.xs,
        color: Colors.neutral[600],
    },
    premiumBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
        backgroundColor: Colors.accent[100],
    },
    premiumBadgeText: {
        fontSize: Typography.fontSize.xs,
        color: Colors.accent[700],
    },
    translationActions: {
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
        backgroundColor: Colors.neutral[200],
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