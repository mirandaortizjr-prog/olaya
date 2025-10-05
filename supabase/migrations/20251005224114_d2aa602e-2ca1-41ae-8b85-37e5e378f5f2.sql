-- Create craving_board table for simple requests
CREATE TABLE public.craving_board (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  craving_type TEXT NOT NULL CHECK (craving_type IN ('hug', 'kiss', 'chocolate', 'coffee', 'qualityTime', 'cuddle', 'massage', 'date', 'surprise', 'custom')),
  custom_message TEXT,
  fulfilled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  fulfilled_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.craving_board ENABLE ROW LEVEL SECURITY;

-- Users can view cravings from their couple
CREATE POLICY "Users can view their couple's cravings"
ON public.craving_board
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = craving_board.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can create cravings
CREATE POLICY "Users can create cravings"
ON public.craving_board
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = craving_board.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can update cravings (to mark as fulfilled)
CREATE POLICY "Users can update cravings"
ON public.craving_board
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.couple_members
    WHERE couple_members.couple_id = craving_board.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can delete their own cravings
CREATE POLICY "Users can delete their own cravings"
ON public.craving_board
FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime for craving board
ALTER PUBLICATION supabase_realtime ADD TABLE public.craving_board;