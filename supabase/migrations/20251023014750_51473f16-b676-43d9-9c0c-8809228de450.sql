-- Create table for game responses and scoring
CREATE TABLE IF NOT EXISTS public.game_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  game_type TEXT NOT NULL,
  user_id UUID NOT NULL,
  question_id TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.game_responses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create game responses"
ON public.game_responses
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_id = game_responses.couple_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their couple's game responses"
ON public.game_responses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_id = game_responses.couple_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own responses"
ON public.game_responses
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_game_responses_couple_session ON public.game_responses(couple_id, session_id);
CREATE INDEX idx_game_responses_game_type ON public.game_responses(game_type, session_id);