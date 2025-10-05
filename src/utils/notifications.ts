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
