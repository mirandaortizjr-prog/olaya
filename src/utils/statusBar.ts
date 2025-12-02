import { StatusBar, Style, Animation } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export const statusBar = {
  // Set status bar style (light or dark content)
  setStyle: async (style: 'LIGHT' | 'DARK' | 'DEFAULT') => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await StatusBar.setStyle({ style: Style[style] });
    } catch (error) {
      console.error('Error setting status bar style:', error);
    }
  },

  // Set status bar background color (Android only)
  setBackgroundColor: async (color: string) => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await StatusBar.setBackgroundColor({ color });
    } catch (error) {
      console.error('Error setting status bar background color:', error);
    }
  },

  // Show the status bar
  show: async (animation?: 'Fade' | 'Slide' | 'None') => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await StatusBar.show({
        animation: animation ? Animation[animation] : Animation.Fade,
      });
    } catch (error) {
      console.error('Error showing status bar:', error);
    }
  },

  // Hide the status bar
  hide: async (animation?: 'Fade' | 'Slide' | 'None') => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await StatusBar.hide({
        animation: animation ? Animation[animation] : Animation.Fade,
      });
    } catch (error) {
      console.error('Error hiding status bar:', error);
    }
  },

  // Get status bar info
  getInfo: async () => {
    if (!Capacitor.isNativePlatform()) return null;
    
    try {
      return await StatusBar.getInfo();
    } catch (error) {
      console.error('Error getting status bar info:', error);
      return null;
    }
  },

  // Set overlay web view (Android only)
  setOverlaysWebView: async (overlay: boolean) => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await StatusBar.setOverlaysWebView({ overlay });
    } catch (error) {
      console.error('Error setting status bar overlay:', error);
    }
  },
};
