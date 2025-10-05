-- Create trigger to add couple creator as a member automatically
CREATE TRIGGER add_creator_as_member_trigger
AFTER INSERT ON public.couples
FOR EACH ROW
EXECUTE FUNCTION public.add_creator_as_member();