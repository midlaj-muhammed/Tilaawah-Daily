import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants';

interface ProgressBarProps {
    progress: number; // 0 to 100
    height?: number;
    variant?: 'default' | 'gradient' | 'light';
}

export const ProgressBar = ({ progress, height = 8, variant = 'default' }: ProgressBarProps) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
        <View style={[
            styles.container,
            { height },
            variant === 'light' && styles.containerLight,
        ]}>
            {variant === 'gradient' ? (
                <LinearGradient
                    colors={[Colors.primary[400], Colors.primary[600]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.fill, { width: `${clampedProgress}%`, height: '100%' }]}
                />
            ) : (
                <View style={[
                    styles.fill,
                    { width: `${clampedProgress}%` },
                    variant === 'light' && styles.fillLight,
                ]} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%', backgroundColor: 'rgba(139,92,246,0.12)', borderRadius: 10, overflow: 'hidden' },
    containerLight: { backgroundColor: 'rgba(255,255,255,0.2)' },
    fill: { height: '100%', backgroundColor: Colors.primary[600], borderRadius: 10 },
    fillLight: { backgroundColor: '#FFF' },
});
