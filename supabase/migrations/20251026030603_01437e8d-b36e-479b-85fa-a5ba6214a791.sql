-- Add privacy password to profiles table
ALTER TABLE public.profiles
ADD COLUMN privacy_password_hash text;

COMMENT ON COLUMN public.profiles.privacy_password_hash IS 'Hashed 4-digit password for private content access';