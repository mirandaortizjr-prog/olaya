import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const getDesireCategories = () => [
  {
    title: "Emotional & Relational Desires",
    emoji: "💗",
    color: "from-pink-500 to-red-600",
    desires: [
      "Quality time", "Undivided attention", "Deep talk", "Light banter",
      "Reassurance", "Validation", "Affection", "Loyalty", "Playfulness",
      "Shared silence", "Eye contact", "Inside joke", "Ritual check-in",
      "Tell me you love me", "Say my name", "Miss me", "Choose me", "Be proud of me"
    ]
  },
  {
    title: "Sensory & Physical Desires",
    emoji: "🔥",
    color: "from-orange-500 to-red-600",
    desires: [
      "Yum yum (food play or craving)", "Coffee", "Chocolate", "Wine night",
      "Skin contact", "Oral", "Backdoor", "Neck kiss", "Lip bite",
      "Breath on skin", "Touch me here", "Undress me", "Watch me",
      "Tease me", "Pin me", "Straddle me", "Lap sit", "Slow dance",
      "Make me beg", "Let me please you"
    ]
  },
  {
    title: "Comfort & Care Desires",
    emoji: "🔥",
    color: "from-blue-500 to-cyan-600",
    desires: [
      "A hug", "A kiss", "Cuddle", "Backrub", "Head scratch",
      "Blanket tuck", "Warm drink", "Foot massage", "Hair play",
      "Shoulder squeeze", "Hand hold", "Nap together", "Bath run for me",
      "Cook for me", "Tuck me in", "Sing to me", "Gentle wake-up", "Just stay"
    ]
  },
  {
    title: "Playful & Mischievous Desires",
    emoji: "💫",
    color: "from-purple-500 to-pink-600",
    desires: [
      "Flirt with me", "Chase me", "Steal a kiss", "Dare me",
      "Roleplay", "Secret photo", "Naughty text", "Surprise me",
      "Hide and seek", "Make me blush", "Be my distraction", "Interrupt me",
      "Tempt me", "Catch me", "Mess up my hair"
    ]
  }
];

export const DesiresPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDesires, setSelectedDesires] = useState<string[]>([]);
  const [customDesire, setCustomDesire] = useState("");
  const [personalizedDesires, setPersonalizedDesires] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userId && coupleId) {
      loadPersonalizedDesires();
    }
  }, [userId, coupleId]);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      
      const { data: membership } = await supabase
        .from('couple_members')
        .select('couple_id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (membership) {
        setCoupleId(membership.couple_id);
      }
    }
  };

  const loadPersonalizedDesires = async () => {
    if (!userId || !coupleId) return;

    const { data } = await supabase
      .from('couple_preferences')
      .select('enabled_items')
      .eq('couple_id', coupleId)
      .eq('preference_type', 'desires')
      .maybeSingle();

    if (data?.enabled_items) {
      const items = Array.isArray(data.enabled_items) ? data.enabled_items as string[] : [];
      setPersonalizedDesires(items);
      setSelectedDesires(items);
    }
  };

  const toggleDesireSelection = (desire: string) => {
    setSelectedDesires(prev => {
      if (prev.includes(desire)) {
        return prev.filter(d => d !== desire);
      } else {
        if (prev.length >= 20) {
          toast({
            title: "Maximum reached",
            description: "You can select up to 20 desires",
            variant: "destructive",
          });
          return prev;
        }
        return [...prev, desire];
      }
    });
  };

  const savePersonalizedDesires = async () => {
    if (!userId || !coupleId) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    const { error } = await supabase
      .from('couple_preferences')
      .upsert({
        couple_id: coupleId,
        preference_type: 'desires',
        enabled_items: selectedDesires as any,
      });

    setIsSaving(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save desires",
        variant: "destructive",
      });
    } else {
      setPersonalizedDesires(selectedDesires);
      toast({
        title: "Success",
        description: "Your desires have been saved",
      });
    }
  };

  const sendDesire = async (desireText: string) => {
    if (!userId || !coupleId) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('posts')
      .insert({
        author_id: userId,
        couple_id: coupleId,
        content: `💗 ${desireText}`,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send desire",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Desire sent!",
        description: "Your partner will see your desire in the gallery",
      });
    }
  };

  const saveCustomDesire = async () => {
    if (!customDesire.trim()) {
      toast({
        title: "Empty desire",
        description: "Please enter a custom desire",
        variant: "destructive",
      });
      return;
    }

    await sendDesire(customDesire);
    setCustomDesire("");
  };

  const categories = getDesireCategories();

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #000000 0%, #798791 50%, #000000 100%)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-black/30 border-b border-white/10">
        <div className="flex items-center justify-between p-4 max-w-lg mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold text-white">Desires</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-lg mx-auto p-6 space-y-6">
        {/* Personalized Desires */}
        {personalizedDesires.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Your Personalized Desires ({personalizedDesires.length}/20)
            </h2>
            <div className="flex flex-wrap gap-2">
              {personalizedDesires.map((desire) => (
                <Button
                  key={desire}
                  variant="secondary"
                  size="sm"
                  onClick={() => sendDesire(desire)}
                  className="bg-white/10 text-white hover:bg-white/20 border border-white/20"
                >
                  {desire}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        {selectedDesires.length > 0 && (
          <Button
            onClick={savePersonalizedDesires}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
          >
            {isSaving ? "Saving..." : `Save Selection (${selectedDesires.length}/20)`}
          </Button>
        )}

        {/* Desire Categories */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.title} className="space-y-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <span>{category.emoji}</span>
                <span>{category.title}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.desires.map((desire) => {
                  const isSelected = selectedDesires.includes(desire);
                  return (
                    <Button
                      key={desire}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDesireSelection(desire)}
                      className={`text-xs ${
                        isSelected
                          ? `bg-gradient-to-r ${category.color} text-white border-none hover:opacity-90`
                          : 'bg-white/5 text-white/80 hover:bg-white/10 border-white/20'
                      }`}
                    >
                      {desire}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Desire */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <h3 className="text-base font-semibold text-white">Custom Desire</h3>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Type your custom desire..."
              value={customDesire}
              onChange={(e) => setCustomDesire(e.target.value)}
              className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
              onKeyDown={(e) => e.key === 'Enter' && saveCustomDesire()}
            />
            <Button
              onClick={saveCustomDesire}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
