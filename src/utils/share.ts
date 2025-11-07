import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export const share = {
  // Share text content
  text: async (text: string, title?: string): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      // Fallback to Web Share API if available
      if (navigator.share) {
        try {
          await navigator.share({ text, title });
          return true;
        } catch (error) {
          console.error('Error sharing:', error);
          return false;
        }
      }
      console.log('Share not available on this platform');
      return false;
    }

    try {
      await Share.share({
        text,
        title,
        dialogTitle: title || 'Share',
      });
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  },

  // Share a URL
  url: async (url: string, title?: string): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      if (navigator.share) {
        try {
          await navigator.share({ url, title });
          return true;
        } catch (error) {
          console.error('Error sharing:', error);
          return false;
        }
      }
      console.log('Share not available on this platform');
      return false;
    }

    try {
      await Share.share({
        url,
        title,
        dialogTitle: title || 'Share',
      });
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  },

  // Check if sharing is available
  canShare: async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      return !!navigator.share;
    }
    
    try {
      const result = await Share.canShare();
      return result.value;
    } catch (error) {
      return false;
    }
  },
};
