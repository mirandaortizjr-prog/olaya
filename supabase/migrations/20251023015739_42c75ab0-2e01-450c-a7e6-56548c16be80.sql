-- Create table for game sessions/invitations
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  game_type TEXT NOT NULL,
  initiated_by UUID NOT NULL,
  partner_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, active, completed
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create game sessions"
ON public.game_sessions
FOR INSERT
WITH CHECK (
  auth.uid() = initiated_by AND
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_id = game_sessions.couple_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their couple's game sessions"
ON public.game_sessions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_id = game_sessions.couple_id
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update game sessions"
ON public.game_sessions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_id = game_sessions.couple_id
    AND user_id = auth.uid()
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_game_sessions_updated_at
BEFORE UPDATE ON public.game_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_game_sessions_couple ON public.game_sessions(couple_id, status);
CREATE INDEX idx_game_sessions_partner ON public.game_sessions(partner_id, status);