import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Desire {
  emoji: string;
  label: string;
  category: string;
}

const allDesires: Desire[] = [
  // Emotional & Relational Desires
  { emoji: "💗", label: "Quality time", category: "Emotional & Relational" },
  { emoji: "💗", label: "Undivided attention", category: "Emotional & Relational" },
  { emoji: "💗", label: "Deep talk", category: "Emotional & Relational" },
  { emoji: "💗", label: "Compliment", category: "Emotional & Relational" },
  { emoji: "💗", label: "Reassurance", category: "Emotional & Relational" },
  { emoji: "💗", label: "Validation", category: "Emotional & Relational" },
  { emoji: "💗", label: "Affection", category: "Emotional & Relational" },
  { emoji: "💗", label: "Loyalty", category: "Emotional & Relational" },
  { emoji: "💗", label: "Love you text", category: "Emotional & Relational" },
  { emoji: "💗", label: "Shared silence", category: "Emotional & Relational" },
  { emoji: "💗", label: "Eye contact", category: "Emotional & Relational" },
  { emoji: "💗", label: "Hand hold", category: "Emotional & Relational" },
  { emoji: "💗", label: "Ritual check-in", category: "Emotional & Relational" },
  { emoji: "💗", label: "Tell me you love me", category: "Emotional & Relational" },
  { emoji: "💗", label: "Say my name", category: "Emotional & Relational" },
  { emoji: "💗", label: "Miss me", category: "Emotional & Relational" },
  { emoji: "💗", label: "Need me", category: "Emotional & Relational" },
  { emoji: "💗", label: "Be proud of me", category: "Emotional & Relational" },

  // Sensory & Physical Desires
  { emoji: "🧡", label: "Yum yum (food play or craving)", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Coffee", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Chocolate", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Massage", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Skin contact", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Oral", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Backdoor", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Neck kiss", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Lip kiss", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Breath on skin", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Touch my here", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Sniff me", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Watch me", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Tease me", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Pin me", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Straddle me", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Grind", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Slow dance", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Make me beg", category: "Sensory & Physical" },
  { emoji: "🧡", label: "Let me please you", category: "Sensory & Physical" },

  // Comfort & Care Desires
  { emoji: "🤎", label: "A hug", category: "Comfort & Care" },
  { emoji: "🤎", label: "A kiss", category: "Comfort & Care" },
  { emoji: "🤎", label: "Cuddle", category: "Comfort & Care" },
  { emoji: "🤎", label: "Backtub", category: "Comfort & Care" },
  { emoji: "🤎", label: "Head scratch", category: "Comfort & Care" },
  { emoji: "🤎", label: "Blanket tuck", category: "Comfort & Care" },
  { emoji: "🤎", label: "Warm drink", category: "Comfort & Care" },
  { emoji: "🤎", label: "Favorite meal", category: "Comfort & Care" },
  { emoji: "🤎", label: "Hair play", category: "Comfort & Care" },
  { emoji: "🤎", label: "Shoulder squeeze", category: "Comfort & Care" },
  { emoji: "🤎", label: "Hand hold", category: "Comfort & Care" },
  { emoji: "🤎", label: "Nap together", category: "Comfort & Care" },
  { emoji: "🤎", label: "Sing to me", category: "Comfort & Care" },
  { emoji: "🤎", label: "Cook for me", category: "Comfort & Care" },
  { emoji: "🤎", label: "Tuck me in", category: "Comfort & Care" },
  { emoji: "🤎", label: "Bath time", category: "Comfort & Care" },
  { emoji: "🤎", label: "Gentle wake-up", category: "Comfort & Care" },
  { emoji: "🤎", label: "Just stay", category: "Comfort & Care" },

  // Playful & Mischievous Desires
  { emoji: "💛", label: "Flirt with me", category: "Playful & Mischievous" },
  { emoji: "💛", label: "Chase me", category: "Playful & Mischievous" },
  { emoji: "💛", label: "Seduce me", category: "Playful & Mischievous" },
  { emoji: "💛", label: "Dare me", category: "Playful & Mischievous" },
  { emoji: "💛", label: "Roleplay", category: "Playful & Mischievous" },
  { emoji: "💛", label: "Blindfold", category: "Playful & Mischievous" },
  { emoji: "💛", label: "Naughty text", category: "Playful & Mischievous" },
  { emoji: "💛", label: "Surprise me", category: "Playful & Mischievous" },
  { emoji: "💛", label: "Hide and seek", category: "Playful & Mischievous" },
  { emoji: "💛", label: "Make me blush", category: "Playful & Mischievous" },
  { emoji: "💛", label: "Tease me more", category: "Playful & Mischievous" },
  { emoji: "💛", label: "Interrupt me", category: "Playful & Mischievous" },
  { emoji: "💛", label: "Tempt me", category: "Playful & Mischievous" },
  { emoji: "💛", label: "Catch me", category: "Playful & Mischievous" },
  { emoji: "💛", label: "Meet up my hair", category: "Playful & Mischievous" },
];

