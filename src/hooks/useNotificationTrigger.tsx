import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NotificationTriggerOptions {
  coupleId?: string;
  userId?: string;
}

export const useNotificationTrigger = ({ coupleId, userId }: NotificationTriggerOptions) => {
  useEffect(() => {
    if (!coupleId || !userId) return;

    // Listen for new messages
    const messagesChannel = supabase
      .channel('messages-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const message = payload.new;
          if (message.sender_id === userId) return; // Don't notify sender

          await sendNotification({
            userId: getPartnerId(message.sender_id),
            type: 'message',
            title: 'New Message',
            body: 'You have a new message from your partner',
            data: {
              type: 'message',
              id: message.id,
              route: '/messenger',
            },
          });
        }
      )
      .subscribe();

    // Listen for new flirts
    const flirtsChannel = supabase
      .channel('flirts-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'flirts',
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const flirt = payload.new;
          if (flirt.sender_id === userId) return;

          await sendNotification({
            userId: getPartnerId(flirt.sender_id),
            type: 'flirt',
            title: 'New Flirt',
            body: 'Your partner sent you a flirt 💕',
            data: {
              type: 'flirt',
              id: flirt.id,
              route: '/flirts',
            },
          });
        }
      )
      .subscribe();

    // Listen for new love notes
    const loveNotesChannel = supabase
      .channel('love-notes-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'love_notes',
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const note = payload.new;
          if (note.sender_id === userId) return;

          await sendNotification({
            userId: getPartnerId(note.sender_id),
            type: 'love_note',
            title: 'New Love Note',
            body: 'You received a love note 💌',
            data: {
              type: 'love_note',
              id: note.id,
              route: '/dashboard',
            },
          });
        }
      )
      .subscribe();

    // Listen for mood updates
    const moodChannel = supabase
      .channel('mood-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feeling_status',
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const mood = payload.new;
          if (mood.user_id === userId) return;

          await sendNotification({
            userId: getPartnerId(mood.user_id),
            type: 'mood',
            title: 'Mood Update',
            body: `Your partner updated their mood`,
            data: {
              type: 'mood',
              id: mood.id,
              route: '/dashboard',
            },
          });
        }
      )
      .subscribe();

    // Listen for new posts
    const postsChannel = supabase
      .channel('posts-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const post = payload.new;
          if (post.author_id === userId) return;

          await sendNotification({
            userId: getPartnerId(post.author_id),
            type: 'post',
            title: 'New Post',
            body: 'Your partner shared something new',
            data: {
              type: 'post',
              id: post.id,
              route: '/dashboard',
            },
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(flirtsChannel);
      supabase.removeChannel(loveNotesChannel);
      supabase.removeChannel(moodChannel);
      supabase.removeChannel(postsChannel);
    };
  }, [coupleId, userId]);
};

async function sendNotification({
  userId,
  type,
  title,
  body,
  data,
}: {
  userId: string;
  type: string;
  title: string;
  body: string;
  data: any;
}) {
  try {
    // Check user's notification preferences
    const { data: prefs } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // Check if this notification type is enabled
    const typeKey = `${type}s_enabled` as keyof typeof prefs;
    if (prefs && prefs[typeKey] === false) {
      console.log(`Notification type ${type} is disabled for user`);
      return;
    }

    // Send push notification via edge function
    await supabase.functions.invoke('send-push-notification', {
      body: {
        userId,
        title,
        body,
        data,
      },
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

function getPartnerId(senderId: string): string {
  // This will be replaced with actual partner lookup
  // For now, returning the senderId (edge function will find partner)
  return senderId;
}
