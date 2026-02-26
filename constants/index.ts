export * from './theme';

// App constants
export const APP_NAME = 'Tilaawah Daily';
export const APP_VERSION = '1.0.0';

// Storage keys
export const STORAGE_KEYS = {
    USER: '@tilaawah_user',
    PREFERENCES: '@tilaawah_preferences',
    READING_PROGRESS: '@tilaawah_reading_progress',
    STREAK_DATA: '@tilaawah_streak_data',
    BOOKMARKS: '@tilaawah_bookmarks',
    NOTES: '@tilaawah_notes',
    SESSIONS: '@tilaawah_sessions',
    ONBOARDING_COMPLETED: '@tilaawah_onboarding_complete',
    AUTH_TOKEN: '@tilaawah_auth_token',
    LAST_READ: '@tilaawah_last_read',
} as const;

// Quran constants
export const TOTAL_SURAHS = 114;
export const TOTAL_AYAHS = 6236;
export const TOTAL_JUZS = 30;
export const TOTAL_PAGES = 604;

// Streak milestones
export const STREAK_MILESTONES = [7, 14, 30, 60, 90, 180, 365, 500, 1000];

// Daily goal presets
export const DAILY_GOAL_PRESETS = {
    minutes: [5, 10, 15, 20, 30, 45, 60],
    ayahs: [5, 10, 20, 30, 50, 100],
    pages: [1, 2, 3, 5, 10],
} as const;

// Reciters list
export const RECITERS = [
    { id: 'abdul_basit', name: 'Abdul Basit', arabicName: 'عبد الباسط عبد الصمد', style: 'Murattal', isPremium: false },
    { id: 'abdulrahman_sudais', name: 'Abdulrahman Al-Sudais', arabicName: 'عبد الرحمن السديس', style: 'Murattal', isPremium: false },
    { id: 'mishary_rashid', name: 'Mishary Rashid Alafasy', arabicName: 'مشاري راشد العفاسي', style: 'Murattal', isPremium: false },
    { id: 'mohammed_siddiq', name: 'Mohammed Siddiq El-Minshawi', arabicName: 'محمد صديق المنشاوي', style: 'Murattal', isPremium: true },
    { id: 'maher_al_muaiqly', name: 'Maher Al-Muaiqly', arabicName: 'ماهر المعيقلي', style: 'Murattal', isPremium: true },
    { id: 'saud_shuraim', name: 'Saud Al-Shuraim', arabicName: 'سعود الشريم', style: 'Murattal', isPremium: true },
] as const;

