-- Create table for custom game questions
CREATE TABLE IF NOT EXISTS public.custom_game_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  question TEXT NOT NULL,
  option_a TEXT,
  option_b TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_game_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for custom questions
CREATE POLICY "Couples can view their custom questions"
  ON public.custom_game_questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.couple_members
      WHERE couple_members.couple_id = custom_game_questions.couple_id
        AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Couples can insert custom questions"
  ON public.custom_game_questions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.couple_members
      WHERE couple_members.couple_id = custom_game_questions.couple_id
        AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own custom questions"
  ON public.custom_game_questions
  FOR DELETE
  USING (created_by = auth.uid());

-- Create index for faster queries
CREATE INDEX idx_custom_questions_couple ON public.custom_game_questions(couple_id, game_type);