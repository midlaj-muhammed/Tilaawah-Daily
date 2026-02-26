import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/store';
import { Card, Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, updateUser } = useUserStore();
    const { colors, isDark } = useTheme();

    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        setIsLoading(true);

        try {
            updateUser({ name: name.trim(), email: email.trim() });
            Alert.alert('Success', 'Profile updated successfully');
            router.back();
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Edit Profile',
                    headerStyle: { backgroundColor: colors.background },
                    headerTintColor: colors.text,
                    headerBackTitle: 'Back',
                    headerShadowVisible: false,
                }}
            />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <TouchableOpacity style={styles.avatarContainer}>
                        <LinearGradient
                            colors={[Colors.primary[400], Colors.primary[600]]}
                            style={styles.avatar}
                        >
                            <Text style={styles.avatarText}>
                                {name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'G'}
                            </Text>
                        </LinearGradient>
                        <View style={[styles.avatarBadge, { borderColor: colors.background }]}>
                            <Ionicons name="camera" size={14} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.changePhotoText, { color: Colors.primary[isDark ? 400 : 600] }]}>Change Photo</Text>
                </View>

                {/* Form Section */}
                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Full Name</Text>
                        <View style={[
                            styles.textInputContainer,
                            {
                                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.light.surface,
                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.neutral[200],
                            }
                        ]}>
                            <Ionicons
                                name="person-outline"
                                size={18}
                                color={isDark ? Colors.primary[400] : Colors.primary[600]}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.textInput, { color: colors.text }]}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                placeholderTextColor={colors.textQuaternary}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email Address</Text>
                        <View style={[
                            styles.textInputContainer,
                            {
                                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.light.surface,
                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.neutral[200],
                            }
                        ]}>
                            <Ionicons
                                name="mail-outline"
                                size={18}
                                color={isDark ? Colors.primary[400] : Colors.primary[600]}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.textInput, { color: colors.text }]}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                placeholderTextColor={colors.textQuaternary}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>
                </View>

                {/* Account Information Section */}
                <View style={styles.infoSection}>
                    <Text style={[styles.infoTitle, { color: colors.textTertiary }]}>Account Information</Text>
                    <Card style={[
                        styles.infoCard,
                        { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : Colors.light.surface }
                    ]}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoLabelRow}>
                                <Ionicons
                                    name="finger-print-outline"
                                    size={18}
                                    color={isDark ? Colors.primary[400] : Colors.primary[600]}
                                    style={styles.infoIcon}
                                />
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Account ID</Text>
                            </View>
                            <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>
                                {user?.id ? `${user.id.substring(0, 8)}...` : 'N/A'}
                            </Text>
                        </View>

                        <View style={[styles.infoDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[200] }]} />

                        <View style={styles.infoRow}>
                            <View style={styles.infoLabelRow}>
                                <Ionicons
                                    name="calendar-outline"
                                    size={18}
                                    color={isDark ? Colors.primary[400] : Colors.primary[600]}
                                    style={styles.infoIcon}
                                />
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Member Since</Text>
                            </View>
                            <Text style={[styles.infoValue, { color: colors.text }]}>
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                }) : 'N/A'}
                            </Text>
                        </View>

                        <View style={[styles.infoDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[200] }]} />

                        <View style={styles.infoRow}>
                            <View style={styles.infoLabelRow}>
                                <Ionicons
                                    name="ribbon-outline"
                                    size={18}
                                    color={isDark ? Colors.primary[400] : Colors.primary[600]}
                                    style={styles.infoIcon}
                                />
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Subscription</Text>
                            </View>
                            <View style={[
                                styles.subscriptionBadge,
                                {
                                    backgroundColor: user?.subscription === 'premium'
                                        ? Colors.primary[isDark ? 900 : 50]
                                        : isDark ? 'rgba(255,255,255,0.06)' : Colors.neutral[100],
                                }
                            ]}>
                                <Text style={[
                                    styles.subscriptionText,
                                    {
                                        color: user?.subscription === 'premium'
                                            ? Colors.primary[isDark ? 400 : 600]
                                            : colors.textSecondary,
                                    }
                                ]}>
                                    {user?.subscription === 'premium' ? '👑 Premium' : 'Free'}
                                </Text>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Save Button */}
                <View style={styles.buttonContainer}>
                    <Button
                        title={isLoading ? 'Saving...' : 'Save Changes'}
                        onPress={handleSave}
                        fullWidth
                        size="lg"
                        disabled={isLoading}
                    />
                </View>

                <View style={{ height: Spacing['4xl'] }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: Colors.primary[500],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: { elevation: 8 },
        }),
    },
    avatarText: {
        fontSize: Typography.fontSize['4xl'],
        fontWeight: '700',
        color: '#FFFFFF',
    },
    avatarBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
    },
    changePhotoText: {
        marginTop: Spacing.sm,
        fontSize: Typography.fontSize.sm,
        fontWeight: '600',
    },
    formSection: {
        paddingHorizontal: Spacing.xl,
        marginBottom: Spacing.lg,
    },
    inputGroup: {
        marginBottom: Spacing.lg,
    },
    inputLabel: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '600',
        marginBottom: Spacing.sm,
        marginLeft: Spacing.xs,
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        paddingHorizontal: Spacing.base,
    },
    inputIcon: {
        marginRight: Spacing.sm,
    },
    textInput: {
        flex: 1,
        paddingVertical: Spacing.md,
        fontSize: Typography.fontSize.base,
    },
    infoSection: {
        paddingHorizontal: Spacing.xl,
        marginBottom: Spacing.xl,
    },
    infoTitle: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '600',
        marginBottom: Spacing.sm,
        marginLeft: Spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoCard: {
        padding: 0,
        overflow: 'hidden',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.base,
        paddingHorizontal: Spacing.lg,
    },
    infoLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        marginRight: Spacing.sm,
    },
    infoLabel: {
        fontSize: Typography.fontSize.base,
    },
    infoValue: {
        fontSize: Typography.fontSize.base,
        fontWeight: '500',
    },
    subscriptionBadge: {
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    subscriptionText: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '600',
    },
    infoDivider: {
        height: 0.5,
        marginHorizontal: Spacing.lg,
    },
    buttonContainer: {
        paddingHorizontal: Spacing.xl,
    },
});