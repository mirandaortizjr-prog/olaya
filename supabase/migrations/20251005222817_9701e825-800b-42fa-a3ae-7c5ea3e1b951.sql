-- Create daily_notes table for morning/evening messages and reflections
CREATE TABLE public.daily_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  note_type TEXT NOT NULL CHECK (note_type IN ('morning', 'evening', 'reflection')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_notes ENABLE ROW LEVEL SECURITY;

-- Users can view notes from their couple
CREATE POLICY "Users can view their couple's daily notes"
ON public.daily_notes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = daily_notes.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can create notes for their couple
CREATE POLICY "Users can create daily notes for their couple"
ON public.daily_notes
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = daily_notes.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can update their own notes
CREATE POLICY "Users can update their own daily notes"
ON public.daily_notes
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own notes
CREATE POLICY "Users can delete their own daily notes"
ON public.daily_notes
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_daily_notes_updated_at
BEFORE UPDATE ON public.daily_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for daily notes
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_notes;