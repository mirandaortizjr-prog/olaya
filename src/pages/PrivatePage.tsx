import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Send, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BiometricPrivacyDialog } from "@/components/BiometricPrivacyDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";

const PrivatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [passwordExists, setPasswordExists] = useState(false);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const authSucceededRef = useRef(false);
  
  // Wall comments state
  const [wallComments, setWallComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUserAndCouple();
  }, []);

  useEffect(() => {
    if (coupleId) {
      checkPasswordExists();
    }
  }, [coupleId]);

  useEffect(() => {
    if (isUnlocked && coupleId) {
      loadWallComments();
      subscribeToWallComments();
    }
  }, [isUnlocked, coupleId]);

  const loadUserAndCouple = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUserId(user.id);

    const { data: membership } = await supabase
      .from('couple_members')
      .select('couple_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!membership) {
      toast({ 
        title: "No couple found", 
        description: "Please join or create a couple first",
        variant: "destructive" 
      });
      navigate("/dashboard");
      return;
    }

    setCoupleId(membership.couple_id);
    setLoading(false);
    setShowAuthDialog(true);
  };

  const checkPasswordExists = async () => {
    if (!coupleId) return;
    
    const { data } = await supabase
      .from('privacy_settings')
      .select('password_hash')
      .eq('couple_id', coupleId)
      .maybeSingle();
    
    setPasswordExists(!!data?.password_hash);
  };

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const verifyPassword = async (password: string): Promise<boolean> => {
    if (!coupleId) return false;

    const hashedPassword = await hashPassword(password);
    const { data } = await supabase
      .from('privacy_settings')
      .select('password_hash')
      .eq('couple_id', coupleId)
      .maybeSingle();

    return data?.password_hash === hashedPassword;
  };

  const setPassword = async (password: string): Promise<boolean> => {
    if (!coupleId) return false;

    const hashedPassword = await hashPassword(password);
    const { error } = await supabase
      .from('privacy_settings')
      .upsert({
        couple_id: coupleId,
        password_hash: hashedPassword,
      });

    if (!error) {
      setPasswordExists(true);
      return true;
    }
    return false;
  };

  const handleAuthSuccess = () => {
    authSucceededRef.current = true;
    setIsUnlocked(true);
    setShowAuthDialog(false);
  };

  const handleDialogClose = () => {
    // Keep the dialog open until unlocked to avoid accidental navigation
    setTimeout(() => {
      if (!authSucceededRef.current && !isUnlocked) {
        setShowAuthDialog(true);
        return;
      }
    }, 0);
  };

  const loadWallComments = async () => {
    if (!coupleId) return;

    const { data, error } = await supabase
      .from('wall_comments')
      .select(`
        *,
        profiles:user_id (full_name, email)
      `)
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setWallComments(data);
    }
  };

  const subscribeToWallComments = () => {
    if (!coupleId) return;

    const channel = supabase
      .channel('wall_comments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wall_comments',
          filter: `couple_id=eq.${coupleId}`
        },
        () => {
          loadWallComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !coupleId || !userId) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('wall_comments')
      .insert({
        couple_id: coupleId,
        user_id: userId,
        comment: newComment.trim()
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    } else {
      setNewComment("");
      toast({ title: "Comment posted! 🔥" });
    }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from('wall_comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive"
      });
    } else {
      toast({ title: "Comment deleted" });
    }
  };

  const privateItems = [
    { id: 'photos', label: 'PHOTOS' },
    { id: 'fantasies', label: 'FANTASIES' },
    { id: 'sex-lust-languages', label: 'SEX & LUST\nLANGUAGES' },
    { id: 'videos', label: 'VIDEOS' },
    { id: 'our-journal', label: 'OUR JOURNAL' },
    { id: 'sex-timeline', label: 'SEX TIMELINE' },
  ];

  if (!isUnlocked) {
    return (
      <>
        <BiometricPrivacyDialog
          open={showAuthDialog}
          onClose={handleDialogClose}
          onSuccess={handleAuthSuccess}
          mode={passwordExists ? 'verify' : 'set'}
          onVerify={verifyPassword}
          onSet={setPassword}
        />
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 flex items-center justify-center">
          <Lock className="w-32 h-32 text-purple-300/20" />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900">
      {/* Header */}
      <div className="relative h-20 flex items-center justify-between px-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20 h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8 text-purple-400" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M30 70 L50 20 L70 70 L30 70 Z M40 70 L50 40 L60 70" />
            <path d="M30 70 L50 60 L70 70" />
          </svg>
          <h1 className="text-xl font-bold text-white tracking-wide">
            PRIVATE VAULT
          </h1>
        </div>

        {/* Flower decoration */}
        <svg className="w-16 h-16 text-pink-400" viewBox="0 0 100 100" fill="currentColor">
          <g transform="translate(50, 50)">
            <ellipse rx="12" ry="25" transform="rotate(0)" opacity="0.9"/>
            <ellipse rx="12" ry="25" transform="rotate(72)" opacity="0.9"/>
            <ellipse rx="12" ry="25" transform="rotate(144)" opacity="0.9"/>
            <ellipse rx="12" ry="25" transform="rotate(216)" opacity="0.9"/>
            <ellipse rx="12" ry="25" transform="rotate(288)" opacity="0.9"/>
            <circle r="8" fill="#1a1a2e"/>
          </g>
        </svg>
      </div>

      {/* Grid of Private Items */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 max-w-xl mx-auto">
          {privateItems.map((item) => (
            <button
              key={item.id}
              className="flex flex-col items-center gap-1.5 group"
              onClick={() => {
                console.log(`Opening ${item.id}`);
                toast({ title: `Opening ${item.label}` });
              }}
            >
              <div className="w-24 h-24 rounded-full bg-gray-600 transition-transform group-hover:scale-105 shadow-lg" />
              <span className="text-[10px] font-semibold text-center text-white leading-tight whitespace-pre-line max-w-[100px]">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* The Wall Section */}
      <div className="px-4 py-6 mt-2">
        <h2 className="text-2xl font-bold text-white mb-4">THE WALL</h2>
        
        {/* Comment Input */}
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-lg p-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write something sexy... 🔥"
              className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400 min-h-[80px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-400">{newComment.length}/500</span>
              <Button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </form>

        {/* Comments Feed */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {wallComments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No comments yet. Be the first to write something! 💕</p>
            </div>
          ) : (
            wallComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-semibold text-purple-300">
                      {comment.profiles?.full_name || comment.profiles?.email || 'User'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {comment.user_id === userId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-white whitespace-pre-wrap">{comment.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivatePage;
