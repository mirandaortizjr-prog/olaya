-- Create RPC to fetch partner profile within the same couple (bypasses RLS on couple_members)
CREATE OR REPLACE FUNCTION public.get_partner_profile(c_id uuid)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  email text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  select p.id as user_id,
         coalesce(p.full_name, p.email) as full_name,
         p.email
  from couple_members cm
  join profiles p on p.id = cm.user_id
  where cm.couple_id = c_id
    and cm.user_id <> auth.uid()
  limit 1
$function$;
