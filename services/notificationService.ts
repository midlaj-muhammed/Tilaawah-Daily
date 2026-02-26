import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

// Configure how notifications should behave when the app is in the foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true
    }),
});

export const notificationService = {
    /**
     * Request permissions and retrieve ExponentPushToken if needed.
     */
    async registerForPushNotificationsAsync() {
        if (!Device.isDevice) {
            console.log('Must use physical device for Push Notifications');
            return null;
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#8B5CF6',
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return false;
        }

        // For local notifications, we don't need to fetch an Expo push token.
        // If we needed remote push notifications from a server, we would fetch the token here
        // using a valid EAS project ID.
        return true;
    },

    /**
     * Schedule a daily reminder notification.
     * @param hour The hour of the day to trigger (0-23)
     * @param minute The minute of the hour to trigger (0-59)
     * @param streakCount Current streak to make message personalized
     */
    async scheduleDailyReminder(hour: number = 18, minute: number = 0, streakCount: number = 0) {
        // First cancel any existing scheduled notifications to avoid duplicates
        await Notifications.cancelAllScheduledNotificationsAsync();

        let body = "It's time for your daily reading. Connect with the Quran today.";
        if (streakCount > 0) {
            body = `Keep your ${streakCount}-day streak alive! Open Tilaawah Daily to read today's Ayah.`;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "📖 Daily Tilaawah Reminder",
                body: body,
                sound: true,
            },
            trigger: {
                type: 'daily',
                hour: hour,
                minute: minute,
            } as Notifications.DailyTriggerInput,
        });
    },

    /**
     * Cancel all scheduled notifications.
     */
    async cancelAllReminders() {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
};
