-- Create table to track private interactions
CREATE TABLE public.private_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  couple_id UUID,
  interaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.private_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own interactions" 
ON public.private_interactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interactions" 
ON public.private_interactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_private_interactions_user_id ON public.private_interactions(user_id);
CREATE INDEX idx_private_interactions_created_at ON public.private_interactions(created_at);

-- Function to calculate lust meter percentage based on last 7 days of activity
CREATE OR REPLACE FUNCTION public.get_lust_meter_score(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  interaction_count INTEGER;
  score INTEGER;
BEGIN
  -- Count interactions in last 7 days
  SELECT COUNT(*)
  INTO interaction_count
  FROM public.private_interactions
  WHERE user_id = p_user_id
    AND created_at > NOW() - INTERVAL '7 days';
  
  -- Calculate score (max 100)
  -- 10 interactions = 100%, scales linearly
  score := LEAST(100, (interaction_count * 10));
  
  RETURN score;
END;
$$;