import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Dimensions,
    Animated,
    Alert,
    Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { quranService } from '@/services';
import { Surah, Ayah } from '@/types';
import { Colors, Spacing, Typography, RECITER_AUDIO_PATHS, RECITERS, TRANSLATIONS } from '@/constants';
import { useProgressStore, useStreakStore, useUserStore, useBookmarkStore } from '@/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SurahReader() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { updateProgress } = useProgressStore();
    const { user, updatePreferences } = useUserStore();
    const { addBookmark, removeBookmark, bookmarks } = useBookmarkStore();

    const [loading, setLoading] = useState(true);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [surah, setSurah] = useState<Surah | null>(null);
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [translations, setTranslations] = useState<Record<number, string>>({});

    // Audio
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);

    // Timer
    const [elapsed, setElapsed] = useState(0);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const preferredReciter = user?.preferences?.preferredReciter ?? 'mishary_rashid';
    const preferredTranslation = user?.preferences?.preferredTranslation ?? 'en.sahih';
    const currentFontSize = user?.preferences?.fontSize ?? 'medium';
    const currentReciter = RECITERS.find(r => r.id === preferredReciter);
    const currentTranslation = TRANSLATIONS.find(t => t.id === preferredTranslation);

    const arabicFontSizes = { small: 24, medium: 30, large: 38, xlarge: 46 };
    const translationFontSizes = { small: 14, medium: 17, large: 20, xlarge: 24 };

    const arabicFontSize = arabicFontSizes[currentFontSize as keyof typeof arabicFontSizes] || 30;
    const translationFontSize = translationFontSizes[currentFontSize as keyof typeof translationFontSizes] || 17;

    // XP system
    const xpPerAyah = 10;
    const totalXpEarned = currentIndex * xpPerAyah;

    const startTimeRef = useRef(Date.now());
    const lastSyncTimeRef = useRef(Date.now());

    useEffect(() => {
        // Reset timers on mount
        startTimeRef.current = Date.now();
        lastSyncTimeRef.current = Date.now();

        const timer = setInterval(() => {
            const now = Date.now();
            const currentElapsed = Math.floor((now - startTimeRef.current) / 1000);
            setElapsed(currentElapsed);

            const timeDiff = now - lastSyncTimeRef.current;
            if (timeDiff >= 5000) {
                const secondsToSync = Math.floor(timeDiff / 1000);
                const currentTotalSecs = Number(useProgressStore.getState().progress.totalReadingSeconds) || 0;

                useProgressStore.getState().updateProgress({
                    totalReadingSeconds: currentTotalSecs + secondsToSync,
                    dailyReadingSeconds: secondsToSync, // Will accumulate properly internally
                });

                lastSyncTimeRef.current = now;
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const loadSurah = async () => {
            if (!id) return;
            setLoading(true);
            const result = await quranService.getSurah(parseInt(id as string), preferredTranslation);
            if (result) {
                setSurah(result.surah);
                setAyahs(result.ayahs);
                updateProgress({
                    lastReadSurahId: result.surah.id,
                    lastReadAyahNumber: 1
                });
            }
            setLoading(false);
            animateAyah();
        };
        loadSurah();

        return () => {
            if (sound) sound.unloadAsync();
        };
    }, [id, preferredTranslation]);

    const playAudio = async () => {
        try {
            if (sound) { await sound.unloadAsync(); setSound(null); }
            setIsLoadingAudio(true);
            setAudioError(null);

            // Ensure background audio is permitted
            await Audio.setAudioModeAsync({
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
                playsInSilentModeIOS: true,
                playThroughEarpieceAndroid: false
            });

            const surahId = parseInt(id as string);
            const ayahNumber = ayahs[currentIndex]?.ayahNumber || 1;
            const audioUrl = quranService.getAudioUrl(surahId, ayahNumber, preferredReciter);

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioUrl }, { shouldPlay: true }
            );

            setSound(newSound);
            setIsPlaying(true);
            setIsLoadingAudio(false);

            newSound.setOnPlaybackStatusUpdate((status: any) => {
                if (status.isLoaded && status.didJustFinish) setIsPlaying(false);
            });
        } catch (error) {
            console.error('Error playing audio:', error);
            setAudioError('Could not play audio.');
            setIsLoadingAudio(false);
            setIsPlaying(false);
        }
    };

    const stopAudio = async () => {
        if (sound) { await sound.stopAsync(); await sound.unloadAsync(); setSound(null); }
        setIsPlaying(false);
    };

    const toggleAudio = () => {
        Haptics.selectionAsync();
        isPlaying ? stopAudio() : playAudio();
    };

    const handleBookmarkToggle = () => {
        if (!currentAyah) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const surahId = parseInt(id as string);
        const existing = bookmarks.find(b => b.surahId === surahId && b.ayahNumber === currentAyah.ayahNumber);
        if (existing) removeBookmark(existing.id);
        else addBookmark({ surahId, ayahNumber: currentAyah.ayahNumber, note: '' });
    };

    const animateAyah = () => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    };

    const handleNext = async () => {
        if (sound) { await sound.unloadAsync(); setSound(null); setIsPlaying(false); }
        if (currentIndex < ayahs.length - 1) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setCurrentIndex(currentIndex + 1);
            animateAyah();
            const prevTotal = useProgressStore.getState().progress.totalAyahsRead || 0;
            updateProgress({
                lastReadAyahNumber: ayahs[currentIndex + 1].ayahNumber,
                totalAyahsRead: prevTotal + 1,
                dailyAyahsRead: 1, // Increments by 1 within the store
            });
            useStreakStore.getState().updateStreak();
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
        }
    };

    const handlePrevious = async () => {
        if (sound) { await sound.unloadAsync(); setSound(null); setIsPlaying(false); }
        if (currentIndex > 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setCurrentIndex(currentIndex - 1);
            animateAyah();
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient colors={['#1A103D', '#2D1B69']} style={StyleSheet.absoluteFillObject} />
                <ActivityIndicator size="large" color={Colors.primary[400]} />
            </View>
        );
    }

    if (!surah || ayahs.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <LinearGradient colors={['#1A103D', '#2D1B69']} style={StyleSheet.absoluteFillObject} />
                <Text style={{ color: '#FFF' }}>Surah not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backLink}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentAyah = ayahs[currentIndex];
    const progressPercent = ((currentIndex + 1) / ayahs.length) * 100;
    const isBookmarked = bookmarks.some(b => b.surahId === parseInt(id as string) && b.ayahNumber === currentAyah?.ayahNumber);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1A103D', '#2D1B69', '#1A103D']}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <Ionicons name="chevron-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>{surah.englishName}</Text>
                        <Text style={styles.headerSubtitle}>{surah.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.iconButton} onPress={() => setSettingsVisible(true)}>
                        <Ionicons name="settings-outline" size={22} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Gamification Bar */}
                <LinearGradient
                    colors={[Colors.primary[500] + '40', Colors.primary[700] + '30']}
                    style={styles.gamBar}
                >
                    <View style={styles.gamLevelBadge}>
                        <Text style={styles.gamLevelText}>Lvl {Math.floor((useProgressStore.getState().progress.totalAyahsRead * 10) / 500) + 1}</Text>
                    </View>
                    <View style={styles.gamTimerContainer}>
                        <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.6)" />
                        <Text style={styles.gamTimerText}>{formatTime(elapsed)}</Text>
                    </View>
                    <View style={styles.gamStatsContainer}>
                        <Text style={styles.gamStatText}>+{totalXpEarned} XP</Text>
                    </View>
                </LinearGradient>

                {/* Progress Info */}
                <View style={styles.progressInfo}>
                    <Text style={styles.progressInfoText}>{currentIndex}/{ayahs.length}</Text>
                    <Text style={styles.progressInfoText}>{ayahs.length - currentIndex - 1} Verses left</Text>
                    <Text style={styles.progressInfoText}>{Math.round(progressPercent)}%</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarBg}>
                    <LinearGradient
                        colors={[Colors.primary[400], Colors.primary[600]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
                    />
                </View>

                {/* Ayah Card */}
                <View style={styles.readerContainer}>
                    <Animated.View style={[styles.ayahCard, { opacity: fadeAnim }]}>
                        <ScrollView contentContainerStyle={styles.ayahScroll} showsVerticalScrollIndicator={false}>
                            {/* Card Header */}
                            <View style={styles.ayahHeader}>
                                <View style={styles.ayahHeaderLeft}>
                                    <TouchableOpacity onPress={toggleAudio} style={styles.audioBtn}>
                                        <Ionicons name={isPlaying ? "pause" : "volume-high"} size={18} color="rgba(255,255,255,0.7)" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.ayahHeaderCenter}>
                                    <Text style={styles.ayahSurahName}>{surah.englishName}</Text>
                                    <Text style={styles.ayahCounter}>{currentIndex + 1}/{ayahs.length}</Text>
                                </View>
                                <View style={styles.ayahHeaderRight}>
                                    <TouchableOpacity onPress={handleBookmarkToggle}>
                                        <Ionicons
                                            name={isBookmarked ? "bookmark" : "bookmark-outline"}
                                            size={22}
                                            color={isBookmarked ? '#FBBF24' : "rgba(255,255,255,0.4)"}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Arabic Text */}
                            <Text style={[styles.arabicText, { fontSize: arabicFontSize, lineHeight: arabicFontSize * 1.8 }]}>
                                {currentAyah.textArabic}
                            </Text>

                            <View style={styles.divider} />

                            {/* Translation */}
                            {user?.preferences?.showTranslation !== false && (
                                <View style={styles.translationContainer}>
                                    <Text style={styles.translationLabel}>
                                        {currentTranslation?.name || 'Translation'}
                                    </Text>
                                    <Text style={[styles.translationText, { fontSize: translationFontSize, lineHeight: translationFontSize * 1.5 }]}>
                                        {translations[currentAyah.ayahNumber] || currentAyah.textEnglish}
                                    </Text>
                                </View>
                            )}

                            {/* Reciter Info */}
                            {currentReciter && (
                                <View style={styles.reciterInfo}>
                                    <Ionicons name="mic" size={12} color="rgba(255,255,255,0.4)" />
                                    <Text style={styles.reciterText}>{currentReciter.name}</Text>
                                </View>
                            )}
                        </ScrollView>
                    </Animated.View>
                </View>

                {/* Footer Controls */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.navBtn, currentIndex === 0 && styles.disabledBtn]}
                        onPress={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>



                    <View style={styles.nextBtnContainer}>
                        {currentIndex < ayahs.length - 1 && (
                            <Text style={styles.xpBadge}>+{xpPerAyah}</Text>
                        )}
                        <TouchableOpacity
                            style={[styles.navBtn, styles.nextBtn]}
                            onPress={handleNext}
                        >
                            {currentIndex === ayahs.length - 1 ? (
                                <Ionicons name="checkmark-done" size={24} color="#FFF" />
                            ) : (
                                <Ionicons name="arrow-forward" size={24} color="#FFF" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            {/* Quick Settings Modal */}
            <Modal visible={settingsVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => setSettingsVisible(false)} />
                    <LinearGradient colors={['#1A103D', '#2D1B69']} style={styles.modalContent}>
                        <View style={styles.modalDragHandle} />
                        <Text style={styles.modalTitle}>Quick Settings</Text>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Font Size Setup */}
                            <Text style={styles.settingSectionTitle}>Font Size</Text>
                            <View style={styles.settingOptionsRow}>
                                {['small', 'medium', 'large', 'xlarge'].map(size => (
                                    <TouchableOpacity
                                        key={size}
                                        style={[styles.settingOptionBtn, currentFontSize === size && styles.settingOptionBtnActive]}
                                        onPress={() => updatePreferences({ fontSize: size as any })}
                                    >
                                        <Text style={[styles.settingOptionText, currentFontSize === size && styles.settingOptionTextActive]}>
                                            {size.charAt(0).toUpperCase() + size.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Reciter Setup */}
                            <Text style={styles.settingSectionTitle}>Reciter</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, marginBottom: 20 }}>
                                {RECITERS.map(rec => (
                                    <TouchableOpacity
                                        key={rec.id}
                                        style={[styles.settingOptionBtn, preferredReciter === rec.id && styles.settingOptionBtnActive, { paddingHorizontal: 16 }]}
                                        onPress={() => updatePreferences({ preferredReciter: rec.id })}
                                    >
                                        <Text style={[styles.settingOptionText, preferredReciter === rec.id && styles.settingOptionTextActive]}>
                                            {rec.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Translation Setup */}
                            <Text style={styles.settingSectionTitle}>Translation</Text>
                            <View style={{ gap: 10, paddingBottom: 40 }}>
                                {TRANSLATIONS.map(trans => (
                                    <TouchableOpacity
                                        key={trans.id}
                                        style={[styles.settingOptionBtn, preferredTranslation === trans.id && styles.settingOptionBtnActive, { justifyContent: 'flex-start', paddingHorizontal: 20 }]}
                                        onPress={() => updatePreferences({ preferredTranslation: trans.id })}
                                    >
                                        <Text style={[styles.settingOptionText, preferredTranslation === trans.id && styles.settingOptionTextActive]}>
                                            {trans.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </LinearGradient>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1A103D' },
    safeArea: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A103D' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A103D' },
    backLink: { color: Colors.primary[400], marginTop: 20, fontWeight: '700' },

    // Header
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8 },
    iconButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(139,92,246,0.15)', borderRadius: 14 },
    headerCenter: { alignItems: 'center' },
    headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' },
    headerSubtitle: { color: 'rgba(196,181,253,0.5)', fontSize: 13, fontWeight: '600' },

    // Gamification Bar
    gamBar: {
        flexDirection: 'row', alignItems: 'center', marginHorizontal: 20,
        marginTop: 8, padding: 10, borderRadius: 16, gap: 10,
    },
    gamLevelBadge: {
        backgroundColor: 'rgba(139,92,246,0.3)', paddingHorizontal: 10,
        paddingVertical: 4, borderRadius: 10,
    },
    gamLevelText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
    gamTimerContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    gamTimerText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600', fontVariant: ['tabular-nums'] },
    gamStatsContainer: {
        marginLeft: 'auto', backgroundColor: 'rgba(251,191,36,0.2)',
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
    },
    gamStatText: { color: '#FBBF24', fontSize: 12, fontWeight: '700' },

    // Progress Info
    progressInfo: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingHorizontal: 24, marginTop: 10, marginBottom: 4,
    },
    progressInfoText: { color: 'rgba(196,181,253,0.5)', fontSize: 12, fontWeight: '600' },

    // Progress Bar
    progressBarBg: { height: 4, backgroundColor: 'rgba(139,92,246,0.15)', marginHorizontal: 20, borderRadius: 2, marginBottom: 8 },
    progressBarFill: { height: '100%', borderRadius: 2 },

    // Ayah Card
    readerContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
    ayahCard: {
        flex: 1, backgroundColor: 'rgba(139,92,246,0.08)', borderRadius: 28,
        padding: 20, borderWidth: 1, borderColor: 'rgba(139,92,246,0.15)',
    },
    ayahScroll: { flexGrow: 1, justifyContent: 'center' },

    ayahHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    ayahHeaderLeft: { flexDirection: 'row', gap: 8 },
    audioBtn: {
        width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(139,92,246,0.15)',
        justifyContent: 'center', alignItems: 'center',
    },
    ayahHeaderCenter: { alignItems: 'center' },
    ayahSurahName: { color: '#FFF', fontSize: 15, fontWeight: '700' },
    ayahCounter: { color: 'rgba(196,181,253,0.5)', fontSize: 12 },
    ayahHeaderRight: { flexDirection: 'row', gap: 8 },

    arabicText: {
        color: '#FFF', fontSize: 30, lineHeight: 52, textAlign: 'center', fontWeight: 'bold',
    },
    divider: {
        height: 1, backgroundColor: 'rgba(139,92,246,0.15)', marginVertical: 24,
        width: '40%', alignSelf: 'center',
    },
    translationContainer: { paddingHorizontal: 10 },
    translationLabel: {
        fontSize: 11, color: 'rgba(196,181,253,0.4)', marginBottom: 8,
        textTransform: 'uppercase', letterSpacing: 1,
    },
    translationText: {
        color: 'rgba(255,255,255,0.8)', fontSize: 17, lineHeight: 26,
        textAlign: 'center', fontWeight: '500',
    },
    reciterInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 4 },
    reciterText: { color: 'rgba(196,181,253,0.4)', fontSize: 11 },

    // Footer
    footer: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingBottom: 30, paddingHorizontal: 20, paddingTop: 12,
    },
    navBtn: {
        width: 56, height: 56, borderRadius: 20,
        backgroundColor: 'rgba(139,92,246,0.15)', justifyContent: 'center', alignItems: 'center',
    },
    nextBtn: { backgroundColor: Colors.primary[600] },
    disabledBtn: { opacity: 0.3 },
    doneButton: { borderRadius: 20, overflow: 'hidden' },
    doneButtonGradient: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 20 },
    doneButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    nextBtnContainer: { alignItems: 'center' },
    xpBadge: {
        color: '#FBBF24', fontSize: 12, fontWeight: '800', marginBottom: 4,
    },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalContent: { height: '70%', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 12 },
    modalDragHandle: { width: 40, height: 5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 22, fontWeight: '800', color: '#FFF', marginBottom: 24, textAlign: 'center' },
    settingSectionTitle: { fontSize: 13, fontWeight: '700', color: 'rgba(196,181,253,0.7)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
    settingOptionsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    settingOptionBtn: { flex: 1, paddingVertical: 12, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
    settingOptionBtnActive: { backgroundColor: Colors.primary[600], borderColor: Colors.primary[400] },
    settingOptionText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },
    settingOptionTextActive: { color: '#FFF', fontWeight: '700' },
});
