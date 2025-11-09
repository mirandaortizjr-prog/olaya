-- Create visual_effects catalog table
CREATE TABLE public.visual_effects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  effect_type TEXT NOT NULL, -- 'object' or 'phrase'
  animation TEXT NOT NULL, -- 'falling', 'floating', 'flutter', etc.
  behavior TEXT NOT NULL, -- description of animation behavior
  category TEXT NOT NULL DEFAULT 'romantic',
  price INTEGER NOT NULL DEFAULT 50,
  preview_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchased_effects table
CREATE TABLE public.purchased_effects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  couple_id UUID NOT NULL,
  effect_id UUID NOT NULL REFERENCES public.visual_effects(id),
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  times_used INTEGER DEFAULT 0
);

-- Create active_effects table
CREATE TABLE public.active_effects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  effect_id UUID NOT NULL REFERENCES public.visual_effects(id),
  activated_by UUID NOT NULL,
  activated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.visual_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchased_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_effects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for visual_effects (public catalog)
CREATE POLICY "Visual effects are viewable by everyone"
ON public.visual_effects FOR SELECT
USING (true);

-- RLS Policies for purchased_effects
CREATE POLICY "Users can view their couple's purchased effects"
ON public.purchased_effects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = purchased_effects.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can purchase effects"
ON public.purchased_effects FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = purchased_effects.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- RLS Policies for active_effects
CREATE POLICY "Users can view their couple's active effects"
ON public.active_effects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = active_effects.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can activate effects"
ON public.active_effects FOR INSERT
WITH CHECK (
  auth.uid() = activated_by
  AND EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = active_effects.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can deactivate effects"
ON public.active_effects FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = active_effects.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Insert the Romantic Effects bundle
INSERT INTO public.visual_effects (name, effect_type, animation, behavior, category, price) VALUES
('Falling Hearts', 'object', 'falling', 'soft flicker, slow descent', 'romantic', 50),
('Rose Petals', 'object', 'falling', 'gentle rotation, shimmer', 'romantic', 50),
('Feathers', 'object', 'falling', 'bounce, glow', 'romantic', 50),
('Lantern Sparks', 'object', 'floating', 'warm flicker, fade-out', 'romantic', 50),
('Starbursts', 'object', 'falling', 'twinkle, fade', 'romantic', 50),
('Light Orbs', 'object', 'floating', 'pulse, hover', 'romantic', 50),
('Halo Rings', 'object', 'falling', 'slow spin, glow', 'romantic', 50),
('Butterflies', 'object', 'flutter', 'trail, soft fade', 'romantic', 50),
('Moon Dust', 'object', 'falling', 'shimmer, blink', 'romantic', 50),
('Cupid Arrows', 'object', 'falling', 'vanish mid-air', 'romantic', 50),
('Lockets', 'object', 'falling', 'open mid-air, glow', 'romantic', 50),
('Infinity Symbols', 'object', 'floating', 'rotate, fade', 'romantic', 50),
('Silhouettes', 'object', 'fade', 'abstract couple outlines', 'romantic', 50),
('Mirrored Hearts', 'object', 'falling', 'dual flicker, sync descent', 'romantic', 50),
('I love you', 'phrase', 'falling', 'soft glow, flicker', 'romantic', 50),
('I need you', 'phrase', 'falling', 'fade-in, pulse', 'romantic', 50),
('You''re mine', 'phrase', 'falling', 'warm flicker', 'romantic', 50),
('Forever us', 'phrase', 'falling', 'slow descent, glow', 'romantic', 50),
('Always with you', 'phrase', 'falling', 'gentle blink', 'romantic', 50),
('Want you', 'phrase', 'falling', 'pulse, fade-out', 'romantic', 50),
('Only you', 'phrase', 'falling', 'soft flicker', 'romantic', 50),
('Crave you', 'phrase', 'falling', 'glow, vanish', 'romantic', 50),
('Yours', 'phrase', 'falling', 'fade-in, flicker', 'romantic', 50),
('Take me', 'phrase', 'falling', 'pulse, shimmer', 'romantic', 50),
('Still you', 'phrase', 'falling', 'minimal flicker, poetic fade', 'romantic', 50);