import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/store';
import { Colors } from '@/constants';

export default function NotificationsScreen() {
    const router = useRouter();
    const { user, updatePreferences } = useUserStore();

    const [dailyReminder, setDailyReminder] = useState(user?.preferences.reminderEnabled ?? true);
    const [streakAlerts, setStreakAlerts] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(true);

    const toggleDailyReminder = (value: boolean) => {
        setDailyReminder(value);
        updatePreferences({ reminderEnabled: value });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Reading Reminders</Text>
                    <View style={styles.card}>
                        <View style={styles.item}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="time-outline" size={22} color={Colors.primary[600]} />
                            </View>
                            <View style={styles.itemContent}>
                                <Text style={styles.itemTitle}>Daily Reminder</Text>
                                <Text style={styles.itemSubtitle}>Get reminded to read Quran daily</Text>
                            </View>
                            <Switch
                                value={dailyReminder}
                                onValueChange={toggleDailyReminder}
                                trackColor={{ false: '#E5E7EB', true: Colors.primary[200] }}
                                thumbColor={dailyReminder ? Colors.primary[600] : '#9CA3AF'}
                            />
                        </View>

                        {dailyReminder && (
                            <TouchableOpacity style={[styles.item, styles.itemBorder]}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="alarm-outline" size={22} color={Colors.primary[600]} />
                                </View>
                                <View style={styles.itemContent}>
                                    <Text style={styles.itemTitle}>Reminder Time</Text>
                                    <Text style={styles.itemSubtitle}>{user?.preferences.reminderTime || '08:00'}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Streak & Progress</Text>
                    <View style={styles.card}>
                        <View style={styles.item}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="flame-outline" size={22} color={Colors.primary[600]} />
                            </View>
                            <View style={styles.itemContent}>
                                <Text style={styles.itemTitle}>Streak Alerts</Text>
                                <Text style={styles.itemSubtitle}>Warn when streak is about to break</Text>
                            </View>
                            <Switch
                                value={streakAlerts}
                                onValueChange={setStreakAlerts}
                                trackColor={{ false: '#E5E7EB', true: Colors.primary[200] }}
                                thumbColor={streakAlerts ? Colors.primary[600] : '#9CA3AF'}
                            />
                        </View>

                        <View style={[styles.item, styles.itemBorder]}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="trending-up-outline" size={22} color={Colors.primary[600]} />
                            </View>
                            <View style={styles.itemContent}>
                                <Text style={styles.itemTitle}>Weekly Report</Text>
                                <Text style={styles.itemSubtitle}>Weekly reading summary</Text>
                            </View>
                            <Switch
                                value={weeklyReport}
                                onValueChange={setWeeklyReport}
                                trackColor={{ false: '#E5E7EB', true: Colors.primary[200] }}
                                thumbColor={weeklyReport ? Colors.primary[600] : '#9CA3AF'}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F3FF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
    },
    placeholder: {
        width: 44,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    itemBorder: {
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    itemSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 2,
    },
});
