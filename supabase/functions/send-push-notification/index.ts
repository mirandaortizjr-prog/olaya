import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
}

interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, title, body }: NotificationPayload = await req.json();

    console.log('Sending push notification to user:', userId);

    // Get user's push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId);

    if (subError) {
      throw new Error(`Error fetching subscriptions: ${subError.message}`);
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No push subscriptions found for user');
      return new Response(
        JSON.stringify({ message: 'No subscriptions found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Send push notification to all subscriptions using Web Push Protocol
    const vapidKeys = {
      publicKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8-fTt64F6qO4KJEOGw8YEp6pjTWrF9rKqYqQq7pJvXzBKBqLjLQvPY',
      privateKey: Deno.env.get('VAPID_PRIVATE_KEY') || ''
    };

    const pushPromises = subscriptions.map(async (sub: PushSubscription) => {
      try {
        // Create the Web Push message
        const pushMessage = JSON.stringify({
          title,
          body,
        });

        // For now, we'll make a direct push to the endpoint
        // In production, you'd use a proper Web Push library with VAPID signing
        const response = await fetch(sub.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'TTL': '86400',
          },
          body: pushMessage,
        });

        if (!response.ok) {
          console.error(`Push failed for endpoint ${sub.endpoint}:`, response.status);
          // If subscription is invalid, delete it
          if (response.status === 404 || response.status === 410) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('endpoint', sub.endpoint);
          }
        } else {
          console.log(`Push notification sent successfully to ${sub.endpoint}`);
        }
      } catch (error) {
        console.error('Error sending push:', error);
      }
    });

    await Promise.all(pushPromises);

    return new Response(
      JSON.stringify({ message: 'Push notifications sent' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: any) {
    console.error('Error in send-push-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
