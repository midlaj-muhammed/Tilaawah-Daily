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
import { Colors, DAILY_GOAL_PRESETS } from '@/constants';

const GOAL_TYPES = [
    { id: 'minutes', label: 'Minutes', icon: 'time-outline' },
    { id: 'ayahs', label: 'Ayahs', icon: 'book-outline' },
    { id: 'pages', label: 'Pages', icon: 'document-outline' },
];

export default function DailyGoalScreen() {
    const router = useRouter();
    const { user, updatePreferences } = useUserStore();

    const [goalType, setGoalType] = useState(user?.preferences.dailyGoal.type || 'minutes');
    const [goalValue, setGoalValue] = useState(user?.preferences.dailyGoal.value || 10);

    const handleSave = () => {
        updatePreferences({
            dailyGoal: { type: goalType, value: goalValue }
        });
        router.back();
    };

    const currentPresets = DAILY_GOAL_PRESETS[goalType as keyof typeof DAILY_GOAL_PRESETS] || [];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Daily Goal</Text>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Goal Type Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Goal Type</Text>
                    <View style={styles.typeContainer}>
                        {GOAL_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                style={[
                                    styles.typeButton,
                                    goalType === type.id && styles.typeButtonActive,
                                ]}
                                onPress={() => setGoalType(type.id as 'minutes' | 'ayahs' | 'pages')}
                            >
                                <Ionicons
                                    name={type.icon as any}
                                    size={20}
                                    color={goalType === type.id ? '#FFF' : Colors.primary[600]}
                                />
                                <Text style={[
                                    styles.typeButtonText,
                                    goalType === type.id && styles.typeButtonTextActive,
                                ]}>
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Goal Value Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Daily Target</Text>
                    <View style={styles.card}>
                        {currentPresets.map((value, index) => (
                            <TouchableOpacity
                                key={value}
                                style={[
                                    styles.item,
                                    index > 0 && styles.itemBorder,
                                    goalValue === value && styles.selectedItem,
                                ]}
                                onPress={() => setGoalValue(value)}
                            >
                                <Text style={[
                                    styles.itemTitle,
                                    goalValue === value && styles.selectedTitle,
                                ]}>
                                    {value} {goalType}
                                </Text>
                                {goalValue === value && (
                                    <View style={styles.checkmark}>
                                        <Ionicons name="checkmark" size={16} color="#FFF" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Ionicons name="information-circle-outline" size={24} color={Colors.primary[600]} />
                    <Text style={styles.infoText}>
                        Your daily goal helps you stay consistent with your Quran reading. Choose a target that is achievable but challenging.
                    </Text>
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
    saveButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: Colors.primary[600],
    },
    saveText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
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
    typeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    typeButtonActive: {
        backgroundColor: Colors.primary[600],
        borderColor: Colors.primary[600],
    },
    typeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary[600],
    },
    typeButtonTextActive: {
        color: '#FFF',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    itemBorder: {
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    selectedItem: {
        backgroundColor: Colors.primary[50],
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
    checkmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary[600],
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        margin: 20,
        padding: 16,
        borderRadius: 16,
        backgroundColor: Colors.primary[50],
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: Colors.primary[700],
        lineHeight: 20,
    },
});
