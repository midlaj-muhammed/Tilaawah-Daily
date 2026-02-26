import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUserStore, useStreakStore, useProgressStore } from '@/store';
import { Colors, Spacing, Typography } from '@/constants';
import { notificationService } from '@/services';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FEATURED_SURAHS = [
    { id: 36, name: 'Yasin', arabicName: 'يس', description: 'Heart of Quran', color: ['#8B5CF6', '#6D28D9'] },
    { id: 67, name: 'Al-Mulk', arabicName: 'الملك', description: 'Protection', color: ['#3B82F6', '#2563EB'] },
    { id: 56, name: 'Al-Waqiah', arabicName: 'الواقعة', description: 'Sustenance', color: ['#EC4899', '#DB2777'] },
    { id: 18, name: 'Al-Kahf', arabicName: 'الكهف', description: 'Friday Read', color: ['#F59E0B', '#D97706'] },
    { id: 55, name: 'Ar-Rahman', arabicName: 'الرحمن', description: "Allah's Beauty", color: ['#10B981', '#059669'] },
    { id: 2, name: 'Al-Baqarah', arabicName: 'البقرة', description: 'Longest Surah', color: ['#A78BFA', '#7C3AED'] },
    { id: 1, name: 'Al-Fatiha', arabicName: 'الفاتحة', description: 'The Opening', color: ['#F97316', '#EA580C'] },
    { id: 114, name: 'An-Nas', arabicName: 'الناس', description: 'Protection', color: ['#6366F1', '#4F46E5'] },
];

const DAILY_AYAH = {
    text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    english: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    surah: "Al-Fatiha",
    number: "1:1"
};

