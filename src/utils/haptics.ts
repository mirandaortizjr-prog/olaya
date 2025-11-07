import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export const haptics = {
  // Light tap (for UI interactions)
  light: async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.error('Haptic feedback error:', error);
    }
  },

  // Medium tap (for button presses)
  medium: async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.error('Haptic feedback error:', error);
    }
  },

  // Heavy tap (for important actions)
  heavy: async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.error('Haptic feedback error:', error);
    }
  },

  // Success vibration
  success: async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (error) {
      console.error('Haptic feedback error:', error);
    }
  },

  // Warning vibration
  warning: async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch (error) {
      console.error('Haptic feedback error:', error);
    }
  },

  // Error vibration
  error: async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (error) {
      console.error('Haptic feedback error:', error);
    }
  },

  // Selection changed (for pickers, switches)
  selectionChanged: async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await Haptics.selectionChanged();
    } catch (error) {
      console.error('Haptic feedback error:', error);
    }
  },
};
