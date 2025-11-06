-- Add video_url column to couples table
ALTER TABLE public.couples ADD COLUMN IF NOT EXISTS video_url TEXT;