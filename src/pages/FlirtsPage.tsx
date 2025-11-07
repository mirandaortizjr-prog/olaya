import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FlirtActions } from "@/components/FlirtActions";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flame } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Simple standalone page that opens the Instant Flirt UI
// and ensures proper routing. It mirrors the modal layout but as a page route.

export default function FlirtsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  type FlirtRow = { id: string; flirt_type: string; sender_id: string; created_at: string };
  const [flirts, setFlirts] = useState<FlirtRow[]>([]);
  const FLIRT_ICONS: Record<string, { emoji: string; label: string }> = {
    wink: { emoji: "😉", label: "Wink" },
    kiss: { emoji: "💋", label: "Kiss" },
    bite: { emoji: "🦷", label: "Bite" },
    lick: { emoji: "👅", label: "Lick" },
    heart: { emoji: "❤️", label: "Hearts" },
    fire: { emoji: "🔥", label: "Fire" },
  };

useEffect(() => {
    document.title = "Flirts • OLAYA"; // SEO page title
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id || null;
      if (!uid) {
        navigate("/auth");
        return;
      }
      setUserId(uid);

      const { data: membership } = await supabase
        .from("couple_members")
        .select("couple_id")
        .eq("user_id", uid)
        .maybeSingle();

      if (!membership?.couple_id) {
        navigate("/dashboard");
        return;
      }
      setCoupleId(membership.couple_id);
      setLoading(false);
    };
    init();
  }, [navigate]);

  useEffect(() => {
    if (!coupleId) return;
    const fetchFlirts = async () => {
      const { data } = await supabase
        .from('flirts')
        .select('*')
        .eq('couple_id', coupleId)
        .order('created_at', { ascending: false })
        .limit(100);
      setFlirts(data || []);
    };
    fetchFlirts();

    const channel = supabase
      .channel('flirts-page')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'flirts', filter: `couple_id=eq.${coupleId}` },
        (payload) => {
          setFlirts(prev => [payload.new as any, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  if (loading || !userId || !coupleId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-muted pb-10">
      <header className="p-4 border-b bg-card flex items-center justify-between max-w-lg mx-auto">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Flirts
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            <Flame className="w-4 h-4 mr-2" /> Send
          </Button>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>Close</Button>
        </div>
      </header>

      {/* Open the same Flirt dialog UI so users get identical experience */}
      <FlirtActions
        coupleId={coupleId}
        senderId={userId}
        open={open}
        onClose={() => {
          setOpen(false);
          navigate("/dashboard");
        }}
      />

      {/* Fallback instructions if dialog is closed */}
      {!open && (
        <main className="max-w-lg mx-auto p-4">
          <p className="text-muted-foreground">Tap the flame button to send a flirt.</p>
          <Button className="mt-4" onClick={() => setOpen(true)}>
            <Flame className="w-4 h-4 mr-2" /> Open Instant Flirt
          </Button>
        </main>
      )}
    </div>
  );
}
