import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    TextInput
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { quranService } from '@/services';
import { Surah } from '@/types';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants';

export default function QuranScreen() {
    const router = useRouter();
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const data = await quranService.getAllSurahs();
                setSurahs(data);
                setFilteredSurahs(data);
            } catch (error) {
                console.error('Error fetching surahs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSurahs();
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredSurahs(surahs);
        } else {
            const filtered = surahs.filter(s =>
                s.englishName.toLowerCase().includes(query.toLowerCase()) ||
                s.id.toString() === query.trim() ||
                s.name.includes(query)
            );
            setFilteredSurahs(filtered);
        }
    };

    const renderSurahItem = ({ item }: { item: Surah }) => (
        <TouchableOpacity
            style={styles.surahCard}
            onPress={() => router.push(`/surah/${item.id}`)}
            activeOpacity={0.7}
        >
            <View style={styles.surahNumberContainer}>
                <Text style={styles.surahNumber}>{item.id}</Text>
            </View>
            <View style={styles.surahInfo}>
                <Text style={styles.surahName}>{item.englishName}</Text>
                <Text style={styles.surahSubtext}>
                    {item.revelationType.toUpperCase()} • {item.ayahCount} AYAHS
                </Text>
            </View>
            <Text style={styles.arabicName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>The Noble Quran</Text>
                <Text style={styles.headerSubtitle}>Surah List</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#94A3B8" />
                    <TextInput
                        placeholder="Search Surah name or number..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={handleSearch}
                        placeholderTextColor="#94A3B8"
                    />
                    {searchQuery !== '' && (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <Ionicons name="close-circle" size={20} color="#94A3B8" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary[600]} />
                </View>
            ) : (
                <View style={{ flex: 1, width: '100%' }}>
                    <FlashList
                        data={filteredSurahs}
                        renderItem={renderSurahItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        // @ts-ignore: estimatedItemSize is a valid prop for FlashList but TS throws error here
                        estimatedItemSize={88}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="search-outline" size={48} color="#E2E8F0" />
                                <Text style={styles.emptyText}>No Surahs found for "{searchQuery}"</Text>
                            </View>
                        }
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F3FF' },
    header: { padding: 20, paddingBottom: 10 },
    headerTitle: { fontSize: 24, fontWeight: '800', color: '#1E1B4B' },
    headerSubtitle: { fontSize: 16, color: Colors.primary[400], fontWeight: '500' },
    searchContainer: { paddingHorizontal: 20, marginBottom: 10 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(139,92,246,0.06)',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#1E293B',
    },
    listContent: { padding: 20, paddingTop: 10, paddingBottom: 40 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    surahCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(139,92,246,0.06)',
    },
    surahNumberContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: Colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16
    },
    surahNumber: { fontSize: 16, fontWeight: '700', color: Colors.primary[700] },
    surahInfo: { flex: 1 },
    surahName: { fontSize: 17, fontWeight: '700', color: '#1E1B4B', marginBottom: 2 },
    surahSubtext: { fontSize: 11, color: '#9CA3AF', fontWeight: '600', letterSpacing: 0.5 },
    arabicName: { fontSize: 20, fontWeight: '600', color: Colors.primary[800], textAlign: 'right' },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: '#94A3B8', marginTop: 16, fontSize: 16, fontWeight: '500' },
});
