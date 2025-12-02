import { Device, DeviceInfo, BatteryInfo, DeviceId, LanguageTag } from '@capacitor/device';

export interface DeviceDetails {
  name: string | undefined;
  model: string;
  platform: 'ios' | 'android' | 'web';
  operatingSystem: string;
  osVersion: string;
  manufacturer: string;
  isVirtual: boolean;
  webViewVersion: string;
}

export const device = {
  // Get device info
  getInfo: async (): Promise<DeviceDetails | null> => {
    try {
      const info = await Device.getInfo();
      return {
        name: info.name,
        model: info.model,
        platform: info.platform,
        operatingSystem: info.operatingSystem,
        osVersion: info.osVersion,
        manufacturer: info.manufacturer,
        isVirtual: info.isVirtual,
        webViewVersion: info.webViewVersion,
      };
    } catch (error) {
      console.error('Error getting device info:', error);
      return null;
    }
  },

  // Get unique device ID
  getId: async (): Promise<string | null> => {
    try {
      const id = await Device.getId();
      return id.identifier;
    } catch (error) {
      console.error('Error getting device ID:', error);
      return null;
    }
  },

  // Get battery info
  getBatteryInfo: async (): Promise<BatteryInfo | null> => {
    try {
      return await Device.getBatteryInfo();
    } catch (error) {
      console.error('Error getting battery info:', error);
      return null;
    }
  },

  // Get device language
  getLanguageCode: async (): Promise<string> => {
    try {
      const lang = await Device.getLanguageCode();
      return lang.value;
    } catch (error) {
      console.error('Error getting language code:', error);
      return navigator.language.split('-')[0] || 'en';
    }
  },

  // Get device language tag (full locale)
  getLanguageTag: async (): Promise<string> => {
    try {
      const lang = await Device.getLanguageTag();
      return lang.value;
    } catch (error) {
      console.error('Error getting language tag:', error);
      return navigator.language || 'en-US';
    }
  },

  // Check if running on iOS
  isIOS: async (): Promise<boolean> => {
    try {
      const info = await Device.getInfo();
      return info.platform === 'ios';
    } catch (error) {
      return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }
  },

  // Check if running on Android
  isAndroid: async (): Promise<boolean> => {
    try {
      const info = await Device.getInfo();
      return info.platform === 'android';
    } catch (error) {
      return /Android/.test(navigator.userAgent);
    }
  },

  // Check if running on web
  isWeb: async (): Promise<boolean> => {
    try {
      const info = await Device.getInfo();
      return info.platform === 'web';
    } catch (error) {
      return true;
    }
  },

  // Check if running in emulator/simulator
  isVirtual: async (): Promise<boolean> => {
    try {
      const info = await Device.getInfo();
      return info.isVirtual;
    } catch (error) {
      return false;
    }
  },

  // Get platform name
  getPlatform: async (): Promise<'ios' | 'android' | 'web'> => {
    try {
      const info = await Device.getInfo();
      return info.platform;
    } catch (error) {
      return 'web';
    }
  },
};
