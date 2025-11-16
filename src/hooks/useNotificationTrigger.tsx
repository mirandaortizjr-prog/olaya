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

          await sendNotification({
            userId: getPartnerId(craving.user_id),
            type: 'craving',
            title: 'New Craving',
            body: `Your partner is craving: ${craving.custom_message || craving.craving_type}`,
            data: {
              type: 'craving',
              id: craving.id,
              route: '/dashboard',
            },
          });
        }
      )
      .subscribe();

    // Listen for fulfilled cravings
    const cravingsFulfilledChannel = supabase
      .channel('cravings-fulfilled-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'craving_board',
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const craving = payload.new;
          if (!craving.fulfilled || craving.user_id !== userId) return;

          await sendNotification({
            userId: craving.user_id,
            type: 'craving_fulfilled',
            title: 'Craving Fulfilled! 💕',
            body: 'Your partner fulfilled your craving',
            data: {
              type: 'craving_fulfilled',
              id: craving.id,
              route: '/dashboard',
            },
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
            type: 'gift',
            title: 'New Gift! 🎁',
            body: gift.message || 'Your partner sent you a gift',
            data: {
              type: 'gift',
              id: gift.id,
              route: '/shop',
            },
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

          await sendNotification({
            userId: getPartnerId(entry.author_id),
            type: 'journal',
            title: 'New Journal Entry',
            body: `Your partner wrote: ${entry.title}`,
            data: {
              type: 'journal',
              id: entry.id,
              route: '/dashboard',
            },
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

          await sendNotification({
            userId: getPartnerId(comment.user_id),
            type: 'comment',
            title: 'New Comment',
            body: 'Your partner commented on a post',
            data: {
              type: 'comment',
              id: comment.id,
              route: '/dashboard',
            },
          });
        }
      )
      .subscribe();

    // Listen for intimate journal entries
    const intimateJournalChannel = supabase
      .channel('intimate-journal-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'intimate_journal',
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const entry = payload.new;
          if (entry.created_by === userId) return;

          await sendNotification({
            userId: getPartnerId(entry.created_by),
            type: 'intimate_journal',
            title: 'New Intimate Journal Entry',
            body: 'Your partner added an intimate journal entry',
            data: {
              type: 'intimate_journal',
              id: entry.id,
              route: '/intimate-journal',
            },
          });
        }
      )
      .subscribe();

    // Listen for truth answers
    const truthAnswersChannel = supabase
      .channel('truth-answers-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'truth_answers',
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const answer = payload.new;
          if (answer.user_id === userId) return;

          await sendNotification({
            userId: getPartnerId(answer.user_id),
            type: 'truth_answer',
            title: 'Truth Answer Submitted',
            body: 'Your partner answered a truth question',
            data: {
              type: 'truth_answer',
              id: answer.id,
              route: '/dashboard',
            },
          });
        }
      )
      .subscribe();

    // Listen for approved truth answers
    const truthApprovedChannel = supabase
      .channel('truth-approved-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'truth_answers',
          filter: `couple_id=eq.${coupleId}`,
        },
        async (payload) => {
          const answer = payload.new;
          if (!answer.approved || answer.user_id !== userId) return;

          await sendNotification({
            userId: answer.user_id,
            type: 'truth_approved',
            title: 'Truth Answer Approved! ✅',
            body: 'Your partner approved your truth answer',
            data: {
              type: 'truth_approved',
              id: answer.id,
              route: '/dashboard',
            },
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

          await sendNotification({
            userId: getPartnerId(poem.created_by),
            type: 'poem',
            title: 'New Poem 💌',
            body: poem.title || 'Your partner wrote you a poem',
            data: {
              type: 'poem',
              id: poem.id,
              route: '/poems',
            },
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

          await sendNotification({
            userId: getPartnerId(effect.activated_by),
            type: 'effect',
            title: 'Visual Effect Activated! ✨',
            body: 'Your partner activated a special effect',
            data: {
              type: 'effect',
              id: effect.id,
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
      supabase.removeChannel(cravingsChannel);
      supabase.removeChannel(cravingsFulfilledChannel);
      supabase.removeChannel(giftsChannel);
      supabase.removeChannel(journalChannel);
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(intimateJournalChannel);
      supabase.removeChannel(truthAnswersChannel);
      supabase.removeChannel(truthApprovedChannel);
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
    const typeKey = `${type}s_enabled` as keyof typeof prefs;
    if (prefs && prefs[typeKey] === false) {
      console.log(`Notification type ${type} is disabled for user`);
      return;
    }

    // Send push notification via OneSignal edge function
    await supabase.functions.invoke('send-onesignal-notification', {
      body: {
        userId,
        title,
        message: body,
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
