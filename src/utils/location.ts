import { Geolocation, Position, PositionOptions } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  altitude?: number;
  speed?: number;
  heading?: number;
}

export const location = {
  // Get current location
  getCurrentLocation: async (options?: PositionOptions): Promise<LocationData | null> => {
    if (!Capacitor.isNativePlatform()) {
      // Web fallback
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          console.log('Geolocation not supported');
          resolve(null);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
              altitude: position.coords.altitude || undefined,
              speed: position.coords.speed || undefined,
              heading: position.coords.heading || undefined,
            });
          },
          (error) => {
            console.error('Error getting location:', error);
            resolve(null);
          },
          options
        );
      });
    }

    try {
      const position: Position = await Geolocation.getCurrentPosition(options);
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        altitude: position.coords.altitude || undefined,
        speed: position.coords.speed || undefined,
        heading: position.coords.heading || undefined,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  },

  // Watch location changes
  watchLocation: (
    callback: (location: LocationData | null) => void,
    options?: PositionOptions
  ): string | number => {
    if (!Capacitor.isNativePlatform()) {
      // Web fallback
      if (!navigator.geolocation) {
        console.log('Geolocation not supported');
        return -1;
      }

      return navigator.geolocation.watchPosition(
        (position) => {
          callback({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            altitude: position.coords.altitude || undefined,
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
          });
        },
        (error) => {
          console.error('Error watching location:', error);
          callback(null);
        },
        options
      );
    }

    // Native implementation
    let watchId: string;
    Geolocation.watchPosition(options || {}, (position, err) => {
      if (err) {
        console.error('Error watching location:', err);
        callback(null);
        return;
      }

      if (position) {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          altitude: position.coords.altitude || undefined,
          speed: position.coords.speed || undefined,
          heading: position.coords.heading || undefined,
        });
      }
    }).then((id) => {
      watchId = id;
    });

    return watchId!;
  },

  // Stop watching location
  clearWatch: async (watchId: string | number) => {
    if (!Capacitor.isNativePlatform()) {
      if (typeof watchId === 'number') {
        navigator.geolocation.clearWatch(watchId);
      }
      return;
    }

    try {
      await Geolocation.clearWatch({ id: watchId as string });
    } catch (error) {
      console.error('Error clearing location watch:', error);
    }
  },

  // Check permissions
  checkPermissions: async () => {
    if (!Capacitor.isNativePlatform()) {
      if (!navigator.permissions) return 'granted';
      
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        return result.state;
      } catch (error) {
        return 'prompt';
      }
    }

    try {
      const permissions = await Geolocation.checkPermissions();
      return permissions.location;
    } catch (error) {
      console.error('Error checking location permissions:', error);
      return 'denied';
    }
  },

  // Request permissions
  requestPermissions: async () => {
    if (!Capacitor.isNativePlatform()) {
      // On web, permissions are requested when calling getCurrentPosition
      return true;
    }

    try {
      const permissions = await Geolocation.requestPermissions();
      return permissions.location === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  },

  // Get Google Maps URL for location
  getMapsUrl: (latitude: number, longitude: number): string => {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  },

  // Format location for display
  formatLocation: (latitude: number, longitude: number): string => {
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};
