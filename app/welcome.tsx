import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@/components/ui';
import { Colors, Typography, Spacing, STORAGE_KEYS } from '@/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1A103D', '#2D1B69', '#4C1D95', '#1A103D']}
                locations={[0, 0.3, 0.6, 1]}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Decorative Glow Orbs */}
            <View style={styles.decorContainer}>
                <View style={[styles.glowOrb, styles.glowOrbTop]} />
                <View style={[styles.glowOrb, styles.glowOrbBottom]} />
                <View style={[styles.glowOrb, styles.glowOrbCenter]} />
                {/* Floating particles */}
                <View style={[styles.particle, { top: '15%', left: '10%' }]} />
                <View style={[styles.particle, styles.particleSmall, { top: '25%', right: '15%' }]} />
                <View style={[styles.particle, { bottom: '30%', right: '10%' }]} />
                <View style={[styles.particle, styles.particleSmall, { bottom: '40%', left: '20%' }]} />
            </View>

            <SafeAreaView style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logoWrapper}>
                        <LinearGradient
                            colors={[Colors.primary[400] + '30', Colors.primary[600] + '15']}
                            style={styles.logoOuter}
                        >
                            <LinearGradient
                                colors={[Colors.primary[400], Colors.primary[700]]}
                                style={styles.logoInner}
                            >
                                <MaterialCommunityIcons name="moon-waning-crescent" size={64} color="#FFFFFF" />
                            </LinearGradient>
                        </LinearGradient>
                    </View>
                    <Text style={styles.appName}>Tilaawah Daily</Text>
                    <Text style={styles.tagline}>Nurture your soul with the Quran</Text>
                </View>

                <View style={styles.footer}>
                    <View style={styles.ctaContainer}>
                        <Button
                            title="Get Started"
                            variant="gradient"
                            onPress={() => router.push('/onboarding')}
                            fullWidth
                            size="lg"
                        />
                        <TouchableOpacity
                            style={styles.signInLink}
                            onPress={() => router.push('/(auth)/login')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.signInText}>
                                Already have an account? <Text style={styles.signInLinkText}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.version}>v1.0.0</Text>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A103D' },
    decorContainer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
    glowOrb: { position: 'absolute', borderRadius: 999 },
    glowOrbTop: {
        width: 300, height: 300, top: -100, right: -100,
        backgroundColor: 'rgba(139,92,246,0.15)',
    },
    glowOrbBottom: {
        width: 400, height: 400, bottom: -150, left: -150,
        backgroundColor: 'rgba(124,58,237,0.1)',
    },
    glowOrbCenter: {
        width: 200, height: 200, top: '40%', left: '30%',
        backgroundColor: 'rgba(167,139,250,0.06)',
    },
    particle: {
        position: 'absolute', width: 20, height: 20,
        backgroundColor: 'rgba(167,139,250,0.2)',
        transform: [{ rotate: '45deg' }], borderRadius: 4,
    },
    particleSmall: { width: 12, height: 12, backgroundColor: 'rgba(196,181,253,0.15)' },
    content: { flex: 1, justifyContent: 'space-between', paddingHorizontal: Spacing.xl },
    header: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        paddingTop: SCREEN_HEIGHT * 0.05,
    },
    logoWrapper: { marginBottom: Spacing.xl },
    logoOuter: {
        width: 140, height: 140, borderRadius: 46,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(139,92,246,0.2)',
    },
    logoInner: {
        width: 100, height: 100, borderRadius: 34,
        justifyContent: 'center', alignItems: 'center',
        elevation: 12,
        shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5, shadowRadius: 20,
    },
    appName: {
        fontSize: Typography.fontSize['4xl'], fontWeight: '800',
        color: '#FFFFFF', letterSpacing: -1, marginBottom: Spacing.xs,
    },
    tagline: {
        fontSize: Typography.fontSize.lg, color: 'rgba(196,181,253,0.6)',
        fontWeight: '500', textAlign: 'center', maxWidth: '80%',
    },
    footer: { paddingBottom: Spacing['2xl'], alignItems: 'center' },
    ctaContainer: { width: '100%', maxWidth: 340, marginBottom: Spacing.xl },
    signInLink: { marginTop: Spacing.lg, alignItems: 'center' },
    signInText: { fontSize: Typography.fontSize.base, color: 'rgba(196,181,253,0.5)' },
    signInLinkText: { color: Colors.primary[400], fontWeight: '700' },
    version: {
        fontSize: Typography.fontSize.xs, color: 'rgba(196,181,253,0.2)',
        fontWeight: '600', letterSpacing: 1,
    },
});
