import { supabase } from "@/integrations/supabase/client";

export const requestNotificationPermission = async (): Promise<boolean> => {
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
};

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

export const subscribeToPushNotifications = async (userId: string): Promise<boolean> => {
  try {
    const registration = await registerServiceWorker();
    if (!registration) {
      console.error('No service worker registration');
      return false;
    }

    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.error('No notification permission');
      return false;
    }

    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Subscribe to push notifications
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nqm5OY'
        )
      });
    }

    // Save subscription to database
    const subscriptionJson = subscription.toJSON();
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        endpoint: subscriptionJson.endpoint!,
        p256dh: subscriptionJson.keys!.p256dh!,
        auth: subscriptionJson.keys!.auth!
      }, {
        onConflict: 'user_id,endpoint'
      });

    if (error) {
      console.error('Error saving push subscription:', error);
      return false;
    }

    console.log('Push notification subscription saved');
    return true;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return false;
  }
};

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
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

  const title = language === 'en' ? 'UsTwo' : 'UsTwo';
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