export default function DashboardScreen() {
    const router = useRouter();
    const { user } = useUserStore();
    const { streakData } = useStreakStore();
    const { progress } = useProgressStore();
    const [greeting, setGreeting] = useState('Assalamu Alaikum');
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 17) setGreeting('Good afternoon');
        else if (hour < 20) setGreeting('Good evening');
        else setGreeting('Good night');

        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();

        // Register push notifications & schedule the daily reminder
        const setupNotifications = async () => {
            const token = await notificationService.registerForPushNotificationsAsync();
            if (token) {
                await notificationService.scheduleDailyReminder(18, 0, streakData?.currentStreak);
            }
        };
        setupNotifications();

    }, [streakData?.currentStreak]);

    const xp = (progress.totalAyahsRead || 0) * 10;
    const level = Math.floor(xp / 500) + 1;
    const xpInLevel = xp % 500;

    const dailyProgressPercent = useMemo(() => {
        const goal = user?.preferences?.dailyGoal || { type: 'minutes', value: 10 };
        const goalType = goal.type;
        const goalValue = goal.value || 10;

        let current = 0;
        if (goalType === 'minutes') {
            current = Math.floor((Number(progress.dailyReadingSeconds) || 0) / 60);
        } else if (goalType === 'pages') {
            current = Math.floor((progress.dailyAyahsRead || 0) / 15);
        } else {
            current = progress.dailyAyahsRead || 0;
        }

        return Math.min((current / goalValue) * 100, 100);
    }, [user, progress]);

    const getCurrentGoalProgress = () => {
        const goalType = user?.preferences?.dailyGoal?.type || 'minutes';
        if (goalType === 'minutes') {
            return Math.floor((Number(progress.dailyReadingSeconds) || 0) / 60);
        } else if (goalType === 'pages') {
            return Math.floor((progress.dailyAyahsRead || 0) / 15);
        }
        return progress.dailyAyahsRead || 0;
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F5F3FF', '#EDE9FE', '#F5F3FF']}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.greetingText}>{greeting}</Text>
                            <Text style={styles.nameText}>{user?.name || 'Habibi'}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.profileButton}
                            onPress={() => router.push('/(tabs)/profile')}
                        >
                            <LinearGradient
                                colors={[Colors.primary[400], Colors.primary[700]]}
                                style={styles.avatarGradient}
                            >
                                <Text style={styles.avatarText}>
                                    {(user?.name || 'H').charAt(0).toUpperCase()}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Gamification Bar */}
                    <LinearGradient
                        colors={[Colors.primary[500], Colors.primary[700]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gamificationBar}
                    >
                        <View style={styles.levelBadge}>
                            <Text style={styles.levelText}>Lvl {level}</Text>
                        </View>
                        <View style={styles.xpContainer}>
                            <Text style={styles.xpText}>{xp} XP</Text>
                            <View style={styles.xpBarBg}>
                                <View style={[styles.xpBarFill, { width: `${(xpInLevel / 500) * 100}%` }]} />
                            </View>
                        </View>
                        <View style={styles.gamificationStats}>
                            <View style={styles.gamificationStatItem}>
                                <Ionicons name="flame" size={16} color="#FCD34D" />
                                <Text style={styles.gamificationStatText}>{streakData?.currentStreak || 0}</Text>
                            </View>
                            <View style={styles.gamificationStatItem}>
                                <Ionicons name="book" size={14} color="rgba(255,255,255,0.7)" />
                                <Text style={styles.gamificationStatText}>{progress.totalAyahsRead}</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Daily Goal Card */}
                    <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/(tabs)/progress')}>
                        <LinearGradient
                            colors={[Colors.primary[600], Colors.primary[900]]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.goalCard}
                        >
                            <View style={styles.goalHeader}>
                                <View>
                                    <Text style={styles.goalTitle}>Daily Goal</Text>
                                    <Text style={styles.goalSubtitle}>
                                        {getCurrentGoalProgress()} of {user?.preferences?.dailyGoal?.value || 10} {user?.preferences?.dailyGoal?.type || 'minutes'}
                                    </Text>
                                </View>
                                <View style={styles.goalPercentage}>
                                    <Text style={styles.goalPercentageText}>{Math.round(dailyProgressPercent)}%</Text>
                                </View>
                            </View>
                            <View style={styles.goalProgressBg}>
                                <View style={[styles.goalProgressFill, { width: `${dailyProgressPercent}%` }]} />
                            </View>
                            <Text style={styles.goalMotivation}>
                                {dailyProgressPercent >= 100 ? "Amazing! Goal achieved! 🎉" : "Keep going, you're doing great!"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Quick Actions */}
                    <View style={styles.quickActionsRow}>
                        <QuickAction icon="book" label="Read" color={Colors.primary[600]} onPress={() => router.push('/(tabs)/quran')} />
                        <QuickAction icon="bookmarks" label="Bookmarks" color="#EC4899" onPress={() => router.push('/bookmarks')} />
                        <QuickAction icon="stats-chart" label="Stats" color="#3B82F6" onPress={() => router.push('/(tabs)/progress')} />
                        <QuickAction icon="settings" label="Settings" color="#64748B" onPress={() => router.push('/settings')} />
                    </View>

                    {/* Popular Surahs */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Popular Surahs</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/quran')}>
                            <Text style={styles.sectionAction}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredScroll}>
                        {FEATURED_SURAHS.map((surah) => (
                            <TouchableOpacity
                                key={surah.id}
                                style={styles.featuredCardWrapper}
                                onPress={() => router.push(`/surah/${surah.id}`)}
                                activeOpacity={0.9}
                            >
                                <LinearGradient
                                    colors={surah.color as [string, string]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.featuredCard}
                                >
                                    <Text style={styles.featuredArabic}>{surah.arabicName}</Text>
                                    <Text style={styles.featuredName}>{surah.name}</Text>
                                    <Text style={styles.featuredDesc}>{surah.description}</Text>
                                    <View style={styles.featuredBadge}>
                                        <Text style={styles.featuredBadgeText}>#{surah.id}</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Continue Reading */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Continue Reading</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.resumeCard}
                        onPress={() => router.push(`/surah/${progress.lastReadSurahId || 1}`)}
                    >
                        <View style={styles.resumeIcon}>
                            <MaterialCommunityIcons name="book-open-page-variant" size={28} color={Colors.primary[600]} />
                        </View>
                        <View style={styles.resumeContent}>
                            <Text style={styles.resumeSurah}>
                                Surah {FEATURED_SURAHS.find(s => s.id === (progress.lastReadSurahId || 1))?.name || `#${progress.lastReadSurahId || 1}`}
                            </Text>
                            <Text style={styles.resumeAyah}>Ayah {progress.lastReadAyahNumber || 1} • Tap to continue</Text>
                        </View>
                        <View style={styles.resumePlay}>
                            <Ionicons name="play" size={20} color="#FFF" />
                        </View>
                    </TouchableOpacity>

                    {/* Verse of the Day */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Verse of the Day</Text>
                        <TouchableOpacity>
                            <Ionicons name="share-outline" size={20} color={Colors.primary[600]} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.ayahCard}>
                        <View style={styles.ayahQuoteIcon}>
                            <MaterialCommunityIcons name="format-quote-open" size={36} color={Colors.primary[200]} />
                        </View>
                        <Text style={styles.arabicAyah}>{DAILY_AYAH.text}</Text>
                        <Text style={styles.englishAyah}>{DAILY_AYAH.english}</Text>
                        <View style={styles.ayahFooter}>
                            <View style={styles.ayahRef}>
                                <Text style={styles.ayahRefText}>{DAILY_AYAH.surah} {DAILY_AYAH.number}</Text>
                            </View>
                            <TouchableOpacity style={styles.ayahBookmarkBtn}>
                                <Ionicons name="bookmark-outline" size={20} color={Colors.primary[600]} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

function QuickAction({ icon, label, color, onPress }: any) {
    return (
        <TouchableOpacity style={styles.quickAction} onPress={onPress}>
            <View style={[styles.quickActionIcon, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <Text style={styles.quickActionLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F3FF' },
    safeArea: { flex: 1 },
    scrollContent: { padding: 20 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20,
    },
    greetingText: { fontSize: 14, color: Colors.primary[400], fontWeight: '500' },
    nameText: { fontSize: 24, fontWeight: '800', color: '#1E1B4B', letterSpacing: -0.5 },
    profileButton: {
        width: 48, height: 48, borderRadius: 20, overflow: 'hidden',
        elevation: 6, shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8,
    },
    avatarGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: '#FFF', fontSize: 20, fontWeight: '700' },

    // Gamification Bar
    gamificationBar: {
        flexDirection: 'row', alignItems: 'center', padding: 14,
        borderRadius: 20, marginBottom: 20, gap: 12,
    },
    levelBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12,
        paddingVertical: 6, borderRadius: 12,
    },
    levelText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
    xpContainer: { flex: 1 },
    xpText: { color: '#FFF', fontSize: 12, fontWeight: '600', marginBottom: 4 },
    xpBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3 },
    xpBarFill: { height: '100%', backgroundColor: '#FCD34D', borderRadius: 3 },
    gamificationStats: { flexDirection: 'row', gap: 10 },
    gamificationStatItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    gamificationStatText: { color: '#FFF', fontSize: 13, fontWeight: '700' },

    // Goal Card
    goalCard: {
        padding: 24, borderRadius: 28, marginBottom: 20,
        elevation: 8, shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16,
    },
    goalHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 16,
    },
    goalTitle: {
        color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600',
        textTransform: 'uppercase', letterSpacing: 1,
    },
    goalSubtitle: { color: '#FFF', fontSize: 20, fontWeight: '800', marginTop: 4 },
    goalPercentage: {
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center',
        alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    },
    goalPercentageText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
    goalProgressBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, marginBottom: 12 },
    goalProgressFill: { height: '100%', backgroundColor: '#FFF', borderRadius: 4 },
    goalMotivation: {
        color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500', fontStyle: 'italic',
    },

    // Quick Actions
    quickActionsRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        marginBottom: 28, gap: 10,
    },
    quickAction: {
        flex: 1, backgroundColor: '#FFF', padding: 14, borderRadius: 20,
        alignItems: 'center', borderWidth: 1, borderColor: 'rgba(139,92,246,0.06)',
        elevation: 2, shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4,
    },
    quickActionIcon: {
        width: 44, height: 44, borderRadius: 14, justifyContent: 'center',
        alignItems: 'center', marginBottom: 8,
    },
    quickActionLabel: { fontSize: 12, fontWeight: '700', color: '#334155' },

    // Section
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'baseline', marginBottom: 14,
    },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E1B4B' },
    sectionAction: { fontSize: 14, color: Colors.primary[600], fontWeight: '700' },

    // Featured Surahs
    featuredScroll: { paddingRight: 20, gap: 12, marginBottom: 28 },
    featuredCardWrapper: { width: 130 },
    featuredCard: {
        borderRadius: 24, padding: 16, height: 160, justifyContent: 'space-between',
        elevation: 6, shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8,
    },
    featuredArabic: { fontSize: 24, fontWeight: '700', color: '#FFF', textAlign: 'center' },
    featuredName: { fontSize: 14, fontWeight: '700', color: '#FFF', textAlign: 'center' },
    featuredDesc: { fontSize: 10, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
    featuredBadge: {
        alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
    },
    featuredBadgeText: { fontSize: 10, color: '#FFF', fontWeight: '600' },

    // Resume Card
    resumeCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
        padding: 16, borderRadius: 24, marginBottom: 28,
        elevation: 3, shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8,
        borderWidth: 1, borderColor: 'rgba(139,92,246,0.06)',
    },
    resumeIcon: {
        width: 56, height: 56, borderRadius: 18, backgroundColor: Colors.primary[50],
        justifyContent: 'center', alignItems: 'center', marginRight: 16,
    },
    resumeContent: { flex: 1 },
    resumeSurah: { fontSize: 17, fontWeight: '700', color: '#1E1B4B', marginBottom: 4 },
    resumeAyah: { fontSize: 13, color: '#64748B', fontWeight: '500' },
    resumePlay: {
        width: 36, height: 36, borderRadius: 14, backgroundColor: Colors.primary[600],
        justifyContent: 'center', alignItems: 'center',
    },

    // Verse of Day
    ayahCard: {
        padding: 24, borderRadius: 28, marginBottom: 20,
        backgroundColor: '#FFF', borderWidth: 1, borderColor: 'rgba(139,92,246,0.06)',
        elevation: 3, shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10,
        alignItems: 'center', overflow: 'hidden',
    },
    ayahQuoteIcon: { marginBottom: -8 },
    arabicAyah: {
        fontSize: 26, fontWeight: 'bold', color: Colors.primary[900],
        textAlign: 'center', marginBottom: 16, lineHeight: 42,
    },
    englishAyah: {
        fontSize: 15, color: '#475569', textAlign: 'center',
        lineHeight: 22, marginBottom: 20,
    },
    ayahFooter: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        width: '100%', marginTop: 10, paddingTop: 16,
        borderTopWidth: 1, borderTopColor: '#F1F5F9',
    },
    ayahRef: {
        backgroundColor: Colors.primary[50], paddingHorizontal: 12,
        paddingVertical: 6, borderRadius: 10,
    },
    ayahRefText: { fontSize: 12, fontWeight: '700', color: Colors.primary[700] },
    ayahBookmarkBtn: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC',
        justifyContent: 'center', alignItems: 'center',
    },
});
