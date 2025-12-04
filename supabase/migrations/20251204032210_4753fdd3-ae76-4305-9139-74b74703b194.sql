-- Create table to store temperament quiz results
CREATE TABLE public.temperament_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  couple_id UUID NOT NULL,
  dominant_temperament TEXT NOT NULL,
  secondary_temperament TEXT NOT NULL,
  tertiary_temperament TEXT NOT NULL,
  rare_temperament TEXT NOT NULL,
  scores JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.temperament_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own and partner's temperament profiles within the same couple
CREATE POLICY "Users can view temperament profiles in their couple"
ON public.temperament_profiles
FOR SELECT
USING (
  couple_id IN (
    SELECT couple_id FROM public.couple_members WHERE user_id = auth.uid()
  )
);

-- Users can insert their own temperament profile
CREATE POLICY "Users can insert their own temperament profile"
ON public.temperament_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own temperament profile
CREATE POLICY "Users can update their own temperament profile"
ON public.temperament_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own temperament profile
CREATE POLICY "Users can delete their own temperament profile"
ON public.temperament_profiles
FOR DELETE
USING (auth.uid() = user_id);