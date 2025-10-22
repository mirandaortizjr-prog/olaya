import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Heart, Bookmark, ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return isImage || isVideo;
    });
    
    if (validFiles.length !== files.length) {
      toast({ 
        title: "Invalid files removed", 
        description: "Only images and videos are allowed",
        variant: "destructive" 
      });
    }
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const createPost = async () => {
    if (!newPost.trim() && uploadedFiles.length === 0) return;

    setUploading(true);
    try {
      const mediaUrls: string[] = [];

      // Upload files to storage
      for (const file of uploadedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${coupleId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('couple_media')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Create signed URL that lasts 7 days
        const { data: signedData } = await supabase.storage
          .from('couple_media')
          .createSignedUrl(fileName, 60 * 60 * 24 * 7);

        if (signedData?.signedUrl) {
          mediaUrls.push(signedData.signedUrl);
        }
      }

      // Create post with media URLs
      const { error } = await supabase
        .from('posts')
        .insert({
          couple_id: coupleId,
          author_id: userId,
          content: newPost.trim() || '',
          media_urls: mediaUrls.length > 0 ? mediaUrls : null
        });

      if (error) throw error;

      setNewPost("");
      setUploadedFiles([]);
      setShowNewPost(false);
      loadPosts();
      toast({ title: "Post created successfully!" });
    } catch (error: any) {
      toast({ 
        title: "Error creating post", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
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
        <Card className="p-4 h-full flex flex-col overflow-y-auto">
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share something with your partner..."
            className="mb-2"
            rows={3}
          />
          
          {/* File upload section */}
          <div className="mb-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Add Photos/Videos
            </Button>
          </div>

          {/* Preview uploaded files */}
          {uploadedFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3 max-h-40 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-20 object-cover rounded"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      className="w-full h-20 object-cover rounded"
                    />
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-auto">
            <Button 
              onClick={createPost} 
              disabled={(!newPost.trim() && uploadedFiles.length === 0) || uploading}
            >
              {uploading ? "Uploading..." : "Post"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowNewPost(false);
                setUploadedFiles([]);
              }}
              disabled={uploading}
            >
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
        <Card className="p-6 h-full flex flex-col relative overflow-y-auto">
          <div className="flex-1 flex flex-col">
            <div className="mb-3">
              <p className="font-semibold">
                {currentPost.author_id === userId ? userFullName : partnerFullName}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(currentPost.created_at), 'PPp')}
              </p>
            </div>

            {/* Display media if available */}
            {currentPost.media_urls && Array.isArray(currentPost.media_urls) && currentPost.media_urls.length > 0 && (
              <div className="mb-4 grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                {currentPost.media_urls.map((url: string, index: number) => {
                  const isVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('.mov');
                  return isVideo ? (
                    <video key={index} controls className="w-full rounded-lg">
                      <source src={url} />
                    </video>
                  ) : (
                    <img key={index} src={url} alt="post media" className="w-full rounded-lg object-cover" />
                  );
                })}
              </div>
            )}

            {currentPost.content && <p className="text-lg mb-4">{currentPost.content}</p>}
            
            <div className="flex gap-2 border-t pt-3 mt-auto">
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