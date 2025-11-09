-- Create user_gradient_purchases table to track which user bought which gradient
CREATE TABLE IF NOT EXISTS public.user_gradient_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  gradient_id text NOT NULL,
  purchased_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_gradient_purchases_user_id ON public.user_gradient_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_gradient_purchases_couple_id ON public.user_gradient_purchases(couple_id);

-- Enable RLS
ALTER TABLE public.user_gradient_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own gradient purchases
CREATE POLICY "Users can view their own gradient purchases"
  ON public.user_gradient_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own gradient purchases
CREATE POLICY "Users can insert their own gradient purchases"
  ON public.user_gradient_purchases
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND EXISTS (
      SELECT 1 FROM public.couple_members 
      WHERE couple_id = user_gradient_purchases.couple_id 
      AND user_id = auth.uid()
    )
  );