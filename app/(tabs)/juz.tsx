import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Landscape-style gradient cards inspired by reference images
const JUZ_GROUPS = [
    { start: 1, end: 5, title: 'Alif Level', subtitle: 'Begin your journey', gradient: ['#E8927C', '#C96B6B', '#8B4B62'] as const, icon: '🌅' },
    { start: 6, end: 10, title: 'Ba Level', subtitle: 'Building foundations', gradient: ['#4ECDC4', '#2BAE9A', '#1A8A74'] as const, icon: '🏔️' },
    { start: 11, end: 15, title: 'Ta Level', subtitle: 'Growing stronger', gradient: ['#A78BFA', '#7C3AED', '#5B21B6'] as const, icon: '🌙' },
    { start: 16, end: 20, title: 'Tha Level', subtitle: 'Deepening knowledge', gradient: ['#F472B6', '#DB2777', '#9D174D'] as const, icon: '🌸' },
    { start: 21, end: 25, title: 'Jim Level', subtitle: 'Nearing completion', gradient: ['#60A5FA', '#3B82F6', '#1D4ED8'] as const, icon: '⭐' },
    { start: 26, end: 30, title: 'Ha Level', subtitle: 'The final chapters', gradient: ['#FBBF24', '#D97706', '#92400E'] as const, icon: '👑' },
];

export default function JuzScreen() {
    const router = useRouter();
    const [expandedGroup, setExpandedGroup] = React.useState<string | null>(null);

    const handleJuzGroupPress = (groupTitle: string) => {
        setExpandedGroup(expandedGroup === groupTitle ? null : groupTitle);
    };

    const handleJuzPress = (juzId: number) => {
        router.push(`/juz/${juzId}`);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0F0A2A', '#1A103D', '#2D1B69']}
                style={StyleSheet.absoluteFillObject}
            />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Quran Challenges</Text>
                    <Text style={styles.headerSubtitle}>Browse by Juz • 30 parts</Text>
                </View>

                <FlatList
                    data={JUZ_GROUPS}
                    keyExtractor={(item) => item.title}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const isExpanded = expandedGroup === item.title;
                        return (
                            <View style={styles.challengeCardWrapper}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => handleJuzGroupPress(item.title)}
                                >
                                    <LinearGradient
                                        colors={[...item.gradient]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.challengeCard}
                                    >
                                        <View style={styles.mountainDecor1} />
                                        <View style={styles.mountainDecor2} />
                                        <View style={styles.mountainDecor3} />

                                        <View style={styles.challengeContent}>
                                            <Text style={styles.challengeIcon}>{item.icon}</Text>
                                            <Text style={styles.challengeTitle}>{item.title}</Text>
                                            <Text style={styles.challengeSubtitle}>{item.subtitle}</Text>
                                            <View style={styles.challengeJuzRange}>
                                                <Text style={styles.challengeRangeText}>Juz {item.start} — {item.end}</Text>
                                                <Ionicons name={isExpanded ? "chevron-down" : "chevron-forward"} size={16} color="rgba(255,255,255,0.7)" />
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>

                                {isExpanded && (
                                    <View style={styles.juzGrid}>
                                        {Array.from({ length: item.end - item.start + 1 }).map((_, i) => {
                                            const juzId = item.start + i;
                                            return (
                                                <TouchableOpacity
                                                    key={juzId}
                                                    style={styles.juzGridItem}
                                                    onPress={() => handleJuzPress(juzId)}
                                                >
                                                    <Text style={styles.juzGridItemText}>Juz {juzId}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                )}
                            </View>
                        );
                    }}
                    ListFooterComponent={<View style={{ height: 100 }} />}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F0A2A' },
    safeArea: { flex: 1 },
    header: { padding: 24, paddingBottom: 8 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 14, color: 'rgba(196,181,253,0.6)', marginTop: 4 },
    list: { padding: 20 },
    challengeCardWrapper: { marginBottom: 16 },
    challengeCard: {
        borderRadius: 28, height: 180, padding: 24, overflow: 'hidden',
        justifyContent: 'flex-end',
        elevation: 8, shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12,
    },
    // Decorative mountain-like shapes
    mountainDecor1: {
        position: 'absolute', bottom: 0, right: 0,
        width: 0, height: 0,
        borderLeftWidth: 120, borderBottomWidth: 100,
        borderLeftColor: 'transparent', borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    mountainDecor2: {
        position: 'absolute', bottom: 0, right: 60,
        width: 0, height: 0,
        borderLeftWidth: 80, borderBottomWidth: 140,
        borderLeftColor: 'transparent', borderBottomColor: 'rgba(0,0,0,0.08)',
    },
    mountainDecor3: {
        position: 'absolute', bottom: 0, left: 0,
        width: 0, height: 0,
        borderRightWidth: 160, borderBottomWidth: 80,
        borderRightColor: 'transparent', borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    challengeContent: { zIndex: 1 },
    challengeIcon: { fontSize: 32, marginBottom: 8 },
    challengeTitle: { fontSize: 24, fontWeight: '800', color: '#FFF', letterSpacing: -0.3 },
    challengeSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 12 },
    challengeJuzRange: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start',
        paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12,
    },
    challengeRangeText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
    juzGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingTop: 16,
        paddingHorizontal: 4,
    },
    juzGridItem: {
        flex: 1,
        minWidth: '28%',
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
    },
    juzGridItemText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
});
