import React, { useState } from 'react';
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
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui';
import { Colors, Typography, Spacing, STORAGE_KEYS } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
    FadeInRight,
    FadeOutLeft,
    SlideInRight,
    SlideOutLeft,
    withSpring,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ONBOARDING_STEPS = [
    {
        title: 'Daily Tilaawah',
        subtitle: 'Read, Reflect, Remember',
        description: 'Set a daily goal that works for you. Whether it is 5 minutes or an hour, build a lasting habit of reciting the Quran every day.',
        icon: 'book-open-variant',
        colors: ['#4C1D95', '#6D28D9', '#8B5CF6'],
        features: [
            { icon: 'target', text: 'Customizable daily goals' },
            { icon: 'time-outline', text: 'Smart reading reminders' },
            { icon: 'bookmark', text: 'Auto-save your progress' }
        ]
    },
    {
        title: 'Track Your Streak',
        subtitle: 'Consistency is Key',
        description: 'Watch your progress grow out of small, consistent steps over time. Never break your chain of daily recitation.',
        icon: 'fire',
        colors: ['#1E3A8A', '#2563EB', '#60A5FA'],
        features: [
            { icon: 'flame', text: 'Daily streak tracking' },
            { icon: 'calendar', text: 'Detailed reading history' },
            { icon: 'stats-chart', text: 'Weekly progress insights' }
        ]
    },
    {
        title: 'Earn Rewards',
        subtitle: 'Gamified Spiritual Growth',
        description: 'Level up your profile, earn exclusive badges, and unlock new milestones as you continue your beautiful journey with the Quran.',
        icon: 'trophy-variant',
        colors: ['#831843', '#BE185D', '#F43F5E'],
        features: [
            { icon: 'medal', text: 'Unlock achievement badges' },
            { icon: 'star', text: 'Earn XP for every Ayah' },
            { icon: 'trending-up', text: 'Level up your profile' }
        ]
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = async () => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            await completeOnboarding();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Error saving onboarding state:', error);
            router.replace('/(auth)/login');
        }
    };

    const currentStepData = ONBOARDING_STEPS[currentStep];

    return (
        <View style={styles.container}>
            {/* Dynamic Background */}
            <LinearGradient
                colors={['#1A103D', '#0F0924']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Animated Orbs based on step */}
            <View style={styles.decorContainer}>
                <Animated.View
                    style={[
                        styles.glowOrb,
                        styles.glowOrbTop,
                        { backgroundColor: currentStepData.colors[2] + '30' }
                    ]}
                />
                <Animated.View
                    style={[
                        styles.glowOrb,
                        styles.glowOrbBottom,
                        { backgroundColor: currentStepData.colors[1] + '20' }
                    ]}
                />
            </View>

            <SafeAreaView style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    {currentStep > 0 ? (
                        <TouchableOpacity onPress={handlePrevious} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.backButtonPlaceholder} />
                    )}
                    <TouchableOpacity onPress={completeOnboarding} style={styles.skipButton}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>

                <Animated.View
                    key={currentStep}
                    entering={FadeInRight.duration(400)}
                    exiting={FadeOutLeft.duration(400)}
                    style={styles.mainContent}
                >
                    {/* Icon Showcase */}
                    <View style={styles.iconShowcase}>
                        <LinearGradient
                            colors={[currentStepData.colors[0], currentStepData.colors[1]]}
                            style={styles.iconCircleOuter}
                        >
                            <BlurView intensity={20} tint="dark" style={styles.iconCircleInner}>
                                <MaterialCommunityIcons
                                    name={currentStepData.icon as any}
                                    size={60}
                                    color="#FFFFFF"
                                />
                            </BlurView>
                        </LinearGradient>

                        {/* Floating elements */}
                        <View style={[styles.floatingSparkle, { top: -10, right: 30 }]}>
                            <MaterialCommunityIcons name="star-four-points" size={24} color={currentStepData.colors[2]} />
                        </View>
                        <View style={[styles.floatingSparkle, { bottom: 20, left: 10 }]}>
                            <MaterialCommunityIcons name="star-four-points" size={16} color={currentStepData.colors[2]} />
                        </View>
                    </View>

                    {/* Text Content */}
                    <View style={styles.textContainer}>
                        <View style={styles.subtitleContainer}>
                            <Text style={[styles.subtitle, { color: currentStepData.colors[2] }]}>
                                {currentStepData.subtitle}
                            </Text>
                        </View>
                        <Text style={styles.title}>{currentStepData.title}</Text>
                        <Text style={styles.description}>{currentStepData.description}</Text>
                    </View>

                    {/* Features List */}
                    <View style={styles.featuresList}>
                        {currentStepData.features.map((feature, idx) => (
                            <View key={idx} style={styles.featureItem}>
                                <View style={[styles.featureIconBg, { backgroundColor: currentStepData.colors[1] + '25' }]}>
                                    <Ionicons name={feature.icon as any} size={18} color={currentStepData.colors[2]} />
                                </View>
                                <Text style={styles.featureText}>{feature.text}</Text>
                            </View>
                        ))}
                    </View>

                </Animated.View>

                {/* Footer */}
                <View style={styles.footer}>
                    {/* Progress Indicator */}
                    <View style={styles.progressContainer}>
                        {ONBOARDING_STEPS.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.progressDot,
                                    currentStep === index && styles.progressDotActive,
                                    currentStep === index && { backgroundColor: currentStepData.colors[2] }
                                ]}
                            />
                        ))}
                    </View>

                    <Button
                        title={currentStep === ONBOARDING_STEPS.length - 1 ? "Start My Journey" : "Continue"}
                        variant="gradient"
                        onPress={handleNext}
                        fullWidth
                        size="lg"
                    />
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
        width: 350, height: 350, top: -50, right: -100,
    },
    glowOrbBottom: {
        width: 450, height: 450, bottom: -150, left: -150,
    },
    content: { flex: 1, paddingBottom: Spacing.xl },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.md,
        height: 60,
    },
    backButton: {
        width: 40, height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center', alignItems: 'center',
    },
    backButtonPlaceholder: { width: 40, height: 40 },
    skipButton: {
        paddingVertical: 8, paddingHorizontal: 16,
        borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)',
    },
    skipText: {
        color: '#FFF', fontSize: 14, fontWeight: '600',
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
    },
    iconShowcase: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    iconCircleOuter: {
        width: 120, height: 120,
        borderRadius: 60,
        padding: 3,
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    iconCircleInner: {
        flex: 1,
        borderRadius: 57,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    floatingSparkle: {
        position: 'absolute',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    subtitleContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 100,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: Spacing.xs,
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: Spacing.xs,
    },
    featuresList: {
        marginTop: Spacing.sm,
        gap: Spacing.sm,
        paddingHorizontal: Spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    featureIconBg: {
        width: 32, height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.sm,
    },
    featureText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.md,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
        gap: 8,
    },
    progressDot: {
        width: 8, height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    progressDotActive: {
        width: 24,
    },
});
