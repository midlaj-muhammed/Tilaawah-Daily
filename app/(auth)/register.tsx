import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
    Platform,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUserStore } from '@/store';
import { Button, Input } from '@/components/ui';
import { Colors, Spacing } from '@/constants';
import { useAuthService } from '@/services/authService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function RegisterScreen() {
    const router = useRouter();
    const { setUser } = useUserStore();
    const authService = useAuthService();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const validateForm = () => {
        const newErrors: any = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
        if (password.length < 6) newErrors.password = 'Min 6 characters';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        // Basic validation
        if (!email.includes('@')) {
            setErrors({ email: 'Invalid email' });
            return;
        }
        setLoading(true);
        try {
            const result = await authService.register({ name, email, password, confirmPassword });
            if (result.success && result.data) {
                setUser(result.data.user);
                router.replace('/(tabs)');
            } else {
                Alert.alert('Registration Failed', result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#1A103D', '#2D1B69']} style={StyleSheet.absoluteFillObject} />
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Join Tilaawah Daily today</Text>
                        </View>

                        <View style={styles.card}>
                            <Input label="Name" placeholder="Full Name" value={name} onChangeText={setName} error={errors.name} />
                            <Input label="Email" placeholder="your@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" error={errors.email} />
                            <Input label="Password" placeholder="Minimum 6 characters" value={password} onChangeText={setPassword} secureTextEntry error={errors.password} />
                            <Input label="Confirm Password" placeholder="Repeat password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry error={errors.confirmPassword} />

                            <Button title={loading ? "Creating..." : "Sign Up"} onPress={handleRegister} loading={loading} fullWidth size="lg" />
                        </View>

                        <TouchableOpacity onPress={() => router.back()} style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? <Text style={styles.footerLink}>Login</Text></Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    scrollContent: { padding: 24, flexGrow: 1, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 32 },
    title: { fontSize: 32, fontWeight: '800', color: '#FFF' },
    subtitle: { color: 'rgba(255,255,255,0.6)', marginTop: 8 },
    card: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 24 },
    footer: { marginTop: 24, alignItems: 'center' },
    footerText: { color: 'rgba(255,255,255,0.6)' },
    footerLink: { color: Colors.primary[400], fontWeight: '700' },
});
