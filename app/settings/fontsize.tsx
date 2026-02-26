import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/store';
import { Colors } from '@/constants';

const FONT_SIZES = [
    { id: 'small', label: 'Small', size: 14 },
    { id: 'medium', label: 'Medium', size: 16 },
    { id: 'large', label: 'Large', size: 18 },
    { id: 'xlarge', label: 'Extra Large', size: 20 },
];

export default function FontSizeScreen() {
    const router = useRouter();
    const { user, updatePreferences } = useUserStore();

    const [selectedSize, setSelectedSize] = useState<string>(user?.preferences.fontSize || 'medium');

    const handleSelect = (sizeId: string) => {
        setSelectedSize(sizeId);
        updatePreferences({ fontSize: sizeId as 'small' | 'medium' | 'large' | 'xlarge' });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Font Size</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.previewCard}>
                    <Text style={[styles.previewText, { fontSize: FONT_SIZES.find(s => s.id === selectedSize)?.size || 16 }]}>
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </Text>
                    <Text style={[styles.previewTranslation, { fontSize: (FONT_SIZES.find(s => s.id === selectedSize)?.size || 16) - 2 }]}>
                        In the name of Allah, the Entirely Merciful, the Especially Merciful.
                    </Text>
                    <Text style={styles.previewLabel}>Preview</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Select Size</Text>
                    <View style={styles.card}>
                        {FONT_SIZES.map((size, index) => (
                            <TouchableOpacity
                                key={size.id}
                                style={[
                                    styles.item,
                                    index > 0 && styles.itemBorder,
                                    selectedSize === size.id && styles.selectedItem,
                                ]}
                                onPress={() => handleSelect(size.id)}
                            >
                                <View style={styles.itemContent}>
                                    <Text style={[
                                        styles.itemTitle,
                                        selectedSize === size.id && styles.selectedTitle
                                    ]}>
                                        {size.label}
                                    </Text>
                                    <Text style={styles.itemSubtitle}>{size.size}px</Text>
                                </View>
                                {selectedSize === size.id && (
                                    <View style={styles.checkmark}>
                                        <Ionicons name="checkmark" size={20} color="#FFF" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
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
    previewCard: {
        backgroundColor: '#FFF',
        margin: 20,
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
    },
    previewText: {
        fontWeight: 'bold',
        color: Colors.primary[900],
        textAlign: 'center',
        marginBottom: 12,
    },
    previewTranslation: {
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 16,
    },
    previewLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        paddingHorizontal: 20,
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
    selectedItem: {
        backgroundColor: Colors.primary[50],
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    selectedTitle: {
        color: Colors.primary[600],
        fontWeight: '700',
    },
    itemSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 2,
    },
    checkmark: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.primary[600],
        justifyContent: 'center',
        alignItems: 'center',
    },
});
