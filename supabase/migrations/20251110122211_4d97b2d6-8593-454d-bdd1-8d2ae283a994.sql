-- Add FTUE tracking to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ftue_completed BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ftue_progress JSONB DEFAULT '[]'::jsonb;