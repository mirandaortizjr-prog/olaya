-- Drop the existing check constraint
ALTER TABLE craving_board DROP CONSTRAINT IF EXISTS craving_board_craving_type_check;

-- Add updated check constraint with all desire types used in the app
ALTER TABLE craving_board ADD CONSTRAINT craving_board_craving_type_check 
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
  'custom',
  'videoGames',
  'adventure'
));