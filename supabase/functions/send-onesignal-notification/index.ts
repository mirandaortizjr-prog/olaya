import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  userId: string;
  title: string;
  message: string;
  data?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, title, message, data }: NotificationRequest = await req.json();
    
    console.log('Sending OneSignal notification:', { userId, title, message });

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user's OneSignal Player ID from profiles table
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('onesignal_player_id')
      .eq('id', userId)
      .single();

    if (profileError || !profile?.onesignal_player_id) {
      console.error('No OneSignal Player ID found for user:', userId, profileError);
      return new Response(
        JSON.stringify({ error: 'User has not registered for push notifications' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Send notification via OneSignal REST API
    const oneSignalResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Deno.env.get('ONESIGNAL_REST_API_KEY')}`,
      },
      body: JSON.stringify({
        app_id: Deno.env.get('ONESIGNAL_APP_ID'),
        include_player_ids: [profile.onesignal_player_id],
        headings: { en: title },
        contents: { en: message },
        data: data || {},
      }),
    });

    const responseData = await oneSignalResponse.json();
    
    if (!oneSignalResponse.ok) {
      console.error('OneSignal API error:', responseData);
      throw new Error(`OneSignal API error: ${JSON.stringify(responseData)}`);
    }

    console.log('OneSignal notification sent successfully:', responseData);

    return new Response(
      JSON.stringify({ success: true, response: responseData }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error sending OneSignal notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
