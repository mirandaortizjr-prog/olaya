
-- Drop the restrictive policy that only allows viewing own purchases
DROP POLICY IF EXISTS "Users can view their own skin purchases" ON user_skin_purchases;

-- Create a new policy that allows couple members to see each other's skin purchases
CREATE POLICY "Couple members can view skin purchases"
ON user_skin_purchases
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM couple_members cm1
    JOIN couple_members cm2 ON cm1.couple_id = cm2.couple_id
    WHERE cm1.user_id = auth.uid()
    AND cm2.user_id = user_skin_purchases.user_id
  )
);
