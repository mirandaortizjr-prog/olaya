import { supabase } from "@/integrations/supabase/client";
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

// Register service worker for push notifications (web only)
async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers are not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/push-sw.js');
    console.log('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

// Subscribe to push notifications
export async function subscribeToPushNotifications(): Promise<boolean> {
  try {
    const isNative = Capacitor.isNativePlatform();
    
    if (isNative) {
      // Native app push notifications
      return await subscribeToNativePush();
    } else {
      // Web push notifications
      return await subscribeToWebPush();
    }
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
}

// Native push notification subscription
async function subscribeToNativePush(): Promise<boolean> {
  try {
    // Request permission
    let permStatus = await PushNotifications.checkPermissions();
    
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    
    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }
    
    // Register with APNs/FCM
    await PushNotifications.register();
    
    // Listen for registration
    return new Promise((resolve) => {
      PushNotifications.addListener('registration', async (token) => {
        console.log('Push registration success, token: ' + token.value);
        
        // Save token to database
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { error } = await supabase
            .from('push_subscriptions')
            .upsert({
              user_id: user.id,
              endpoint: `native:${token.value}`,
              p256dh: 'native',
              auth: 'native',
              platform: Capacitor.getPlatform()
            });
          
          if (error) {
            console.error('Error saving push subscription:', error);
            resolve(false);
          } else {
            resolve(true);
          }
        } else {
          resolve(false);
        }
      });
      
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration: ' + JSON.stringify(error));
        resolve(false);
      });
    });
  } catch (error) {
    console.error('Error in native push setup:', error);
    return false;
  }
}

// Web push notification subscription
async function subscribeToWebPush(): Promise<boolean> {
  try {
    const registration = await registerServiceWorker();
    if (!registration) {
      throw new Error('Service Worker not supported');
    }

    const permission = await requestNotificationPermission();
    if (!permission) {
      throw new Error('Notification permission denied');
    }

    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      const publicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8-fTt64F6qO4KJEOGw8YEp6pjTWrF9rKqYqQq7pJvXzBKBqLjLQvPY';
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const subscriptionJSON = subscription.toJSON();
    
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        endpoint: subscriptionJSON.endpoint,
        p256dh: subscriptionJSON.keys?.p256dh || '',
        auth: subscriptionJSON.keys?.auth || '',
        platform: 'web'
      });

    if (error) {
      console.error('Error saving push subscription:', error);
      return false;
    }

    console.log('Push notification subscription saved successfully');
    return true;
  } catch (error) {
    console.error('Error in web push subscription:', error);
    return false;
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray as BufferSource;
}

// Request notification permission (web only)
async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

// Initialize native push notification listeners
export function initializeNativePushListeners() {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  // Show notification when received
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push notification received: ', notification);
  });

  // Handle notification action
  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Push notification action performed', notification.actionId, notification.inputValue);
  });
}

export const showQuickMessageNotification = (
  messageType: string,
  partnerName?: string,
  language: 'en' | 'es' = 'en'
) => {
  if (Notification.permission !== 'granted') {
    return;
  }

  const messages = {
    wink: { 
      en: `${partnerName || 'Your partner'} sent you a wink 😉`,
      es: `${partnerName || 'Tu pareja'} te envió un guiño 😉`
    },
    kiss: { 
      en: `${partnerName || 'Your partner'} sent you a kiss 💋`,
      es: `${partnerName || 'Tu pareja'} te envió un beso 💋`
    },
    love: { 
      en: `${partnerName || 'Your partner'} said I love you 💕`,
      es: `${partnerName || 'Tu pareja'} dijo te amo 💕`
    },
    want: { 
      en: `${partnerName || 'Your partner'} said I want you 🔥`,
      es: `${partnerName || 'Tu pareja'} dijo te deseo 🔥`
    },
    hot: { 
      en: `${partnerName || 'Your partner'} said you're hot 🌟`,
      es: `${partnerName || 'Tu pareja'} dijo estás ardiente 🌟`
    },
    thinking: { 
      en: `${partnerName || 'Your partner'} is thinking of you 💭`,
      es: `${partnerName || 'Tu pareja'} está pensando en ti 💭`
    },
  };

  const title = language === 'en' ? 'OLAYA' : 'OLAYA';
  const body = messages[messageType as keyof typeof messages]?.[language] ||
               messages.wink[language];

  try {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'quick-message',
      requireInteraction: false,
    });

    // Vibrate if supported (mobile devices)
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    
    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};
