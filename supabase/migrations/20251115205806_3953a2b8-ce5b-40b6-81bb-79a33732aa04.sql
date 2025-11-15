-- Fix active_skin_id and active_gradient_id to accept string identifiers instead of UUIDs
ALTER TABLE couple_skins ALTER COLUMN active_skin_id TYPE text;
ALTER TABLE couple_gradients ALTER COLUMN active_gradient_id TYPE text;