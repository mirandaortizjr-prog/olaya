-- Fix invite code reusability - allow codes to work even after being marked as used
-- This enables spouses to leave and rejoin using the same code

-- Update find_couple_by_invite_code to ignore the "used" flag
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
  LIMIT 1
$$;

-- Add trigger to reset invite_code_used when someone leaves and couple is no longer full
CREATE OR REPLACE FUNCTION public.reset_invite_code_on_leave()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  member_count int;
BEGIN
  -- Count remaining members after deletion
  SELECT COUNT(*) INTO member_count
  FROM couple_members
  WHERE couple_id = OLD.couple_id;

  -- If less than 2 members, reset the invite code used flag
  IF member_count < 2 THEN
    UPDATE couples
    SET invite_code_used = false
    WHERE id = OLD.couple_id;
  END IF;

  RETURN OLD;
END;
$$;

-- Create trigger for when someone leaves
DROP TRIGGER IF EXISTS reset_invite_on_leave_trigger ON couple_members;
CREATE TRIGGER reset_invite_on_leave_trigger
  AFTER DELETE ON couple_members
  FOR EACH ROW
  EXECUTE FUNCTION public.reset_invite_code_on_leave();