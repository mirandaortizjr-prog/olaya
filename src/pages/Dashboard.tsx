import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { CouplePictureUpload } from "@/components/CouplePictureUpload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QuickActions } from "@/components/QuickActions";
import { RecentMessages } from "@/components/RecentMessages";
import { DailyNotes } from "@/components/DailyNotes";
import { MoodTracker } from "@/components/MoodTracker";
import { LoveNotes } from "@/components/LoveNotes";
import { MemoryCalendar } from "@/components/MemoryCalendar";
import { CravingBoard } from "@/components/CravingBoard";
import { MediaSharing } from "@/components/MediaSharing";
import { DesireVault } from "@/components/DesireVault";
import { SharedJournal } from "@/components/SharedJournal";
import { RelationshipTimeline } from "@/components/RelationshipTimeline";
import { LoveLanguageSelector } from "@/components/LoveLanguageSelector";
import { PostsFeed } from "@/components/PostsFeed";
import { CalmingTools } from "@/components/CalmingTools";
import { LoveMeter } from "@/components/LoveMeter";
import { useSubscription } from "@/hooks/useSubscription";
import { requestNotificationPermission, showQuickMessageNotification, subscribeToPushNotifications } from "@/utils/notifications";
import { ThemeSettings } from "@/components/ThemeSettings";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Heart, 
  LogOut, 
  Users,
  Link2,
  Copy,
  Share2,
  UserCircle,
  Eye,
  Flame,
  Sparkles,
  Mail,
  Brain,
  Crown,
  Settings,
  RefreshCw
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CoupleData {
  coupleId: string;
  inviteCode: string;
  sanctuaryName: string;
  couplePictureUrl?: string;
  anniversaryDate?: string;
  isCreator: boolean;
  partner: {
    user_id: string;
    full_name: string;
    email: string;
  } | null;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [coupleData, setCoupleData] = useState<CoupleData | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [editingSanctuaryName, setEditingSanctuaryName] = useState(false);
  const [editingAnniversary, setEditingAnniversary] = useState(false);
  const [sanctuaryName, setSanctuaryName] = useState("");
  const [anniversaryDate, setAnniversaryDate] = useState("");
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const { isPremium, isLoading: subscriptionLoading, createCheckoutSession } = useSubscription(user?.id);
  const { setCoupleId } = useTheme();

  useEffect(() => {
    // Check for invite code in URL
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setInviteCode(codeFromUrl.toUpperCase());
    }

    checkAuth();
    requestNotificationPermission().then(async (hasPermission) => {
      if (hasPermission) {
        subscribeToPushNotifications();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      } else {
        fetchCoupleData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, searchParams]);

  // Realtime subscription for quick messages
  useEffect(() => {
    if (!coupleData?.coupleId || !user?.id) return;

    const channel = supabase
      .channel('quick_messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quick_messages',
          filter: `couple_id=eq.${coupleData.coupleId}`,
        },
        (payload) => {
          const message = payload.new as any;
          // Only show notification if it's from partner (not from self)
          if (message.sender_id !== user.id) {
            showQuickMessageToast(message.message_type);
            showQuickMessageNotification(
              message.message_type,
              coupleData.partner?.full_name,
              language
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleData?.coupleId, user?.id, coupleData?.partner?.full_name, language]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    
    if (session?.user) {
      await fetchCoupleData(session.user.id);
      await fetchUserProfile(session.user.id);
    }
    
    setLoading(false);
    
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchCoupleData = async (userId: string) => {
    try {
      console.log("Fetching couple data for user:", userId);
      
      // Get user's couple membership
      const { data: membership, error: memberError } = await supabase
        .from("couple_members")
        .select("couple_id")
        .eq("user_id", userId)
        .order("joined_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log("Membership data:", membership, "Error:", memberError);

      if (memberError) throw memberError;

      if (!membership) {
        setCoupleData(null);
        return;
      }

      // Fetch couple data (with sanctuary name and picture)
      const { data: couple, error: coupleError } = await supabase
        .from("couples")
        .select("id, created_by, name, couple_picture_url, anniversary_date")
        .eq("id", membership.couple_id)
        .maybeSingle();

      console.log("Couple data:", couple, "Error:", coupleError);

      if (coupleError) throw coupleError;

      // Fetch invite code securely (only if user is the creator)
      let inviteCode = "";
      if (couple?.created_by === userId) {
        const { data: inviteData, error: inviteError } = await supabase.rpc(
          "get_couple_invite_code",
          { couple_uuid: membership.couple_id }
        );

        console.log("Invite code data:", inviteData, "Error:", inviteError);

        if (!inviteError && Array.isArray(inviteData) && inviteData.length > 0) {
          inviteCode = inviteData[0].invite_code || "";
        }
      }

      // Get partner profile via RPC (bypasses RLS on couple_members)
      const { data: partner, error: partnerError } = await supabase.rpc(
        "get_partner_profile",
        { c_id: membership.couple_id }
      );

      console.log("RPC partner result:", partner, "Error:", partnerError);

      let partnerProfile = null;
      if (!partnerError && Array.isArray(partner) && partner.length > 0) {
        partnerProfile = {
          user_id: partner[0].user_id,
          full_name: partner[0].full_name,
          email: partner[0].email,
        };
      }

      // Resolve couple picture URL (handles private bucket by signing stored path)
      let couplePicUrl: string | undefined = undefined;
      if (couple?.couple_picture_url) {
        if (couple.couple_picture_url.startsWith('http')) {
          couplePicUrl = couple.couple_picture_url;
        } else {
          const stored = couple.couple_picture_url; // e.g., 'couple_media/user-or-couple-id/filename.jpg'
          const [bucket, ...rest] = stored.split('/');
          const path = rest.join('/');
          if (bucket && path) {
            const { data: signed } = await supabase.storage
              .from(bucket)
              .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days
            couplePicUrl = signed?.signedUrl;
          }
        }
      }

      setCoupleData({
        coupleId: membership.couple_id,
        inviteCode: inviteCode,
        sanctuaryName: couple?.name || 'Our Sanctuary',
        couplePictureUrl: couplePicUrl,
        anniversaryDate: couple?.anniversary_date || undefined,
        isCreator: couple?.created_by === userId,
        partner: partnerProfile,
      });
      setSanctuaryName(couple?.name || 'Our Sanctuary');
      setAnniversaryDate(couple?.anniversary_date || '');
      setCoupleId(membership.couple_id); // Set couple ID for theme sync
    } catch (error: any) {
      console.error("Error fetching couple data:", error);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const generateInviteCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const createCouple = async () => {
    if (!user) return;
    
    try {
      const code = generateInviteCode();
      
      const { data: newCouple, error: coupleError } = await supabase
        .from("couples")
        .insert({ invite_code: code })
        .select()
        .single();

      if (coupleError) throw coupleError;

      const { error: memberError } = await supabase
        .from("couple_members")
        .insert({ couple_id: newCouple.id, user_id: user.id });

      if (memberError) throw memberError;

      await fetchCoupleData(user.id);
      
      toast({
        title: "Sanctuary Created! 💕",
        description: "Share your invite code with your partner",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const joinCouple = async () => {
    if (!user || !inviteCode) return;

    // Check if user is already in a couple
    if (coupleData) {
      toast({
        title: "Already in a sanctuary",
        description: "Please leave your current sanctuary first using the 'Leave Sanctuary' button below.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use RPC to bypass RLS for looking up a couple by invite code
      const { data: coupleId, error: rpcError } = await supabase.rpc(
        "find_couple_by_invite_code",
        { code: inviteCode.trim().toUpperCase() }
      );

      if (rpcError) {
        toast({
          title: "Error",
          description: rpcError.message,
          variant: "destructive",
        });
        return;
      }

      if (!coupleId) {
        toast({
          title: "Invalid Code",
          description: "Please check the invite code and try again",
          variant: "destructive",
        });
        return;
      }

      const { error: memberError } = await supabase
        .from("couple_members")
        .insert({ couple_id: coupleId as string, user_id: user.id });

      if (memberError) {
        if (memberError.code === '23505') {
          toast({
            title: "Already Joined",
            description: "You're already part of this sanctuary",
            variant: "destructive",
          });
        } else {
          throw memberError;
        }
        return;
      }

      await fetchCoupleData(user.id);
      setInviteCode("");
      
      toast({
        title: "Connected! ❤️",
        description: "You've joined your partner's sanctuary",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyInviteCode = () => {
    if (coupleData?.inviteCode) {
      navigator.clipboard.writeText(coupleData.inviteCode);
      toast({
        title: "Copied!",
        description: "Invite code copied to clipboard",
      });
    }
  };

  const shareInvite = async () => {
    if (!coupleData?.inviteCode) return;
    
    const inviteUrl = `${window.location.origin}/dashboard?code=${coupleData.inviteCode}`;
    const shareText = `💕 Join me in our couples sanctuary!\n\nUse code: ${coupleData.inviteCode}\nOr click: ${inviteUrl}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Our Sanctuary 💕',
          text: shareText,
        });
      } catch (err) {
        navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied!",
          description: "Invite link copied to clipboard",
        });
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied!",
        description: "Invite link copied to clipboard",
      });
    }
  };

  const leaveCouple = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("couple_members")
        .delete()
        .eq("user_id", user.id);
      if (error) throw error;

      setCoupleData(null);
      setInviteCode("");

      toast({
        title: "Left sanctuary",
        description: "You can now join your partner's code.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const updateSanctuaryName = async () => {
    if (!coupleData || !sanctuaryName.trim()) return;
    
    try {
      const { error } = await supabase
        .from('couples')
        .update({ name: sanctuaryName.trim() })
        .eq('id', coupleData.coupleId);
      
      if (error) throw error;
      
      setCoupleData({ ...coupleData, sanctuaryName: sanctuaryName.trim() });
      setEditingSanctuaryName(false);
      toast({
        title: t('success'),
        description: t('sanctuaryNameUpdated'),
      });
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateAnniversaryDate = async () => {
    if (!coupleData) return;
    
    try {
      const { error } = await supabase
        .from('couples')
        .update({ anniversary_date: anniversaryDate || null })
        .eq('id', coupleData.coupleId);
      
      if (error) throw error;
      
      setCoupleData({ ...coupleData, anniversaryDate: anniversaryDate || undefined });
      setEditingAnniversary(false);
      toast({
        title: 'Success! 💕',
        description: anniversaryDate ? 'Anniversary date saved' : 'Anniversary date cleared',
      });
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const showQuickMessageToast = (messageType: string) => {
    const messageConfig = {
      wink: { 
        icon: Eye, 
        label: language === 'en' ? 'Wink' : 'Guiño',
        emoji: '😉',
        className: 'from-purple-500 to-pink-500'
      },
      kiss: { 
        icon: Heart, 
        label: language === 'en' ? 'Kiss' : 'Beso',
        emoji: '💋',
        className: 'from-red-500 to-pink-500'
      },
      love: { 
        icon: Mail, 
        label: language === 'en' ? 'I Love You' : 'Te Amo',
        emoji: '💕',
        className: 'from-pink-500 to-rose-500'
      },
      want: { 
        icon: Flame, 
        label: language === 'en' ? 'I Want You' : 'Te Deseo',
        emoji: '🔥',
        className: 'from-orange-500 to-red-500'
      },
      hot: { 
        icon: Sparkles, 
        label: language === 'en' ? "You're Hot" : 'Estás Ardiente',
        emoji: '🌟',
        className: 'from-amber-500 to-orange-500'
      },
      thinking: { 
        icon: Brain, 
        label: language === 'en' ? "Thinking of You" : 'Pensando en Ti',
        emoji: '💭',
        className: 'from-blue-500 to-purple-500'
      },
    };

    const config = messageConfig[messageType as keyof typeof messageConfig] || messageConfig.wink;
    const Icon = config.icon;
    const partnerName = coupleData?.partner?.full_name || (language === 'en' ? 'Your partner' : 'Tu pareja');

    sonnerToast(
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-full bg-gradient-to-br ${config.className} animate-bounce`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-semibold">{partnerName}</p>
          <p className="text-sm opacity-90">{config.label} {config.emoji}</p>
        </div>
      </div>,
      {
        duration: 4000,
        className: 'bg-card border-2 border-primary/20',
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-romantic animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">{t("loadingSanctuary")}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header>
        <title>Dashboard - Your Sanctuary | UsTwo</title>
        <meta name="description" content="Your private couples sanctuary for daily connection, love notes, and shared moments" />
      </header>

      <div className="min-h-screen bg-gradient-cool">
        {/* Modern Navigation Header */}
        <nav className="border-b border-border bg-card backdrop-blur-xl sticky top-0 z-50 shadow-soft">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowProfileSettings(!showProfileSettings)}
                  className="focus:outline-none hover:scale-105 transition-transform"
                >
                  <Avatar className="h-11 w-11 ring-2 ring-primary/20">
                    <AvatarImage src={userProfile?.avatar_url || undefined} alt={userProfile?.full_name || user?.email} />
                    <AvatarFallback className="bg-gradient-romantic text-white font-semibold">
                      {userProfile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
                <h1 className="text-2xl font-bold bg-gradient-romantic bg-clip-text text-transparent hidden sm:block">
                  {t("yourSanctuary")}
                </h1>
              </div>
              <div className="flex gap-3 items-center">
                <LanguageSwitcher />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowThemeSettings(true)} 
                  className="hover:bg-muted"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-muted">
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">{t("signOut")}</span>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <ThemeSettings open={showThemeSettings} onOpenChange={setShowThemeSettings} />
          
          {showProfileSettings && user && (
            <Card className="max-w-md mx-auto mb-6 shadow-medium border-primary/10">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Profile Settings</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowProfileSettings(false)}
                  >
                    Close
                  </Button>
                </div>
                <ProfilePictureUpload
                  userId={user.id}
                  currentAvatarUrl={userProfile?.avatar_url}
                  userName={userProfile?.full_name || user?.email}
                  onUploadComplete={(url) => {
                    setUserProfile({ ...userProfile, avatar_url: url });
                  }}
                />
              </div>
            </Card>
          )}
          
          {!coupleData ? (
            // Not in a couple - show create/join options
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Create Your Sacred Space</h2>
                <p className="text-muted-foreground text-lg">
                  Start your journey together by creating or joining a sanctuary
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Create Sanctuary */}
                <Card className="p-8 hover:shadow-glow transition-all">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">Create Sanctuary</h3>
                      <p className="text-muted-foreground mb-4">
                        Start a new space and invite your partner
                      </p>
                    </div>
                    <Button onClick={createCouple} className="w-full" size="lg">
                      <Heart className="w-4 h-4 mr-2" />
                      Create Your Space
                    </Button>
                  </div>
                </Card>

                {/* Join Sanctuary */}
                <Card className="p-8 hover:shadow-glow transition-all">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                      <Link2 className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">Join Partner</h3>
                      <p className="text-muted-foreground mb-4">
                        Enter your partner's invite code
                      </p>
                    </div>
                    <div className="w-full space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="inviteCode">Invite Code</Label>
                        <Input
                          id="inviteCode"
                          placeholder="Enter 8-character code"
                           value={inviteCode}
                           onChange={(e) => setInviteCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0,8))}
                           maxLength={8}
                           className="text-center text-lg font-mono"
                        />
                      </div>
                       <Button onClick={joinCouple} className="w-full" size="lg" disabled={inviteCode.trim().length !== 8}>
                        <Link2 className="w-4 h-4 mr-2" />
                        Join Sanctuary
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            // In a couple - show sanctuary dashboard
            <div className="space-y-6">
              {/* Header Card - Partner Connection */}
              <Card className="p-6 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 shadow-medium border-primary/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <CouplePictureUpload
                      coupleId={coupleData.coupleId}
                      currentPictureUrl={coupleData.couplePictureUrl}
                      onUploadComplete={(url) => {
                        setCoupleData({ ...coupleData, couplePictureUrl: url });
                      }}
                    />
                    <div className="flex-1">
                      {editingSanctuaryName ? (
                        <div className="flex gap-2 items-center">
                          <Input
                            value={sanctuaryName}
                            onChange={(e) => setSanctuaryName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && updateSanctuaryName()}
                            placeholder={t('sanctuaryNamePlaceholder')}
                            maxLength={50}
                            className="text-lg font-bold"
                            autoFocus
                          />
                          <Button size="sm" onClick={updateSanctuaryName}>
                            {t('save')}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => {
                              setEditingSanctuaryName(false);
                              setSanctuaryName(coupleData.sanctuaryName);
                            }}
                          >
                            {t('cancel')}
                          </Button>
                        </div>
                      ) : (
                        <h2 
                          className="text-xl font-bold cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
                          onClick={() => setEditingSanctuaryName(true)}
                          title={t('clickToEditName')}
                        >
                          {coupleData.sanctuaryName}
                          <UserCircle className="w-4 h-4 opacity-50" />
                        </h2>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {coupleData.partner 
                          ? `${t('connectedWith')} ${coupleData.partner.full_name}`
                          : t('waitingForPartner')}
                      </p>
                      {editingAnniversary ? (
                        <div className="flex gap-2 items-center mt-2">
                          <Input
                            type="date"
                            value={anniversaryDate}
                            onChange={(e) => setAnniversaryDate(e.target.value)}
                            className="text-sm"
                          />
                          <Button size="sm" onClick={updateAnniversaryDate}>
                            {t('save')}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => {
                              setEditingAnniversary(false);
                              setAnniversaryDate(coupleData.anniversaryDate || '');
                            }}
                          >
                            {t('cancel')}
                          </Button>
                        </div>
                      ) : (
                        <p 
                          className="text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors mt-1 flex items-center gap-1"
                          onClick={() => setEditingAnniversary(true)}
                          title="Click to edit anniversary"
                        >
                          <Heart className="w-3 h-3" />
                          {coupleData.anniversaryDate 
                            ? `Anniversary: ${new Date(coupleData.anniversaryDate).toLocaleDateString()}`
                            : 'Add anniversary date'}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/couple-profiles")}
                      className="gap-2"
                    >
                      <Users className="w-4 h-4" />
                      View Profiles
                    </Button>
                    {!coupleData.partner && coupleData.inviteCode && coupleData.isCreator && (
                      <div className="flex gap-2 flex-1 sm:flex-initial">
                        <Input
                          value={coupleData.inviteCode}
                          readOnly
                          className="font-mono text-sm font-semibold text-center bg-card"
                        />
                        <Button onClick={copyInviteCode} variant="outline" size="icon" title="Copy code">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button onClick={shareInvite} variant="outline" size="icon" title="Share code">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={async () => {
                            const { data, error } = await supabase.rpc("refresh_invite_code", { couple_uuid: coupleData.coupleId });
                            if (error) {
                              toast({ title: "Error", description: error.message, variant: "destructive" });
                              return;
                            }
                            if (typeof data === 'string') {
                              setCoupleData({ ...coupleData, inviteCode: data });
                              toast({ title: "Invite code refreshed", description: "Share the new code with your partner." });
                            }
                          }}
                          variant="outline"
                          size="icon"
                          title="Refresh invite code"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          Leave
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Leave this sanctuary?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove your connection. You can rejoin later with an invite code.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={leaveCouple}>Leave</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>

              {/* Subscription Card */}
              {coupleData.partner && user && !subscriptionLoading && (
                <Card className="p-5 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 shadow-soft">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Crown className={`w-6 h-6 ${isPremium ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                      <div>
                        <h3 className="font-semibold text-sm">
                          {isPremium ? 'Legacy Temple Member' : 'Everyday Sanctuary'}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {isPremium 
                            ? 'All premium features unlocked' 
                            : 'Upgrade for premium features'}
                        </p>
                      </div>
                    </div>
                    {!isPremium && (
                      <Button 
                        onClick={() => createCheckoutSession(user.email || '')}
                        size="sm"
                        className="bg-gradient-romantic shadow-soft w-full sm:w-auto"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade $9.99/mo
                      </Button>
                    )}
                  </div>
                </Card>
              )}

              {/* Love-O-Meter */}
              {coupleData.partner && (
                <LoveMeter coupleId={coupleData.coupleId} />
              )}

              {/* Love Wall */}
              {coupleData.partner && user && (
                <PostsFeed 
                  coupleId={coupleData.coupleId} 
                  userId={user.id}
                />
              )}

              {/* Main Content Grid */}
              {coupleData.partner && user && (
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Column 1 - Interactive Features */}
                  <div className="space-y-6">
                    <QuickActions coupleId={coupleData.coupleId} userId={user.id} />
                    <MoodTracker 
                      coupleId={coupleData.coupleId} 
                      userId={user.id}
                      partnerName={coupleData.partner.full_name}
                    />
                    <LoveNotes 
                      coupleId={coupleData.coupleId} 
                      userId={user.id}
                      partnerName={coupleData.partner.full_name}
                    />
                    <CravingBoard 
                      coupleId={coupleData.coupleId} 
                      userId={user.id}
                      partnerName={coupleData.partner.full_name}
                    />
                  </div>

                  {/* Column 2 - Memory & Communication */}
                  <div className="space-y-6">
                    <RecentMessages 
                      coupleId={coupleData.coupleId} 
                      userId={user.id} 
                      partnerName={coupleData.partner.full_name}
                    />
                    <Card 
                      className="p-6 hover:shadow-glow transition-shadow cursor-pointer bg-gradient-to-br from-card to-card/50 border-primary/10"
                      onClick={() => navigate('/daily-notes')}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Mail className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold">{t('dailyNotes')}</h3>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary">
                          Open →
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Share morning whispers, evening blessings, and reflections
                      </p>
                    </Card>
                    <MemoryCalendar 
                      coupleId={coupleData.coupleId} 
                      userId={user.id}
                      partnerName={coupleData.partner.full_name}
                    />
                    <MediaSharing 
                      coupleId={coupleData.coupleId} 
                      userId={user.id}
                      partnerName={coupleData.partner.full_name}
                    />
                  </div>
                </div>
              )}

              {/* Premium Features Section */}
              {coupleData.partner && user && isPremium && (
                <div className="space-y-6 mt-8">
                  <div className="flex items-center gap-3 px-4 py-2 bg-gradient-romantic rounded-lg w-fit shadow-glow">
                    <Crown className="w-5 h-5 text-white" />
                    <span className="font-semibold text-white">Premium Features</span>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <DesireVault 
                      coupleId={coupleData.coupleId} 
                      userId={user.id}
                    />
                    <LoveLanguageSelector 
                      userId={user.id}
                      partnerUserId={coupleData.partner.user_id}
                    />
                  </div>
                  
                  <SharedJournal 
                    coupleId={coupleData.coupleId} 
                    userId={user.id}
                  />
                  
                  <RelationshipTimeline 
                    coupleId={coupleData.coupleId} 
                    userId={user.id}
                  />
                  
                  <CalmingTools />
                </div>
              )}

              {/* Upgrade CTA for Non-Premium */}
              {coupleData.partner && user && !isPremium && (
                <Card className="p-10 text-center bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 shadow-glow border-primary/20">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-romantic flex items-center justify-center shadow-glow">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-3 bg-gradient-romantic bg-clip-text text-transparent">
                    Unlock Premium Features
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                    Access Desire Vault, Shared Journal, Relationship Timeline, Love Languages, Posts Feed, and Calming Tools
                  </p>
                  <Button 
                    size="lg"
                    onClick={() => createCheckoutSession(user.email || '')}
                    className="bg-gradient-romantic shadow-glow hover:scale-105 transition-transform"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade to Legacy Temple - $9.99/month
                  </Button>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Dashboard;
