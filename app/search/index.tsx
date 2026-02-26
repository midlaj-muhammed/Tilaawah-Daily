import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search for Surah or Ayah..."
                        style={styles.input}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>
            <View style={styles.content}>
                <Text style={styles.subtitle}>Start typing to search the Quran</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F3FF' },
    header: { padding: 20 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
    input: { flex: 1, marginLeft: 12, fontSize: 16, color: '#111827' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    subtitle: { fontSize: 16, color: '#6B7280' },
});
