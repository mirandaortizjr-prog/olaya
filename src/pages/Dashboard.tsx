import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, Settings, LogOut, Users, Link2, Calendar, Flame, Home, Lock, Clock, ThumbsUp, ThumbsDown, Heart, Bookmark, Gamepad2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { CouplePictureUpload, CouplePictureUploadButton } from "@/components/CouplePictureUpload";
import { FeelingStatusSelector } from "@/components/FeelingStatusSelector";
import { NotificationSettings } from "@/components/NotificationSettings";
import { MessengerChat } from "@/components/MessengerChat";
import { FlirtActions } from "@/components/FlirtActions";
import { FlirtNotifications } from "@/components/FlirtNotifications";
import { DesireActions } from "@/components/DesireActions";
import { BottomNavigation } from "@/components/BottomNavigation";
import { PrivateVault } from "@/components/PrivateVault";
import { CoupleGames } from "@/components/CoupleGames";
import { UnioGallery } from "@/components/UnioGallery";
import { MemoryCalendar } from "@/components/MemoryCalendar";
import { LoveMeter } from "@/components/LoveMeter";
import { CoupleSongPlayer, CoupleSongPlayerEmbed } from "@/components/CoupleSongPlayer";

interface CoupleData {
  coupleId: string;
  inviteCode: string;
  spaceName: string;
  couplePictureUrl?: string;
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
  const [coupleSongUrl, setCoupleSongUrl] = useState<string | null>(null);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [showSongDialog, setShowSongDialog] = useState(false);

