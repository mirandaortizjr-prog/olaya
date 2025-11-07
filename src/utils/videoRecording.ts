import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export interface VideoRecording {
  dataUrl: string;
  duration: number;
  mimeType: string;
}

class VideoRecorderManager {
  private mediaRecorder: MediaRecorder | null = null;
  private videoChunks: Blob[] = [];
  private startTime: number = 0;
  private stream: MediaStream | null = null;

  async startRecording(): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Video recording not supported on this device');
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });

      const mimeType = this.getSupportedMimeType();
      this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
      this.videoChunks = [];
      this.startTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.videoChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error starting video recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<VideoRecording> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = async () => {
        try {
          const duration = Math.floor((Date.now() - this.startTime) / 1000);
          const mimeType = this.getSupportedMimeType();
          const videoBlob = new Blob(this.videoChunks, { type: mimeType });
          
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              dataUrl: reader.result as string,
              duration,
              mimeType
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(videoBlob);

          // Cleanup
          if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
          }
        } catch (error) {
          reject(error);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.videoChunks = [];
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  private getSupportedMimeType(): string {
    const types = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
      'video/mp4'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'video/webm'; // fallback
  }
}

export const videoRecording = {
  recorder: new VideoRecorderManager(),

  // Pick existing video from gallery (native only)
  async pickVideo(): Promise<string | null> {
    if (!Capacitor.isNativePlatform()) {
      console.log('Video picking only available on native platforms');
      return null;
    }

    try {
      // Use camera plugin to access gallery
      const video = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      return video.dataUrl || null;
    } catch (error) {
      console.error('Error picking video:', error);
      return null;
    }
  },

  async checkPermissions() {
    try {
      const cameraResult = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const micResult = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return {
        camera: cameraResult.state,
        microphone: micResult.state
      };
    } catch (error) {
      console.error('Error checking video permissions:', error);
      return { camera: 'prompt', microphone: 'prompt' };
    }
  },

  async requestPermissions() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Error requesting video permissions:', error);
      return false;
    }
  }
};
