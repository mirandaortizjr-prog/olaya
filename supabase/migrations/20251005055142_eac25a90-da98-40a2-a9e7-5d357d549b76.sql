-- Add INSERT policy for couples table to allow users to create couples
CREATE POLICY "Users can create couples" 
ON public.couples 
FOR INSERT 
TO authenticated
WITH CHECK (true);