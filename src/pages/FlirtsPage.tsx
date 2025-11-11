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
  // inline mode no modal needed
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
    <div className="min-h-screen pb-10" style={{ background: 'linear-gradient(to bottom, #672487, #000000)' }}>
      <header className="p-4 border-b bg-black/20 backdrop-blur-sm flex items-center justify-between max-w-lg mx-auto">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Flirts
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>Close</Button>
        </div>
      </header>

      {/* Inline flirts grid */}
      <main className="max-w-lg mx-auto p-4">
        <FlirtActions
          coupleId={coupleId}
          senderId={userId}
          inline
        />
      </main>

      {/* Flirts history */}
      <main className="max-w-lg mx-auto p-4">
        <section aria-labelledby="flirts-history-heading" className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
          <header className="flex items-center justify-between p-4 border-b">
            <h2 id="flirts-history-heading" className="text-base font-semibold">Recent Flirts</h2>
            <span className="text-xs text-muted-foreground">{flirts.length} total</span>
          </header>
          <ScrollArea className="max-h-[70vh]">
            <ul className="divide-y">
              {flirts.length === 0 ? (
                <li className="p-4 text-sm text-muted-foreground">
                  No flirts yet. Tap “Send” to start flirting.
                </li>
              ) : (
                flirts.map(f => {
                  const meta = FLIRT_ICONS[f.flirt_type] || { emoji: "💌", label: f.flirt_type };
                  const isYou = f.sender_id === userId;
                  return (
                    <li key={f.id} className="p-4 flex items-center gap-3">
                      <span className="text-xl" aria-hidden>{meta.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{isYou ? "You" : "Partner"}</span>{" "}
                          sent <span className="font-medium">{meta.label}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(f.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </ScrollArea>
        </section>
      </main>
    </div>
  );
}