  // Autoplay song when it's available
  useEffect(() => {
    if (coupleSongUrl) {
      setIsSongPlaying(true);
    }
  }, [coupleSongUrl]);
  const [activeView, setActiveView] = useState("home");
  const [showMessenger, setShowMessenger] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFlirt, setShowFlirt] = useState(false);
  const [showDesires, setShowDesires] = useState(false);
  const [editingSpaceName, setEditingSpaceName] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

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
      partner: partnerData,
    });
    setSpaceName(couple.name || 'name your space');
    setCoupleSongUrl(couple.couple_song_url || null);

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
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setShowFlirt(true)}>
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
      />
    );
  }

  if (activeView === "desires") {
    setShowDesires(true);
    setActiveView("home");
  }


  if (activeView === "locked") {
    return (
      <>
        <PrivateVault
          coupleId={coupleData.coupleId}
          userId={user!.id}
          onClose={() => setActiveView("home")}
        />
        <div className="fixed bottom-0 left-0 right-0 bg-muted/80 backdrop-blur border-t">
          <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-4">
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("calendar")}>
              <Calendar className="w-7 h-7 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setShowFlirt(true)}>
              <Flame className="w-7 h-7 text-red-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("home")}>
              <Home className="w-7 h-7 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("locked")}>
              <Lock className="w-7 h-7 text-foreground" />
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
        />
        <div className="fixed bottom-0 left-0 right-0 bg-muted/80 backdrop-blur border-t">
          <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-4">
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("calendar")}>
              <Calendar className="w-7 h-7 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setShowFlirt(true)}>
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

  // Main Home View - matches the image layout exactly
  return (
    <div className="min-h-screen bg-muted pb-24">
      {/* Top Header Bar */}
      <div className="bg-muted p-4">
        <div className="flex items-center justify-between max-w-lg mx-auto gap-2">
          <div className="flex items-center gap-1 flex-shrink-0">
            <CoupleSongPlayer
              coupleId={coupleData.coupleId}
              songUrl={coupleSongUrl}
              onUpdate={setCoupleSongUrl}
              autoplay={false}
              isPlaying={isSongPlaying}
              onPlayingChange={setIsSongPlaying}
              onEditClick={() => setShowSongDialog(true)}
            />
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="text-foreground">
              <Settings className="w-7 h-7" />
            </Button>
          </div>
          
          {editingSpaceName ? (
            <Input
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              onBlur={updateSpaceName}
              onKeyPress={(e) => e.key === 'Enter' && updateSpaceName()}
              className="text-center bg-transparent border-0 text-lg sm:text-xl font-normal flex-1 min-w-0"
              autoFocus
            />
          ) : (
            <h1
              className="text-lg sm:text-xl font-normal cursor-pointer flex-1 text-center truncate"
              onClick={() => setEditingSpaceName(true)}
            >
              {coupleData.spaceName}
            </h1>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMessenger(true)}
            disabled={!coupleData.partner}
            className="text-foreground flex-shrink-0"
          >
            <MessageCircle className="w-7 h-7" />
          </Button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-4">
        {/* Single Couple Profile Photo */}
        <div className="flex flex-col items-center gap-4 mt-6">
          <div className="relative">
            <CouplePictureUpload
              coupleId={coupleData.coupleId}
              currentPictureUrl={coupleData.couplePictureUrl || userProfile?.avatar_url || null}
              onUploadComplete={(url) => {
                setCoupleData({ ...coupleData, couplePictureUrl: url });
              }}
            />
          </div>

          {/* Feeling Status with Names */}
          <div className="w-full space-y-3">
            {/* User Status */}
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-400 to-gray-500 rounded-full px-6 py-2 shadow-lg">
              <span className="text-sm font-medium text-white">
                {userProfile?.full_name || 'You'}
              </span>
              {user && (
                <FeelingStatusSelector
                  coupleId={coupleData.coupleId}
                  userId={user.id}
                  currentStatus={userFeelingStatus}
                  currentCustomMessage={userCustomMessage}
                  onStatusChange={(status, customMsg) => {
                    setUserFeelingStatus(status);
                    setUserCustomMessage(customMsg || "");
                  }}
                />
              )}
            </div>

            {/* Partner Status */}
            {coupleData.partner && (
              <div className="flex items-center justify-between bg-gradient-to-r from-gray-400 to-gray-500 rounded-full px-6 py-2 shadow-lg">
                <span className="text-sm font-medium text-white">
                  {coupleData.partner.full_name || 'Partner'}
                </span>
                <span className="text-sm text-white">
                  {partnerFeelingStatus === "custom" && partnerCustomMessage 
                    ? partnerCustomMessage 
                    : partnerFeelingStatus || "Feeling"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Flirt Notifications */}
        {coupleData.partner && (
          <FlirtNotifications
            coupleId={coupleData.coupleId}
            userId={user!.id}
            partnerName={coupleData.partner.full_name || "Partner"}
          />
        )}

        {/* YouTube Song Player - Centered between notifications and Love Meter */}
        {coupleSongUrl && (
          <CoupleSongPlayerEmbed
            videoId={coupleSongUrl ? coupleSongUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|music\.youtube\.com\/watch\?v=)([^&\n?#]+)/)?.[1] || null : null}
            isPlaying={isSongPlaying}
            onClose={() => setIsSongPlaying(false)}
            onEditClick={() => setShowSongDialog(true)}
          />
        )}

        {/* Love-O-Meter */}
        <LoveMeter coupleId={coupleData.coupleId} />

        {/* Feed Section - Large beige card */}
        <div className="bg-[#F5E6D3] rounded-3xl p-6 shadow-xl h-[600px] flex flex-col">
          <UnioGallery
            coupleId={coupleData.coupleId}
            userId={user!.id}
            userFullName={userProfile?.full_name || "You"}
            partnerFullName={coupleData.partner?.full_name || "Partner"}
          />
        </div>

        {/* Invite Code if no partner */}
        {!coupleData.partner && (
          <Card className="p-4 bg-card">
            <h3 className="font-semibold mb-2">Invite Your Partner</h3>
            <div className="flex gap-2">
              <Input value={coupleData.inviteCode} readOnly className="font-mono" />
              <Button onClick={() => {
                navigator.clipboard.writeText(coupleData.inviteCode);
                toast({ title: "Code copied!" });
              }}>
                Copy
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Navigation - matches image */}
      <div className="fixed bottom-0 left-0 right-0 bg-muted/80 backdrop-blur border-t">
        <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-4">
          <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("calendar")}>
            <Calendar className="w-7 h-7 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setShowFlirt(true)}>
            <Flame className="w-7 h-7 text-red-500" />
          </Button>
          <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("home")}>
            <Home className="w-7 h-7 text-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("locked")}>
            <Lock className="w-7 h-7 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("games")}>
            <Gamepad2 className="w-7 h-7 text-muted-foreground" />
          </Button>
        </div>
      </div>

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
        />
      )}

      <BottomNavigation
        activeView={activeView}
        onViewChange={(view) => {
          if (view === "desires") {
            setShowDesires(true);
          } else if (view === "flirt") {
            setShowFlirt(true);
          } else {
            setActiveView(view);
          }
        }}
      />

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <CouplePictureUploadButton
              coupleId={coupleData.coupleId}
              currentPictureUrl={coupleData.couplePictureUrl || userProfile?.avatar_url || undefined}
              onUploadComplete={(url) => {
                setCoupleData({ ...coupleData, couplePictureUrl: url });
              }}
            />
            <div>
              <h3 className="font-semibold mb-2">Language</h3>
              <LanguageSwitcher />
            </div>
            <NotificationSettings />
            <Button variant="outline" className="w-full" onClick={() => navigate('/couple-profiles')}>
              <Users className="w-4 h-4 mr-2" />
              View Profiles
            </Button>
            <Button variant="destructive" className="w-full" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
