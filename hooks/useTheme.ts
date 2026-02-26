import { Colors } from '@/constants';

export const useTheme = () => {
    // Always use light theme
    const colors = Colors.light;
    const isDark = false;

    return {
        colors,
        isDark,
        theme: 'light' as const,
    };
};
