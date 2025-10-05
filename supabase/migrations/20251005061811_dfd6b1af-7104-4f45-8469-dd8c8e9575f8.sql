-- Make add_creator_as_member idempotent to prevent duplicate membership errors
CREATE OR REPLACE FUNCTION public.add_creator_as_member()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.couple_members (couple_id, user_id)
  VALUES (NEW.id, auth.uid())
  ON CONFLICT (couple_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;