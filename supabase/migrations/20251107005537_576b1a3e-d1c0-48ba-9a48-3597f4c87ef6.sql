-- Add custom display name field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT;

COMMENT ON COLUMN public.profiles.display_name IS 'Custom display name for couple view (e.g., "Jose Miranda")';