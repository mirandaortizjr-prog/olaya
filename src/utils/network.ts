import { Network, ConnectionStatus, ConnectionType } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';

export interface NetworkStatus {
  connected: boolean;
  connectionType: ConnectionType;
}

export const network = {
  // Get current network status
  getStatus: async (): Promise<NetworkStatus> => {
    try {
      const status = await Network.getStatus();
      return {
        connected: status.connected,
        connectionType: status.connectionType,
      };
    } catch (error) {
      console.error('Error getting network status:', error);
      return {
        connected: navigator.onLine,
        connectionType: 'unknown',
      };
    }
  },

  // Check if connected to the internet
  isConnected: async (): Promise<boolean> => {
    try {
      const status = await Network.getStatus();
      return status.connected;
    } catch (error) {
      console.error('Error checking network connection:', error);
      return navigator.onLine;
    }
  },

  // Add network status change listener
  addListener: (callback: (status: NetworkStatus) => void) => {
    let listener: { remove: () => void } | null = null;

    Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
      callback({
        connected: status.connected,
        connectionType: status.connectionType,
      });
    }).then(l => {
      listener = l;
    });

    // Also listen to browser online/offline events as fallback
    const handleOnline = () => callback({ connected: true, connectionType: 'unknown' });
    const handleOffline = () => callback({ connected: false, connectionType: 'none' });
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return {
      remove: () => {
        listener?.remove();
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      },
    };
  },

  // Check connection type
  getConnectionType: async (): Promise<ConnectionType> => {
    try {
      const status = await Network.getStatus();
      return status.connectionType;
    } catch (error) {
      console.error('Error getting connection type:', error);
      return 'unknown';
    }
  },

  // Check if on WiFi
  isWifi: async (): Promise<boolean> => {
    try {
      const status = await Network.getStatus();
      return status.connectionType === 'wifi';
    } catch (error) {
      return false;
    }
  },

  // Check if on cellular
  isCellular: async (): Promise<boolean> => {
    try {
      const status = await Network.getStatus();
      return status.connectionType === 'cellular';
    } catch (error) {
      return false;
    }
  },
};
