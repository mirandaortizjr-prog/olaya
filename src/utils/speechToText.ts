import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { Capacitor } from '@capacitor/core';

export interface SpeechRecognitionResult {
  text: string;
  confidence?: number;
}

// Web Speech API fallback
class WebSpeechRecognition {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }
  }

  async start(
    language: string = 'en-US',
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported in this browser');
    }

    this.recognition.lang = language;

    this.recognition.onresult = (event: any) => {
      const result = event.results[0][0];
      onResult({
        text: result.transcript,
        confidence: result.confidence
      });
    };

    this.recognition.onerror = (event: any) => {
      if (onError) {
        onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.isListening = true;
    this.recognition.start();
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isActive(): boolean {
    return this.isListening;
  }
}

const webSpeech = new WebSpeechRecognition();

export const speechToText = {
  // Start listening for speech
  start: async (
    options: {
      language?: string;
      partialResults?: boolean;
      onResult: (result: SpeechRecognitionResult) => void;
      onError?: (error: any) => void;
    }
  ): Promise<void> => {
    const { language = 'en-US', partialResults = false, onResult, onError } = options;

    if (!Capacitor.isNativePlatform()) {
      // Web fallback
      try {
        await webSpeech.start(language, onResult, onError);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        if (onError) onError(error);
      }
      return;
    }

    try {
      await SpeechRecognition.start({
        language,
        partialResults,
        popup: false,
      });

      // Listen for results
      SpeechRecognition.addListener('partialResults', (data: any) => {
        if (data.matches && data.matches.length > 0) {
          onResult({
            text: data.matches[0],
          });
        }
      });
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      if (onError) onError(error);
    }
  },

  // Stop listening
  stop: async (): Promise<void> => {
    if (!Capacitor.isNativePlatform()) {
      webSpeech.stop();
      return;
    }

    try {
      await SpeechRecognition.stop();
      SpeechRecognition.removeAllListeners();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  },

  // Check if available
  isAvailable: async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }

    try {
      const { available } = await SpeechRecognition.available();
      return available;
    } catch (error) {
      return false;
    }
  },

  // Request permissions
  requestPermissions: async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      // Web API requests permissions automatically
      return true;
    }

    try {
      const { speechRecognition } = await SpeechRecognition.requestPermissions();
      return speechRecognition === 'granted';
    } catch (error) {
      console.error('Error requesting speech recognition permissions:', error);
      return false;
    }
  },

  // Check permissions
  checkPermissions: async (): Promise<string> => {
    if (!Capacitor.isNativePlatform()) {
      return 'granted'; // Web API handles this automatically
    }

    try {
      const { speechRecognition } = await SpeechRecognition.checkPermissions();
      return speechRecognition;
    } catch (error) {
      console.error('Error checking speech recognition permissions:', error);
      return 'denied';
    }
  },

  // Get supported languages
  getSupportedLanguages: async (): Promise<string[]> => {
    if (!Capacitor.isNativePlatform()) {
      // Common languages supported by Web Speech API
      return [
        'en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 
        'it-IT', 'ja-JP', 'ko-KR', 'pt-BR', 'zh-CN'
      ];
    }

    try {
      const { languages } = await SpeechRecognition.getSupportedLanguages();
      return languages;
    } catch (error) {
      console.error('Error getting supported languages:', error);
      return ['en-US'];
    }
  }
};