export default function DesiresPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [customDesires, setCustomDesires] = useState<Desire[]>([]);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [newDesireEmoji, setNewDesireEmoji] = useState("");
  const [newDesireLabel, setNewDesireLabel] = useState("");

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
      loadCustomDesires(membership.couple_id);
    }
  };

  const loadCustomDesires = async (coupleId: string) => {
    const { data } = await supabase
      .from("couple_preferences")
      .select("enabled_items")
      .eq("couple_id", coupleId)
      .eq("preference_type", "custom_desires")
      .single();

    if (data?.enabled_items && Array.isArray(data.enabled_items)) {
      setCustomDesires(data.enabled_items as unknown as Desire[]);
    }
  };

  const saveCustomDesires = async (desires: Desire[]) => {
    if (!coupleId) return;

    const { error } = await supabase
      .from("couple_preferences")
      .upsert(
        {
          couple_id: coupleId,
          preference_type: "custom_desires",
          enabled_items: desires as any,
        },
        {
          onConflict: "couple_id,preference_type",
        }
      );

    if (error) {
      toast({ title: "Error saving custom desires", variant: "destructive" });
    } else {
      toast({ title: "Custom desires saved!" });
    }
  };

  const addCustomDesire = () => {
    if (!newDesireEmoji || !newDesireLabel) {
      toast({ title: "Please add both emoji and label", variant: "destructive" });
      return;
    }

    if (customDesires.length >= 10) {
      toast({ title: "Maximum 10 personalized desires", variant: "destructive" });
      return;
    }

    const newDesire: Desire = {
      emoji: newDesireEmoji,
      label: newDesireLabel,
      category: "Personalized",
    };

    const updated = [...customDesires, newDesire];
    setCustomDesires(updated);
    saveCustomDesires(updated);
    setNewDesireEmoji("");
    setNewDesireLabel("");
  };

  const deleteCustomDesire = (index: number) => {
    const updated = customDesires.filter((_, i) => i !== index);
    setCustomDesires(updated);
    saveCustomDesires(updated);
  };

  const sendDesire = async (desire: Desire) => {
    if (!coupleId || !user) return;

    const { error } = await supabase
      .from("craving_board")
      .insert({
        couple_id: coupleId,
        user_id: user.id,
        craving_type: desire.label,
        custom_message: desire.emoji,
      });

    if (error) {
      toast({ title: "Error sending desire", variant: "destructive" });
    } else {
      toast({ title: `${desire.emoji} ${desire.label} sent!` });
    }
  };

  const categories = [
    { name: "Emotional & Relational", icon: "💗" },
    { name: "Sensory & Physical", icon: "🧡" },
    { name: "Comfort & Care", icon: "🤎" },
    { name: "Playful & Mischievous", icon: "💛" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 via-red-900 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Desires</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Custom Desires */}
        {customDesires.length > 0 && (
          <section className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 p-4">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Personalized
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {customDesires.map((desire, index) => (
                <div key={index} className="relative group">
                  <Button
                    variant="outline"
                    className="w-full bg-white/5 border-white/20 hover:bg-white/10 text-white h-auto py-3 justify-start"
                    onClick={() => sendDesire(desire)}
                  >
                    <span className="text-2xl mr-2">{desire.emoji}</span>
                    <span className="text-sm">{desire.label}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteCustomDesire(index)}
                  >
                    <span className="text-xs text-white">×</span>
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Desires by Category */}
        {categories.map((category) => (
          <section
            key={category.name}
            className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 p-4"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              {category.name} Desires
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {allDesires
                .filter((d) => d.category === category.name)
                .map((desire, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="bg-white/5 border-white/20 hover:bg-white/10 text-white h-auto py-3 justify-start"
                    onClick={() => sendDesire(desire)}
                  >
                    <span className="text-2xl mr-2">{desire.emoji}</span>
                    <span className="text-sm">{desire.label}</span>
                  </Button>
                ))}
            </div>
          </section>
        ))}

        {/* Personalize Button */}
        <div className="pb-20">
          <Button
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-14"
            onClick={() => setShowPersonalize(true)}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Personalize (Add up to 10 custom desires)
          </Button>
        </div>
      </div>

      {/* Personalize Dialog */}
      <Dialog open={showPersonalize} onOpenChange={setShowPersonalize}>
        <DialogContent className="bg-black/90 text-white border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Add Custom Desire</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Emoji</label>
              <Input
                placeholder="💖"
                value={newDesireEmoji}
                onChange={(e) => setNewDesireEmoji(e.target.value)}
                maxLength={2}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-white/70 mb-2 block">Label</label>
              <Input
                placeholder="Your custom desire"
                value={newDesireLabel}
                onChange={(e) => setNewDesireLabel(e.target.value)}
                maxLength={30}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <p className="text-xs text-white/50">
              {customDesires.length}/10 custom desires
            </p>
            <Button
              className="w-full bg-white/20 hover:bg-white/30 text-white"
              onClick={addCustomDesire}
            >
              Add Desire
            </Button>
          </div>

          {customDesires.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-semibold text-white/70">Your Custom Desires:</h3>
              {customDesires.map((desire, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white/5 rounded p-2"
                >
                  <span className="text-sm">
                    {desire.emoji} {desire.label}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCustomDesire(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-white/10"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
