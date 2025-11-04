-- Create table for couple preferences on desires and flirts
CREATE TABLE public.couple_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL,
  preference_type TEXT NOT NULL, -- 'desire' or 'flirt'
  enabled_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(couple_id, preference_type)
);

-- Enable RLS
ALTER TABLE public.couple_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their couple's preferences"
  ON public.couple_preferences
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = couple_preferences.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their couple's preferences"
  ON public.couple_preferences
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = couple_preferences.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their couple's preferences"
  ON public.couple_preferences
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = couple_preferences.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_couple_preferences_updated_at
  BEFORE UPDATE ON public.couple_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();