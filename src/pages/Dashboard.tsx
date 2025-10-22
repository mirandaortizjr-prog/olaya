import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, Settings, LogOut, Users, Link2, Calendar, Flame, Home, Lock, Clock, ThumbsUp, ThumbsDown, Heart, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { FeelingStatusSelector } from "@/components/FeelingStatusSelector";
import { MessengerChat } from "@/components/MessengerChat";
import { FlirtActions } from "@/components/FlirtActions";
import { PrivateContentPage } from "@/components/PrivateContentPage";
import { PrivatePhotosPage } from "@/components/PrivatePhotosPage";
import { UnioGallery } from "@/components/UnioGallery";
import { MemoryCalendar } from "@/components/MemoryCalendar";

interface CoupleData {
  coupleId: string;
  inviteCode: string;
  spaceName: string;
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
  const [userFeelingStatus, setUserFeelingStatus] = useState("");
  const [loveMeter, setLoveMeter] = useState(0);
  const [activeView, setActiveView] = useState("home");
  const [showMessenger, setShowMessenger] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFlirt, setShowFlirt] = useState(false);
  const [editingSpaceName, setEditingSpaceName] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

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

    // Get partner info using RPC
    const { data: partner } = await supabase.rpc('get_partner_profile', { c_id: couple.id });
    const partnerProfile = partner && partner.length > 0 ? partner[0] : null;

    // Fetch partner's full profile including avatar directly
    let partnerData = null;
    if (partnerProfile) {
      const { data: fullPartnerProfile } = await supabase
        .from('profiles')
        .select('avatar_url, full_name, email')
        .eq('id', partnerProfile.user_id)
        .maybeSingle();
      
      if (fullPartnerProfile) {
        partnerData = {
          user_id: partnerProfile.user_id,
          full_name: fullPartnerProfile.full_name || partnerProfile.full_name,
          email: fullPartnerProfile.email || partnerProfile.email,
          avatar_url: fullPartnerProfile.avatar_url
        };
      } else {
        partnerData = { ...partnerProfile, avatar_url: null };
      }
    }

    setCoupleData({
      coupleId: couple.id,
      inviteCode: couple.invite_code,
      spaceName: couple.name || 'name your space',
      partner: partnerData,
    });
    setSpaceName(couple.name || 'name your space');

    loadFeelingStatuses(couple.id, userId, partnerData?.user_id);
    loadLoveMeter(couple.id);
  };

  const loadFeelingStatuses = async (coupleId: string, userId: string, partnerId?: string) => {
    const { data: userStatus } = await supabase
      .from('feeling_status')
      .select('status')
      .eq('couple_id', coupleId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (userStatus) setUserFeelingStatus(userStatus.status);

    if (partnerId) {
      const { data: partnerStatus } = await supabase
        .from('feeling_status')
        .select('status')
        .eq('couple_id', coupleId)
        .eq('user_id', partnerId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (partnerStatus) setPartnerFeelingStatus(partnerStatus.status);
    }
  };

  const loadLoveMeter = async (coupleId: string) => {
    const { data } = await supabase
      .from('love_meter')
      .select('weekly_count')
      .eq('couple_id', coupleId)
      .single();

    if (data) {
      const percentage = Math.min((data.weekly_count / 50) * 100, 100);
      setLoveMeter(percentage);
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
          <h1 className="text-2xl font-bold text-center mb-6">Welcome to Unio</h1>
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
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("flirt")}>
              <Flame className="w-7 h-7 text-red-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("home")}>
              <Home className="w-7 h-7 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("locked")}>
              <Lock className="w-7 h-7 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("photos")}>
              <Clock className="w-7 h-7 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === "locked") {
    return (
      <>
        <PrivateContentPage
          coupleId={coupleData.coupleId}
          userId={user!.id}
          onClose={() => setActiveView("home")}
        />
        <div className="fixed bottom-0 left-0 right-0 bg-muted/80 backdrop-blur border-t">
          <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-4">
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("calendar")}>
              <Calendar className="w-7 h-7 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("flirt")}>
              <Flame className="w-7 h-7 text-red-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("home")}>
              <Home className="w-7 h-7 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("locked")}>
              <Lock className="w-7 h-7 text-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("photos")}>
              <Clock className="w-7 h-7 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (activeView === "photos") {
    return (
      <>
        <PrivatePhotosPage
          coupleId={coupleData.coupleId}
          userId={user!.id}
          onClose={() => setActiveView("home")}
        />
        <div className="fixed bottom-0 left-0 right-0 bg-muted/80 backdrop-blur border-t">
          <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-4">
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("calendar")}>
              <Calendar className="w-7 h-7 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("flirt")}>
              <Flame className="w-7 h-7 text-red-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("home")}>
              <Home className="w-7 h-7 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("locked")}>
              <Lock className="w-7 h-7 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("photos")}>
              <Clock className="w-7 h-7 text-foreground" />
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
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="text-foreground">
            <Settings className="w-7 h-7" />
          </Button>
          
          {editingSpaceName ? (
            <Input
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              onBlur={updateSpaceName}
              onKeyPress={(e) => e.key === 'Enter' && updateSpaceName()}
              className="text-center bg-transparent border-0 text-xl font-normal"
              autoFocus
            />
          ) : (
            <h1
              className="text-xl font-normal cursor-pointer"
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
            className="text-foreground"
          >
            <MessageCircle className="w-7 h-7" />
          </Button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-4">
        {/* Large Profile Photos */}
        <div className="flex justify-around items-start gap-8 mt-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-8 border-black overflow-hidden bg-[#F5E6D3] flex items-center justify-center">
                {userProfile?.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">Photo</span>
                )}
              </div>
            </div>
            <div className="mt-3">
              {user && (
                <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-full px-8 py-2 shadow-lg">
                  <FeelingStatusSelector
                    coupleId={coupleData.coupleId}
                    userId={user.id}
                    currentStatus={userFeelingStatus}
                    onStatusChange={setUserFeelingStatus}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center">
            {coupleData.partner ? (
              <>
                <div className="w-40 h-40 rounded-full border-8 border-black overflow-hidden bg-[#F5E6D3] flex items-center justify-center">
                  {coupleData.partner.avatar_url ? (
                    <img src={coupleData.partner.avatar_url} alt="Partner" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">Photo</span>
                  )}
                </div>
                <div className="mt-3">
                  <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-full px-8 py-2 shadow-lg">
                    <span className="text-sm">{partnerFeelingStatus || "Feeling"}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-40 h-40 rounded-full border-8 border-black bg-[#F5E6D3] flex items-center justify-center">
                  <span className="text-3xl">Photo</span>
                </div>
                <div className="mt-3">
                  <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-full px-8 py-2 shadow-lg">
                    <span className="text-sm">Feeling</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Love-O-Meter - Black background with red bar */}
        <div className="bg-black rounded-3xl p-6 shadow-xl">
          <div className="text-center mb-3">
            <h3 className="text-white font-normal text-lg">Love - O - Meter</h3>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-8 overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-500 rounded-full"
              style={{ width: `${loveMeter}%` }}
            />
          </div>
        </div>

        {/* UNIO Gallery - Large beige card */}
        <div className="bg-[#F5E6D3] rounded-3xl p-6 shadow-xl min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-700">Posted by.....</p>
            <h2 className="text-xl font-normal">UNIO Gallery</h2>
          </div>
          
          <div className="space-y-4">
            <UnioGallery
              coupleId={coupleData.coupleId}
              userId={user!.id}
              userFullName={userProfile?.full_name || "You"}
              partnerFullName={coupleData.partner?.full_name || "Partner"}
            />
          </div>
          
          {/* Reaction Icons at Bottom */}
          <div className="flex justify-around items-center mt-6 pt-4 border-t border-gray-300">
            <Button variant="ghost" size="icon">
              <ThumbsDown className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <ThumbsUp className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="w-6 h-6 text-red-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircle className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bookmark className="w-6 h-6" />
            </Button>
          </div>
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
          <Button variant="ghost" size="icon" className="h-16 w-16 flex-col" onClick={() => setActiveView("photos")}>
            <Clock className="w-7 h-7 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <FlirtActions
        coupleId={coupleData.coupleId}
        senderId={user!.id}
        open={showFlirt}
        onClose={() => setShowFlirt(false)}
      />

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Language</h3>
              <LanguageSwitcher />
            </div>
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
