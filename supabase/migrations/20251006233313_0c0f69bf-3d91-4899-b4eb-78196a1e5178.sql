-- Drop the old check constraint
ALTER TABLE public.craving_board 
DROP CONSTRAINT IF EXISTS craving_board_craving_type_check;

-- Add updated check constraint with all craving types including new ones
ALTER TABLE public.craving_board 
ADD CONSTRAINT craving_board_craving_type_check 
CHECK (craving_type IN (
  'hug', 
  'kiss', 
  'chocolate', 
  'coffee', 
  'qualityTime', 
  'cuddle', 
  'massage', 
  'date', 
  'yumyum', 
  'oralSex', 
  'surprise', 
  'custom'
));