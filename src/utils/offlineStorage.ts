import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export interface OfflineData {
  key: string;
  value: any;
  timestamp: number;
}

export const offlineStorage = {
  // Store data locally
  set: async (key: string, value: any): Promise<boolean> => {
    try {
      await Preferences.set({
        key,
        value: JSON.stringify({
          data: value,
          timestamp: Date.now()
        })
      });
      return true;
    } catch (error) {
      console.error('Error storing data:', error);
      return false;
    }
  },

  // Get data from local storage
  get: async (key: string): Promise<any | null> => {
    try {
      const { value } = await Preferences.get({ key });
      if (!value) return null;
      
      const parsed = JSON.parse(value);
      return parsed.data;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },

  // Remove data
  remove: async (key: string): Promise<boolean> => {
    try {
      await Preferences.remove({ key });
      return true;
    } catch (error) {
      console.error('Error removing data:', error);
      return false;
    }
  },

  // Clear all stored data
  clear: async (): Promise<boolean> => {
    try {
      await Preferences.clear();
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  },

  // Get all keys
  keys: async (): Promise<string[]> => {
    try {
      const { keys } = await Preferences.keys();
      return keys;
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  },

  // Store file locally (native only)
  saveFile: async (
    fileName: string,
    data: string,
    directory: Directory = Directory.Data
  ): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      console.log('File storage only available on native platforms');
      return false;
    }

    try {
      await Filesystem.writeFile({
        path: fileName,
        data,
        directory,
        encoding: Encoding.UTF8,
      });
      return true;
    } catch (error) {
      console.error('Error saving file:', error);
      return false;
    }
  },

  // Read file (native only)
  readFile: async (
    fileName: string,
    directory: Directory = Directory.Data
  ): Promise<string | null> => {
    if (!Capacitor.isNativePlatform()) {
      console.log('File storage only available on native platforms');
      return null;
    }

    try {
      const { data } = await Filesystem.readFile({
        path: fileName,
        directory,
        encoding: Encoding.UTF8,
      });
      return data as string;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  },

  // Delete file (native only)
  deleteFile: async (
    fileName: string,
    directory: Directory = Directory.Data
  ): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      console.log('File storage only available on native platforms');
      return false;
    }

    try {
      await Filesystem.deleteFile({
        path: fileName,
        directory,
      });
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  },

  // Store draft messages (for offline support)
  saveDraft: async (type: string, content: any): Promise<boolean> => {
    const key = `draft_${type}_${Date.now()}`;
    return offlineStorage.set(key, {
      type,
      content,
      status: 'pending',
      createdAt: Date.now()
    });
  },

  // Get all pending drafts
  getPendingDrafts: async (): Promise<OfflineData[]> => {
    try {
      const keys = await offlineStorage.keys();
      const draftKeys = keys.filter(key => key.startsWith('draft_'));
      
      const drafts: OfflineData[] = [];
      for (const key of draftKeys) {
        const value = await offlineStorage.get(key);
        if (value && value.status === 'pending') {
          drafts.push({
            key,
            value,
            timestamp: value.createdAt
          });
        }
      }
      
      return drafts.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error getting pending drafts:', error);
      return [];
    }
  },

  // Mark draft as synced
  markDraftSynced: async (key: string): Promise<boolean> => {
    try {
      const value = await offlineStorage.get(key);
      if (value) {
        value.status = 'synced';
        await offlineStorage.set(key, value);
      }
      return true;
    } catch (error) {
      console.error('Error marking draft as synced:', error);
      return false;
    }
  },

  // Clean up old synced drafts (older than 7 days)
  cleanupOldDrafts: async (): Promise<boolean> => {
    try {
      const keys = await offlineStorage.keys();
      const draftKeys = keys.filter(key => key.startsWith('draft_'));
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      for (const key of draftKeys) {
        const value = await offlineStorage.get(key);
        if (value && value.status === 'synced' && value.createdAt < sevenDaysAgo) {
          await offlineStorage.remove(key);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error cleaning up drafts:', error);
      return false;
    }
  }
};
