-- Add onesignal_player_id column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onesignal_player_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_onesignal_player_id 
ON public.profiles(onesignal_player_id);

-- Add comment
COMMENT ON COLUMN public.profiles.onesignal_player_id IS 'OneSignal Player ID for push notifications via Despia SDK';
