import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.primary[600],
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 20 : 12,
                    left: 16,
                    right: 16,
                    height: 64,
                    borderRadius: 28,
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    borderTopWidth: 0,
                    elevation: 12,
                    shadowColor: '#7C3AED',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.12,
                    shadowRadius: 16,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 0.2,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Ionicons name="grid" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="quran"
                options={{
                    title: 'Quran',
                    tabBarIcon: ({ color }) => <Ionicons name="book" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="juz"
                options={{
                    title: 'Juz',
                    tabBarIcon: ({ color }) => <Ionicons name="layers" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="progress"
                options={{
                    title: 'Stats',
                    tabBarIcon: ({ color }) => <Ionicons name="bar-chart" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <Ionicons name="person" size={22} color={color} />,
                }}
            />
        </Tabs>
    );
}
