-- Create table to track couple's purchased and active gradients
CREATE TABLE IF NOT EXISTS public.couple_gradients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  active_gradient_id UUID,
  purchased_gradients JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.couple_gradients ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their couple's gradients"
ON public.couple_gradients
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = couple_gradients.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their couple's gradients"
ON public.couple_gradients
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = couple_gradients.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their couple's gradients"
ON public.couple_gradients
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = couple_gradients.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Insert gradient shop items
INSERT INTO public.shop_items (name, description, category, price, image_url) VALUES
('Purple Coral Gradient', 'Vibrant purple fading to warm coral orange', 'accessories', 50, '/placeholder.svg'),
('Gold Pink Gradient', 'Luxurious gold flowing into hot pink', 'accessories', 50, '/placeholder.svg'),
('Pink Gold Gradient', 'Hot pink transitioning to rich gold', 'accessories', 50, '/placeholder.svg'),
('Cyan Gold Gradient', 'Cool cyan blending into warm gold', 'accessories', 50, '/placeholder.svg'),
('Teal Lime Gradient', 'Deep teal flowing into bright lime green', 'accessories', 50, '/placeholder.svg'),
('Purple Lime Gradient', 'Rich purple transitioning to vibrant lime', 'accessories', 50, '/placeholder.svg'),
('Purple Cyan Gradient', 'Deep purple fading to electric cyan', 'accessories', 50, '/placeholder.svg'),
('Blue Cyan Gradient', 'Royal blue blending into bright cyan', 'accessories', 50, '/placeholder.svg');