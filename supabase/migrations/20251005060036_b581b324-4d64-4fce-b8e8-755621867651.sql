-- Allow couple members to view each other's profiles
CREATE POLICY "Couple members can view each other's profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.couple_members cm1
    JOIN public.couple_members cm2 ON cm1.couple_id = cm2.couple_id
    WHERE cm1.user_id = auth.uid() 
    AND cm2.user_id = profiles.id
  )
);