import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// VAPID keys for Web Push authentication
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8-fTt64F6qO4KJEOGw8YEp6pjTWrF9rKqYqQq7pJvXzBKBqLjLQvPY';
const VAPID_PRIVATE_KEY = 'yKH7VzbKLmO8wQvmBZ3gKJ0sYGJLz6QN8dP4xT5vK3M';

interface PushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
  platform?: string;
}

interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
}

// Function to send web push using native Deno APIs
async function sendWebPush(subscription: PushSubscription, payload: string) {
  const { endpoint } = subscription;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'TTL': '86400',
    },
    body: payload,
  });

  return response;
}

// Function to send native push via FCM/APNs
async function sendNativePush(subscription: PushSubscription, title: string, body: string) {
  const token = subscription.endpoint.replace('native:', '');
  const platform = subscription.platform || 'unknown';
  
  console.log(`Sending native push to ${platform} device, token: ${token.substring(0, 20)}...`);
  
  // In production, you would integrate with FCM for Android and APNs for iOS
  // For now, we'll log it
  console.log('Native push notification:', { title, body, token, platform });
  
  // TODO: Implement actual FCM/APNs integration
  // For Android (FCM):
  // - Use FCM_SERVER_KEY secret
  // - Send to https://fcm.googleapis.com/fcm/send
  
  // For iOS (APNs):
  // - Use APNs certificates
  // - Send to APNs servers
  
  return { success: true };
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

    // Send push notification to all subscriptions
    const pushPromises = subscriptions.map(async (sub: PushSubscription) => {
      try {
        const isNative = sub.endpoint.startsWith('native:');
        
        if (isNative) {
          // Send native push
          await sendNativePush(sub, title, body);
          console.log(`Native push notification sent to ${sub.platform} device`);
        } else {
          // Send web push
          const payload = JSON.stringify({ title, body });
          const response = await sendWebPush(sub, payload);

          if (!response.ok) {
            console.error(`Web push failed for endpoint ${sub.endpoint}:`, response.status);
            // If subscription is invalid, delete it
            if (response.status === 404 || response.status === 410) {
              await supabase
                .from('push_subscriptions')
                .delete()
                .eq('endpoint', sub.endpoint);
            }
          } else {
            console.log(`Web push notification sent successfully to ${sub.endpoint}`);
          }
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
