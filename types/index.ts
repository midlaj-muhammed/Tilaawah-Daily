// User related types
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: string;
    preferences: UserPreferences;
    subscription: SubscriptionTier;
}

export interface UserPreferences {
    dailyGoal: DailyGoal;
    reminderTime: string;
    reminderEnabled: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'xlarge';
    theme: 'light' | 'dark' | 'system';
    showTranslation: boolean;
    preferredTranslation: string;
    preferredReciter: string;
}

export type DailyGoal = {
    type: 'minutes' | 'ayahs' | 'pages';
    value: number;
};

export type SubscriptionTier = 'free' | 'premium';

// Quran related types
export interface Surah {
    id: number;
    name: string;
    arabicName: string;
    englishName: string;
    meaning: string;
    ayahCount: number;
    startPage: number;
    endPage: number;
    revelationType: 'meccan' | 'medinan';
    juzNumbers: number[];
}

export interface Ayah {
    id: number;
    surahId: number;
    surahName?: string;
    surahEnglishName?: string;
    ayahNumber: number;
    text: string;
    textArabic: string;
    textEnglish: string;
    juzNumber: number;
    pageNumber: number;
    rukuNumber: number;
    manzilNumber: number;
}

export interface Juz {
    id: number;
    startSurah: number;
    startAyah: number;
    endSurah: number;
    endAyah: number;
}

export interface Reciter {
    id: string;
    name: string;
    arabicName: string;
    style: string;
    isPremium: boolean;
}

export interface Translation {
    id: string;
    name: string;
    language: string;
    author: string;
    isPremium: boolean;
}

// Reading session types
export interface ReadingSession {
    id: string;
    userId: string;
    surahId: number;
    startAyah: number;
    endAyah: number;
    duration: number; // in seconds
    date: string;
    completedAt: string;
}

export interface ReadingProgress {
    userId: string;
    lastReadSurah: number;
    lastReadAyah: number;
    totalAyahsRead: number;
    totalDuration: number; // in seconds
    completionPercentage: number;
    surahsCompleted: number[];
    juzsCompleted: number[];
}

// Streak types
export interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastReadDate: string | null;
    streakHistory: StreakDay[];
    milestones: Milestone[];
}

export interface StreakDay {
    date: string;
    completed: boolean;
    ayahsRead: number;
    duration: number;
}

export interface Milestone {
    id: string;
    type: 'streak' | 'completion' | 'time' | 'ayahs';
    value: number;
    achievedAt: string;
    title: string;
    description: string;
    icon: string;
}

// Bookmark and Notes
export interface Bookmark {
    id: string;
    userId: string;
    surahId: number;
    ayahNumber: number;
    createdAt: string;
    note?: string;
    color: string;
}

export interface Note {
    id: string;
    userId: string;
    surahId: number;
    ayahNumber: number;
    content: string;
    createdAt: string;
    updatedAt: string;
}

// Notification types
export interface NotificationSettings {
    enabled: boolean;
    reminderTime: string;
    streakAlerts: boolean;
    milestones: boolean;
    weeklyReport: boolean;
}

export interface ScheduledNotification {
    id: string;
    type: 'reminder' | 'streak_alert' | 'milestone' | 'weekly';
    scheduledFor: string;
    title: string;
    body: string;
    data?: Record<string, any>;
}

// Statistics
export interface ReadingStatistics {
    totalAyahsRead: number;
    totalDuration: number;
    averageDailyDuration: number;
    averageDailyAyahs: number;
    mostReadSurah: number;
    readingDaysCount: number;
    weeklyData: WeeklyStats[];
    monthlyData: MonthlyStats[];
}

export interface WeeklyStats {
    week: string;
    totalAyahs: number;
    totalDuration: number;
    daysActive: number;
}

export interface MonthlyStats {
    month: string;
    totalAyahs: number;
    totalDuration: number;
    daysActive: number;
    surahsCompleted: number;
}

// Subscription
export interface Subscription {
    id: string;
    userId: string;
    tier: SubscriptionTier;
    startDate: string;
    expiryDate: string;
    platform: 'ios' | 'android' | 'web';
    isActive: boolean;
}

// Navigation types
export type RootStackParamList = {
    '(auth)': undefined;
    '(tabs)': undefined;
    '(onboarding)': undefined;
    'surah/[id]': { id: string };
    'ayah/[surahId]/[ayahNumber]': { surahId: string; ayahNumber: string };
    'settings/index': undefined;
    'settings/preferences': undefined;
    'settings/notifications': undefined;
    'settings/subscription': undefined;
    'bookmarks/index': undefined;
    'notes/index': undefined;
    'statistics/index': undefined;
};

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Form types
export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface OnboardingData {
    name: string;
    dailyGoal: DailyGoal;
    reminderTime: string;
    reminderEnabled: boolean;
}