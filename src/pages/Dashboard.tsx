import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { QuickActions } from "@/components/QuickActions";
import { RecentMessages } from "@/components/RecentMessages";
import { requestNotificationPermission } from "@/utils/notifications";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Link2, LogOut, Copy, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [coupleData, setCoupleData] = useState<any>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  useEffect(() => {
    checkUser();
    
    // Request notification permission when user logs in
    requestNotificationPermission().then((granted) => {
      if (granted) {
        console.log('Notification permission granted');
      }
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUser = async () => {
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
      // Check if user is part of a couple
      const { data: membership, error: memberError } = await supabase
        .from("couple_members")
        .select("couple_id, couples(id, invite_code)")
        .eq("user_id", userId)
        .maybeSingle();

      if (memberError) throw memberError;

      if (membership) {
        // Get partner info
        const { data: members, error: membersError } = await supabase
          .from("couple_members")
          .select("user_id, profiles(full_name, email)")
          .eq("couple_id", membership.couple_id)
          .neq("user_id", userId);

        if (membersError) throw membersError;

        setCoupleData({
          coupleId: membership.couple_id,
          inviteCode: membership.couples.invite_code,
          partner: members?.[0] || null,
        });
      }
    } catch (error: any) {
      console.error("Error fetching couple data:", error);
    }
  };

  const createCouple = async () => {
    if (!user) return;
    
    try {
      const code = await generateInviteCode();
      
      const { error: coupleError } = await supabase
        .from("couples")
        .insert({ invite_code: code });

      if (coupleError) throw coupleError;

      await fetchCoupleData(user.id);
      
      toast({
        title: t("sanctuaryCreated"),
        description: t("shareInviteCode"),
      });
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateInviteCode = async () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const joinCouple = async () => {
    if (!user || !inviteCode) return;

    try {
      const { data: couple, error: coupleError } = await supabase
        .from("couples")
        .select("id")
        .eq("invite_code", inviteCode.toUpperCase())
        .single();

      if (coupleError || !couple) {
        toast({
          title: t("invalidCode"),
          description: t("invalidCodeDesc"),
          variant: "destructive",
        });
        return;
      }

      const { error: memberError } = await supabase
        .from("couple_members")
        .insert({ couple_id: couple.id, user_id: user.id });

      if (memberError) throw memberError;

      await fetchCoupleData(user.id);
      setInviteCode("");
      
      toast({
        title: t("connected"),
        description: t("connectedDesc"),
      });
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyInviteCode = () => {
    if (coupleData?.inviteCode) {
      navigator.clipboard.writeText(coupleData.inviteCode);
      toast({
        title: t("copied"),
        description: t("copiedDesc"),
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
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
    <div className="min-h-screen bg-gradient-warm p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
            {t("yourSanctuary")}
          </h1>
          <div className="flex gap-2">
            <LanguageSwitcher />
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              {t("signOut")}
            </Button>
          </div>
        </div>

        {!coupleData ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 shadow-soft">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{t("createYourSpace")}</h2>
                  <p className="text-muted-foreground">
                    {t("createSpaceDesc")}
                  </p>
                </div>
                <Button onClick={createCouple} className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  {t("createSanctuaryBtn")}
                </Button>
              </div>
            </Card>

            <Card className="p-8 shadow-soft">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                  <Link2 className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{t("joinYourPartner")}</h2>
                  <p className="text-muted-foreground">
                    {t("joinPartnerDesc")}
                  </p>
                </div>
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="inviteCode">{t("inviteCode")}</Label>
                    <Input
                      id="inviteCode"
                      placeholder={t("inviteCodePlaceholder")}
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      maxLength={8}
                    />
                  </div>
                  <Button onClick={joinCouple} className="w-full" disabled={!inviteCode}>
                    <Link2 className="w-4 h-4 mr-2" />
                    {t("joinSanctuaryBtn")}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 shadow-glow">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-romantic flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">{t("yourSanctuary")}</h2>
                    <p className="text-muted-foreground text-sm">
                      {coupleData.partner 
                        ? `${t("connectedWith")} ${coupleData.partner.profiles?.full_name || coupleData.partner.profiles?.email}`
                        : t("waitingForPartner")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 rounded-lg p-6 border-2 border-dashed border-primary/20">
                <Label className="text-sm text-muted-foreground mb-2 block">
                  {t("shareThisCode")}
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={coupleData.inviteCode}
                    readOnly
                    className="font-mono text-lg font-semibold"
                  />
                  <Button onClick={copyInviteCode} variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {coupleData.partner && (
              <div className="space-y-6">
                <QuickActions coupleId={coupleData.coupleId} userId={user.id} />
                
                <RecentMessages 
                  coupleId={coupleData.coupleId} 
                  userId={user.id}
                  partnerName={coupleData.partner?.profiles?.full_name || coupleData.partner?.profiles?.email}
                />
                
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-6 hover:shadow-soft transition-shadow cursor-pointer">
                    <h3 className="font-semibold mb-2">{t("dailyNotes")}</h3>
                    <p className="text-sm text-muted-foreground">{t("dailyNotesDesc")}</p>
                  </Card>
                  <Card className="p-6 hover:shadow-soft transition-shadow cursor-pointer">
                    <h3 className="font-semibold mb-2">{t("loveNotes")}</h3>
                    <p className="text-sm text-muted-foreground">{t("loveNotesDesc")}</p>
                  </Card>
                  <Card className="p-6 hover:shadow-soft transition-shadow cursor-pointer">
                    <h3 className="font-semibold mb-2">{t("memories")}</h3>
                    <p className="text-sm text-muted-foreground">{t("memoriesDesc")}</p>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
