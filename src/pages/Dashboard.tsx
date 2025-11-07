import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, Settings, LogOut, Users, Link2, Calendar, Flame, Home, Lock, Clock, ThumbsUp, ThumbsDown, Heart, Bookmark, Gamepad2, Music, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { GalleryUploadButton } from "@/components/GalleryUploadButton";
import { CouplePictureUpload, CouplePictureUploadButton } from "@/components/CouplePictureUpload";
import { BackgroundSlideshow } from "@/components/BackgroundSlideshow";
import { BackgroundUploadManager } from "@/components/BackgroundUploadManager";
import { FeelingStatusSelector } from "@/components/FeelingStatusSelector";
import { NotificationSettings } from "@/components/NotificationSettings";
import { MessengerChat } from "@/components/MessengerChat";
import { FlirtActions } from "@/components/FlirtActions";
import { FlirtNotifications } from "@/components/FlirtNotifications";
import { DesireActions } from "@/components/DesireActions";
import { RecentMessages } from "@/components/RecentMessages";
import { BottomNavigation } from "@/components/BottomNavigation";
import { PrivateVault } from "@/components/PrivateVault";
import { CoupleGames } from "@/components/CoupleGames";
import { UnioGallery } from "@/components/UnioGallery";
import { MemoryCalendar } from "@/components/MemoryCalendar";
import { LoveMeter } from "@/components/LoveMeter";
import { CoupleSongPlayer, CoupleSongPlayerEmbed } from "@/components/CoupleSongPlayer";
import { AnniversaryCountdown } from "@/components/AnniversaryCountdown";
import { ThemeSettings } from "@/components/ThemeSettings";
import { SongSettings } from "@/components/SongSettings";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { useLanguage } from "@/contexts/LanguageContext";
import { PremiumFeatures } from "@/components/PremiumFeatures";

