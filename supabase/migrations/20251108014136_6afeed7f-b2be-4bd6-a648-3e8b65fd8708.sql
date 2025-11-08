-- Create private_vault_settings table for couple's private vault customization
CREATE TABLE public.private_vault_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID NOT NULL UNIQUE,
  vault_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.private_vault_settings ENABLE ROW LEVEL SECURITY;

-- Users can view their couple's vault settings
CREATE POLICY "Users can view their couple's vault settings"
ON public.private_vault_settings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = private_vault_settings.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can insert their couple's vault settings
CREATE POLICY "Users can insert their couple's vault settings"
ON public.private_vault_settings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = private_vault_settings.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Users can update their couple's vault settings
CREATE POLICY "Users can update their couple's vault settings"
ON public.private_vault_settings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = private_vault_settings.couple_id
    AND couple_members.user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_private_vault_settings_updated_at
BEFORE UPDATE ON public.private_vault_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();