import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export const camera = {
  // Take a photo with the camera
  takePhoto: async (): Promise<string | null> => {
    if (!Capacitor.isNativePlatform()) {
      console.log('Camera not available on web');
      return null;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  },

  // Pick a photo from gallery
  pickPhoto: async (): Promise<string | null> => {
    if (!Capacitor.isNativePlatform()) {
      console.log('Camera not available on web');
      return null;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Error picking photo:', error);
      return null;
    }
  },

  // Pick multiple photos from gallery
  pickPhotos: async (): Promise<string[]> => {
    if (!Capacitor.isNativePlatform()) {
      console.log('Camera not available on web');
      return [];
    }

    try {
      const images = await Camera.pickImages({
        quality: 90,
      });

      return images.photos.map(photo => photo.webPath || '').filter(Boolean);
    } catch (error) {
      console.error('Error picking photos:', error);
      return [];
    }
  },

  // Check camera permissions
  checkPermissions: async () => {
    try {
      const permissions = await Camera.checkPermissions();
      return permissions;
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      return { camera: 'denied', photos: 'denied' };
    }
  },

  // Request camera permissions
  requestPermissions: async () => {
    try {
      const permissions = await Camera.requestPermissions();
      return permissions;
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return { camera: 'denied', photos: 'denied' };
    }
  },
};
