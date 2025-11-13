-- Add font_preference column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS font_preference TEXT DEFAULT 'default';