// Translations list
// `id` matches alquran.cloud API identifier for direct fetching
export const TRANSLATIONS = [
    // English
    { id: 'en.sahih', name: 'Sahih International', language: 'English', author: 'Sahih International', isPremium: false },
    { id: 'en.yusufali', name: 'Yusuf Ali', language: 'English', author: 'Abdullah Yusuf Ali', isPremium: false },
    { id: 'en.pickthall', name: 'Pickthall', language: 'English', author: 'Mohammed Marmaduke Pickthall', isPremium: false },
    { id: 'en.asad', name: 'Muhammad Asad', language: 'English', author: 'Muhammad Asad', isPremium: false },
    { id: 'en.hilali', name: 'Hilali & Khan', language: 'English', author: 'Hilali & Khan', isPremium: false },
    { id: 'en.itani', name: 'Clear Quran', language: 'English', author: 'Talal Itani', isPremium: false },
    { id: 'en.maududi', name: 'Maududi', language: 'English', author: 'Abul Ala Maududi', isPremium: false },
    // Malayalam
    { id: 'ml.abdulhameed', name: 'Abdul Hameed & Parappoor', language: 'Malayalam', author: 'Cheriyamundam Abdul Hameed & Kunhi Mohammed Parappoor', isPremium: false },
    { id: 'ml.karakunnu', name: 'Karakunnu & Elayavoor', language: 'Malayalam', author: 'Karakunnu & Elayavoor', isPremium: false },
    // Hindi
    { id: 'hi.hindi', name: 'Farooq Khan & Nadwi', language: 'Hindi', author: 'Suhel Farooq Khan & Saifur Rahman Nadwi', isPremium: false },
    { id: 'hi.farooq', name: 'Farooq Khan & Ahmed', language: 'Hindi', author: 'Muhammad Farooq Khan & Muhammad Ahmed', isPremium: false },
    // Urdu
    { id: 'ur.jalandhry', name: 'Jalandhry', language: 'Urdu', author: 'Fateh Muhammad Jalandhry', isPremium: false },
    { id: 'ur.maududi', name: 'Maududi', language: 'Urdu', author: "Abul A'ala Maududi", isPremium: false },
    // Tamil
    { id: 'ta.tamil', name: 'Jan Trust', language: 'Tamil', author: 'Jan Trust Foundation', isPremium: false },
    // Bengali
    { id: 'bn.bengali', name: 'Muhiuddin Khan', language: 'Bengali', author: 'Muhiuddin Khan', isPremium: false },
    // French
    { id: 'fr.hamidullah', name: 'Hamidullah', language: 'French', author: 'Muhammad Hamidullah', isPremium: false },
    // Turkish
    { id: 'tr.diyanet', name: 'Diyanet İşleri', language: 'Turkish', author: 'Diyanet Isleri', isPremium: false },
    // Malay
    { id: 'ms.basmeih', name: 'Basmeih', language: 'Malay', author: 'Abdullah Muhammad Basmeih', isPremium: false },
    // Indonesian
    { id: 'id.indonesian', name: 'Bahasa Indonesia', language: 'Indonesian', author: 'Indonesian Ministry of Religious Affairs', isPremium: false },
    // Russian
    { id: 'ru.kuliev', name: 'Kuliev', language: 'Russian', author: 'Elmir Kuliev', isPremium: false },
    // German
    { id: 'de.bubenheim', name: 'Bubenheim & Elyas', language: 'German', author: 'A. S. F. Bubenheim & N. Elyas', isPremium: false },
    // Spanish
    { id: 'es.cortes', name: 'Julio Cortes', language: 'Spanish', author: 'Julio Cortes', isPremium: false },
    // Persian / Farsi
    { id: 'fa.makarem', name: 'Makarem Shirazi', language: 'Persian', author: 'Naser Makarem Shirazi', isPremium: false },
] as const;

// Audio base URL (everyayah.com)
export const AUDIO_BASE_URL = 'https://everyayah.com/data';

// Reciter audio paths
export const RECITER_AUDIO_PATHS: Record<string, string> = {
    abdul_basit: 'abdul_basit_murattal',
    abdulrahman_sudais: 'Abdulrahman_Al-Sudais',
    mishary_rashid: 'Alafasy_128kbps',
    mohammed_siddiq: 'Minshawy_Murattal_128kbps',
    maher_al_muaiqly: 'Maher_AlMuaiqly128kbps',
    saud_shuraim: 'Saud_Al-Shuraim_128kbps',
};

// Notification identifiers
export const NOTIFICATION_IDS = {
    DAILY_REMINDER: 'daily-reminder',
    STREAK_ALERT: 'streak-alert',
    MILESTONE: 'milestone',
    WEEKLY_REPORT: 'weekly-report',
} as const;

// Premium features
export const PREMIUM_FEATURES = {
    ADVANCED_ANALYTICS: 'advanced_analytics',
    ADDITIONAL_RECITERS: 'additional_reciters',
    ADDITIONAL_TRANSLATIONS: 'additional_translations',
    STREAK_GRACE: 'streak_grace',
    SIDE_BY_SIDE_VIEW: 'side_by_side_view',
    OFFLINE_DOWNLOADS: 'offline_downloads',
} as const;

// Subscription prices (in USD)
export const SUBSCRIPTION_PRICES = {
    monthly: 4.99,
    yearly: 39.99,
} as const;

// Default preferences
export const DEFAULT_PREFERENCES = {
    dailyGoal: { type: 'minutes' as const, value: 10 },
    reminderTime: '08:00',
    reminderEnabled: true,
    fontSize: 'medium' as const,
    theme: 'light' as const,
    showTranslation: true,
    preferredTranslation: 'en.sahih',
    preferredReciter: 'mishary_rashid',
};