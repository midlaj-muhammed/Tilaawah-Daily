import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUserStore } from '@/store';
import { Colors, Spacing } from '@/constants';

export default function SettingsScreen() {
    const router = useRouter();
    const { logout, user } = useUserStore();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout', style: 'destructive', onPress: () => {
                        logout();
                        router.replace('/welcome');
                    }
                },
            ]
        );
    };

    const SettingItem = ({ icon, title, subtitle, onPress, color = Colors.primary[600] }: any) => (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{title}</Text>
                {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E1B4B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Profile & Account</Text>
                    <SettingItem
                        icon="person"
                        title="Edit Profile"
                        subtitle={user?.name || 'User'}
                        onPress={() => router.push('/settings/edit-profile')}
                    />
                    <SettingItem
                        icon="star"
                        title="Subscription"
                        subtitle={user?.subscription === 'premium' ? 'Premium Plan' : 'Free Plan'}
                        onPress={() => router.push('/settings/subscription')}
                        color="#FFD700"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Reading Preferences</Text>
                    <SettingItem
                        icon="language"
                        title="Translation"
                        subtitle="Choose your preferred language"
                        onPress={() => router.push('/settings/translation')}
                    />
                    <SettingItem
                        icon="mic"
                        title="Reciter"
                        subtitle="Change the audio voice"
                        onPress={() => router.push('/settings/reciter')}
                    />
                    <SettingItem
                        icon="text"
                        title="Font Size"
                        subtitle="Medium"
                        onPress={() => router.push('/settings/fontsize')}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>General</Text>
                    <SettingItem icon="notifications" title="Notifications" onPress={() => { }} />
                    <SettingItem icon="moon" title="Dark Mode" onPress={() => { }} />
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Tilaawah Daily v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F3FF' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    backButton: { marginRight: 16 },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#1E1B4B' },
    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionLabel: { fontSize: 13, fontWeight: '700', color: Colors.primary[400], textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 },
    item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 8, elevation: 2, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
    iconContainer: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    itemContent: { flex: 1 },
    itemTitle: { fontSize: 16, fontWeight: '600', color: '#1E1B4B' },
    itemSubtitle: { fontSize: 13, color: Colors.primary[300], marginTop: 2 },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 20, padding: 16, borderRadius: 20, backgroundColor: '#FEF2F2' },
    logoutText: { color: '#EF4444', fontWeight: '700', marginLeft: 8, fontSize: 16 },
    version: { textAlign: 'center', color: Colors.primary[300], fontSize: 12, marginBottom: 40, fontWeight: '500' },
});
