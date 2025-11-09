import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, CheckCircle2, MessageCircle, Sparkles, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Fantasy {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: 'wishlist' | 'consider' | 'approved' | 'denied' | 'fulfilled';
  created_at: string;
  fulfilled_at?: string;
  user_id: string;
}

export default function DesiresPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [fantasies, setFantasies] = useState<Fantasy[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

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
      .single();

    if (membership) {
      setCoupleId(membership.couple_id);
      loadFantasies(membership.couple_id);
    }
  };

  const loadFantasies = async (coupleId: string) => {
    const { data } = await supabase
      .from("desire_vault")
      .select("*")
      .eq("couple_id", coupleId)
      .order("created_at", { ascending: false });

    if (data) {
      setFantasies(data.map(d => ({
        id: d.id,
        title: d.title,
        description: d.description || undefined,
        category: d.category,
        status: d.fulfilled ? 'fulfilled' : (
          d.category === 'approved' ? 'approved' : 
          d.category === 'denied' ? 'denied' : 
          d.category === 'consider' ? 'consider' : 
          'wishlist'
        ),
        created_at: d.created_at,
        fulfilled_at: d.fulfilled_at || undefined,
        user_id: d.user_id,
      })));
    }
  };

  const addFantasy = async () => {
    if (!coupleId || !user || !newTitle.trim()) {
      toast({ title: "Please enter a title", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from("desire_vault")
      .insert({
        couple_id: coupleId,
        user_id: user.id,
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        category: 'wishlist',
        is_private: false,
        fulfilled: false,
      });

    if (error) {
      toast({ title: "Error adding fantasy", variant: "destructive" });
      return;
    }

    toast({ title: "Fantasy added to wishlist!" });
    setNewTitle("");
    setNewDescription("");
    setShowAddDialog(false);
    loadFantasies(coupleId);
  };

  const updateStatus = async (fantasyId: string, newStatus: 'wishlist' | 'consider' | 'approved' | 'denied' | 'fulfilled') => {
    if (!coupleId) return;

    const updates: any = {
      category: newStatus,
    };

    if (newStatus === 'fulfilled') {
      updates.fulfilled = true;
      updates.fulfilled_at = new Date().toISOString();
    } else {
      updates.fulfilled = false;
      updates.fulfilled_at = null;
    }

    const { error } = await supabase
      .from("desire_vault")
      .update(updates)
      .eq("id", fantasyId);

    if (error) {
      toast({ title: "Error updating status", variant: "destructive" });
      return;
    }

    toast({ title: "Status updated!" });
    loadFantasies(coupleId);
  };

  const deleteFantasy = async (fantasyId: string) => {
    const { error } = await supabase
      .from("desire_vault")
      .delete()
      .eq("id", fantasyId);

    if (!error) {
      toast({ title: "Fantasy deleted" });
      loadFantasies(coupleId!);
    }
  };

  const wishlistFantasies = fantasies.filter(f => f.status === 'wishlist');
  const considerFantasies = fantasies.filter(f => f.status === 'consider');
  const approvedFantasies = fantasies.filter(f => f.status === 'approved');
  const deniedFantasies = fantasies.filter(f => f.status === 'denied');
  const fulfilledFantasies = fantasies.filter(f => f.status === 'fulfilled');

  const renderFantasyCard = (fantasy: Fantasy, actions: JSX.Element) => (
    <div
      key={fantasy.id}
      className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all"
    >
      <h3 className="text-white font-semibold text-lg mb-2">{fantasy.title}</h3>
      {fantasy.description && (
        <p className="text-white/70 text-sm mb-3">{fantasy.description}</p>
      )}
      <div className="flex gap-2 flex-wrap">
        {actions}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteFantasy(fantasy.id)}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-fantasy-black via-fantasy-purple-dark to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Fantasies</h1>
          <Button
            size="icon"
            onClick={() => setShowAddDialog(true)}
            className="bg-fantasy-skyblue hover:bg-fantasy-skyblue-dark"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Content - 5 Sections Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Row 1: Wishlist, Discuss, Approved */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Section 1: Wishlist */}
          <Card className="border-fantasy-skyblue/30 bg-fantasy-wishlist shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Wishlist
                <span className="ml-auto text-sm font-normal text-white/70">
                  {wishlistFantasies.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {wishlistFantasies.length === 0 ? (
                <p className="text-white/50 text-center py-8">No wishes yet</p>
              ) : (
                wishlistFantasies.map(fantasy =>
                  renderFantasyCard(
                    fantasy,
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(fantasy.id, 'consider')}
                        className="bg-fantasy-purple hover:bg-fantasy-purple-dark"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Discuss
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(fantasy.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(fantasy.id, 'denied')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Deny
                      </Button>
                    </>
                  )
                )
              )}
            </CardContent>
          </Card>

          {/* Section 2: Consider & Talk About */}
          <Card className="border-fantasy-purple/30 bg-fantasy-consider shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                To Discuss
                <span className="ml-auto text-sm font-normal text-white/70">
                  {considerFantasies.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {considerFantasies.length === 0 ? (
                <p className="text-white/50 text-center py-8">Nothing to discuss</p>
              ) : (
                considerFantasies.map(fantasy =>
                  renderFantasyCard(
                    fantasy,
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(fantasy.id, 'wishlist')}
                        className="bg-fantasy-skyblue/80 hover:bg-fantasy-skyblue"
                      >
                        Back
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(fantasy.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(fantasy.id, 'denied')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Deny
                      </Button>
                    </>
                  )
                )
              )}
            </CardContent>
          </Card>

          {/* Section 3: Approved to Fulfill */}
          <Card className="border-fantasy-purple-dark/30 bg-fantasy-approved shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Approved
                <span className="ml-auto text-sm font-normal text-white/70">
                  {approvedFantasies.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {approvedFantasies.length === 0 ? (
                <p className="text-white/50 text-center py-8">Nothing approved yet</p>
              ) : (
                approvedFantasies.map(fantasy =>
                  renderFantasyCard(
                    fantasy,
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(fantasy.id, 'consider')}
                        className="bg-fantasy-purple/80 hover:bg-fantasy-purple"
                      >
                        Back
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(fantasy.id, 'fulfilled')}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Fulfilled
                      </Button>
                    </>
                  )
                )
              )}
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Denied and Fulfilled */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Section 4: Denied */}
          <Card className="border-red-500/30 bg-gradient-to-br from-red-900/30 to-black shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-xl">❌</span>
                Denied
                <span className="ml-auto text-sm font-normal text-white/70">
                  {deniedFantasies.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {deniedFantasies.length === 0 ? (
                <p className="text-white/50 text-center py-8">No denied fantasies</p>
              ) : (
                deniedFantasies.map(fantasy =>
                  renderFantasyCard(
                    fantasy,
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(fantasy.id, 'wishlist')}
                        className="bg-fantasy-skyblue/80 hover:bg-fantasy-skyblue"
                      >
                        Reconsider
                      </Button>
                    </>
                  )
                )
              )}
            </CardContent>
          </Card>

          {/* Section 5: Fulfilled Log */}
          <Card className="border-white/10 bg-fantasy-fulfilled shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <History className="w-5 h-5" />
                Fulfilled
                <span className="ml-auto text-sm font-normal text-white/70">
                  {fulfilledFantasies.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {fulfilledFantasies.length === 0 ? (
                <p className="text-white/50 text-center py-8">No fulfilled fantasies yet</p>
              ) : (
                fulfilledFantasies.map(fantasy =>
                  renderFantasyCard(
                    fantasy,
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(fantasy.id, 'approved')}
                        className="bg-white/10 hover:bg-white/20"
                      >
                        Undo
                      </Button>
                      {fantasy.fulfilled_at && (
                        <span className="text-xs text-white/50">
                          {new Date(fantasy.fulfilled_at).toLocaleDateString()}
                        </span>
                      )}
                    </>
                  )
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Fantasy Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-gradient-to-br from-fantasy-skyblue-dark to-fantasy-purple-dark border-fantasy-skyblue/30">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Add New Fantasy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/90 mb-2 block font-medium">Title</label>
              <Input
                placeholder="What's your fantasy?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            <div>
              <label className="text-sm text-white/90 mb-2 block font-medium">Description (Optional)</label>
              <Textarea
                placeholder="Add more details..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-24"
              />
            </div>
            <Button
              className="w-full bg-fantasy-skyblue hover:bg-fantasy-skyblue-dark text-white font-semibold"
              onClick={addFantasy}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Wishlist
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
