import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '@/constants';

interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    padding?: 'default' | 'none';
    variant?: 'default' | 'frosted' | 'purple';
}

export const Card = ({ children, style, padding = 'default', variant = 'default' }: CardProps) => {
    return (
        <View style={[
            styles.card,
            variant === 'frosted' && styles.frosted,
            variant === 'purple' && styles.purple,
            padding === 'none' && { padding: 0 },
            style,
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 16,
        elevation: 3,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    frosted: {
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderWidth: 1,
        borderColor: 'rgba(139,92,246,0.1)',
    },
    purple: {
        backgroundColor: Colors.primary[50],
        borderWidth: 1,
        borderColor: Colors.primary[200],
    },
});
