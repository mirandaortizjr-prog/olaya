import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, Settings, LogOut, Users, Link2, Heart, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { CouplePictureUpload } from "@/components/CouplePictureUpload";
import { FeelingStatusSelector } from "@/components/FeelingStatusSelector";
import { MessengerChat } from "@/components/MessengerChat";
import { FlirtActions } from "@/components/FlirtActions";
import { PrivateContentPage } from "@/components/PrivateContentPage";
import { PrivatePhotosPage } from "@/components/PrivatePhotosPage";
import { UnioGallery } from "@/components/UnioGallery";
import { MemoryCalendar } from "@/components/MemoryCalendar";
import { BottomNavigation } from "@/components/BottomNavigation";

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
    const { data, error } = await supabase
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

    const { data: partner } = await supabase.rpc('get_partner_profile', { c_id: couple.id });

    const partnerProfile = partner && partner.length > 0 ? partner[0] : null;

    // Load partner avatar if exists
    let partnerAvatarUrl = null;
    if (partnerProfile) {
      const { data: partnerProfileData } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', partnerProfile.user_id)
        .single();
      
      if (partnerProfileData?.avatar_url) {
        partnerAvatarUrl = partnerProfileData.avatar_url;
      }
    }

    setCoupleData({
      coupleId: couple.id,
      inviteCode: couple.invite_code,
      spaceName: couple.name || 'Our Space',
      partner: partnerProfile ? {
        ...partnerProfile,
        avatar_url: partnerAvatarUrl
      } : null,
    });
    setSpaceName(couple.name || 'Our Space');

    // Load feeling statuses
    loadFeelingStatuses(couple.id, userId, partnerProfile?.user_id);
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

    const { data, error } = await supabase
      .from('couples')
      .insert({ invite_code: '' })
      .select()
      .single();

    if (error) {
      toast({ title: "Error creating couple", variant: "destructive" });
    } else {
      toast({ title: "Couple created successfully!" });
      loadCoupleData(user.id);
    }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!coupleData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
        <Card className="max-w-md mx-auto mt-10 p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome to Us Two</h1>
          <div className="space-y-4">
            <div>
              <Button onClick={createCouple} className="w-full" size="lg">
                Create Your Space
              </Button>
              <p className="text-sm text-center text-muted-foreground mt-2">
                Start your journey together
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <div>
              <Label htmlFor="inviteCode">Join with invite code</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="inviteCode"
                  placeholder="Enter code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase().slice(0, 8))}
                  maxLength={8}
                />
                <Button onClick={joinCouple} disabled={inviteCode.length !== 8}>
                  <Link2 className="w-4 h-4" />
                </Button>
              </div>
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
      <div className="min-h-screen pb-20">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Calendar</h2>
          <Button variant="ghost" onClick={() => setActiveView("home")}>Close</Button>
        </div>
        <div className="p-4">
          <MemoryCalendar coupleId={coupleData.coupleId} userId={user!.id} />
        </div>
        <BottomNavigation activeView={activeView} onViewChange={setActiveView} />
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
        <BottomNavigation activeView={activeView} onViewChange={setActiveView} />
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
        <BottomNavigation activeView={activeView} onViewChange={setActiveView} />
      </>
    );
  }

  if (activeView === "flirt") {
    return (
      <div className="min-h-screen pb-20">
        <FlirtActions
          coupleId={coupleData.coupleId}
          senderId={user!.id}
          open={true}
          onClose={() => setActiveView("home")}
        />
        <BottomNavigation activeView={activeView} onViewChange={setActiveView} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4 max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
            <Settings className="w-5 h-5" />
          </Button>
          
          {editingSpaceName ? (
            <div className="flex-1 mx-2">
              <Input
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                onBlur={updateSpaceName}
                onKeyPress={(e) => e.key === 'Enter' && updateSpaceName()}
                className="text-center"
                autoFocus
              />
            </div>
          ) : (
            <h1
              className="text-xl font-semibold cursor-pointer hover:text-primary"
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
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Profile Photos */}
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="relative inline-block">
              <ProfilePictureUpload 
                userId={user!.id} 
                currentAvatarUrl={userProfile?.avatar_url}
                onUploadComplete={(url) => setUserProfile({...userProfile, avatar_url: url})}
              />
            </div>
            <div className="mt-2">
              {user && (
                <FeelingStatusSelector
                  coupleId={coupleData.coupleId}
                  userId={user.id}
                  currentStatus={userFeelingStatus}
                  onStatusChange={setUserFeelingStatus}
                />
              )}
            </div>
          </div>

          <div className="text-center">
            {coupleData.partner ? (
              <>
                <Avatar className="w-28 h-28 border-4 border-card">
                  <AvatarImage src={coupleData.partner.avatar_url} />
                  <AvatarFallback>
                    {coupleData.partner.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-2">
                  <Button variant="outline" size="sm" disabled>
                    {partnerFeelingStatus || "No status"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-28 h-28 rounded-full border-4 border-dashed border-muted flex items-center justify-center">
                <Users className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Love-O-Meter */}
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="text-center mb-2 flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Love-O-Meter</h3>
          </div>
          <div className="w-full bg-muted rounded-full h-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-pink-500 to-red-600 transition-all duration-500"
              style={{ width: `${loveMeter}%` }}
            />
          </div>
          <p className="text-center text-sm mt-2 text-muted-foreground">
            {Math.round(loveMeter)}% this week
          </p>
        </Card>

        {/* UNIO Gallery */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">UNIO Gallery</h2>
          </div>
          <UnioGallery
            coupleId={coupleData.coupleId}
            userId={user!.id}
            userFullName={userProfile?.full_name || "You"}
            partnerFullName={coupleData.partner?.full_name || "Partner"}
          />
        </div>

        {/* Show invite code if no partner */}
        {!coupleData.partner && (
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Invite Your Partner</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Share this code with your partner to join your space
            </p>
            <div className="flex gap-2">
              <Input
                value={coupleData.inviteCode}
                readOnly
                className="font-mono text-center"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(coupleData.inviteCode);
                  toast({ title: "Code copied!" });
                }}
              >
                Copy
              </Button>
            </div>
          </Card>
        )}
      </div>

      <BottomNavigation activeView={activeView} onViewChange={setActiveView} />
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
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/couple-profiles')}
            >
              <Users className="w-4 h-4 mr-2" />
              View Profiles
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleSignOut}
            >
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
