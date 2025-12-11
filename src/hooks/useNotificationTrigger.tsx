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
          if (message.sender_id === userId) return;

          const partnerId = await getPartnerId(message.sender_id, coupleId);
          if (!partnerId) return;

          await sendNotification({
            userId: partnerId,
            type: 'messages',
            title: 'New Message',
            body: 'You have a new message from your partner',
            data: { type: 'message', id: message.id, route: '/messenger' },
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

          const partnerId = await getPartnerId(flirt.sender_id, coupleId);
          if (!partnerId) return;

          await sendNotification({
            userId: partnerId,
            type: 'flirts',
            title: 'New Flirt',
            body: 'Your partner sent you a flirt 💕',
            data: { type: 'flirt', id: flirt.id, route: '/flirts' },
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

          const partnerId = await getPartnerId(note.sender_id, coupleId);
          if (!partnerId) return;

          await sendNotification({
            userId: partnerId,
            type: 'love_notes',
            title: 'New Love Note',
            body: 'You received a love note 💌',
            data: { type: 'love_note', id: note.id, route: '/dashboard' },
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

          const partnerId = await getPartnerId(mood.user_id, coupleId);
          if (!partnerId) return;

          await sendNotification({
            userId: partnerId,
            type: 'mood_updates',
            title: 'Mood Update',
            body: `Your partner updated their mood`,
            data: { type: 'mood', id: mood.id, route: '/dashboard' },
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

          const partnerId = await getPartnerId(post.author_id, coupleId);
          if (!partnerId) return;

          await sendNotification({
            userId: partnerId,
            type: 'posts',
            title: 'New Post',
            body: 'Your partner shared something new',
            data: { type: 'post', id: post.id, route: '/dashboard' },
          });
        }
      )
      .subscribe();

    // Listen for new cravings
    const cravingsChannel = supabase
      .channel('cravings-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'craving_board',
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const craving = payload.new;
          if (craving.user_id === userId) return;

          const partnerId = await getPartnerId(craving.user_id, coupleId);
          if (!partnerId) return;

          await sendNotification({
            userId: partnerId,
            type: 'posts', // cravings use posts preference
            title: 'New Craving',
            body: `Your partner is craving: ${craving.custom_message || craving.craving_type}`,
            data: { type: 'craving', id: craving.id, route: '/dashboard' },
          });
        }
      )
      .subscribe();

    // Listen for gifts
    const giftsChannel = supabase
      .channel('gifts-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'gift_transactions',
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const gift = payload.new;
          if (gift.sender_id === userId) return;

          await sendNotification({
            userId: gift.receiver_id,
            type: 'posts', // gifts use posts preference
            title: 'New Gift! 🎁',
            body: gift.message || 'Your partner sent you a gift',
            data: { type: 'gift', id: gift.id, route: '/shop' },
          });
        }
      )
      .subscribe();

    // Listen for shared journal entries
    const journalChannel = supabase
      .channel('journal-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'shared_journal',
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const entry = payload.new;
          if (entry.author_id === userId) return;

          const partnerId = await getPartnerId(entry.author_id, coupleId);
          if (!partnerId) return;

          await sendNotification({
            userId: partnerId,
            type: 'posts',
            title: 'New Journal Entry',
            body: `Your partner wrote: ${entry.title}`,
            data: { type: 'journal', id: entry.id, route: '/dashboard' },
          });
        }
      )
      .subscribe();

    // Listen for post comments
    const commentsChannel = supabase
      .channel('comments-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_comments',
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const comment = payload.new;
          if (comment.user_id === userId) return;

          const partnerId = await getPartnerId(comment.user_id, coupleId);
          if (!partnerId) return;

          await sendNotification({
            userId: partnerId,
            type: 'posts',
            title: 'New Comment',
            body: 'Your partner commented on a post',
            data: { type: 'comment', id: comment.id, route: '/dashboard' },
          });
        }
      )
      .subscribe();

    // Listen for poems
    const poemsChannel = supabase
      .channel('poems-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'poems',
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const poem = payload.new;
          if (poem.created_by === userId) return;

          const partnerId = await getPartnerId(poem.created_by, coupleId);
          if (!partnerId) return;

          await sendNotification({
            userId: partnerId,
            type: 'love_notes',
            title: 'New Poem 💌',
            body: poem.title || 'Your partner wrote you a poem',
            data: { type: 'poem', id: poem.id, route: '/poems' },
          });
        }
      )
      .subscribe();

    // Listen for active effects
    const effectsChannel = supabase
      .channel('effects-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'active_effects',
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const effect = payload.new;
          if (effect.activated_by === userId) return;

          const partnerId = await getPartnerId(effect.activated_by, coupleId);
          if (!partnerId) return;

          await sendNotification({
            userId: partnerId,
            type: 'posts',
            title: 'Visual Effect Activated! ✨',
            body: 'Your partner activated a special effect',
            data: { type: 'effect', id: effect.id, route: '/dashboard' },
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
      supabase.removeChannel(cravingsChannel);
      supabase.removeChannel(giftsChannel);
      supabase.removeChannel(journalChannel);
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(poemsChannel);
      supabase.removeChannel(effectsChannel);
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
    const typeKey = `${type}_enabled` as keyof typeof prefs;
    if (prefs && prefs[typeKey] === false) {
      console.log(`Notification type ${type} is disabled for user`);
      return;
    }

    console.log('Sending notification to user:', userId, title);

    // Send push notification via OneSignal edge function
    const { error } = await supabase.functions.invoke('send-onesignal-notification', {
      body: { userId, title, message: body, data },
    });

    if (error) {
      console.error('Error invoking notification function:', error);
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

async function getPartnerId(senderId: string, coupleId: string): Promise<string | null> {
  try {
    const { data } = await supabase
      .from('couple_members')
      .select('user_id')
      .eq('couple_id', coupleId)
      .neq('user_id', senderId)
      .single();
    
    return data?.user_id || null;
  } catch (error) {
    console.error('Error getting partner ID:', error);
    return null;
  }
}