-- Create shop_items table for virtual gifts
CREATE TABLE IF NOT EXISTS public.shop_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view shop items
CREATE POLICY "Shop items are viewable by everyone" 
ON public.shop_items 
FOR SELECT 
USING (true);

-- Create gift_transactions table to track gifted items
CREATE TABLE IF NOT EXISTS public.gift_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.shop_items(id),
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  couple_id UUID NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gift_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view gifts they sent or received
CREATE POLICY "Users can view their gift transactions" 
ON public.gift_transactions 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can insert gift transactions they send
CREATE POLICY "Users can send gifts" 
ON public.gift_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

-- Insert flower gifts
INSERT INTO public.shop_items (name, description, category, price, image_url) VALUES
  ('Red Rose Bouquet', 'A beautiful bouquet of red roses wrapped with a bow', 'flowers', 50, 'flower-bouquet-1'),
  ('Grand Red Rose Bouquet', 'An abundant arrangement of red roses with green accents', 'flowers', 100, 'flower-bouquet-2'),
  ('Pink Rose Heart Bouquet', 'Delicate pink roses arranged in a heart-shaped bouquet', 'flowers', 75, 'flower-bouquet-3'),
  ('Pearl Pink Rose Bouquet', 'Elegant pink roses with pearl accents', 'flowers', 150, 'flower-bouquet-4'),
  ('Romantic Pink Rose Bundle', 'A sweet bundle of pink roses with green leaves', 'flowers', 60, 'flower-bouquet-5'),
  ('Soft Pink Rose Stems', 'Four graceful pink rose stems', 'flowers', 40, 'flower-bouquet-6'),
  ('Coral Rose Arrangement', 'A stunning arrangement of coral roses in a vase', 'flowers', 120, 'flower-bouquet-7');