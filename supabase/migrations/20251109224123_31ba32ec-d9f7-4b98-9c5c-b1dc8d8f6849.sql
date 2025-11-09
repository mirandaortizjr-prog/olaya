-- Extend love_languages table to support comprehensive quiz results and daily actions
ALTER TABLE love_languages ADD COLUMN IF NOT EXISTS quiz_completed_at timestamp with time zone;
ALTER TABLE love_languages ADD COLUMN IF NOT EXISTS all_scores jsonb DEFAULT '[]'::jsonb;
ALTER TABLE love_languages ADD COLUMN IF NOT EXISTS profile_title text;
ALTER TABLE love_languages ADD COLUMN IF NOT EXISTS current_day integer DEFAULT 1;
ALTER TABLE love_languages ADD COLUMN IF NOT EXISTS last_action_date date;

-- Add comment explaining the structure
COMMENT ON COLUMN love_languages.all_scores IS 'Array of objects with language, score, percentage, and rank for all 5 love languages';
COMMENT ON COLUMN love_languages.current_day IS 'Current day number (1-365) in the daily action cycle';
COMMENT ON COLUMN love_languages.last_action_date IS 'Last date a daily action was completed';