import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Heart, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNewPost, setShowNewPost] = useState(false);
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
      setShowNewPost(false);
      loadPosts();
    }
  };

  const nextPost = () => {
    if (currentIndex < posts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevPost = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentPost = posts[currentIndex];

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
    <div className="relative h-full">
      {showNewPost ? (
        <Card className="p-4 h-full flex flex-col">
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share something with your partner..."
            className="mb-2 flex-1"
          />
          <div className="flex gap-2">
            <Button onClick={createPost} disabled={!newPost.trim()}>
              Post
            </Button>
            <Button variant="outline" onClick={() => setShowNewPost(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      ) : posts.length === 0 ? (
        <Card className="p-8 h-full flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-4">No posts yet</p>
          <Button onClick={() => setShowNewPost(true)}>
            Create First Post
          </Button>
        </Card>
      ) : (
        <Card className="p-6 h-full flex flex-col relative">
          <div className="flex-1 flex flex-col">
            <div className="mb-3">
              <p className="font-semibold">
                {currentPost.author_id === userId ? userFullName : partnerFullName}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(currentPost.created_at), 'PPp')}
              </p>
            </div>
            <p className="flex-1 text-lg mb-4">{currentPost.content}</p>
            
            <div className="flex gap-2 border-t pt-3">
              <Button
                variant={hasReacted(currentPost.id, 'like') ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleReaction(currentPost.id, 'like')}
                className="gap-1"
              >
                <ThumbsUp className="w-4 h-4" />
                {getReactionCount(currentPost.id, 'like')}
              </Button>
              <Button
                variant={hasReacted(currentPost.id, 'dislike') ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleReaction(currentPost.id, 'dislike')}
                className="gap-1"
              >
                <ThumbsDown className="w-4 h-4" />
                {getReactionCount(currentPost.id, 'dislike')}
              </Button>
              <Button
                variant={hasReacted(currentPost.id, 'love') ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleReaction(currentPost.id, 'love')}
                className="gap-1"
              >
                <Heart className="w-4 h-4" />
                {getReactionCount(currentPost.id, 'love')}
              </Button>
              <Button
                variant={hasReacted(currentPost.id, 'save') ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleReaction(currentPost.id, 'save')}
                className="gap-1"
              >
                <Bookmark className="w-4 h-4" />
                {getReactionCount(currentPost.id, 'save')}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevPost}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {posts.length}
              </span>
              <Button size="sm" onClick={() => setShowNewPost(true)}>
                New Post
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextPost}
              disabled={currentIndex === posts.length - 1}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
