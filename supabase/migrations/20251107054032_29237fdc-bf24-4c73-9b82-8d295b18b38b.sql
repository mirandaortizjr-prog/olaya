-- Create couple_progress table for the 10000-level system
CREATE TABLE IF NOT EXISTS couple_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL,
  current_level INTEGER NOT NULL DEFAULT 1,
  total_experience INTEGER NOT NULL DEFAULT 0,
  level_started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT couple_progress_couple_id_unique UNIQUE(couple_id)
);

-- Enable RLS
ALTER TABLE couple_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for couple_progress
CREATE POLICY "Users can view their couple's progress"
  ON couple_progress FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = couple_progress.couple_id
    AND couple_members.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their couple's progress"
  ON couple_progress FOR ALL
  USING (EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = couple_progress.couple_id
    AND couple_members.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM couple_members
    WHERE couple_members.couple_id = couple_progress.couple_id
    AND couple_members.user_id = auth.uid()
  ));

-- Add level and experience fields to game_responses
ALTER TABLE game_responses ADD COLUMN IF NOT EXISTS level_earned INTEGER DEFAULT 0;
ALTER TABLE game_responses ADD COLUMN IF NOT EXISTS experience_earned INTEGER DEFAULT 0;

-- Create function to update couple progress
CREATE OR REPLACE FUNCTION update_couple_progress(
  p_couple_id UUID,
  p_experience_gained INTEGER
)
RETURNS TABLE (
  new_level INTEGER,
  new_experience INTEGER,
  leveled_up BOOLEAN
) AS $$
DECLARE
  v_current_level INTEGER;
  v_current_exp INTEGER;
  v_new_exp INTEGER;
  v_new_level INTEGER;
  v_exp_for_next INTEGER;
  v_leveled_up BOOLEAN := FALSE;
BEGIN
  -- Get or create couple progress
  INSERT INTO couple_progress (couple_id, current_level, total_experience)
  VALUES (p_couple_id, 1, 0)
  ON CONFLICT (couple_id) DO NOTHING;

  SELECT current_level, total_experience
  INTO v_current_level, v_current_exp
  FROM couple_progress
  WHERE couple_id = p_couple_id;

  v_new_exp := v_current_exp + p_experience_gained;
  v_new_level := v_current_level;

  -- Level up formula: 100 * level (linear progression)
  -- At level 10000, you need 1,000,000 total exp
  LOOP
    v_exp_for_next := 100 * v_new_level;
    
    IF v_new_exp >= v_exp_for_next AND v_new_level < 10000 THEN
      v_new_exp := v_new_exp - v_exp_for_next;
      v_new_level := v_new_level + 1;
      v_leveled_up := TRUE;
    ELSE
      EXIT;
    END IF;
  END LOOP;

  -- Update the couple progress
  UPDATE couple_progress
  SET 
    current_level = v_new_level,
    total_experience = v_new_exp,
    updated_at = now()
  WHERE couple_id = p_couple_id;

  RETURN QUERY SELECT v_new_level, v_new_exp, v_leveled_up;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;