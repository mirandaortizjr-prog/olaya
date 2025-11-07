import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X, Star, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const FLIRT_CATEGORIES = [
  {
    title: "💋 Classic Physical Flirts",
    category: "physical",
    flirts: [
      { value: "kiss", label: "Kiss", emoji: "💋" },
      { value: "wink", label: "Wink", emoji: "😉" },
      { value: "lick", label: "Lick", emoji: "👅" },
      { value: "bite", label: "Bite", emoji: "🦷" },
      { value: "hug", label: "Hug", emoji: "🤗" },
      { value: "cuddle", label: "Cuddle", emoji: "🫂" },
      { value: "nuzzle", label: "Nuzzle", emoji: "🥰" },
      { value: "caress", label: "Caress", emoji: "✨" },
      { value: "stroke", label: "Stroke", emoji: "👋" },
      { value: "graze", label: "Graze", emoji: "🌊" },
      { value: "tickle", label: "Tickle", emoji: "🤭" },
      { value: "tease", label: "Tease", emoji: "😏" },
      { value: "squeeze", label: "Squeeze", emoji: "🤲" },
      { value: "tap", label: "Tap", emoji: "👆" },
      { value: "tug", label: "Tug", emoji: "🫴" },
      { value: "pull_closer", label: "Pull closer", emoji: "🫶" },
      { value: "brush_lips", label: "Brush lips", emoji: "💋" },
      { value: "trace_skin", label: "Trace skin", emoji: "✨" },
      { value: "hold_hands", label: "Hold hands", emoji: "🤝" },
      { value: "rest_head", label: "Rest head on shoulder", emoji: "🥺" },
    ]
  },
  {
    title: "🔥 Sensual / Suggestive Flirts",
    category: "sensual",
    flirts: [
      { value: "whisper", label: "Whisper in ear", emoji: "🗣️" },
      { value: "slow_gaze", label: "Slow gaze", emoji: "👀" },
      { value: "lip_bite", label: "Lip bite", emoji: "😈" },
      { value: "neck_kiss", label: "Neck kiss", emoji: "💋" },
      { value: "back_touch", label: "Back touch", emoji: "🫳" },
      { value: "hip_pull", label: "Hip pull", emoji: "🔥" },
      { value: "hair_tug", label: "Hair tug", emoji: "😏" },
      { value: "finger_trail", label: "Finger trail", emoji: "✨" },
      { value: "breath_on_skin", label: "Breath on skin", emoji: "💨" },
      { value: "tongue_flick", label: "Tongue flick", emoji: "👅" },
      { value: "collar_grab", label: "Collar grab", emoji: "🫴" },
      { value: "shirt_lift", label: "Shirt lift", emoji: "👕" },
      { value: "thigh_touch", label: "Thigh touch", emoji: "🔥" },
      { value: "moan_softly", label: "Moan softly", emoji: "😩" },
      { value: "pin_gently", label: "Pin gently", emoji: "😈" },
      { value: "straddle", label: "Straddle", emoji: "🔥" },
      { value: "lap_sit", label: "Lap sit", emoji: "🪑" },
      { value: "undo_button", label: "Undo button", emoji: "👔" },
      { value: "slide_hand_under", label: "Slide hand under", emoji: "🫳" },
    ]
  },
  {
    title: "😏 Playful / Coy Flirts",
    category: "playful",
    flirts: [
      { value: "pout", label: "Pout", emoji: "🥺" },
      { value: "giggle", label: "Giggle", emoji: "🤭" },
      { value: "chase", label: "Chase", emoji: "🏃" },
      { value: "hide_and_seek", label: "Hide and seek", emoji: "🙈" },
      { value: "peekaboo", label: "Peekaboo", emoji: "👀" },
      { value: "fake_jealousy", label: "Fake jealousy", emoji: "😤" },
      { value: "play_fight", label: "Play fight", emoji: "🤺" },
      { value: "steal_blanket", label: "Steal blanket", emoji: "🛏️" },
      { value: "steal_kiss", label: "Steal kiss", emoji: "💋" },
      { value: "flash_smile", label: "Flash smile", emoji: "😊" },
      { value: "raise_eyebrow", label: "Raise eyebrow", emoji: "🤨" },
      { value: "send_emoji", label: "Send emoji", emoji: "💬" },
      { value: "send_voice_note", label: "Send voice note", emoji: "🎙️" },
      { value: "leave_lipstick_mark", label: "Leave lipstick mark", emoji: "💋" },
      { value: "send_secret_photo", label: "Send secret photo", emoji: "📸" },
      { value: "send_coded_message", label: "Send coded message", emoji: "🔐" },
      { value: "pretend_to_ignore", label: "Pretend to ignore", emoji: "🙄" },
      { value: "compliment_sneakily", label: "Compliment sneakily", emoji: "😌" },
      { value: "flirt_then_flee", label: "Flirt then flee", emoji: "🏃‍♀️" },
    ]
  },
  {
    title: "🧠 Verbal / Emotional Flirts",
    category: "verbal",
    flirts: [
      { value: "i_miss_you", label: "I miss you", emoji: "💕" },
      { value: "youre_trouble", label: "You're trouble", emoji: "😈" },
      { value: "youre_mine", label: "You're mine", emoji: "❤️" },
      { value: "say_it_again", label: "Say it again", emoji: "🗣️" },
      { value: "you_make_me_blush", label: "You make me blush", emoji: "😊" },
      { value: "i_dare_you", label: "I dare you", emoji: "😏" },
      { value: "youre_so_hot", label: "You're so hot when you…", emoji: "🔥" },
      { value: "i_want_you_now", label: "I want you now", emoji: "😈" },
      { value: "youre_irresistible", label: "You're irresistible", emoji: "😍" },
      { value: "favorite_distraction", label: "You're my favorite distraction", emoji: "💭" },
      { value: "thinking_last_night", label: "I'm thinking about last night", emoji: "🌙" },
      { value: "reason_i_smile", label: "You're the reason I smile", emoji: "😊" },
      { value: "not_wearing_anything", label: "I'm not wearing anything…", emoji: "😏" },
      { value: "guess_what_imagining", label: "Guess what I'm imagining", emoji: "💭" },
      { value: "youre_my_weakness", label: "You're my weakness", emoji: "🥺" },
    ]
  }
];

