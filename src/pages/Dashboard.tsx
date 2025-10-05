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
import { useSubscription } from "@/hooks/useSubscription";
import { requestNotificationPermission, showQuickMessageNotification, subscribeToPushNotifications } from "@/utils/notifications";
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
  Crown
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const { isPremium, isLoading: subscriptionLoading, createCheckoutSession } = useSubscription(user?.id);

  useEffect(() => {
    // Check for invite code in URL
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setInviteCode(codeFromUrl.toUpperCase());
    }

    checkAuth();
    requestNotificationPermission().then(async (hasPermission) => {
      if (hasPermission) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          subscribeToPushNotifications(session.user.id);
        }
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

      // Fetch couple data
      const { data: couple, error: coupleError } = await supabase
        .from("couples")
        .select("invite_code")
        .eq("id", membership.couple_id)
        .maybeSingle();

      console.log("Couple data:", couple, "Error:", coupleError);

      if (coupleError) throw coupleError;

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

      console.log("Setting couple data with partner:", partnerProfile);

      setCoupleData({
        coupleId: membership.couple_id,
        inviteCode: couple?.invite_code || "",
        partner: partnerProfile,
      });
    } catch (error: any) {
      console.error("Error fetching couple data:", error);
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
        { code: inviteCode.toUpperCase() }
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

      <div className="min-h-screen bg-gradient-warm">
        {/* Navigation Header */}
        <nav className="border-b border-border/50 bg-card/80 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
                {t("yourSanctuary")}
              </h1>
              <div className="flex gap-2 items-center">
                <LanguageSwitcher />
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("signOut")}
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
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
                          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                          maxLength={8}
                          className="text-center text-lg font-mono"
                        />
                      </div>
                      <Button onClick={joinCouple} className="w-full" size="lg" disabled={inviteCode.length !== 8}>
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
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Partner Connection Card */}
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 shadow-glow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-romantic flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">Your Sanctuary</h2>
                      <p className="text-muted-foreground">
                        {coupleData.partner 
                          ? `Connected with ${coupleData.partner.full_name}`
                          : "Waiting for partner to join"}
                      </p>
                    </div>
                  </div>
                  {coupleData.partner && (
                    <div className="flex items-center gap-3 px-4 py-2 bg-card/50 rounded-lg">
                      <UserCircle className="w-5 h-5 text-primary" />
                      <span className="font-medium">{coupleData.partner.full_name}</span>
                    </div>
                  )}
                </div>

                {/* Invite Code Section */}
                <div className="bg-card/50 rounded-lg p-6 border-2 border-dashed border-primary/20">
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    {coupleData.partner ? "Your sanctuary code" : "Share this code with your partner"}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={coupleData.inviteCode}
                      readOnly
                      className="font-mono text-lg font-semibold text-center"
                    />
                    <Button onClick={copyInviteCode} variant="outline" size="icon">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button onClick={shareInvite} variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          Leave Sanctuary
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Leave this sanctuary?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove your connection to this sanctuary. You can rejoin later with an invite code.
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

              {/* Subscription Status & Upgrade */}
              {coupleData.partner && user && !subscriptionLoading && (
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Crown className={`w-6 h-6 ${isPremium ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                      <div>
                        <h3 className="font-semibold">
                          {isPremium ? 'Legacy Temple Member' : 'Everyday Sanctuary'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isPremium 
                            ? 'Access to all premium features' 
                            : 'Upgrade to unlock premium features like Desire Vault, Timeline & more'}
                        </p>
                      </div>
                    </div>
                    {!isPremium && (
                      <Button 
                        onClick={() => createCheckoutSession(user.email || '')}
                        className="bg-gradient-to-r from-primary to-accent"
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade - $9.99/mo
                      </Button>
                    )}
                  </div>
                </Card>
              )}

              {/* Quick Actions & Messages */}
              {coupleData.partner && user && (
                <div className="space-y-6">
                  {/* Free Features */}
                  <MoodTracker 
                    coupleId={coupleData.coupleId} 
                    userId={user.id}
                    partnerName={coupleData.partner.full_name}
                  />
                  <CravingBoard 
                    coupleId={coupleData.coupleId} 
                    userId={user.id}
                    partnerName={coupleData.partner.full_name}
                  />
                  <MediaSharing 
                    coupleId={coupleData.coupleId} 
                    userId={user.id}
                    partnerName={coupleData.partner.full_name}
                  />
                  <MemoryCalendar 
                    coupleId={coupleData.coupleId} 
                    userId={user.id}
                    partnerName={coupleData.partner.full_name}
                  />
                  <LoveNotes 
                    coupleId={coupleData.coupleId} 
                    userId={user.id}
                    partnerName={coupleData.partner.full_name}
                  />
                  <QuickActions coupleId={coupleData.coupleId} userId={user.id} />
                  <DailyNotes 
                    coupleId={coupleData.coupleId} 
                    userId={user.id}
                    partnerName={coupleData.partner.full_name}
                  />
                  <RecentMessages 
                    coupleId={coupleData.coupleId} 
                    userId={user.id} 
                    partnerName={coupleData.partner.full_name}
                  />

                  {/* Premium Features */}
                  {isPremium ? (
                    <>
                      <div className="grid md:grid-cols-2 gap-6">
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
                      <PostsFeed 
                        coupleId={coupleData.coupleId} 
                        userId={user.id}
                      />
                      <CalmingTools />
                    </>
                  ) : (
                    <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5">
                      <Crown className="w-16 h-16 mx-auto mb-4 text-primary" />
                      <h3 className="text-2xl font-bold mb-2">Unlock Premium Features</h3>
                      <p className="text-muted-foreground mb-6">
                        Get access to Desire Vault, Shared Journal, Timeline, Love Languages, Posts, and Calming Tools
                      </p>
                      <Button 
                        size="lg"
                        onClick={() => createCheckoutSession(user.email || '')}
                        className="bg-gradient-to-r from-primary to-accent"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Upgrade to Legacy Temple - $9.99/month
                      </Button>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Dashboard;
