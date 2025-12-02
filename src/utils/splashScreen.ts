import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

export const splashScreen = {
  // Show the splash screen
  show: async (options?: { autoHide?: boolean; fadeInDuration?: number; fadeOutDuration?: number; showDuration?: number }) => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await SplashScreen.show({
        autoHide: options?.autoHide ?? true,
        fadeInDuration: options?.fadeInDuration ?? 200,
        fadeOutDuration: options?.fadeOutDuration ?? 200,
        showDuration: options?.showDuration ?? 3000,
      });
    } catch (error) {
      console.error('Error showing splash screen:', error);
    }
  },

  // Hide the splash screen
  hide: async (options?: { fadeOutDuration?: number }) => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await SplashScreen.hide({
        fadeOutDuration: options?.fadeOutDuration ?? 200,
      });
    } catch (error) {
      console.error('Error hiding splash screen:', error);
    }
  },
};
