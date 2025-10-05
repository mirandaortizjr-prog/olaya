-- 1) Secure RPC to fetch couple id by invite code (bypasses RLS safely)
create or replace function public.find_couple_by_invite_code(code text)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.couples
  where invite_code = code
  limit 1
$$;

grant execute on function public.find_couple_by_invite_code(text) to authenticated;

-- 2) Auto-add creator as member when a couple is created
-- (uses existing public.add_creator_as_member())
create trigger trg_couples_add_creator_member
  after insert on public.couples
  for each row execute function public.add_creator_as_member();

-- 3) Maintain updated_at on updates for couples (optional but safe)
-- (uses existing public.update_updated_at_column())
create trigger trg_couples_set_updated_at
  before update on public.couples
  for each row execute function public.update_updated_at_column();