import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Send, Trash2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BiometricPrivacyDialog } from "@/components/BiometricPrivacyDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { PrivatePhotoGallery } from "@/components/PrivatePhotoGallery";
import { PrivateVideoGallery } from "@/components/PrivateVideoGallery";

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
  const [myComments, setMyComments] = useState<any[]>([]);
  const [partnerComments, setPartnerComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [partnerInfo, setPartnerInfo] = useState<any>(null);
  
  // Vault settings
  const [vaultTitle, setVaultTitle] = useState<string>("");
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [showVideoGallery, setShowVideoGallery] = useState(false);

  useEffect(() => {
    loadUserAndCouple();
  }, []);

  useEffect(() => {
    if (coupleId) {
      // Check if already unlocked in this session
      const wasUnlocked = sessionStorage.getItem('private_vault_unlocked');
      if (wasUnlocked === 'true') {
        setIsUnlocked(true);
        setShowAuthDialog(false);
      } else {
        checkPasswordExists();
        setShowAuthDialog(true);
      }
    }
  }, [coupleId]);

  useEffect(() => {
    if (isUnlocked && coupleId && userId) {
      loadWallComments();
      loadPartnerInfo();
      loadVaultSettings();
      subscribeToWallComments();
    }
  }, [isUnlocked, coupleId, userId]);

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
    // Don't automatically show dialog - let the next useEffect handle it
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
    // Remember that user unlocked the vault in this session
    sessionStorage.setItem('private_vault_unlocked', 'true');
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

  const loadPartnerInfo = async () => {
    if (!coupleId) return;

    const { data: members } = await supabase
      .from('couple_members')
      .select('user_id, profiles:user_id(full_name, email)')
      .eq('couple_id', coupleId)
      .neq('user_id', userId);

    if (members && members[0]) {
      setPartnerInfo(members[0].profiles);
    }
  };

  const loadVaultSettings = async () => {
    if (!coupleId) return;

    const { data } = await supabase
      .from('private_vault_settings')
      .select('vault_title')
      .eq('couple_id', coupleId)
      .maybeSingle();

    if (data?.vault_title) {
      setVaultTitle(data.vault_title);
    }
  };

  const handleSaveVaultTitle = async () => {
    if (!coupleId) return;

    const { error } = await supabase
      .from('private_vault_settings')
      .upsert({
        couple_id: coupleId,
        vault_title: editingTitle.trim() || null
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update vault title",
        variant: "destructive"
      });
    } else {
      setVaultTitle(editingTitle.trim());
      setShowSettingsDialog(false);
      toast({ title: "Vault title updated!" });
    }
  };

  const loadWallComments = async () => {
    if (!coupleId || !userId) return;

    const { data, error } = await supabase
      .from('wall_comments')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMyComments(data.filter(c => c.user_id === userId));
      setPartnerComments(data.filter(c => c.user_id !== userId));
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
    { id: 'our-journal', label: 'OUR JOURNAL', route: '/intimate-journal' },
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
        
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-white tracking-wide mb-1">
            PRIVATE VAULT
          </h1>
          {vaultTitle && (
            <p className="text-sm text-purple-300 italic">"{vaultTitle}"</p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 h-8 w-8"
          onClick={() => {
            setEditingTitle(vaultTitle);
            setShowSettingsDialog(true);
          }}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="bg-gradient-to-b from-gray-900 to-black border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">Vault Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Custom Title (Optional)
              </label>
              <Input
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                placeholder="Our Secret Space..."
                maxLength={50}
                className="bg-black/30 border-purple-500/30 text-white placeholder:text-gray-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Give your private vault a special name
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowSettingsDialog(false)}
              className="text-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveVaultTitle}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grid of Private Items */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 max-w-xl mx-auto">
          {privateItems.map((item) => (
            <button
              key={item.id}
              className="flex flex-col items-center gap-1.5 group"
              onClick={() => {
                if (item.id === 'photos') {
                  setShowPhotoGallery(true);
                } else if (item.id === 'videos') {
                  setShowVideoGallery(true);
                } else if (item.id === 'fantasies') {
                  navigate('/desires');
                } else if (item.route) {
                  // Preserve unlocked state while navigating within private sections
                  sessionStorage.setItem('private_vault_unlocked', 'true');
                  navigate(item.route);
                } else {
                  console.log(`Opening ${item.id}`);
                  toast({ title: `Opening ${item.label}` });
                }
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

      {/* Photo Gallery */}
      {showPhotoGallery && coupleId && userId && (
        <PrivatePhotoGallery
          coupleId={coupleId}
          userId={userId}
          onClose={() => setShowPhotoGallery(false)}
        />
      )}

      {/* Video Gallery */}
      {showVideoGallery && (
        <Dialog open={showVideoGallery} onOpenChange={setShowVideoGallery}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-4 bg-gradient-to-b from-gray-900 to-black border-purple-500/30">
            <div className="h-[90vh] overflow-auto">
              <PrivateVideoGallery coupleId={coupleId!} userId={userId!} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* The Wall Section - Two Columns */}
      <div className="px-4 py-6 mt-2">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">THE WALL</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* My Wall */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-pink-400 mb-1">Your Wall</h3>
              <p className="text-xs text-gray-400">Your private space</p>
            </div>

            {/* My Post Box */}
            <form onSubmit={handleSubmitComment}>
              <div className="bg-gradient-to-b from-pink-900/30 to-pink-950/30 border border-pink-500/20 rounded-lg p-4">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts... 🔥"
                  className="bg-black/30 border-pink-500/30 text-white placeholder:text-gray-400 min-h-[80px] resize-none mb-3"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{newComment.length}/500</span>
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    size="sm"
                    className="bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Post
                  </Button>
                </div>
              </div>
            </form>

            {/* My Comments */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {myComments.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  <p>Your wall is empty</p>
                </div>
              ) : (
                myComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gradient-to-b from-pink-900/20 to-pink-950/20 border border-pink-500/10 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-6 w-6"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-white text-sm whitespace-pre-wrap">{comment.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Partner's Wall */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-purple-400 mb-1">
                {partnerInfo?.full_name || "Partner's"} Wall
              </h3>
              <p className="text-xs text-gray-400">Their private space</p>
            </div>

            {/* Partner's Wall - View Only */}
            <div className="bg-gradient-to-b from-purple-900/30 to-purple-950/30 border border-purple-500/20 rounded-lg p-4 min-h-[140px] flex items-center justify-center">
              <p className="text-sm text-gray-400 text-center">
                This is {partnerInfo?.full_name?.split(' ')[0] || "their"} private wall.<br />
                Only they can post here.
              </p>
            </div>

            {/* Partner's Comments */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {partnerComments.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  <p>Their wall is empty</p>
                </div>
              ) : (
                partnerComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gradient-to-b from-purple-900/20 to-purple-950/20 border border-purple-500/10 rounded-lg p-3"
                  >
                    <p className="text-xs text-gray-400 mb-2">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                    <p className="text-white text-sm whitespace-pre-wrap">{comment.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivatePage;
