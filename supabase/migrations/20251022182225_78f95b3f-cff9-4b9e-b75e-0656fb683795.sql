-- Create messages table for messenger functionality
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view couple messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = messages.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = messages.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can mark messages as read"
  ON public.messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = messages.couple_id
      AND couple_members.user_id = auth.uid()
      AND messages.sender_id != auth.uid()
    )
  );

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create feeling_status table
CREATE TABLE public.feeling_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  couple_id UUID NOT NULL,
  status TEXT NOT NULL,
  custom_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.feeling_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view couple feeling status"
  ON public.feeling_status FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = feeling_status.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own status"
  ON public.feeling_status FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create flirts table for instant flirt actions
CREATE TABLE public.flirts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  flirt_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.flirts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view couple flirts"
  ON public.flirts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = flirts.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send flirts"
  ON public.flirts FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = flirts.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

-- Enable realtime for flirts
ALTER PUBLICATION supabase_realtime ADD TABLE public.flirts;

-- Create private_content table for locked experiences
CREATE TABLE public.private_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.private_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own and shared private content"
  ON public.private_content FOR SELECT
  USING (
    (auth.uid() = user_id) OR
    (is_shared = true AND EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = private_content.couple_id
      AND couple_members.user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can create private content"
  ON public.private_content FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM couple_members
      WHERE couple_members.couple_id = private_content.couple_id
      AND couple_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own content"
  ON public.private_content FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content"
  ON public.private_content FOR DELETE
  USING (auth.uid() = user_id);

-- Add reactions to posts (for UNIO Gallery)
CREATE TABLE public.post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id, reaction_type)
);

ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reactions"
  ON public.post_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      JOIN couple_members cm ON cm.couple_id = p.couple_id
      WHERE p.id = post_reactions.post_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add reactions"
  ON public.post_reactions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM posts p
      JOIN couple_members cm ON cm.couple_id = p.couple_id
      WHERE p.id = post_reactions.post_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove their reactions"
  ON public.post_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime for post_reactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_reactions;

-- Add trigger for updated_at
CREATE TRIGGER update_feeling_status_updated_at
  BEFORE UPDATE ON public.feeling_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_private_content_updated_at
  BEFORE UPDATE ON public.private_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();