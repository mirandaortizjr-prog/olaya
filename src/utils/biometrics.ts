import { BiometricAuth, BiometryType } from '@aparajita/capacitor-biometric-auth';
import { Capacitor } from '@capacitor/core';

export const biometrics = {
  // Check if biometric authentication is available
  isAvailable: async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) return false;

    try {
      const result = await BiometricAuth.checkBiometry();
      return result.isAvailable;
    } catch (error) {
      console.error('Error checking biometry availability:', error);
      return false;
    }
  },

  // Get the type of biometry available
  getBiometryType: async (): Promise<BiometryType | null> => {
    if (!Capacitor.isNativePlatform()) return null;

    try {
      const result = await BiometricAuth.checkBiometry();
      return result.biometryType;
    } catch (error) {
      console.error('Error getting biometry type:', error);
      return null;
    }
  },

  // Authenticate with biometrics
  authenticate: async (reason: string = 'Authenticate to continue'): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) return false;

    try {
      await BiometricAuth.authenticate({
        reason,
        cancelTitle: 'Cancel',
        allowDeviceCredential: true,
        iosFallbackTitle: 'Use Passcode',
        androidTitle: 'Biometric Authentication',
        androidSubtitle: '',
        androidConfirmationRequired: false,
      });
      return true;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return false;
    }
  },

  // Get biometry name for display (e.g., "Face ID", "Touch ID", "Fingerprint")
  getBiometryName: async (): Promise<string> => {
    if (!Capacitor.isNativePlatform()) return 'Biometric';

    try {
      const result = await BiometricAuth.checkBiometry();
      
      switch (result.biometryType) {
        case BiometryType.faceId:
          return 'Face ID';
        case BiometryType.touchId:
          return 'Touch ID';
        case BiometryType.fingerprintAuthentication:
          return 'Fingerprint';
        case BiometryType.faceAuthentication:
          return 'Face Authentication';
        case BiometryType.irisAuthentication:
          return 'Iris Authentication';
        default:
          return 'Biometric';
      }
    } catch (error) {
      return 'Biometric';
    }
  },
};
