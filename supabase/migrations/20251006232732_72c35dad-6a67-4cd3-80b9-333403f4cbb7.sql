-- Drop existing storage policies for couple_media if they exist
drop policy if exists "Couple media upload by members" on storage.objects;
drop policy if exists "Couple media view by members" on storage.objects;
drop policy if exists "Couple media modify by owner" on storage.objects;
drop policy if exists "Couple media delete by owner" on storage.objects;

-- Storage policies for private couple_media bucket to allow couple members to upload and read
-- Covers both folder patterns: <userId>/... and <coupleId>/...

-- Allow uploads by authenticated users only when the path folder is their user id OR a couple id they belong to
create policy "Couple media upload by members"
on storage.objects
for insert to authenticated
with check (
  bucket_id = 'couple_media' and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1 from public.couple_members
      where couple_id = ((storage.foldername(name))[1])::uuid
        and user_id = auth.uid()
    )
  )
);

-- Allow reading objects by authenticated users if they are owner or a member of the couple folder or the folder is their user id
create policy "Couple media view by members"
on storage.objects
for select to authenticated
using (
  bucket_id = 'couple_media' and (
    owner = auth.uid()
    or (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1 from public.couple_members
      where couple_id = ((storage.foldername(name))[1])::uuid
        and user_id = auth.uid()
    )
  )
);

-- Allow updates/deletes by the original uploader (owner) within the same bucket
create policy "Couple media modify by owner"
on storage.objects
for update to authenticated
using (bucket_id = 'couple_media' and owner = auth.uid())
with check (bucket_id = 'couple_media' and owner = auth.uid());

create policy "Couple media delete by owner"
on storage.objects
for delete to authenticated
using (bucket_id = 'couple_media' and owner = auth.uid());