import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { Html5Qrcode } from 'html5-qrcode';

export interface QRScanResult {
  text: string;
  format?: string;
}

// Web QR scanner implementation
class WebQRScanner {
  private scanner: Html5Qrcode | null = null;
  private isScanning = false;

  async start(
    elementId: string,
    onSuccess: (result: QRScanResult) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      this.scanner = new Html5Qrcode(elementId);
      this.isScanning = true;

      await this.scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText, decodedResult) => {
          onSuccess({
            text: decodedText,
            format: decodedResult.result.format?.formatName
          });
        },
        (errorMessage) => {
          // Silent errors during scanning - only report critical ones
          if (onError && errorMessage.includes('NotFoundException') === false) {
            onError(errorMessage);
          }
        }
      );
    } catch (error) {
      console.error('Error starting web QR scanner:', error);
      this.isScanning = false;
      if (onError) {
        onError(error instanceof Error ? error.message : 'Failed to start scanner');
      }
    }
  }

  async stop(): Promise<void> {
    if (this.scanner && this.isScanning) {
      try {
        await this.scanner.stop();
        this.scanner.clear();
        this.isScanning = false;
      } catch (error) {
        console.error('Error stopping web QR scanner:', error);
      }
    }
  }

  isActive(): boolean {
    return this.isScanning;
  }
}

const webScanner = new WebQRScanner();

export const qrScanner = {
  // Check if scanner is supported
  isSupported: async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      // Web support check
      return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
    }

    try {
      const { supported } = await BarcodeScanner.isSupported();
      return supported;
    } catch (error) {
      return false;
    }
  },

  // Check and request permissions
  checkPermissions: async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      // Web automatically requests on start
      return true;
    }

    try {
      const { camera } = await BarcodeScanner.checkPermissions();
      return camera === 'granted' || camera === 'limited';
    } catch (error) {
      console.error('Error checking scanner permissions:', error);
      return false;
    }
  },

  requestPermissions: async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      // Web automatically requests on start
      return true;
    }

    try {
      const { camera } = await BarcodeScanner.requestPermissions();
      return camera === 'granted' || camera === 'limited';
    } catch (error) {
      console.error('Error requesting scanner permissions:', error);
      return false;
    }
  },

  // Scan using camera (native single scan)
  scan: async (): Promise<QRScanResult | null> => {
    if (!Capacitor.isNativePlatform()) {
      console.log('Native scan not available on web, use startWebScan instead');
      return null;
    }

    try {
      const { barcodes } = await BarcodeScanner.scan({
        formats: [BarcodeFormat.QrCode]
      });

      if (barcodes.length > 0) {
        return {
          text: barcodes[0].rawValue,
          format: barcodes[0].format
        };
      }

      return null;
    } catch (error) {
      console.error('Error scanning:', error);
      return null;
    }
  },


  // Start web scanning
  startWebScan: async (
    elementId: string,
    onResult: (result: QRScanResult) => void,
    onError?: (error: string) => void
  ): Promise<void> => {
    await webScanner.start(elementId, onResult, onError);
  },

  // Stop web scanning
  stopWebScan: async (): Promise<void> => {
    await webScanner.stop();
  },

  // Check if currently scanning (web only)
  isScanning: (): boolean => {
    return webScanner.isActive();
  }
};
