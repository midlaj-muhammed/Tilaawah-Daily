import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '@/constants';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
}

export const Input = ({ label, error, leftIcon, ...props }: InputProps) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error && styles.inputError]}>
                {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
                <TextInput
                    style={styles.input}
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 16, width: '100%' },
    label: { color: '#FFF', fontSize: 14, fontWeight: '600', marginBottom: 8, opacity: 0.8 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(139,92,246,0.08)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(139,92,246,0.15)',
        paddingHorizontal: 14,
    },
    input: { flex: 1, height: 52, color: '#FFF', fontSize: 16 },
    inputError: { borderColor: '#EF4444' },
    icon: { marginRight: 10 },
    errorText: { color: '#EF4444', fontSize: 12, marginTop: 4 },
});
