-- Create purchased_gifts table
CREATE TABLE public.purchased_gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  gift_id UUID NOT NULL,
  gift_name TEXT NOT NULL,
  gift_image TEXT NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.purchased_gifts ENABLE ROW LEVEL SECURITY;

-- Users can view their couple's purchased gifts
CREATE POLICY "Users can view their couple's purchased gifts"
ON public.purchased_gifts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = purchased_gifts.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can purchase gifts for their couple
CREATE POLICY "Users can purchase gifts"
ON public.purchased_gifts
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = purchased_gifts.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Create index for faster queries
CREATE INDEX idx_purchased_gifts_couple_id ON public.purchased_gifts(couple_id);
CREATE INDEX idx_purchased_gifts_purchased_at ON public.purchased_gifts(purchased_at);