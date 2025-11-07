import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown, Heart, Bookmark, Upload, X, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Post {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  media_urls: any;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  comment: string;
  created_at: string;
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

interface PostCardProps {
  post: Post;
  userId: string;
  userFullName: string;
  partnerFullName: string;
  reactions: Record<string, Reaction[]>;
  comments: Record<string, Comment[]>;
  newComment: Record<string, string>;
  showComments: Record<string, boolean>;
  onToggleReaction: (postId: string, reactionType: string) => void;
  onToggleComments: (postId: string) => void;
  onCommentChange: (postId: string, value: string) => void;
  onAddComment: (postId: string) => void;
}

const PostCard = ({ 
  post, 
  userId, 
  userFullName, 
  partnerFullName, 
  reactions, 
  comments, 
  newComment,
  showComments,
  onToggleReaction,
  onToggleComments,
  onCommentChange,
  onAddComment
}: PostCardProps) => {
  const getReactionCount = (postId: string, type: string) => {
    return reactions[postId]?.filter(r => r.reaction_type === type).length || 0;
  };

  const hasReacted = (postId: string, type: string) => {
    return reactions[postId]?.some(r => r.user_id === userId && r.reaction_type === type) || false;
  };

  const getCommentAuthor = (comment: Comment) => {
    return comment.user_id === userId ? userFullName : partnerFullName;
  };

  return (
    <Card className="mb-4 overflow-hidden animate-fade-in">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold">
              {post.author_id === userId ? userFullName : partnerFullName}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(post.created_at), 'PPp')}
            </p>
          </div>
        </div>

        {/* Display media if available */}
        {post.media_urls && Array.isArray(post.media_urls) && post.media_urls.length > 0 && (
          <div className="mb-3 -mx-4 overflow-x-auto">
            <div className={`flex gap-2 ${post.media_urls.length > 1 ? 'px-4' : ''}`}>
              {post.media_urls.map((url: string, index: number) => {
                const isVideo = url.includes('.mp4') || url.includes('.webm') || url.includes('.mov');
                return (
                  <div 
                    key={index} 
                    className={`${post.media_urls.length > 1 ? 'flex-shrink-0 w-[85vw]' : 'w-full'}`}
                  >
                    {isVideo ? (
                      <video controls className="w-full h-[70vh] object-cover rounded">
                        <source src={url} />
                      </video>
                    ) : (
                      <img 
                        src={url} 
                        alt="post media" 
                        className="w-full h-[70vh] object-cover rounded" 
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {post.content && <p className="mb-3">{post.content}</p>}
        
        <div className="flex gap-2 border-t pt-3 mb-3">
          <Button
            variant={hasReacted(post.id, 'like') ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleReaction(post.id, 'like')}
            className="gap-1"
          >
            <ThumbsUp className="w-4 h-4" />
            {getReactionCount(post.id, 'like')}
          </Button>
          <Button
            variant={hasReacted(post.id, 'dislike') ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleReaction(post.id, 'dislike')}
            className="gap-1"
          >
            <ThumbsDown className="w-4 h-4" />
            {getReactionCount(post.id, 'dislike')}
          </Button>
          <Button
            variant={hasReacted(post.id, 'love') ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleReaction(post.id, 'love')}
            className="gap-1"
          >
            <Heart className="w-4 h-4" />
            {getReactionCount(post.id, 'love')}
          </Button>
          <Button
            variant={hasReacted(post.id, 'save') ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleReaction(post.id, 'save')}
            className="gap-1"
          >
            <Bookmark className="w-4 h-4" />
            {getReactionCount(post.id, 'save')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleComments(post.id)}
            className="gap-1 ml-auto"
          >
            <MessageCircle className="w-4 h-4" />
            {comments[post.id]?.length || 0}
          </Button>
        </div>

        {/* Comments section */}
        {showComments[post.id] && (
          <div className="border-t pt-3 space-y-2">
            {comments[post.id]?.map((comment) => (
              <div key={comment.id} className="bg-muted p-2 rounded text-sm">
                <p className="font-semibold text-xs">{getCommentAuthor(comment)}</p>
                <p>{comment.comment}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(comment.created_at), 'PPp')}
                </p>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                value={newComment[post.id] || ''}
                onChange={(e) => onCommentChange(post.id, e.target.value)}
                placeholder="Add a comment..."
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && onAddComment(post.id)}
              />
              <Button
                size="sm"
                onClick={() => onAddComment(post.id)}
                disabled={!newComment[post.id]?.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export const UnioGallery = ({ coupleId, userId, userFullName, partnerFullName }: UnioGalleryProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [reactions, setReactions] = useState<Record<string, Reaction[]>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newPost, setNewPost] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
    loadReactions();
    loadComments();

    const channel = supabase
      .channel('posts-reactions-comments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts', filter: `couple_id=eq.${coupleId}` }, loadPosts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_reactions' }, loadReactions)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_comments' }, loadComments)
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

  const loadComments = async () => {
    const { data } = await supabase
      .from('post_comments')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data) {
      const grouped = data.reduce((acc, comment) => {
        if (!acc[comment.post_id]) acc[comment.post_id] = [];
        acc[comment.post_id].push(comment);
        return acc;
      }, {} as Record<string, Comment[]>);
      setComments(grouped);
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

      console.log('Starting upload process. Files:', uploadedFiles.length);

      // Upload files to storage
      for (const file of uploadedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${coupleId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        console.log('Uploading file:', fileName);
        const { error: uploadError } = await supabase.storage
          .from('couple_media')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        // Create signed URL that lasts 7 days
        console.log('Creating signed URL for:', fileName);
        const { data: signedData, error: signError } = await supabase.storage
          .from('couple_media')
          .createSignedUrl(fileName, 60 * 60 * 24 * 7);

        if (signError) {
          console.error('Sign URL error:', signError);
          throw signError;
        }

        if (signedData?.signedUrl) {
          console.log('Signed URL created:', signedData.signedUrl);
          mediaUrls.push(signedData.signedUrl);
        }
      }

      console.log('All files uploaded. Creating post with URLs:', mediaUrls);

      // Create post with media URLs
      const { error, data: postData } = await supabase
        .from('posts')
        .insert({
          couple_id: coupleId,
          author_id: userId,
          content: newPost.trim() || '',
          media_urls: mediaUrls.length > 0 ? mediaUrls : null
        })
        .select();

      if (error) {
        console.error('Post insert error:', error);
        throw error;
      }

      console.log('Post created successfully:', postData);

      setNewPost("");
      setUploadedFiles([]);
      setShowNewPost(false);
      loadPosts();
      toast({ title: "Post created successfully!" });
    } catch (error: any) {
      console.error('Full error details:', error);
      toast({ 
        title: "Error creating post", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
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


  const addComment = async (postId: string) => {
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;

    const { error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        couple_id: coupleId,
        comment: commentText
      });

    if (error) {
      toast({ title: "Error adding comment", variant: "destructive" });
    } else {
      setNewComment({ ...newComment, [postId]: '' });
      loadComments();
    }
  };

  const handleCommentChange = (postId: string, value: string) => {
    setNewComment({ ...newComment, [postId]: value });
  };

  const handleToggleComments = (postId: string) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  return (
    <div className="relative h-full flex flex-col">
      {showNewPost && (
        <Card className="p-4 mb-4 animate-scale-in">
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

          <div className="flex gap-2">
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
      )}

      {/* Feed scroll area */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        {posts.length === 0 && !showNewPost ? (
          <Card className="p-8 flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-4">No posts yet</p>
            <Button onClick={() => setShowNewPost(true)}>
              Create First Post
            </Button>
          </Card>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post}
              userId={userId}
              userFullName={userFullName}
              partnerFullName={partnerFullName}
              reactions={reactions}
              comments={comments}
              newComment={newComment}
              showComments={showComments}
              onToggleReaction={toggleReaction}
              onToggleComments={handleToggleComments}
              onCommentChange={handleCommentChange}
              onAddComment={addComment}
            />
          ))
        )}
      </div>
    </div>
  );
};