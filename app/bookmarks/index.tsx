import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useBookmarkStore } from '@/store';
import { Colors } from '@/constants';

export default function BookmarksScreen() {
    const router = useRouter();
    const { bookmarks, removeBookmark } = useBookmarkStore();

    const handleDeleteBookmark = (id: string) => {
        Alert.alert(
            'Remove Bookmark',
            'Are you sure you want to remove this bookmark?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => removeBookmark(id) },
            ]
        );
    };

    const handleBookmarkPress = (surahId: number) => {
        router.push(`/surah/${surahId}`);
    };

    const renderBookmarkItem = ({ item }: { item: { id: string; surahId: number; ayahNumber: number; createdAt: string } }) => (
        <TouchableOpacity
            style={styles.bookmarkItem}
            onPress={() => handleBookmarkPress(item.surahId)}
        >
            <View style={styles.bookmarkIcon}>
                <MaterialCommunityIcons name="bookmark" size={24} color={Colors.primary[600]} />
            </View>
            <View style={styles.bookmarkContent}>
                <Text style={styles.bookmarkTitle}>Surah {item.surahId}</Text>
                <Text style={styles.bookmarkSubtitle}>Ayah {item.ayahNumber}</Text>
                <Text style={styles.bookmarkDate}>
                    {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteBookmark(item.id)}
            >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (bookmarks.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color="#0F172A" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Bookmarks</Text>
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.emptyState}>
                    <View style={styles.emptyIconContainer}>
                        <MaterialCommunityIcons name="bookmark-outline" size={64} color={Colors.primary[300]} />
                    </View>
                    <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Tap the bookmark icon while reading to save your favorite verses
                    </Text>
                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => router.push('/(tabs)/quran')}
                    >
                        <Text style={styles.exploreButtonText}>Explore Quran</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bookmarks</Text>
                <View style={styles.placeholder} />
            </View>

            <FlatList
                data={bookmarks}
                keyExtractor={(item) => item.id}
                renderItem={renderBookmarkItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
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
        color: '#1E1B4B',
    },
    placeholder: {
        width: 44,
    },
    listContent: {
        padding: 20,
        gap: 12,
    },
    bookmarkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    bookmarkIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: Colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    bookmarkContent: {
        flex: 1,
    },
    bookmarkTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E1B4B',
        marginBottom: 4,
    },
    bookmarkSubtitle: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 4,
    },
    bookmarkDate: {
        fontSize: 12,
        color: '#94A3B8',
    },
    deleteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1E1B4B',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    exploreButton: {
        backgroundColor: Colors.primary[600],
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 16,
    },
    exploreButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
