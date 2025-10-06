import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DailyNotes } from "@/components/DailyNotes";
import { useLanguage } from "@/contexts/LanguageContext";

const DailyNotesPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string>("Partner");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      setUserId(user.id);

      const { data: memberData } = await supabase
        .from("couple_members")
        .select("couple_id")
        .eq("user_id", user.id)
        .single();

      if (memberData?.couple_id) {
        setCoupleId(memberData.couple_id);

        // Get partner info via RPC
        const { data: partner } = await supabase.rpc(
          "get_partner_profile",
          { c_id: memberData.couple_id }
        );

        if (partner && Array.isArray(partner) && partner.length > 0) {
          setPartnerName(partner[0].full_name || "Partner");
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!coupleId || !userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center">
        <div className="text-lg text-muted-foreground">No couple data found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <DailyNotes 
          coupleId={coupleId} 
          userId={userId} 
          partnerName={partnerName}
        />
      </div>
    </div>
  );
};

export default DailyNotesPage;
