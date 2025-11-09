-- Create intimacy_languages table
CREATE TABLE IF NOT EXISTS public.intimacy_languages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  couple_id UUID NOT NULL,
  lust_language JSONB,
  sex_language JSONB,
  entry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.intimacy_languages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own intimacy language"
  ON public.intimacy_languages
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view partner's intimacy language"
  ON public.intimacy_languages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM couple_members cm1
      JOIN couple_members cm2 ON cm1.couple_id = cm2.couple_id
      WHERE cm1.user_id = auth.uid() AND cm2.user_id = intimacy_languages.user_id
    )
  );

CREATE POLICY "Users can insert their own intimacy language"
  ON public.intimacy_languages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own intimacy language"
  ON public.intimacy_languages
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX idx_intimacy_languages_user_id ON public.intimacy_languages(user_id);
CREATE INDEX idx_intimacy_languages_couple_id ON public.intimacy_languages(couple_id);
