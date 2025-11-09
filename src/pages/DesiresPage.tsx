import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CravingBoard } from "@/components/CravingBoard";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DesiresPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string>("Partner");

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

    const { data: membership } = await supabase
      .from("couple_members")
      .select("couple_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (membership) {
      setCoupleId(membership.couple_id);
      
      const { data: members } = await supabase
        .from("couple_members")
        .select("user_id, profiles(full_name)")
        .eq("couple_id", membership.couple_id)
        .neq("user_id", user.id);

      if (members && members[0] && members[0].profiles) {
        const profile = members[0].profiles as any;
        setPartnerName(profile.full_name || "Partner");
      }
    }
  };

  if (!user || !coupleId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-500/10 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">{t('desiresLabel')}</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Craving Board - This shows quick cravings */}
        <CravingBoard
          coupleId={coupleId}
          userId={user.id}
          partnerName={partnerName}
        />
      </div>
    </div>
  );
}
