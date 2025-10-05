-- Ensure unique membership per user per couple
ALTER TABLE public.couple_members
ADD CONSTRAINT couple_members_unique UNIQUE (couple_id, user_id);

-- Trigger function to auto-add creator as member
CREATE OR REPLACE FUNCTION public.add_creator_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.couple_members (couple_id, user_id)
  VALUES (NEW.id, auth.uid());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger (idempotent)
DROP TRIGGER IF EXISTS add_couple_creator_member ON public.couples;
CREATE TRIGGER add_couple_creator_member
AFTER INSERT ON public.couples
FOR EACH ROW
EXECUTE FUNCTION public.add_creator_as_member();