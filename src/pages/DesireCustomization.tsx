import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const getDesireCategories = (t: any) => [
  {
    titleKey: "emotional_relational_desires",
    emoji: "💗",
    color: "from-pink-500 to-purple-500",
    desires: [
      { key: "quality_time", labelKey: "Quality time" },
      { key: "undivided_attention", labelKey: "Undivided attention" },
      { key: "deep_talk", labelKey: "Deep talk" },
      { key: "light_banter", labelKey: "Light banter" },
      { key: "reassurance", labelKey: "Reassurance" },
      { key: "validation", labelKey: "Validation" },
      { key: "affection", labelKey: "Affection" },
      { key: "loyalty", labelKey: "Loyalty" },
      { key: "playfulness", labelKey: "Playfulness" },
      { key: "shared_silence", labelKey: "Shared silence" },
      { key: "eye_contact", labelKey: "Eye contact" },
      { key: "inside_joke", labelKey: "Inside joke" },
      { key: "ritual_checkin", labelKey: "Ritual check-in" },
      { key: "tell_me_you_love_me", labelKey: "Tell me you love me" },
      { key: "say_my_name", labelKey: "Say my name" },
      { key: "miss_me", labelKey: "Miss me" },
      { key: "choose_me", labelKey: "Choose me" },
      { key: "be_proud_of_me", labelKey: "Be proud of me" },
    ]
  },
  {
    titleKey: "sensory_physical_desires",
    emoji: "🔥",
    color: "from-orange-500 to-red-500",
    desires: [
      { key: "yum_yum", labelKey: "Yum yum (food play or craving)" },
      { key: "coffee", labelKey: "Coffee" },
      { key: "chocolate", labelKey: "Chocolate" },
      { key: "wine_night", labelKey: "Wine night" },
      { key: "skin_contact", labelKey: "Skin contact" },
      { key: "oral", labelKey: "Oral" },
      { key: "backdoor", labelKey: "Backdoor" },
      { key: "neck_kiss", labelKey: "Neck kiss" },
      { key: "lip_bite", labelKey: "Lip bite" },
      { key: "breath_on_skin", labelKey: "Breath on skin" },
      { key: "touch_me_here", labelKey: "Touch me here" },
      { key: "undress_me", labelKey: "Undress me" },
      { key: "watch_me", labelKey: "Watch me" },
      { key: "tease_me", labelKey: "Tease me" },
      { key: "pin_me", labelKey: "Pin me" },
      { key: "straddle_me", labelKey: "Straddle me" },
      { key: "lap_sit", labelKey: "Lap sit" },
      { key: "slow_dance", labelKey: "Slow dance" },
      { key: "make_me_beg", labelKey: "Make me beg" },
      { key: "let_me_please_you", labelKey: "Let me please you" },
    ]
  },
  {
    titleKey: "comfort_care_desires",
    emoji: "🔥",
    color: "from-blue-500 to-cyan-500",
    desires: [
      { key: "a_hug", labelKey: "A hug" },
      { key: "a_kiss", labelKey: "A kiss" },
      { key: "cuddle", labelKey: "Cuddle" },
      { key: "backrub", labelKey: "Backrub" },
      { key: "head_scratch", labelKey: "Head scratch" },
      { key: "blanket_tuck", labelKey: "Blanket tuck" },
      { key: "warm_drink", labelKey: "Warm drink" },
      { key: "foot_massage", labelKey: "Foot massage" },
      { key: "hair_play", labelKey: "Hair play" },
      { key: "shoulder_squeeze", labelKey: "Shoulder squeeze" },
      { key: "hand_hold", labelKey: "Hand hold" },
      { key: "nap_together", labelKey: "Nap together" },
      { key: "bath_run_for_me", labelKey: "Bath run for me" },
      { key: "cook_for_me", labelKey: "Cook for me" },
      { key: "tuck_me_in", labelKey: "Tuck me in" },
      { key: "sing_to_me", labelKey: "Sing to me" },
      { key: "gentle_wakeup", labelKey: "Gentle wake-up" },
      { key: "just_stay", labelKey: "Just stay" },
    ]
  },
  {
    titleKey: "playful_mischievous_desires",
    emoji: "💫",
    color: "from-purple-500 to-pink-500",
    desires: [
      { key: "flirt_with_me", labelKey: "Flirt with me" },
      { key: "chase_me", labelKey: "Chase me" },
      { key: "steal_a_kiss", labelKey: "Steal a kiss" },
      { key: "dare_me", labelKey: "Dare me" },
      { key: "roleplay", labelKey: "Roleplay" },
      { key: "secret_photo", labelKey: "Secret photo" },
      { key: "naughty_text", labelKey: "Naughty text" },
      { key: "surprise_me", labelKey: "Surprise me" },
      { key: "hide_and_seek", labelKey: "Hide and seek" },
      { key: "make_me_blush", labelKey: "Make me blush" },
      { key: "be_my_distraction", labelKey: "Be my distraction" },
      { key: "interrupt_me", labelKey: "Interrupt me" },
      { key: "tempt_me", labelKey: "Tempt me" },
      { key: "catch_me", labelKey: "Catch me" },
      { key: "mess_up_my_hair", labelKey: "Mess up my hair" },
    ]
  }
];

export const DesireCustomization = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
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
        .single();
      
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
        description: "Your partner will see your desire",
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

  const categories = getDesireCategories(t);

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
              Your Personalized Desires ({selectedDesires.length}/20)
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
        <Button
          onClick={savePersonalizedDesires}
          disabled={isSaving || selectedDesires.length === 0}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
        >
          {isSaving ? "Saving..." : `Save Selection (${selectedDesires.length}/20)`}
        </Button>

        {/* Desire Categories */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.titleKey} className="space-y-3">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span>{category.emoji}</span>
                <span>{category.titleKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.desires.map((desire) => {
                  const isSelected = selectedDesires.includes(desire.labelKey);
                  return (
                    <Button
                      key={desire.key}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDesireSelection(desire.labelKey)}
                      className={`${
                        isSelected
                          ? `bg-gradient-to-r ${category.color} text-white border-none`
                          : 'bg-white/5 text-white/80 hover:bg-white/10 border-white/20'
                      }`}
                    >
                      {desire.labelKey}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Desire */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white">Custom Desire</h3>
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
