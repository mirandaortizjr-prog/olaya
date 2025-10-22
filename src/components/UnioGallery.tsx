import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Heart, Bookmark, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Post {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  media_urls: any;
}

interface Reaction {
  reaction_type: string;
  user_id: string;
}

interface UnioGalleryProps {
  coupleId: string;
  userId: string;
  userFullName: string;
  partnerFullName: string;
}

export const UnioGallery = ({ coupleId, userId, userFullName, partnerFullName }: UnioGalleryProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [reactions, setReactions] = useState<Record<string, Reaction[]>>({});
  const [newPost, setNewPost] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
    loadReactions();

    const channel = supabase
      .channel('posts-reactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts', filter: `couple_id=eq.${coupleId}` }, loadPosts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_reactions' }, loadReactions)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const loadPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (data) setPosts(data);
  };

  const loadReactions = async () => {
    const { data } = await supabase.from('post_reactions').select('*');
    if (data) {
      const grouped = data.reduce((acc, reaction) => {
        if (!acc[reaction.post_id]) acc[reaction.post_id] = [];
        acc[reaction.post_id].push(reaction);
        return acc;
      }, {} as Record<string, Reaction[]>);
      setReactions(grouped);
    }
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    const { error } = await supabase
      .from('posts')
      .insert({
        couple_id: coupleId,
        author_id: userId,
        content: newPost.trim()
      });

    if (error) {
      toast({ title: "Error creating post", variant: "destructive" });
    } else {
      setNewPost("");
      loadPosts();
    }
  };

  const toggleReaction = async (postId: string, reactionType: string) => {
    const existingReaction = reactions[postId]?.find(
      r => r.user_id === userId && r.reaction_type === reactionType
    );

    if (existingReaction) {
      await supabase
        .from('post_reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
        .eq('reaction_type', reactionType);
    } else {
      await supabase
        .from('post_reactions')
        .insert({
          post_id: postId,
          user_id: userId,
          reaction_type: reactionType
        });
    }
    loadReactions();
  };

  const getReactionCount = (postId: string, type: string) => {
    return reactions[postId]?.filter(r => r.reaction_type === type).length || 0;
  };

  const hasReacted = (postId: string, type: string) => {
    return reactions[postId]?.some(r => r.user_id === userId && r.reaction_type === type) || false;
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share something with your partner..."
          className="mb-2"
        />
        <Button onClick={createPost} disabled={!newPost.trim()}>
          Post
        </Button>
      </Card>

      {posts.map((post) => (
        <Card key={post.id} className="p-4">
          <div className="mb-3">
            <p className="font-semibold">
              {post.author_id === userId ? userFullName : partnerFullName}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(post.created_at), 'PPp')}
            </p>
          </div>
          <p className="mb-4">{post.content}</p>
          
          <div className="flex gap-2 border-t pt-3">
            <Button
              variant={hasReacted(post.id, 'like') ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleReaction(post.id, 'like')}
              className="gap-1"
            >
              <ThumbsUp className="w-4 h-4" />
              {getReactionCount(post.id, 'like')}
            </Button>
            <Button
              variant={hasReacted(post.id, 'dislike') ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleReaction(post.id, 'dislike')}
              className="gap-1"
            >
              <ThumbsDown className="w-4 h-4" />
              {getReactionCount(post.id, 'dislike')}
            </Button>
            <Button
              variant={hasReacted(post.id, 'love') ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleReaction(post.id, 'love')}
              className="gap-1"
            >
              <Heart className="w-4 h-4" />
              {getReactionCount(post.id, 'love')}
            </Button>
            <Button
              variant={hasReacted(post.id, 'save') ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleReaction(post.id, 'save')}
              className="gap-1"
            >
              <Bookmark className="w-4 h-4" />
              {getReactionCount(post.id, 'save')}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
