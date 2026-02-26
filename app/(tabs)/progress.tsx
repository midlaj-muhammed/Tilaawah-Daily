import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '@/constants';
import { useProgressStore, useStreakStore } from '@/store';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProgressScreen() {
    const { progress } = useProgressStore();
    const { streakData } = useStreakStore();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.headerTitle}>Your Progress</Text>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: '#FF9F0A20' }]}>
                            <Ionicons name="flame" size={24} color="#FF9F0A" />
                        </View>
                        <Text style={styles.statValue}>{streakData?.currentStreak || 0}</Text>
                        <Text style={styles.statLabel}>Day Streak</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: Colors.primary[500] + '20' }]}>
                            <Ionicons name="book" size={24} color={Colors.primary[500]} />
                        </View>
                        <Text style={styles.statValue}>{progress.totalAyahsRead}</Text>
                        <Text style={styles.statLabel}>Ayahs Read</Text>
                    </View>
                </View>

                {/* Longest Streak Card */}
                <LinearGradient colors={[Colors.primary[800], Colors.primary[900]]} style={styles.longestStreakCard}>
                    <MaterialCommunityIcons name="trophy" size={40} color="#FFD700" />
                    <View style={styles.longestStreakInfo}>
                        <Text style={styles.longestStreakLabel}>Longest Streak</Text>
                        <Text style={styles.longestStreakValue}>{streakData?.longestStreak || 0} Days</Text>
                    </View>
                </LinearGradient>

                <Text style={styles.sectionTitle}>Quran Completion</Text>
                <View style={styles.quranProgressCard}>
                    <View style={styles.quranProgressHeader}>
                        <Text style={styles.quranProgressTitle}>Total Progress</Text>
                        <Text style={styles.quranProgressPercent}>{((progress.totalAyahsRead / 6236) * 100).toFixed(1)}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <LinearGradient
                            colors={[Colors.primary[400], Colors.primary[600]]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressBarFill, { width: `${Math.min((progress.totalAyahsRead / 6236) * 100, 100)}%` }]}
                        />
                    </View>
                    <Text style={styles.quranProgressSubtitle}>{progress.totalAyahsRead} of 6,236 Ayahs</Text>
                </View>

                <Text style={styles.sectionTitle}>Activity History</Text>
                {streakData?.history && streakData.history.length > 0 ? (
                    <View style={styles.historyList}>
                        {[...streakData.history].reverse().slice(0, 10).map((dateStr, index) => {
                            const date = new Date(dateStr);
                            const isToday = dateStr === new Date().toISOString().split('T')[0];
                            return (
                                <View key={index} style={styles.historyItem}>
                                    <View style={styles.historyIconWrapper}>
                                        <Ionicons name="checkmark-circle" size={24} color={Colors.primary[500]} />
                                    </View>
                                    <View style={styles.historyItemContent}>
                                        <Text style={styles.historyItemTitle}>Daily Reading Completed</Text>
                                        <Text style={styles.historyItemDate}>
                                            {isToday ? 'Today' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <View style={styles.emptyActivity}>
                        <Ionicons name="calendar-outline" size={48} color="#E5E7EB" />
                        <Text style={styles.emptyText}>Keep reading to build your history</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F3FF' },
    content: { padding: 24, paddingBottom: 100 },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#1E1B4B', marginBottom: 24 },
    statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
    statCard: { flex: 1, backgroundColor: '#FFF', padding: 20, borderRadius: 24, alignItems: 'center', elevation: 3, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
    statIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    statValue: { fontSize: 24, fontWeight: '800', color: '#1E1B4B' },
    statLabel: { fontSize: 13, color: Colors.primary[400], fontWeight: '600', marginTop: 4 },
    longestStreakCard: { flexDirection: 'row', alignItems: 'center', padding: 24, borderRadius: 24, marginBottom: 32 },
    longestStreakInfo: { marginLeft: 16 },
    longestStreakLabel: { color: 'rgba(196,181,253,0.6)', fontSize: 14, fontWeight: '600' },
    longestStreakValue: { color: '#FFF', fontSize: 24, fontWeight: '800', marginTop: 2 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E1B4B', marginBottom: 16 },
    emptyActivity: { alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: '#FFFFFF', borderRadius: 24, borderStyle: 'dashed', borderWidth: 2, borderColor: Colors.primary[100] },
    emptyText: { color: Colors.primary[300], marginTop: 12, fontWeight: '500' },
    historyList: { gap: 12 },
    historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
    historyIconWrapper: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary[50], justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    historyItemContent: { flex: 1 },
    historyItemTitle: { fontSize: 15, fontWeight: '700', color: '#1E1B4B', marginBottom: 2 },
    historyItemDate: { fontSize: 13, color: '#64748B', fontWeight: '500' },
    quranProgressCard: { backgroundColor: '#FFF', padding: 24, borderRadius: 24, marginBottom: 32, elevation: 3, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
    quranProgressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    quranProgressTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B' },
    quranProgressPercent: { fontSize: 20, fontWeight: '800', color: Colors.primary[600] },
    progressBarBg: { height: 12, backgroundColor: Colors.primary[50], borderRadius: 6, overflow: 'hidden', marginBottom: 12 },
    progressBarFill: { height: '100%', borderRadius: 6 },
    quranProgressSubtitle: { fontSize: 13, color: '#64748B', fontWeight: '500', textAlign: 'right' },
});
