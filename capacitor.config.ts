import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.89fc973ab7d148a28e154f75766194b1',
  appName: 'Olaya Together',
  webDir: 'dist',
  server: {
    url: 'https://89fc973a-b7d1-48a2-8e15-4f75766194b1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    Badge: {
      persist: true,
      autoClear: false
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    Camera: {
      saveToGallery: true,
    },
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
