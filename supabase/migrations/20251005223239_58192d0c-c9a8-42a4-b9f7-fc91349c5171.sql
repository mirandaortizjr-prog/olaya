-- Create mood_tracker table for sharing emotional states
CREATE TABLE public.mood_tracker (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  mood_type TEXT NOT NULL CHECK (mood_type IN ('tender', 'playful', 'loving', 'peaceful', 'excited', 'stressed', 'needSpace', 'grateful', 'romantic', 'energetic')),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mood_tracker ENABLE ROW LEVEL SECURITY;

-- Users can view moods from their couple
CREATE POLICY "Users can view their couple's moods"
ON public.mood_tracker
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = mood_tracker.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can create mood updates for their couple
CREATE POLICY "Users can create mood updates"
ON public.mood_tracker
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = mood_tracker.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can update their own moods
CREATE POLICY "Users can update their own moods"
ON public.mood_tracker
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own moods
CREATE POLICY "Users can delete their own moods"
ON public.mood_tracker
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mood_tracker_updated_at
BEFORE UPDATE ON public.mood_tracker
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for mood tracker
ALTER PUBLICATION supabase_realtime ADD TABLE public.mood_tracker;