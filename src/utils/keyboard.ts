import { Keyboard, KeyboardStyle, KeyboardResize } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

export const keyboard = {
  // Show the keyboard
  show: async () => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await Keyboard.show();
    } catch (error) {
      console.error('Error showing keyboard:', error);
    }
  },

  // Hide the keyboard
  hide: async () => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await Keyboard.hide();
    } catch (error) {
      console.error('Error hiding keyboard:', error);
    }
  },

  // Set keyboard style (light/dark)
  setStyle: async (style: 'LIGHT' | 'DARK' | 'DEFAULT') => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await Keyboard.setStyle({ style: KeyboardStyle[style] });
    } catch (error) {
      console.error('Error setting keyboard style:', error);
    }
  },

  // Set resize mode
  setResizeMode: async (mode: 'BODY' | 'IONIC' | 'NATIVE' | 'NONE') => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await Keyboard.setResizeMode({ mode: KeyboardResize[mode] });
    } catch (error) {
      console.error('Error setting keyboard resize mode:', error);
    }
  },

  // Set whether to scroll to focused input
  setScroll: async (isDisabled: boolean) => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await Keyboard.setScroll({ isDisabled });
    } catch (error) {
      console.error('Error setting keyboard scroll:', error);
    }
  },

  // Set accessory bar visibility (iOS only)
  setAccessoryBarVisible: async (isVisible: boolean) => {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await Keyboard.setAccessoryBarVisible({ isVisible });
    } catch (error) {
      console.error('Error setting accessory bar visibility:', error);
    }
  },

  // Add keyboard event listeners
  addListeners: (callbacks: {
    onShow?: (info: { keyboardHeight: number }) => void;
    onHide?: () => void;
    onWillShow?: (info: { keyboardHeight: number }) => void;
    onWillHide?: () => void;
  }) => {
    if (!Capacitor.isNativePlatform()) return { remove: () => {} };
    
    const listeners: (() => void)[] = [];

    if (callbacks.onShow) {
      Keyboard.addListener('keyboardDidShow', callbacks.onShow).then(l => listeners.push(() => l.remove()));
    }
    if (callbacks.onHide) {
      Keyboard.addListener('keyboardDidHide', callbacks.onHide).then(l => listeners.push(() => l.remove()));
    }
    if (callbacks.onWillShow) {
      Keyboard.addListener('keyboardWillShow', callbacks.onWillShow).then(l => listeners.push(() => l.remove()));
    }
    if (callbacks.onWillHide) {
      Keyboard.addListener('keyboardWillHide', callbacks.onWillHide).then(l => listeners.push(() => l.remove()));
    }

    return {
      remove: () => listeners.forEach(remove => remove()),
    };
  },
};
