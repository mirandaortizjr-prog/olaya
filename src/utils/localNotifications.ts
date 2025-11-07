import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const localNotifications = {
  // Request permission for local notifications
  requestPermission: async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) return false;

    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Error requesting local notification permissions:', error);
      return false;
    }
  },

  // Schedule anniversary reminder
  scheduleAnniversaryReminder: async (anniversaryDate: Date): Promise<void> => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const hasPermission = await localNotifications.requestPermission();
      if (!hasPermission) return;

      // Schedule notification for anniversary day at 9 AM
      const notificationDate = new Date(anniversaryDate);
      notificationDate.setHours(9, 0, 0, 0);

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: '🎉 Happy Anniversary!',
            body: 'Today is a special day for you and your partner!',
            schedule: { at: notificationDate, repeats: true, every: 'year' },
            sound: undefined,
            attachments: undefined,
            actionTypeId: '',
            extra: { route: '/dashboard' },
          },
        ],
      });

      console.log('Anniversary reminder scheduled');
    } catch (error) {
      console.error('Error scheduling anniversary reminder:', error);
    }
  },

  // Schedule daily check-in reminder
  scheduleDailyCheckIn: async (hour: number = 20): Promise<void> => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const hasPermission = await localNotifications.requestPermission();
      if (!hasPermission) return;

      const notificationDate = new Date();
      notificationDate.setHours(hour, 0, 0, 0);

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 2,
            title: '💕 Time to Connect',
            body: 'Send your partner some love today!',
            schedule: { at: notificationDate, repeats: true, every: 'day' },
            sound: undefined,
            attachments: undefined,
            actionTypeId: '',
            extra: { route: '/dashboard' },
          },
        ],
      });

      console.log('Daily check-in reminder scheduled');
    } catch (error) {
      console.error('Error scheduling daily check-in:', error);
    }
  },

  // Cancel a specific notification
  cancel: async (id: number): Promise<void> => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await LocalNotifications.cancel({ notifications: [{ id }] });
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  },

  // Cancel all notifications
  cancelAll: async (): Promise<void> => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications });
      }
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  },

  // Get all pending notifications
  getPending: async () => {
    if (!Capacitor.isNativePlatform()) return [];

    try {
      const result = await LocalNotifications.getPending();
      return result.notifications;
    } catch (error) {
      console.error('Error getting pending notifications:', error);
      return [];
    }
  },
};
