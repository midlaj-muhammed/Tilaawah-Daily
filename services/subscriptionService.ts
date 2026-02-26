import { Subscription, ApiResponse } from '@/types';
import { SUBSCRIPTION_PRICES, PREMIUM_FEATURES } from '@/constants';

let InAppPurchases: any = null;
try {
    InAppPurchases = require('expo-in-app-purchases');
} catch (e) { }

const PRODUCT_IDS = {
    monthly: 'tilaawah_premium_monthly',
    yearly: 'tilaawah_premium_yearly',
};

export const subscriptionService = {
    initialize: async () => {
        try {
            await InAppPurchases?.connectAsync();
            return true;
        } catch { return false; }
    },

    purchaseSubscription: async (
        productId: 'monthly' | 'yearly',
        onSuccess?: (subscription: Subscription) => void,
        onError?: (error: string) => void
    ): Promise<ApiResponse<Subscription>> => {
        // Basic implementation - in production use real verification
        const subscription: Subscription = {
            id: `sub-${Date.now()}`,
            userId: 'current-user',
            tier: 'premium',
            startDate: new Date().toISOString(),
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            platform: 'ios',
            isActive: true,
        };
        onSuccess?.(subscription);
        return { success: true, data: subscription };
    },

    verifyPurchase: async (purchaseToken: string): Promise<ApiResponse<Subscription>> => {
        return { success: true, data: {} as any };
    },

    restorePurchases: async (): Promise<ApiResponse<Subscription[]>> => {
        return { success: true, data: [] };
    },

    getSubscriptionStatus: async (): Promise<ApiResponse<Subscription | null>> => {
        const userStore = require('@/store/userStore').useUserStore;
        const user = userStore.getState().user;
        if (!user || user.subscription !== 'premium') return { success: true, data: null };
        return { success: true, data: { isActive: true } as any };
    },

    hasPremiumAccess: async (): Promise<boolean> => {
        const userStore = require('@/store/userStore').useUserStore;
        const user = userStore.getState().user;
        return user?.subscription === 'premium';
    },

    isFeatureAvailable: async (feature: string): Promise<boolean> => {
        const hasPremium = await subscriptionService.hasPremiumAccess();
        if (Object.values(PREMIUM_FEATURES).includes(feature as any)) return hasPremium;
        return true;
    },

    getYearlySavings: () => {
        const monthlyCost = SUBSCRIPTION_PRICES.monthly * 12;
        const yearlyCost = SUBSCRIPTION_PRICES.yearly;
        const savings = monthlyCost - yearlyCost;
        const percentage = Math.round((savings / monthlyCost) * 100);
        return { amount: savings, percentage };
    },
};

export const useSubscriptionService = () => subscriptionService;
export default subscriptionService;
