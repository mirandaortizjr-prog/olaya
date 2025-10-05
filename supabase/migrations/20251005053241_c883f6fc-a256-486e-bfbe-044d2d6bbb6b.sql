-- Create table for quick romantic messages
CREATE TABLE public.quick_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL CHECK (message_type IN ('wink', 'kiss', 'love', 'want', 'hot', 'thinking')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quick_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages in their couple
CREATE POLICY "Users can view their couple messages"
ON public.quick_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = quick_messages.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Policy: Users can send messages in their couple
CREATE POLICY "Users can send messages in their couple"
ON public.quick_messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = quick_messages.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.quick_messages;

-- Add index for better query performance
CREATE INDEX idx_quick_messages_couple_created ON public.quick_messages(couple_id, created_at DESC);