-- Create table to track game completions and rewards
CREATE TABLE IF NOT EXISTS public.game_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  user_id UUID NOT NULL,
  game_type TEXT NOT NULL,
  session_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_completions ENABLE ROW LEVEL SECURITY;

-- Users can insert their own game completions
CREATE POLICY "Users can insert their own game completions"
ON public.game_completions
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = game_completions.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can view their couple's game completions
CREATE POLICY "Users can view their couple's game completions"
ON public.game_completions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = game_completions.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Create index for faster queries
CREATE INDEX idx_game_completions_couple_user_date ON public.game_completions(couple_id, user_id, completed_at);
CREATE INDEX idx_game_completions_game_type ON public.game_completions(game_type, completed_at);