import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore, useStreakStore, useProgressStore } from '@/store';
import { Button, Card, ProgressBar } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { Colors, Typography, Spacing, BorderRadius, Shadows, STORAGE_KEYS, SUBSCRIPTION_PRICES, TOTAL_AYAHS, RECITERS, TRANSLATIONS } from '@/constants';

export default function ProfileScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { user, logout, updatePreferences } = useUserStore();
    const { streakData } = useStreakStore();
    const { progress } = useProgressStore();

    const handleLogout = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.multiRemove([
                            STORAGE_KEYS.USER,
                            STORAGE_KEYS.AUTH_TOKEN,
                        ]);
                        logout();
                        router.replace('/welcome');
                    },
                },
            ]
        );
    };

    const currentReciter = RECITERS.find(r => r.id === user?.preferences.preferredReciter);
    const currentTranslation = TRANSLATIONS.find(t => t.id === user?.preferences.preferredTranslation);

    const menuItems = [
        {
            section: 'Account',
            items: [
                { iconName: 'person-outline', title: 'Edit Profile', onPress: () => router.push('/settings/edit-profile') },
                { iconName: 'flag-outline', title: 'Daily Goal', subtitle: `${user?.preferences.dailyGoal.value} ${user?.preferences.dailyGoal.type}`, onPress: () => router.push('/settings/daily-goal') },
                { iconName: 'notifications-outline', title: 'Notifications', onPress: () => router.push('/settings/notifications') },
            ],
        },
        {
            section: 'Reading',
            items: [
                { iconName: 'mic-outline', title: 'Reciter', subtitle: currentReciter?.name || 'Mishary Rashid Alafasy', onPress: () => router.push('/settings/reciter') },
                { iconName: 'language-outline', title: 'Translation', subtitle: currentTranslation?.name || 'Sahih International', onPress: () => router.push('/settings/translation') },
                { iconName: 'text-outline', title: 'Font Size', subtitle: user?.preferences.fontSize || 'Medium', onPress: () => router.push('/settings/fontsize') },
            ],
        },
        {
            section: 'App',
            items: [
                { iconName: 'settings-outline', title: 'Settings', onPress: () => router.push('/settings') },
                { iconName: 'star-outline', title: 'Rate App', onPress: () => { } },
                { iconName: 'chatbox-ellipses-outline', title: 'Feedback', onPress: () => { } },
                { iconName: 'document-text-outline', title: 'Privacy Policy', onPress: () => { } },
            ],
        },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
                </View>

                {/* Profile Card */}
                <View>
                    <Card style={[styles.profileCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : Colors.light.surface }]}>
                        <LinearGradient
                            colors={isDark ? [Colors.primary[800], Colors.primary[900]] : [Colors.primary[50], Colors.primary[100]]}
                            style={styles.profileGradient}
                        >
                            <View style={styles.avatarContainer}>
                                <LinearGradient
                                    colors={[Colors.primary[400], Colors.primary[600]]}
                                    style={styles.avatar}
                                >
                                    <Text style={styles.avatarText}>
                                        {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                                    </Text>
                                </LinearGradient>
                            </View>
                            <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'Guest User'}</Text>
                            <Text style={[styles.userEmail, { color: colors.textTertiary }]}>{user?.email || 'Not signed in'}</Text>
                        </LinearGradient>

                        <View style={[styles.profileStats, { borderTopColor: colors.border }]}>
                            <View style={styles.profileStat}>
                                <Text style={[styles.profileStatValue, { color: Colors.primary[600] }]}>{streakData.currentStreak}</Text>
                                <Text style={[styles.profileStatLabel, { color: colors.textTertiary }]}>Streak</Text>
                            </View>
                            <View style={[styles.profileStatDivider, { backgroundColor: colors.border }]} />
                            <View style={styles.profileStat}>
                                <Text style={[styles.profileStatValue, { color: Colors.primary[600] }]}>{progress?.totalAyahsRead ?? 0}</Text>
                                <Text style={[styles.profileStatLabel, { color: colors.textTertiary }]}>Ayahs</Text>
                            </View>
                            <View style={[styles.profileStatDivider, { backgroundColor: colors.border }]} />
                            <View style={styles.profileStat}>
                                <Text style={[styles.profileStatValue, { color: Colors.primary[600] }]}>{user?.subscription === 'premium' ? 'Pro' : 'Free'}</Text>
                                <Text style={[styles.profileStatLabel, { color: colors.textTertiary }]}>Plan</Text>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Quick Progress */}
                <View>
                    <Card style={[styles.quickProgress, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : Colors.light.surface }]}>
                        <View style={styles.quickProgressHeader}>
                            <Text style={[styles.quickProgressTitle, { color: colors.text }]}>Quran Progress</Text>
                            <Text style={[styles.quickProgressPercent, { color: Colors.primary[600] }]}>
                                {progress?.completionPercentage ?? 0}%
                            </Text>
                        </View>
                        <ProgressBar progress={progress?.completionPercentage ?? 0} height={8} />
                    </Card>
                </View>

                {/* Premium Banner */}
                {user?.subscription !== 'premium' && (
                    <TouchableOpacity
                        onPress={() => router.push('/settings/subscription')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#7C3AED', '#5B21B6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.premiumBanner}
                        >
                            <View style={styles.premiumContent}>
                                <View style={styles.premiumIconContainer}>
                                    <Ionicons name="ribbon" size={24} color="#FFFFFF" />
                                </View>
                                <View style={styles.premiumText}>
                                    <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                                    <Text style={styles.premiumSubtitle}>Unlock all features</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* Menu Sections */}
                {menuItems.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={styles.menuSection}>
                        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>{section.section}</Text>
                        <Card style={[styles.menuCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : Colors.light.surface }]} padding="none">
                            {section.items.map((item, itemIndex) => (
                                <TouchableOpacity
                                    key={itemIndex}
                                    style={[
                                        styles.menuItem,
                                        itemIndex < section.items.length - 1 && [styles.menuItemBorder, { borderBottomColor: colors.border }],
                                    ]}
                                    onPress={item.onPress}
                                >
                                    <View style={[styles.menuIconContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : colors.surfaceSecondary }]}>
                                        <Ionicons name={item.iconName as any} size={20} color={isDark ? Colors.primary[400] : Colors.primary[600]} />
                                    </View>
                                    <View style={styles.menuContent}>
                                        <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
                                        {item.subtitle && (
                                            <Text style={[styles.menuSubtitle, { color: colors.textTertiary }]}>{item.subtitle}</Text>
                                        )}
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={colors.textQuaternary} />
                                </TouchableOpacity>
                            ))}
                        </Card>
                    </View>
                ))}

                {/* Sign Out Button */}
                <View style={styles.signOutSection}>
                    <Button
                        title="Sign Out"
                        variant="outline"
                        onPress={handleLogout}
                        fullWidth
                    />
                </View>

                {/* Version */}
                <Text style={[styles.version, { color: colors.textTertiary }]}>Tilaawah Daily v1.0.0</Text>

                <View style={{ height: Spacing['4xl'] }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.base,
    },
    title: {
        fontSize: Typography.fontSize['3xl'],
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    profileCard: {
        marginHorizontal: Spacing.xl,
        marginBottom: Spacing.base,
        overflow: 'hidden',
    },
    profileGradient: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
        paddingHorizontal: Spacing.base,
    },
    avatarContainer: {
        marginBottom: Spacing.base,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    avatarText: {
        fontSize: Typography.fontSize['3xl'],
        fontWeight: '700',
        color: '#FFFFFF',
    },
    userName: {
        fontSize: Typography.fontSize.xl,
        fontWeight: '700',
        marginBottom: Spacing.xs,
    },
    userEmail: {
        fontSize: Typography.fontSize.sm,
    },
    profileStats: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: Spacing.base,
        paddingHorizontal: Spacing.base,
        borderTopWidth: 1,
    },
    profileStat: {
        flex: 1,
        alignItems: 'center',
    },
    profileStatValue: {
        fontSize: Typography.fontSize.xl,
        fontWeight: '700',
    },
    profileStatLabel: {
        fontSize: Typography.fontSize.sm,
        marginTop: 2,
    },
    profileStatDivider: {
        width: 1,
        height: 30,
    },
    quickProgress: {
        marginHorizontal: Spacing.xl,
        marginBottom: Spacing.lg,
        padding: Spacing.lg,
    },
    quickProgressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    quickProgressTitle: {
        fontSize: Typography.fontSize.base,
        fontWeight: '600',
    },
    quickProgressPercent: {
        fontSize: Typography.fontSize.base,
        fontWeight: '700',
    },
    premiumBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: Spacing.xl,
        marginBottom: Spacing.lg,
        padding: Spacing.lg,
        borderRadius: BorderRadius.xl,
    },
    premiumContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    premiumIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.base,
    },
    premiumText: {
        flex: 1,
        paddingRight: Spacing.sm,
    },
    premiumTitle: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    premiumSubtitle: {
        fontSize: Typography.fontSize.xs,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    menuSection: {
        paddingHorizontal: Spacing.xl,
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '600',
        marginBottom: Spacing.sm,
        marginLeft: Spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    menuCard: {},
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.base,
        paddingHorizontal: Spacing.lg,
    },
    menuItemBorder: {
        borderBottomWidth: 0.5,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.base,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: Typography.fontSize.base,
        fontWeight: '600',
    },
    menuSubtitle: {
        fontSize: Typography.fontSize.sm,
        marginTop: 2,
    },
    menuArrow: {
        marginLeft: Spacing.xs,
    },
    signOutSection: {
        paddingHorizontal: Spacing.xl,
        marginTop: Spacing.base,
    },
    version: {
        textAlign: 'center',
        fontSize: Typography.fontSize.sm,
        marginTop: Spacing.xl,
    },
});