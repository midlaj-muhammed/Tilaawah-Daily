import React, { useState, useEffect } from 'react';
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
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Google OAuth Web Client ID from google-services.json (must be type 3/Web client ID for Firebase)
const GOOGLE_WEB_CLIENT_ID = '232177874845-7bg9cb8s2srk9k2j7obv046nsd8fca1m.apps.googleusercontent.com';

export default function LoginScreen() {
    const router = useRouter();
    const { setUser } = useUserStore();
    const authService = useAuthService();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    // Initialize Native Google Sign-In
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: GOOGLE_WEB_CLIENT_ID,
            offlineAccess: false,
        });
    }, []);

    const handleGoogleSignIn = async (idToken: string) => {
        setLoading(true);
        try {
            const result = await authService.loginWithGoogle(idToken);
            if (result.success && result.data) {
                setUser(result.data.user);
                router.replace('/(tabs)');
            } else {
                Alert.alert('Login Failed', result.error || 'Could not sign in with Google');
            }
        } catch (error: any) {
            console.error('Google sign-in error:', error);
            Alert.alert('Error', 'An error occurred during Google Sign-In');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            const result = await authService.login({ email, password });
            if (result.success && result.data) {
                setUser(result.data.user);
                router.replace('/(tabs)');
            } else {
                setErrors({ email: result.error || 'Invalid email or password' });
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({ email: 'An unexpected error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            if (userInfo.idToken) {
                handleGoogleSignIn(userInfo.idToken);
            } else {
                Alert.alert('Error', 'No ID token received from Google');
            }
        } catch (error: any) {
            console.error('Google Sign-In Error:', error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                Alert.alert('Error', 'Google Play Services are not available on this device');
            } else {
                // some other error happened
                Alert.alert('Error', 'An error occurred during Google Sign-In. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1A103D', '#2D1B69', '#4C1D95', '#1A103D']}
                locations={[0, 0.3, 0.6, 1]}
                style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.patternContainer}>
                <View style={[styles.glowOrb, styles.glowOrbTopRight]} />
                <View style={[styles.glowOrb, styles.glowOrbBottomLeft]} />
                <View style={[styles.glowOrb, styles.glowOrbCenter]} />
                <View style={[styles.diamond, { top: SCREEN_HEIGHT * 0.12, left: 30 }]} />
                <View style={[styles.diamond, styles.diamondSmall, { top: SCREEN_HEIGHT * 0.08, right: 60 }]} />
                <View style={[styles.diamond, styles.diamondSmall, { bottom: SCREEN_HEIGHT * 0.15, left: 50 }]} />
            </View>

            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.header}>
                            <View style={styles.logoWrapper}>
                                <LinearGradient
                                    colors={[Colors.primary[400] + '30', Colors.primary[600] + '15']}
                                    style={styles.logoOuter}
                                >
                                    <LinearGradient
                                        colors={[Colors.primary[500], Colors.primary[700]]}
                                        style={styles.logoInner}
                                    >
                                        <MaterialCommunityIcons name="moon-waning-crescent" size={36} color="#FFFFFF" />
                                    </LinearGradient>
                                </LinearGradient>
                            </View>

                            <Text style={styles.brandName}>Tilaawah Daily</Text>
                            <Text style={styles.brandTagline}>Build your Quran reading habit</Text>
                        </View>

                        <View style={styles.cardContainer}>
                            <BlurView
                                intensity={Platform.OS === 'ios' ? 40 : 0}
                                tint="dark"
                                style={styles.card}
                            >
                                <View style={styles.cardOverlay} />

                                <View style={styles.cardContent}>
                                    <View>
                                        <Text style={styles.welcomeText}>Welcome Back</Text>
                                        <Text style={styles.welcomeSubtext}>Sign in to continue your journey</Text>
                                    </View>

                                    <View>
                                        <Input
                                            label="Email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            error={errors.email}
                                            leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.primary[400]} />}
                                        />
                                    </View>

                                    <View>
                                        <Input
                                            label="Password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry
                                            error={errors.password}
                                            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={Colors.primary[400]} />}
                                        />
                                    </View>

                                    <View>
                                        <TouchableOpacity
                                            style={styles.forgotPassword}
                                            onPress={async () => {
                                                if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
                                                    Alert.alert('Email Required', 'Please enter a valid email address first.');
                                                    return;
                                                }
                                                const result = await authService.requestPasswordReset(email);
                                                if (result.success) {
                                                    Alert.alert('Reset Email Sent', result.data?.message || 'Check your inbox.');
                                                } else {
                                                    Alert.alert('Error', result.error || 'Failed to send reset email.');
                                                }
                                            }}
                                        >
                                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View>
                                        <TouchableOpacity
                                            activeOpacity={0.85}
                                            onPress={handleLogin}
                                            disabled={loading}
                                            style={styles.signInButtonWrapper}
                                        >
                                            <LinearGradient
                                                colors={[Colors.primary[500], Colors.primary[700]]}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                style={styles.signInButton}
                                            >
                                                {loading ? (
                                                    <Text style={styles.signInButtonText}>Signing in...</Text>
                                                ) : (
                                                    <>
                                                        <Text style={styles.signInButtonText}>Sign In</Text>
                                                        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                                                    </>
                                                )}
                                            </LinearGradient>
                                        </TouchableOpacity>
                                        <View style={styles.buttonGlow} />
                                    </View>

                                    <View style={styles.divider}>
                                        <View style={styles.dividerLine} />
                                        <Text style={styles.dividerText}>or continue with</Text>
                                        <View style={styles.dividerLine} />
                                    </View>

                                    <View>
                                        <TouchableOpacity
                                            style={styles.googleButton}
                                            activeOpacity={0.8}
                                            onPress={handleGoogleLogin}
                                            disabled={loading}
                                        >
                                            <View style={styles.googleIconContainer}>
                                                <MaterialCommunityIcons name="google" size={20} color="#FFFFFF" />
                                            </View>
                                            <Text style={styles.googleButtonText}>Google</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </BlurView>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                                <Text style={styles.footerLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A103D' },
    patternContainer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
    glowOrb: { position: 'absolute', borderRadius: 999 },
    glowOrbTopRight: { width: 280, height: 280, top: -80, right: -100, backgroundColor: Colors.primary[600] + '18' },
    glowOrbBottomLeft: { width: 320, height: 320, bottom: -120, left: -120, backgroundColor: Colors.primary[500] + '10' },
    glowOrbCenter: { width: 160, height: 160, top: SCREEN_HEIGHT * 0.35, right: -60, backgroundColor: 'rgba(255,255,255,0.05)' },
    diamond: { position: 'absolute', width: 16, height: 16, backgroundColor: Colors.primary[400] + '20', transform: [{ rotate: '45deg' }], borderRadius: 3 },
    diamondSmall: { width: 10, height: 10, backgroundColor: Colors.primary[300] + '15' },
    safeArea: { flex: 1 },
    keyboardView: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center', paddingTop: Spacing.xl, paddingBottom: Spacing['2xl'] },
    header: { alignItems: 'center', marginBottom: 32 },
    logoWrapper: { marginBottom: 16 },
    logoOuter: { width: 96, height: 96, borderRadius: 32, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.primary[500] + '20' },
    logoInner: { width: 72, height: 72, borderRadius: 24, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: Colors.primary[500], shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16 },
    brandName: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 6 },
    brandTagline: { fontSize: 15, color: Colors.primary[200] + 'AA', fontWeight: '500', letterSpacing: 0.2 },
    cardContainer: { borderRadius: 28, overflow: 'hidden', elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 24 },
    card: { borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26, 16, 61, 0.85)' },
    cardContent: { padding: 28, position: 'relative', zIndex: 1 },
    welcomeText: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3, marginBottom: 6 },
    welcomeSubtext: { fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 28, fontWeight: '400' },
    forgotPassword: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -4 },
    forgotPasswordText: { fontSize: 13, color: Colors.primary[400], fontWeight: '600' },
    signInButtonWrapper: { borderRadius: 16, overflow: 'hidden', marginBottom: 4 },
    signInButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, gap: 8 },
    signInButtonText: { fontSize: 17, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
    buttonGlow: { height: 20, marginHorizontal: 40, borderRadius: 20, backgroundColor: Colors.primary[500] + '25', marginTop: -6, marginBottom: 20 },
    divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
    dividerText: { marginHorizontal: 16, fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: '500' },
    googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)', gap: 10 },
    googleIconContainer: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    googleButtonText: { fontSize: 15, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 28 },
    footerText: { fontSize: 15, color: 'rgba(255,255,255,0.4)' },
    footerLink: { fontSize: 15, color: Colors.primary[400], fontWeight: '700' },
});
