-- Create user_skin_purchases table
CREATE TABLE IF NOT EXISTS public.user_skin_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  couple_id UUID NOT NULL,
  skin_id TEXT NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_skin_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own skin purchases"
  ON public.user_skin_purchases
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = user_skin_purchases.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own skin purchases"
  ON public.user_skin_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create couple_skins table
CREATE TABLE IF NOT EXISTS public.couple_skins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL UNIQUE,
  active_skin_id TEXT NOT NULL DEFAULT 'default',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.couple_skins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their couple's skin settings"
  ON public.couple_skins
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = couple_skins.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their couple's skin settings"
  ON public.couple_skins
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = couple_skins.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their couple's skin settings"
  ON public.couple_skins
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = couple_skins.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

-- Insert skin items into shop_items (without ON CONFLICT)
INSERT INTO public.shop_items (name, description, price, category, image_url)
SELECT 'Golden Elegance', 'Luxurious black and gold framed background', 50, 'accessories', 'golden-elegance'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_items WHERE name = 'Golden Elegance');

INSERT INTO public.shop_items (name, description, price, category, image_url)
SELECT 'Passionate Hearts', 'Deep red passionate hearts design', 50, 'accessories', 'passionate-hearts'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_items WHERE name = 'Passionate Hearts');

INSERT INTO public.shop_items (name, description, price, category, image_url)
SELECT 'Pink Heart Bokeh', 'Soft pink bokeh heart pattern', 50, 'accessories', 'pink-bokeh'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_items WHERE name = 'Pink Heart Bokeh');

INSERT INTO public.shop_items (name, description, price, category, image_url)
SELECT 'Burgundy Romance', 'Romantic burgundy hearts atmosphere', 50, 'accessories', 'burgundy-romance'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_items WHERE name = 'Burgundy Romance');

INSERT INTO public.shop_items (name, description, price, category, image_url)
SELECT 'Ocean Hearts', 'Refreshing ocean gradient with hearts', 50, 'accessories', 'ocean-hearts'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_items WHERE name = 'Ocean Hearts');

INSERT INTO public.shop_items (name, description, price, category, image_url)
SELECT 'Classic Love', 'Timeless red hearts on white', 50, 'accessories', 'classic-love'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_items WHERE name = 'Classic Love');

INSERT INTO public.shop_items (name, description, price, category, image_url)
SELECT 'Diamond Lattice', 'Elegant diamond lattice pattern', 50, 'accessories', 'diamond-lattice'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_items WHERE name = 'Diamond Lattice');