interface CoupleData {
  coupleId: string;
  inviteCode: string;
  spaceName: string;
  couplePictureUrl?: string;
  anniversaryDate?: string | null;
  videoUrl?: string;
  partner: {
    user_id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  } | null;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [coupleData, setCoupleData] = useState<CoupleData | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [partnerFeelingStatus, setPartnerFeelingStatus] = useState("");
  const [partnerCustomMessage, setPartnerCustomMessage] = useState("");
  const [userFeelingStatus, setUserFeelingStatus] = useState("");
  const [userCustomMessage, setUserCustomMessage] = useState("");
  const [coupleSongs, setCoupleSongs] = useState<string[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [showSongDialog, setShowSongDialog] = useState(false);

  // Autoplay song when it's available
  useEffect(() => {
    if (coupleSongs.length > 0) {
      setIsSongPlaying(true);
    }
  }, [coupleSongs]);
  const [activeView, setActiveView] = useState("home");
  const [showMessenger, setShowMessenger] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSongSettings, setShowSongSettings] = useState(false);
  const [showFlirt, setShowFlirt] = useState(false);
  const [showDesires, setShowDesires] = useState(false);
  const [editingSpaceName, setEditingSpaceName] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const [pendingGamesCount, setPendingGamesCount] = useState(0);
  const [pendingGameSessions, setPendingGameSessions] = useState<any[]>([]);
  const [newDesiresCount, setNewDesiresCount] = useState(0);
  const [newFlirtsCount, setNewFlirtsCount] = useState(0);
  const [newVaultCount, setNewVaultCount] = useState(0);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [lastViewedDesires, setLastViewedDesires] = useState<Date>(new Date());
  const [lastViewedFlirts, setLastViewedFlirts] = useState<Date>(new Date());
  const [lastViewedVault, setLastViewedVault] = useState<Date>(new Date());
  const [lastViewedMessages, setLastViewedMessages] = useState<Date>(new Date());
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    checkUser();
  }, []);

  // Fetch new messages count
  useEffect(() => {
    if (!coupleData?.coupleId || !coupleData.partner) return;

    const fetchNewMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('id')
        .eq('couple_id', coupleData.coupleId)
        .neq('sender_id', user!.id)
        .gt('created_at', lastViewedMessages.toISOString());

      if (!error && data) {
        setNewMessagesCount(data.length);
      }
    };

    fetchNewMessages();

    const channel = supabase
      .channel('new-messages-notification')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `couple_id=eq.${coupleData.coupleId}`,
        },
        (payload: any) => {
          if (payload.new.sender_id !== user!.id) {
            setNewMessagesCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleData?.coupleId, coupleData?.partner, user?.id, lastViewedMessages]);

  // Fetch pending games count
  useEffect(() => {
    if (!user?.id) return;

    fetchPendingGames();

    const channel = supabase
      .channel('game-sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_sessions',
        },
        () => {
          fetchPendingGames();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Track new desires
  useEffect(() => {
    if (!user?.id) return;

    fetchNewDesires();

    const channel = supabase
      .channel('desires-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'craving_board',
        },
        () => {
          fetchNewDesires();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, lastViewedDesires]);

  // Track new flirts
  useEffect(() => {
    if (!user?.id) return;

    fetchNewFlirts();

    const channel = supabase
      .channel('flirts-changes-notif')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'flirts',
        },
        () => {
          fetchNewFlirts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, lastViewedFlirts]);

  // Track new vault items
  useEffect(() => {
    if (!user?.id) return;

    fetchNewVaultItems();

    const channel = supabase
      .channel('vault-changes-notif')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'private_content',
        },
        () => {
          fetchNewVaultItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, lastViewedVault]);

  // Subscribe to couple updates for real-time picture changes
  useEffect(() => {
    if (!coupleData?.coupleId || !user?.id) return;

    const channel = supabase
      .channel('couple-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'couples',
          filter: `id=eq.${coupleData.coupleId}`,
        },
        async (payload) => {
          // Reload couple data when picture is updated
          if (payload.new.couple_picture_url !== payload.old.couple_picture_url) {
            await loadCoupleData(user.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleData?.coupleId, user?.id]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);
    await loadUserProfile(user.id);
    await loadCoupleData(user.id);
    setLoading(false);
  };

  const loadUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setUserProfile(data);
    }
  };

  const loadCoupleData = async (userId: string) => {
    const { data: membership } = await supabase
      .from('couple_members')
      .select('couple_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!membership) return;

    const { data: couple } = await supabase
      .from('couples')
      .select('*')
      .eq('id', membership.couple_id)
      .single();

    if (!couple) return;

    // Get partner info using RPC (now includes avatar_url)
    const { data: partner } = await supabase.rpc('get_partner_profile', { c_id: couple.id });
    const partnerData = partner && partner.length > 0 ? partner[0] : null;

    // Load couple picture URL if it exists
    let couplePictureUrl = couple.couple_picture_url;
    if (couplePictureUrl && couplePictureUrl.startsWith('couple_media/')) {
      // Extract the path from the storage path
      const filePath = couplePictureUrl.replace('couple_media/', '');
      const { data: signedData } = await supabase.storage
        .from('couple_media')
        .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days
      if (signedData?.signedUrl) {
        couplePictureUrl = signedData.signedUrl;
      }
    }

    setCoupleData({
      coupleId: couple.id,
      inviteCode: couple.invite_code,
      spaceName: couple.name || 'name your space',
      couplePictureUrl: couplePictureUrl || undefined,
      anniversaryDate: couple.anniversary_date || null,
      partner: partnerData,
    });
    setSpaceName(couple.name || 'name your space');
    setCoupleSongs((couple.couple_songs as string[]) || []);

    loadFeelingStatuses(couple.id, userId, partnerData?.user_id);
  };

  const loadFeelingStatuses = async (coupleId: string, userId: string, partnerId?: string) => {
    const { data: userStatus } = await supabase
      .from('feeling_status')
      .select('status, custom_message')
      .eq('couple_id', coupleId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (userStatus) {
      setUserFeelingStatus(userStatus.status);
      setUserCustomMessage(userStatus.custom_message || "");
    }

    if (partnerId) {
      const { data: partnerStatus } = await supabase
        .from('feeling_status')
        .select('status, custom_message')
        .eq('couple_id', coupleId)
        .eq('user_id', partnerId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (partnerStatus) {
        setPartnerFeelingStatus(partnerStatus.status);
        setPartnerCustomMessage(partnerStatus.custom_message || "");
      }
    }
  };

  const fetchPendingGames = async () => {
    if (!user?.id) return;

    // Get the user's couple_id first
    const { data: membership } = await supabase
      .from('couple_members')
      .select('couple_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!membership) return;

    // Count game sessions where partner initiated and user hasn't responded yet
    const { data: sessions, error } = await supabase
      .from('game_sessions')
      .select('id, initiated_by, game_type, partner_id, status')
      .eq('couple_id', membership.couple_id)
      .eq('partner_id', user.id)
      .eq('status', 'pending');

    if (!error && sessions) {
      setPendingGamesCount(sessions.length);
      setPendingGameSessions(sessions);
    }
  };

  const fetchNewDesires = async () => {
    if (!user?.id) return;

    const { data: membership } = await supabase
      .from('couple_members')
      .select('couple_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!membership) return;

    const { data, error } = await supabase
      .from('craving_board')
      .select('id')
      .eq('couple_id', membership.couple_id)
      .neq('user_id', user.id)
      .eq('fulfilled', false)
      .gt('created_at', lastViewedDesires.toISOString());

    if (!error && data) {
      setNewDesiresCount(data.length);
    }
  };

  const fetchNewFlirts = async () => {
    if (!user?.id) return;

    const { data: membership } = await supabase
      .from('couple_members')
      .select('couple_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!membership) return;

    const { data, error } = await supabase
      .from('flirts')
      .select('id')
      .eq('couple_id', membership.couple_id)
      .neq('sender_id', user.id)
      .gt('created_at', lastViewedFlirts.toISOString());

    if (!error && data) {
      setNewFlirtsCount(data.length);
    }
  };

  const fetchNewVaultItems = async () => {
    if (!user?.id) return;

    const { data: membership } = await supabase
      .from('couple_members')
      .select('couple_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!membership) return;

    const { data, error } = await supabase
      .from('private_content')
      .select('id')
      .eq('couple_id', membership.couple_id)
      .neq('user_id', user.id)
      .eq('is_shared', true)
      .gt('created_at', lastViewedVault.toISOString());

    if (!error && data) {
      setNewVaultCount(data.length);
    }
  };


  const joinCouple = async () => {
    if (!user || !inviteCode.trim()) return;

    const { data: coupleId, error: rpcError } = await supabase.rpc(
      "find_couple_by_invite_code",
      { code: inviteCode.trim().toUpperCase() }
    );

    if (rpcError || !coupleId) {
      toast({ title: "Invalid or expired invite code", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from('couple_members')
      .insert({ couple_id: coupleId, user_id: user.id });

    if (error) {
      toast({ title: "Error joining couple", variant: "destructive" });
    } else {
      toast({ title: "Successfully joined!" });
      loadCoupleData(user.id);
    }
  };

  const createCouple = async () => {
    if (!user) return;

    const { data: couple, error } = await supabase
      .from('couples')
      .insert({ invite_code: '' })
      .select()
      .single();

    if (error || !couple) {
      toast({ title: "Error creating couple", variant: "destructive" });
      return;
    }

    // Link current user to the newly created couple
    const { error: memberError } = await supabase
      .from('couple_members')
      .insert({ couple_id: couple.id, user_id: user.id });

    if (memberError) {
      toast({ title: "Error linking your profile to the couple", variant: "destructive" });
      return;
    }

    // Generate a fresh invite code for sharing
    try {
      await supabase.rpc('refresh_invite_code', { couple_uuid: couple.id });
    } catch (e) {
      console.warn('Could not refresh invite code', e);
    }

    toast({ title: "Couple created successfully!" });
    await loadCoupleData(user.id);
  };

  const updateSpaceName = async () => {
    if (!coupleData || !spaceName.trim()) return;

    const { error } = await supabase
      .from('couples')
      .update({ name: spaceName.trim() })
      .eq('id', coupleData.coupleId);

    if (error) {
      toast({ title: "Error updating name", variant: "destructive" });
    } else {
      setCoupleData({ ...coupleData, spaceName: spaceName.trim() });
      setEditingSpaceName(false);
      toast({ title: "Space name updated!" });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!coupleData) {
    return (
      <div className="min-h-screen bg-muted p-4">
        <Card className="max-w-md mx-auto mt-10 p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome to OLAYA</h1>
          <div className="space-y-4">
            <Button onClick={createCouple} className="w-full" size="lg">
              Create Your Space
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <div>
              <Input
                placeholder="Enter invite code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase().slice(0, 8))}
                maxLength={8}
                className="mb-2"
              />
              <Button onClick={joinCouple} disabled={inviteCode.length !== 8} className="w-full">
                <Link2 className="w-4 h-4 mr-2" />
                Join with Code
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (showMessenger && coupleData.partner) {
    return (
      <MessengerChat
        coupleId={coupleData.coupleId}
        currentUserId={user!.id}
        partnerName={coupleData.partner.full_name}
        onClose={() => setShowMessenger(false)}
      />
    );
  }

  if (activeView === "calendar") {
    return (
      <div className="min-h-screen bg-muted pb-20">
        <div className="p-4 border-b bg-card flex justify-between items-center">
          <h2 className="text-xl font-semibold">Calendar</h2>
          <Button variant="ghost" onClick={() => setActiveView("home")}>Close</Button>
        </div>
        <div className="p-4">
          <MemoryCalendar coupleId={coupleData.coupleId} userId={user!.id} />
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-muted/80 backdrop-blur border-t">
          <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-4">
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("calendar")}>
              <Calendar className="w-7 h-7 text-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => navigate('/flirt-customization')}>
              <Flame className="w-7 h-7 text-red-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("home")}>
              <Home className="w-7 h-7 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("locked")}>
              <Lock className="w-7 h-7 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === "games") {
    return (
      <CoupleGames
        coupleId={coupleData.coupleId}
        userId={user!.id}
        partnerId={coupleData.partner?.user_id || null}
        onClose={() => setActiveView("home")}
        pendingGameSessions={pendingGameSessions}
      />
    );
  }

  if (activeView === "desires") {
    setShowDesires(true);
    setActiveView("home");
  }

  if (activeView === "flirt") {
    navigate('/flirt-customization');
    setActiveView("home");
    return null;
  }

  if (activeView === "desires") {
    navigate('/desire-customization');
    setActiveView("home");
    return null;
  }


  if (activeView === "locked") {
    navigate('/private');
    setActiveView("home");
    return null;
  }

  if (false) {
    return (
      <>
        <div className="min-h-screen bg-muted pb-24">
          <div className="bg-muted p-4">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="text-foreground">
                <Settings className="w-7 h-7" />
              </Button>
              <h1 className="text-xl font-normal">Private</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMessenger(true)}
                disabled={!coupleData.partner}
                className="text-foreground"
              >
                <MessageCircle className="w-7 h-7" />
              </Button>
            </div>
          </div>

          <div className="max-w-lg mx-auto px-4 space-y-4 mt-4">
            <PremiumFeatures
              coupleId={coupleData.coupleId}
              userId={user!.id}
              userEmail={userProfile?.email || ''}
              partnerUserId={coupleData.partner?.user_id}
              lastViewedTimestamp={lastViewedVault}
            />
            
            <PrivateVault
              coupleId={coupleData.coupleId}
              userId={user!.id}
              onClose={() => setActiveView("home")}
              lastViewedTimestamp={lastViewedVault}
            />
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 bg-muted/80 backdrop-blur border-t">
          <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-4">
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("calendar")}>
              <Calendar className="w-7 h-7 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => navigate('/flirt-customization')}>
              <Flame className="w-7 h-7 text-red-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("home")}>
              <Home className="w-7 h-7 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col relative" onClick={() => setActiveView("locked")}>
              <Lock className="w-7 h-7 text-foreground" />
              {newVaultCount > 0 && (
                <span className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full" />
              )}
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (activeView === "vault") {
    return (
      <>
        <PrivateVault
          coupleId={coupleData.coupleId}
          userId={user!.id}
          onClose={() => setActiveView("home")}
          lastViewedTimestamp={lastViewedVault}
        />
        <div className="fixed bottom-0 left-0 right-0 bg-muted/80 backdrop-blur border-t">
          <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-4">
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("calendar")}>
              <Calendar className="w-7 h-7 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => navigate('/flirt-customization')}>
              <Flame className="w-7 h-7 text-red-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("home")}>
              <Home className="w-7 h-7 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("locked")}>
              <Lock className="w-7 h-7 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Main Home View - exact match to reference images
  return (
    <div className="min-h-screen pb-20" style={{ background: 'var(--hero-bg)' }}>
      {/* Hero Section - Dark gradient background with full background images */}
      <div style={{ background: 'var(--hero-bg)' }} className="relative">
        {/* Background slideshow - extends to top */}
        <div className="relative h-80 max-w-lg mx-auto overflow-hidden">
          <BackgroundSlideshow coupleId={coupleData.coupleId} />
          
          {/* Title centered at top, settings button on top right */}
          <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-center px-4">
            {editingSpaceName ? (
              <Input
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                onBlur={updateSpaceName}
                onKeyPress={(e) => e.key === 'Enter' && updateSpaceName()}
                className="text-center bg-white/10 border-white/20 text-xl font-light text-white max-w-[200px]"
                autoFocus
              />
            ) : (
              <h1 className="text-xl font-light text-white cursor-pointer" onClick={() => setEditingSpaceName(true)}>
                {coupleData.spaceName}
              </h1>
            )}
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="absolute right-4 w-10 h-10 hover:bg-white/10">
              <Settings className="w-6 h-6 text-white/70" />
            </Button>
          </div>
          
          {/* Profile Picture - bottom-left corner, overlapping */}
          <div className="absolute bottom-4 left-4 z-20">
            <CouplePictureUpload
              coupleId={coupleData.coupleId}
              currentPictureUrl={coupleData.couplePictureUrl || userProfile?.avatar_url || null}
              onUploadComplete={(url) => setCoupleData({ ...coupleData, couplePictureUrl: url })}
            />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div style={{ background: 'var(--info-bg)' }} className="py-4">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-normal text-white">
              {coupleData.partner && userProfile
                ? `${userProfile.display_name || userProfile.full_name || 'You'} & ${coupleData.partner.full_name || 'Partner'}` 
                : 'Couple Names'}
            </h2>
            {user && coupleData.partner && (
              <FeelingStatusSelector
                currentStatus={partnerFeelingStatus}
                currentCustomMessage={partnerCustomMessage}
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white text-base">Anniversary</span>
            <AnniversaryCountdown anniversaryDate={coupleData.anniversaryDate || null} />
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div style={{ background: 'var(--video-gradient)' }} className="py-6">
        <div className="max-w-lg mx-auto px-4">
          <YouTubePlayer
            coupleId={coupleData.coupleId}
            videoUrl={coupleData.videoUrl}
            onVideoUrlChange={async (url) => {
              setCoupleData({ ...coupleData, videoUrl: url });
              // Save to database
              const { error } = await supabase
                .from('couples')
                .update({ video_url: url } as any)
                .eq('id', coupleData.coupleId);
              
              if (error) {
                console.error('Error saving video URL:', error);
              }
            }}
          />
        </div>
      </div>

      {/* Icon Row */}
      <div style={{ background: 'var(--icons-bg)' }} className="py-6">
        <div className="max-w-lg mx-auto px-4 flex items-center justify-center gap-12">
          <Button variant="ghost" size="icon" className="w-12 h-12 p-0 hover:bg-white/5" onClick={() => navigate('/flirt-customization')}>
            <Flame className="w-10 h-10 text-[hsl(200_30%_60%)]" strokeWidth={1.5} />
          </Button>
          <Button variant="ghost" size="icon" className="w-12 h-12 p-0 hover:bg-white/5" onClick={() => { setShowDesires(true); setNewDesiresCount(0); setLastViewedDesires(new Date()); }}>
            <Heart className="w-10 h-10 text-[hsl(200_30%_60%)]" strokeWidth={1.5} />
          </Button>
          <Button variant="ghost" size="icon" className="w-12 h-12 p-0 hover:bg-white/5" onClick={() => setActiveView("locked")}>
            <Lock className="w-10 h-10 text-[hsl(200_30%_60%)]" strokeWidth={1.5} />
          </Button>
          <Button variant="ghost" size="icon" className="w-12 h-12 p-0 hover:bg-white/5" onClick={() => setActiveView("games")}>
            <Gamepad2 className="w-10 h-10 text-[hsl(200_30%_60%)]" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {/* Feed Section */}
      <div style={{ backgroundColor: '#000000' }} className="pb-4 px-1">
        <div style={{ background: 'linear-gradient(180deg, #000000, #4F585E)' }} className="rounded-3xl p-3 min-h-[500px]">
          <UnioGallery
            coupleId={coupleData.coupleId}
            userId={user!.id}
            userFullName={userProfile?.full_name || "You"}
            partnerFullName={coupleData.partner?.full_name || "Partner"}
          />
        </div>
      </div>

      {!coupleData.partner && (
        <div className="px-4 pb-4">
          <Card className="p-4 max-w-lg mx-auto">
            <h3 className="font-semibold mb-2">Invite Your Partner</h3>
            <div className="flex gap-2">
              <Input value={coupleData.inviteCode} readOnly className="font-mono" />
              <Button onClick={() => { navigator.clipboard.writeText(coupleData.inviteCode); toast({ title: "Code copied!" }); }}>Copy</Button>
            </div>
          </Card>
        </div>
      )}

      <BottomNavigation
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          if (view === "desires") { setShowDesires(true); setNewDesiresCount(0); setLastViewedDesires(new Date()); }
          else if (view === "flirt") { navigate('/flirts'); setNewFlirtsCount(0); setLastViewedFlirts(new Date()); }
          else if (view === "locked") { setNewVaultCount(0); setLastViewedVault(new Date()); }
        }}
        pendingGamesCount={pendingGamesCount}
        newDesiresCount={newDesiresCount}
        newFlirtsCount={newFlirtsCount}
        newVaultCount={newVaultCount}
      />

      <FlirtActions
        coupleId={coupleData.coupleId}
        senderId={user!.id}
        open={showFlirt}
        onClose={() => setShowFlirt(false)}
      />

      {coupleData && (
        <DesireActions
          coupleId={coupleData.coupleId}
          userId={user!.id}
          open={showDesires}
          onClose={() => setShowDesires(false)}
          lastViewedTimestamp={lastViewedDesires}
        />
      )}

      <BottomNavigation
        activeView={activeView}
        pendingGamesCount={pendingGamesCount}
        newDesiresCount={newDesiresCount}
        newFlirtsCount={newFlirtsCount}
        newVaultCount={newVaultCount}
        onViewChange={(view) => {
          if (view === "desires") {
            setLastViewedDesires(new Date());
            setNewDesiresCount(0);
            setShowDesires(true);
          } else if (view === "flirt") {
            setLastViewedFlirts(new Date());
            setNewFlirtsCount(0);
            navigate('/flirts');
          } else if (view === "locked") {
            setLastViewedVault(new Date());
            setNewVaultCount(0);
            setActiveView(view);
          } else {
            setActiveView(view);
          }
        }}
      />

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{t('settings')}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSettings(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pr-2">{/* Added pr-2 for scrollbar spacing */}
            <CouplePictureUploadButton
              coupleId={coupleData.coupleId}
              currentPictureUrl={coupleData.couplePictureUrl || userProfile?.avatar_url || undefined}
              onUploadComplete={(url) => {
                setCoupleData({ ...coupleData, couplePictureUrl: url });
              }}
            />
            <BackgroundUploadManager coupleId={coupleData.coupleId} />
            <div>
              <h3 className="font-semibold mb-2">{t('nestName')}</h3>
              <Input
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                onBlur={updateSpaceName}
                placeholder={t('enterYourNestName')}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">{t('nestNameDescription')}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('yourDisplayName')}</h3>
              <Input
                value={userProfile?.display_name || ''}
                onChange={(e) => setUserProfile({ ...userProfile, display_name: e.target.value })}
                onBlur={async () => {
                  if (!user?.id) return;
                  const { error } = await supabase
                    .from('profiles')
                    .update({ display_name: userProfile?.display_name })
                    .eq('id', user.id);
                  
                  if (error) {
                    toast({ title: t('errorUpdatingDisplayName'), variant: "destructive" });
                  } else {
                    toast({ title: t('displayNameUpdated') });
                  }
                }}
                placeholder={t('enterDisplayName')}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">{t('displayNameDescription')}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('anniversaryDate')}</h3>
              <Input
                type="date"
                value={coupleData.anniversaryDate || ''}
                onChange={async (e) => {
                  const newDate = e.target.value;
                  const { error } = await supabase
                    .from('couples')
                    .update({ anniversary_date: newDate })
                    .eq('id', coupleData.coupleId);
                  
                  if (error) {
                    toast({ title: t('errorUpdatingAnniversaryDate'), variant: "destructive" });
                  } else {
                    setCoupleData({ ...coupleData, anniversaryDate: newDate });
                    toast({ title: t('anniversaryDateUpdated') });
                  }
                }}
              />
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('language')}</h3>
              <LanguageSwitcher />
            </div>
            
            <GalleryUploadButton coupleId={coupleData.coupleId} userId={user!.id} />
            
            <NotificationSettings />
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {
                setShowSettings(false);
                setShowSongSettings(true);
              }}
            >
              <Music className="w-4 h-4 mr-2" />
              {t('manageSongs')}
            </Button>
            
            <Button variant="outline" className="w-full" onClick={() => navigate('/couple-profiles')}>
              <Users className="w-4 h-4 mr-2" />
              {t('viewProfiles')}
            </Button>
            <Button variant="destructive" className="w-full" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              {t('signOut')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Song Settings Dialog */}
      <SongSettings
        open={showSongSettings}
        onOpenChange={setShowSongSettings}
        coupleId={coupleData.coupleId}
        songs={coupleSongs}
        onUpdate={setCoupleSongs}
      />
    </div>
  );
};

export default Dashboard;
