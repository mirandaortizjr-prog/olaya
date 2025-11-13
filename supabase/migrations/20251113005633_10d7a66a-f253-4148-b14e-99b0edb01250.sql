-- Create game_answers table for storing individual answers to game questions
CREATE TABLE public.game_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  couple_id UUID NOT NULL,
  user_id UUID NOT NULL,
  question_id TEXT NOT NULL,
  answer_value TEXT NOT NULL,
  game_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_answers ENABLE ROW LEVEL SECURITY;

-- Users can insert their own game answers
CREATE POLICY "Users can insert their own game answers"
ON public.game_answers
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM couple_members 
    WHERE couple_members.couple_id = game_answers.couple_id 
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can view their couple's game answers
CREATE POLICY "Users can view their couple's game answers"
ON public.game_answers
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members 
    WHERE couple_members.couple_id = game_answers.couple_id 
    AND couple_members.user_id = auth.uid()
  )
);