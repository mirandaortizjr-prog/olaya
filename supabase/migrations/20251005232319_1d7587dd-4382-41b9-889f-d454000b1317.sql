-- Security improvements for profiles table
-- Remove direct email exposure by removing it from client-accessible queries
-- Email should only be needed server-side

-- Create a secure function to get user email (only returns own email)
CREATE OR REPLACE FUNCTION public.get_own_email()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public.profiles WHERE id = auth.uid()
$$;

-- Update subscriptions table to hide sensitive Stripe data from client
-- Create a view that only shows subscription status, not Stripe IDs
CREATE OR REPLACE VIEW public.subscription_status AS
SELECT 
  user_id,
  status,
  current_period_end,
  cancel_at_period_end,
  created_at
FROM public.subscriptions;

-- Grant access to the view
GRANT SELECT ON public.subscription_status TO authenticated;

-- Enable RLS on the view
ALTER VIEW public.subscription_status SET (security_invoker = on);

-- Add expiration to invite codes for better security
ALTER TABLE public.couples ADD COLUMN IF NOT EXISTS invite_code_expires_at timestamp with time zone;
ALTER TABLE public.couples ADD COLUMN IF NOT EXISTS invite_code_used boolean DEFAULT false;

-- Function to generate new invite code with expiration (7 days)
CREATE OR REPLACE FUNCTION public.refresh_invite_code(couple_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code text;
  characters text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  i integer;
BEGIN
  -- Check if user is member of this couple
  IF NOT EXISTS (
    SELECT 1 FROM couple_members 
    WHERE couple_id = couple_uuid AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized to refresh this invite code';
  END IF;

  -- Generate new code
  new_code := '';
  FOR i IN 1..8 LOOP
    new_code := new_code || substr(characters, floor(random() * length(characters) + 1)::int, 1);
  END LOOP;

  -- Update couple with new code and expiration
  UPDATE couples 
  SET 
    invite_code = new_code,
    invite_code_expires_at = now() + interval '7 days',
    invite_code_used = false
  WHERE id = couple_uuid;

  RETURN new_code;
END;
$$;

-- Update find_couple_by_invite_code to check expiration
CREATE OR REPLACE FUNCTION public.find_couple_by_invite_code(code text)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id
  FROM public.couples
  WHERE invite_code = code
    AND (invite_code_expires_at IS NULL OR invite_code_expires_at > now())
    AND invite_code_used = false
  LIMIT 1
$$;

-- Mark invite code as used when second person joins
CREATE OR REPLACE FUNCTION public.mark_invite_code_used()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  member_count integer;
BEGIN
  -- Count members in this couple
  SELECT COUNT(*) INTO member_count
  FROM couple_members
  WHERE couple_id = NEW.couple_id;

  -- If this is the second member, mark invite code as used
  IF member_count = 2 THEN
    UPDATE couples
    SET invite_code_used = true
    WHERE id = NEW.couple_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger to mark code as used
DROP TRIGGER IF EXISTS mark_invite_used_trigger ON couple_members;
CREATE TRIGGER mark_invite_used_trigger
  AFTER INSERT ON couple_members
  FOR EACH ROW
  EXECUTE FUNCTION public.mark_invite_code_used();

-- Set expiration for existing invite codes (7 days from now)
UPDATE couples 
SET invite_code_expires_at = now() + interval '7 days'
WHERE invite_code_expires_at IS NULL;