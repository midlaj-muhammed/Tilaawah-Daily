import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants';

interface ButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
    fullWidth?: boolean;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    style?: ViewStyle;
}

export const Button = ({ title, onPress, loading, variant = 'primary', fullWidth, size = 'md', disabled, style }: ButtonProps) => {
    if (variant === 'gradient') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.85}
                style={[fullWidth && styles.fullWidth, (disabled || loading) && styles.disabled, style]}
            >
                <LinearGradient
                    colors={[Colors.primary[500], Colors.primary[700]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.button, styles[size], { borderRadius: size === 'lg' ? 20 : 12 }]}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.text}>{title}</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={[
                styles.button,
                styles[variant],
                fullWidth && styles.fullWidth,
                styles[size],
                (disabled || loading) && styles.disabled,
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.85}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? Colors.primary[600] : '#FFF'} />
            ) : (
                <Text style={[styles.text, variant === 'outline' && styles.outlineText, variant === 'secondary' && styles.secondaryText]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: { borderRadius: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    primary: { backgroundColor: Colors.primary[600] },
    secondary: { backgroundColor: Colors.primary[100] },
    outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary[500] },
    gradient: { backgroundColor: Colors.primary[500] },
    fullWidth: { width: '100%' },
    sm: { height: 36 },
    md: { height: 48 },
    lg: { height: 56 },
    disabled: { opacity: 0.5 },
    text: { color: '#FFF', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },
    outlineText: { color: Colors.primary[600] },
    secondaryText: { color: Colors.primary[700] },
});
