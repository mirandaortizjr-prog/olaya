-- Create privacy_settings table for couple password protection
CREATE TABLE IF NOT EXISTS public.privacy_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for privacy_settings
CREATE POLICY "Users can view their couple's privacy settings"
  ON public.privacy_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = privacy_settings.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their couple's privacy settings"
  ON public.privacy_settings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = privacy_settings.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their couple's privacy settings"
  ON public.privacy_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = privacy_settings.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_privacy_settings_updated_at
  BEFORE UPDATE ON public.privacy_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();