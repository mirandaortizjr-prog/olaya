import { Badge } from '@capawesome/capacitor-badge';
import { Capacitor } from '@capacitor/core';

export const badge = {
  // Set the badge count
  set: async (count: number) => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await Badge.set({ count });
    } catch (error) {
      console.error('Error setting badge:', error);
    }
  },

  // Get the current badge count
  get: async (): Promise<number> => {
    if (!Capacitor.isNativePlatform()) return 0;
    
    try {
      const result = await Badge.get();
      return result.count;
    } catch (error) {
      console.error('Error getting badge:', error);
      return 0;
    }
  },

  // Increase the badge count by 1
  increase: async () => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await Badge.increase();
    } catch (error) {
      console.error('Error increasing badge:', error);
    }
  },

  // Decrease the badge count by 1
  decrease: async () => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await Badge.decrease();
    } catch (error) {
      console.error('Error decreasing badge:', error);
    }
  },

  // Clear the badge
  clear: async () => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await Badge.clear();
    } catch (error) {
      console.error('Error clearing badge:', error);
    }
  },

  // Check if badge is supported
  isSupported: async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) return false;
    
    try {
      const result = await Badge.isSupported();
      return result.isSupported;
    } catch (error) {
      console.error('Error checking badge support:', error);
      return false;
    }
  },

  // Check and request permissions
  checkPermissions: async () => {
    if (!Capacitor.isNativePlatform()) return { display: 'denied' };
    
    try {
      return await Badge.checkPermissions();
    } catch (error) {
      console.error('Error checking badge permissions:', error);
      return { display: 'denied' };
    }
  },

  requestPermissions: async () => {
    if (!Capacitor.isNativePlatform()) return { display: 'denied' };
    
    try {
      return await Badge.requestPermissions();
    } catch (error) {
      console.error('Error requesting badge permissions:', error);
      return { display: 'denied' };
    }
  },
};
