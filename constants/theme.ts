export const Colors = {
    primary: {
        50: '#F5F3FF',
        100: '#EDE9FE',
        200: '#DDD6FE',
        300: '#C4B5FD',
        400: '#A78BFA',
        500: '#8B5CF6',
        600: '#7C3AED',
        700: '#6D28D9',
        800: '#5B21B6',
        900: '#4C1D95',
    },
    light: {
        background: '#F5F3FF',
        surface: '#FFFFFF',
        surfaceSecondary: '#EDE9FE',
        text: '#1E1B4B',
        textSecondary: '#4338CA',
        textTertiary: '#6B7280',
        textQuaternary: '#9CA3AF',
        border: '#E5E7EB',
    },
    dark: {
        background: '#0F0A2A',
        surface: '#1A103D',
        surfaceSecondary: '#2D1B69',
        text: '#F5F3FF',
        textSecondary: '#C4B5FD',
        textTertiary: '#A78BFA',
        textQuaternary: '#6D28D9',
        border: 'rgba(139,92,246,0.2)',
    },
    gray: {
        50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB',
        300: '#D1D5DB', 400: '#9CA3AF', 500: '#6B7280',
        600: '#4B5563', 700: '#374151', 800: '#1F2937', 900: '#111827',
    },
    neutral: {
        50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB',
        300: '#D1D5DB', 400: '#9CA3AF', 500: '#6B7280',
        600: '#4B5563', 700: '#374151', 800: '#1F2937', 900: '#111827',
    },
    accent: {
        25: '#FFF7ED', 50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A',
        300: '#FCD34D', 400: '#FBBF24', 500: '#F59E0B',
        600: '#D97706', 700: '#B45309', 800: '#92400E', 900: '#78350F',
    },
    mint: {
        400: '#34D399',
        500: '#10B981',
        600: '#059669',
    },
    pink: {
        400: '#F472B6',
        500: '#EC4899',
        600: '#DB2777',
    },
    danger: '#EF4444',
};

export const Shadows = {
    sm: { shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
    md: { shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 3 },
    lg: { shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 12, elevation: 6 },
    glow: { shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 8 },
};

export const Typography = {
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        md: 18,
        lg: 20,
        xl: 24,
        '2xl': 28,
        '3xl': 32,
        '4xl': 40,
    }
};

export const Spacing = {
    xs: 4,
    sm: 8,
    base: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 80,
};

export const BorderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
};