export const FlirtCustomization = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFlirts, setSelectedFlirts] = useState<string[]>([]);
  const [customFlirt, setCustomFlirt] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [personalizedFlirts, setPersonalizedFlirts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [coupleId, setCoupleId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUserId(user.id);

    const { data: membership } = await supabase
      .from('couple_members')
      .select('couple_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (membership) {
      setCoupleId(membership.couple_id);
      loadPersonalizedFlirts(membership.couple_id);
    }
  };

  const loadPersonalizedFlirts = async (cId: string) => {
    const { data } = await supabase
      .from('couple_preferences')
      .select('enabled_items')
      .eq('couple_id', cId)
      .eq('preference_type', 'flirt')
      .maybeSingle();

    if (data?.enabled_items) {
      const enabledValues = data.enabled_items as string[];
      
      // Map enabled values to full flirt objects
      const allFlirts = FLIRT_CATEGORIES.flatMap(cat => cat.flirts);
      const personalizedList = enabledValues.map(value => {
        const found = allFlirts.find(f => f.value === value);
        return found || { value, label: value, emoji: "✨", custom: true };
      });
      
      setPersonalizedFlirts(personalizedList);
    }
  };

  const toggleFlirtSelection = (value: string) => {
    if (selectedFlirts.includes(value)) {
      setSelectedFlirts(selectedFlirts.filter(f => f !== value));
    } else if (selectedFlirts.length < 20) {
      setSelectedFlirts([...selectedFlirts, value]);
    } else {
      toast({ 
        title: "Maximum 20 flirts", 
        description: "You can select up to 20 flirts to personalize", 
        variant: "destructive" 
      });
    }
  };

  const savePersonalizedFlirts = async () => {
    if (selectedFlirts.length === 0) {
      toast({ title: "Select at least one flirt", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('couple_preferences')
      .upsert({
        couple_id: coupleId,
        preference_type: 'flirt',
        enabled_items: selectedFlirts
      }, { onConflict: 'couple_id,preference_type' });

    setSaving(false);

    if (error) {
      toast({ title: "Error saving flirts", variant: "destructive" });
    } else {
      toast({ title: "Personalized flirts saved!" });
      loadPersonalizedFlirts(coupleId);
      setSelectedFlirts([]);
    }
  };

  const sendFlirt = async (flirtValue: string, label: string, emoji: string) => {
    setSaving(true);
    
    const { error: flirtError } = await supabase
      .from('flirts')
      .insert({
        couple_id: coupleId,
        sender_id: userId,
        flirt_type: flirtValue
      });

    if (!flirtError) {
      await supabase.from('posts').insert({
        couple_id: coupleId,
        author_id: userId,
        content: `${emoji} ${label}`
      });

      toast({ title: `${emoji} ${label} sent!`, description: "Your partner will feel the love!" });
    }

    setSaving(false);
  };

  const saveCustomFlirt = async () => {
    if (!customFlirt.trim()) {
      toast({ title: "Please enter a flirt", variant: "destructive" });
      return;
    }

    const customValue = `custom_${Date.now()}`;
    const newFlirts = [...(personalizedFlirts.map(f => f.value)), customValue];

    setSaving(true);
    const { error } = await supabase
      .from('couple_preferences')
      .upsert({
        couple_id: coupleId,
        preference_type: 'flirt',
        enabled_items: newFlirts
      }, { onConflict: 'couple_id,preference_type' });

    if (error) {
      toast({ title: "Error saving custom flirt", variant: "destructive" });
      setSaving(false);
      return;
    }

    await sendFlirt(customValue, customFlirt.trim(), "✨");
    setCustomFlirt("");
    setShowCustomInput(false);
    loadPersonalizedFlirts(coupleId);
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/50 to-background pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <X className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            Customize Flirts
          </h1>
          <div className="w-10" />
        </div>

        {/* Instructions */}
        <p className="text-center text-muted-foreground mb-8">
          Choose up to 20 flirts by pressing the star ⭐, or tap one to send instantly
        </p>

        {/* Personalized Flirts Section */}
        {personalizedFlirts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary">Your Personalized Flirts</h2>
            <div className="grid grid-cols-2 gap-2">
              {personalizedFlirts.map((flirt) => (
                <Button
                  key={flirt.value}
                  variant="outline"
                  className="h-20 flex-col gap-1 bg-primary/10 border-primary/30 hover:bg-primary/20"
                  onClick={() => sendFlirt(flirt.value, flirt.label, flirt.emoji)}
                  disabled={saving}
                >
                  <span className="text-2xl">{flirt.emoji}</span>
                  <span className="text-xs text-center">{flirt.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Selection Mode Controls */}
        {selectedFlirts.length > 0 && (
          <div className="mb-6 bg-primary/10 border border-primary/30 rounded-lg p-4">
            <p className="text-sm mb-2">Selected: {selectedFlirts.length}/20</p>
            <div className="flex gap-2">
              <Button
                onClick={savePersonalizedFlirts}
                disabled={saving}
                className="flex-1"
              >
                Save Personalized Flirts
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedFlirts([])}
                disabled={saving}
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Flirt Categories */}
        <div className="space-y-8">
          {FLIRT_CATEGORIES.map((category) => (
            <div key={category.category}>
              <h2 className="text-lg font-semibold mb-3">
                {category.title}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {category.flirts.map((flirt) => (
                  <div key={flirt.value} className="relative">
                    <Button
                      variant="outline"
                      className={`w-full h-20 flex-col gap-1 ${
                        selectedFlirts.includes(flirt.value)
                          ? 'bg-yellow-500/20 border-yellow-400'
                          : 'hover:bg-accent/50'
                      }`}
                      onClick={() => sendFlirt(flirt.value, flirt.label, flirt.emoji)}
                      disabled={saving}
                    >
                      <span className="text-2xl">{flirt.emoji}</span>
                      <span className="text-xs text-center">{flirt.label}</span>
                    </Button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlirtSelection(flirt.value);
                      }}
                      className={`absolute right-2 top-2 ${
                        selectedFlirts.includes(flirt.value) 
                          ? 'text-yellow-400' 
                          : 'text-muted-foreground hover:text-yellow-400'
                      }`}
                      disabled={saving}
                    >
                      <Star 
                        className="w-4 h-4" 
                        fill={selectedFlirts.includes(flirt.value) ? "currentColor" : "none"} 
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Customize Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Add Custom Flirt</h2>
          {!showCustomInput ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowCustomInput(true)}
            >
              ✨ Write your own flirt
            </Button>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder="Enter your custom flirt..."
                value={customFlirt}
                onChange={(e) => setCustomFlirt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveCustomFlirt()}
                autoFocus
              />
              <div className="flex gap-2">
                <Button onClick={saveCustomFlirt} disabled={saving || !customFlirt.trim()} className="flex-1">
                  Send Custom Flirt
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomFlirt("");
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
