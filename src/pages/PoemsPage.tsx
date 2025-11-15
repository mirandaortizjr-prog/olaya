import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Sparkles, Heart, Search } from "lucide-react";
import { StartPoemDialog } from "@/components/poems/StartPoemDialog";
import { ActivePoemCard } from "@/components/poems/ActivePoemCard";
import { CompletedPoemCard } from "@/components/poems/CompletedPoemCard";
import type { Database } from "@/integrations/supabase/types";

type PoemRow = Database["public"]["Tables"]["poems"]["Row"];

interface Poem extends Omit<PoemRow, "lines" | "tags"> {
  lines: Array<{ text: string; user_id: string; timestamp: string }>;
  tags: string[];
}

export default function PoemsPage() {
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchUserAndCouple();
  }, []);

  useEffect(() => {
    if (coupleId) {
      fetchPoems();
      subscribeToPoems();
    }
  }, [coupleId]);

  const fetchUserAndCouple = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUserId(user.id);

    const { data: member } = await supabase
      .from("couple_members")
      .select("couple_id")
      .eq("user_id", user.id)
      .single();

    if (member) {
      setCoupleId(member.couple_id);
    }
  };

  const fetchPoems = async () => {
    if (!coupleId) return;

    const { data, error } = await supabase
      .from("poems")
      .select("*")
      .eq("couple_id", coupleId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error loading poems",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPoems((data || []) as Poem[]);
    }
    setLoading(false);
  };

  const subscribeToPoems = () => {
    const channel = supabase
      .channel("poems-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "poems",
          filter: `couple_id=eq.${coupleId}`,
        },
        () => {
          fetchPoems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const activePoems = poems.filter((p) => p.status === "Active");
  const completedPoems = poems.filter((p) => p.status === "Completed");

  const filteredCompletedPoems = completedPoems.filter((poem) => {
    const matchesSearch =
      poem.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poem.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || poem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center">
        <p className="text-muted-foreground">Loading poems...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-20">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Our Poems
            </h1>
          </div>
          <Button onClick={() => setShowStartDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Poem
          </Button>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active ({activePoems.length})
            </TabsTrigger>
            <TabsTrigger value="gallery">
              Gallery ({completedPoems.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activePoems.length === 0 ? (
              <Card className="p-12 text-center">
                <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  No active poems
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Start writing a poem together with your partner
                </p>
                <Button onClick={() => setShowStartDialog(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Start Your First Poem
                </Button>
              </Card>
            ) : (
              activePoems.map((poem) => (
                <ActivePoemCard
                  key={poem.id}
                  poem={poem}
                  userId={userId!}
                  onUpdate={fetchPoems}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">All Categories</option>
                <option value="Funny">Funny</option>
                <option value="Romantic">Romantic</option>
                <option value="Kinky">Kinky</option>
                <option value="Deep">Deep</option>
                <option value="Wildcard">Wildcard</option>
                <option value="FreePlay">FreePlay</option>
              </select>
            </div>

            {filteredCompletedPoems.length === 0 ? (
              <Card className="p-12 text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-lg font-medium text-muted-foreground">
                  No completed poems yet
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredCompletedPoems.map((poem) => (
                  <CompletedPoemCard
                    key={poem.id}
                    poem={poem}
                    userId={userId!}
                    onUpdate={fetchPoems}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <StartPoemDialog
        open={showStartDialog}
        onOpenChange={setShowStartDialog}
        coupleId={coupleId!}
        userId={userId!}
        onSuccess={fetchPoems}
      />
    </div>
  );
}
