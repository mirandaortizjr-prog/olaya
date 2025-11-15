
-- Add unique constraint to couple_gradients table on couple_id
ALTER TABLE couple_gradients ADD CONSTRAINT couple_gradients_couple_id_key UNIQUE (couple_id);
