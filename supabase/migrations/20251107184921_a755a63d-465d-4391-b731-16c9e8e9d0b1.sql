-- Drop the restrictive check constraint on craving_board to allow any desire type
ALTER TABLE craving_board DROP CONSTRAINT IF EXISTS craving_board_craving_type_check;