-- Ensure unique constraint on love_languages.user_id for reliable upserts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'love_languages_user_id_key'
  ) THEN
    ALTER TABLE public.love_languages
    ADD CONSTRAINT love_languages_user_id_key UNIQUE (user_id);
  END IF;
END$$;
