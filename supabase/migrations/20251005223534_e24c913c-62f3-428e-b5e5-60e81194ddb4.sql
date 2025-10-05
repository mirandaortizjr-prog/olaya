-- Create love_notes table for romantic messages
CREATE TABLE public.love_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  note_type TEXT NOT NULL CHECK (note_type IN ('flirtation', 'devotion', 'affirmation', 'appreciation', 'adoration', 'desire')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.love_notes ENABLE ROW LEVEL SECURITY;

-- Users can view love notes from their couple
CREATE POLICY "Users can view their couple's love notes"
ON public.love_notes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = love_notes.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can send love notes to their couple
CREATE POLICY "Users can send love notes"
ON public.love_notes
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = love_notes.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can update read status of notes sent to them
CREATE POLICY "Users can mark notes as read"
ON public.love_notes
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = love_notes.couple_id
    AND couple_members.user_id = auth.uid()
    AND love_notes.sender_id != auth.uid()
  )
);

-- Users can delete their own love notes
CREATE POLICY "Users can delete their own love notes"
ON public.love_notes
FOR DELETE
USING (auth.uid() = sender_id);

-- Enable realtime for love notes
ALTER PUBLICATION supabase_realtime ADD TABLE public.love_notes;