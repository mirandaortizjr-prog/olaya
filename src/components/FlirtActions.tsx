import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flame, Heart, Eye, Sparkles, Wind, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PreferencesSettings } from "./PreferencesSettings";
import { haptics } from "@/utils/haptics";

const FLIRT_ACTIONS = [
  // Classic Physical Flirts
  { value: "kiss", label: "Kiss", icon: Heart, emoji: "💋", category: "physical" },
  { value: "wink", label: "Wink", icon: Eye, emoji: "😉", category: "physical" },
  { value: "lick", label: "Lick", icon: Wind, emoji: "👅", category: "physical" },
  { value: "bite", label: "Bite", icon: Sparkles, emoji: "🦷", category: "physical" },
  { value: "hug", label: "Hug", icon: Heart, emoji: "🤗", category: "physical" },
  { value: "cuddle", label: "Cuddle", icon: Heart, emoji: "🫂", category: "physical" },
  { value: "nuzzle", label: "Nuzzle", icon: Heart, emoji: "🥰", category: "physical" },
  { value: "caress", label: "Caress", icon: Sparkles, emoji: "✨", category: "physical" },
  { value: "stroke", label: "Stroke", icon: Wind, emoji: "👋", category: "physical" },
  { value: "graze", label: "Graze", icon: Wind, emoji: "🌊", category: "physical" },
  { value: "tickle", label: "Tickle", icon: Sparkles, emoji: "🤭", category: "physical" },
  { value: "tease", label: "Tease", icon: Flame, emoji: "😏", category: "physical" },
  { value: "squeeze", label: "Squeeze", icon: Heart, emoji: "🤲", category: "physical" },
  { value: "tap", label: "Tap", icon: Sparkles, emoji: "👆", category: "physical" },
  { value: "tug", label: "Tug", icon: Wind, emoji: "🫴", category: "physical" },
  { value: "pull_closer", label: "Pull closer", icon: Heart, emoji: "🫶", category: "physical" },
  { value: "brush_lips", label: "Brush lips", icon: Heart, emoji: "💋", category: "physical" },
  { value: "trace_skin", label: "Trace skin", icon: Sparkles, emoji: "✨", category: "physical" },
  { value: "hold_hands", label: "Hold hands", icon: Heart, emoji: "🤝", category: "physical" },
  { value: "rest_head", label: "Rest head on shoulder", icon: Heart, emoji: "🥺", category: "physical" },

  // Sensual / Suggestive Flirts
  { value: "whisper", label: "Whisper in ear", icon: Wind, emoji: "🗣️", category: "sensual" },
  { value: "slow_gaze", label: "Slow gaze", icon: Eye, emoji: "👀", category: "sensual" },
  { value: "lip_bite", label: "Lip bite", icon: Flame, emoji: "😈", category: "sensual" },
  { value: "neck_kiss", label: "Neck kiss", icon: Heart, emoji: "💋", category: "sensual" },
  { value: "back_touch", label: "Back touch", icon: Sparkles, emoji: "🫳", category: "sensual" },
  { value: "hip_pull", label: "Hip pull", icon: Flame, emoji: "🔥", category: "sensual" },
  { value: "hair_tug", label: "Hair tug", icon: Flame, emoji: "😏", category: "sensual" },
  { value: "finger_trail", label: "Finger trail", icon: Sparkles, emoji: "✨", category: "sensual" },
  { value: "breath_on_skin", label: "Breath on skin", icon: Wind, emoji: "💨", category: "sensual" },
  { value: "tongue_flick", label: "Tongue flick", icon: Flame, emoji: "👅", category: "sensual" },
  { value: "collar_grab", label: "Collar grab", icon: Flame, emoji: "🫴", category: "sensual" },
  { value: "shirt_lift", label: "Shirt lift", icon: Flame, emoji: "👕", category: "sensual" },
  { value: "thigh_touch", label: "Thigh touch", icon: Flame, emoji: "🔥", category: "sensual" },
  { value: "moan_softly", label: "Moan softly", icon: Flame, emoji: "😩", category: "sensual" },
  { value: "pin_gently", label: "Pin gently", icon: Flame, emoji: "😈", category: "sensual" },
  { value: "straddle", label: "Straddle", icon: Flame, emoji: "🔥", category: "sensual" },
  { value: "lap_sit", label: "Lap sit", icon: Flame, emoji: "🪑", category: "sensual" },
  { value: "undo_button", label: "Undo button", icon: Flame, emoji: "👔", category: "sensual" },
  { value: "slide_hand_under", label: "Slide hand under", icon: Flame, emoji: "🫳", category: "sensual" },

  // Playful / Coy Flirts
  { value: "pout", label: "Pout", icon: Heart, emoji: "🥺", category: "playful" },
  { value: "giggle", label: "Giggle", icon: Sparkles, emoji: "🤭", category: "playful" },
  { value: "chase", label: "Chase", icon: Sparkles, emoji: "🏃", category: "playful" },
  { value: "hide_and_seek", label: "Hide and seek", icon: Sparkles, emoji: "🙈", category: "playful" },
  { value: "peekaboo", label: "Peekaboo", icon: Eye, emoji: "👀", category: "playful" },
  { value: "fake_jealousy", label: "Fake jealousy", icon: Sparkles, emoji: "😤", category: "playful" },
  { value: "play_fight", label: "Play fight", icon: Sparkles, emoji: "🤺", category: "playful" },
  { value: "steal_blanket", label: "Steal blanket", icon: Sparkles, emoji: "🛏️", category: "playful" },
  { value: "steal_kiss", label: "Steal kiss", icon: Heart, emoji: "💋", category: "playful" },
  { value: "flash_smile", label: "Flash smile", icon: Heart, emoji: "😊", category: "playful" },
  { value: "raise_eyebrow", label: "Raise eyebrow", icon: Eye, emoji: "🤨", category: "playful" },
  { value: "send_emoji", label: "Send emoji", icon: Sparkles, emoji: "💬", category: "playful" },
  { value: "send_voice_note", label: "Send voice note", icon: Wind, emoji: "🎙️", category: "playful" },
  { value: "leave_lipstick_mark", label: "Leave lipstick mark", icon: Heart, emoji: "💋", category: "playful" },
  { value: "send_secret_photo", label: "Send secret photo", icon: Eye, emoji: "📸", category: "playful" },
  { value: "send_coded_message", label: "Send coded message", icon: Sparkles, emoji: "🔐", category: "playful" },
  { value: "pretend_to_ignore", label: "Pretend to ignore", icon: Eye, emoji: "🙄", category: "playful" },
  { value: "compliment_sneakily", label: "Compliment sneakily", icon: Heart, emoji: "😌", category: "playful" },
  { value: "flirt_then_flee", label: "Flirt then flee", icon: Sparkles, emoji: "🏃‍♀️", category: "playful" },

  // Verbal / Emotional Flirts
  { value: "i_miss_you", label: "I miss you", icon: Heart, emoji: "💕", category: "verbal" },
  { value: "youre_trouble", label: "You're trouble", icon: Flame, emoji: "😈", category: "verbal" },
  { value: "youre_mine", label: "You're mine", icon: Heart, emoji: "❤️", category: "verbal" },
  { value: "say_it_again", label: "Say it again", icon: Wind, emoji: "🗣️", category: "verbal" },
  { value: "you_make_me_blush", label: "You make me blush", icon: Heart, emoji: "😊", category: "verbal" },
  { value: "i_dare_you", label: "I dare you", icon: Flame, emoji: "😏", category: "verbal" },
  { value: "youre_so_hot", label: "You're so hot when you…", icon: Flame, emoji: "🔥", category: "verbal" },
  { value: "i_want_you_now", label: "I want you now", icon: Flame, emoji: "😈", category: "verbal" },
  { value: "youre_irresistible", label: "You're irresistible", icon: Flame, emoji: "😍", category: "verbal" },
  { value: "favorite_distraction", label: "You're my favorite distraction", icon: Heart, emoji: "💭", category: "verbal" },
  { value: "thinking_last_night", label: "I'm thinking about last night", icon: Flame, emoji: "🌙", category: "verbal" },
  { value: "reason_i_smile", label: "You're the reason I smile", icon: Heart, emoji: "😊", category: "verbal" },
  { value: "not_wearing_anything", label: "I'm not wearing anything…", icon: Flame, emoji: "😏", category: "verbal" },
  { value: "guess_what_imagining", label: "Guess what I'm imagining", icon: Flame, emoji: "💭", category: "verbal" },
  { value: "youre_my_weakness", label: "You're my weakness", icon: Heart, emoji: "🥺", category: "verbal" },
];

interface FlirtActionsProps {
  coupleId: string;
  senderId: string;
  open?: boolean;
  onClose?: () => void;
  inline?: boolean;
}

export const FlirtActions = ({ coupleId, senderId, open = false, onClose = () => {}, inline = false }: FlirtActionsProps) => {
  const [sending, setSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [enabledFlirts, setEnabledFlirts] = useState<string[]>([]);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [customFlirts, setCustomFlirts] = useState<Array<{ label: string; emoji: string }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open || inline) {
      loadPreferences();
      loadCustomFlirts();
    }
  }, [open, coupleId, inline]);

  const loadCustomFlirts = async () => {
    const { data } = await supabase
      .from('couple_preferences')
      .select('enabled_items')
      .eq('couple_id', coupleId)
      .eq('preference_type', 'custom_flirts')
      .maybeSingle();
    
    if (data && data.enabled_items) {
      setCustomFlirts(data.enabled_items as Array<{ label: string; emoji: string }>);
    }
  };

  const saveCustomFlirts = async (flirts: Array<{ label: string; emoji: string }>) => {
    const { error } = await supabase
      .from('couple_preferences')
      .upsert({
        couple_id: coupleId,
        preference_type: 'custom_flirts',
        enabled_items: flirts
      }, {
        onConflict: 'couple_id,preference_type'
      });

    if (error) {
      toast({
        title: "Error saving custom flirts",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const loadPreferences = async () => {
    const { data } = await supabase
      .from('couple_preferences')
      .select('enabled_items')
      .eq('couple_id', coupleId)
      .eq('preference_type', 'flirt')
      .maybeSingle();

    const allFlirtValues = FLIRT_ACTIONS.map(f => f.value);
    
    if (data && data.enabled_items) {
      const saved = data.enabled_items as string[];
      // Check if saved prefs match current flirts, otherwise reset
      const hasValidFlirts = saved.some(s => allFlirtValues.includes(s));
      setEnabledFlirts(hasValidFlirts ? saved : allFlirtValues);
    } else {
      // Enable all by default
      setEnabledFlirts(allFlirtValues);
    }
  };

  const sendFlirt = async (flirtType: string, label: string, emoji: string) => {
    try {
      // Haptic feedback for sending flirt
      await haptics.medium();
      
      console.log('=== SENDING FLIRT ===');
      console.log('Flirt details:', { flirtType, label, emoji, coupleId, senderId });
      setSending(true);
      
      const { data, error } = await supabase
        .from('flirts')
        .insert({
          couple_id: coupleId,
          sender_id: senderId,
          flirt_type: flirtType
        })
        .select();

      console.log('Flirt insert result:', { data, error });

      if (error) {
        console.error('Flirt error:', error);
        toast({ 
          title: "Error sending flirt", 
          description: error.message,
          variant: "destructive" 
        });
        setSending(false);
        return;
      }

      // Create a post with the flirt
      console.log('Creating post for flirt...');
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          couple_id: coupleId,
          author_id: senderId,
          content: `${emoji} ${label}`
        })
        .select();

      console.log('Post insert result:', { postData, postError });

      if (postError) {
        console.error('Post error:', postError);
      }

      // Send push notification to partner
      const { data: partner } = await supabase
        .from('couple_members')
        .select('user_id')
        .eq('couple_id', coupleId)
        .neq('user_id', senderId)
        .single();

      if (partner) {
        await supabase.functions.invoke('send-push-notification', {
          body: {
            userId: partner.user_id,
            title: `${emoji} Flirt from your partner!`,
            body: `${label} - Check your notifications`
          }
        });
      }

      toast({ 
        title: `${emoji} ${label} sent!`,
        description: "Your partner will feel the love!"
      });
      if (!inline) onClose();
    } catch (err) {
      console.error('Unexpected error in sendFlirt:', err);
      toast({
        title: "Error",
        description: "Failed to send flirt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const grid = (
    <div className={inline ? "space-y-4" : "max-h-[60vh] overflow-y-auto space-y-4 px-1"}>
      {['physical', 'sensual', 'playful', 'verbal'].map((category) => {
        const categoryFlirts = FLIRT_ACTIONS.filter(
          flirt => flirt.category === category && enabledFlirts.includes(flirt.value)
        );
        if (categoryFlirts.length === 0) return null;
        return (
          <div key={category} className="space-y-2">
            <h3 className="text-sm font-semibold capitalize text-muted-foreground">
              {category === 'physical' && '💋 Classic Physical'}
              {category === 'sensual' && '🔥 Sensual / Suggestive'}
              {category === 'playful' && '😏 Playful / Coy'}
              {category === 'verbal' && '🧠 Verbal / Emotional'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categoryFlirts.map((flirt) => (
                <Button
                  key={flirt.value}
                  variant="outline"
                  className="h-20 flex-col gap-1 text-sm"
                  onClick={() => sendFlirt(flirt.value, flirt.label, flirt.emoji)}
                  disabled={sending}
                >
                  <span className="text-2xl">{flirt.emoji}</span>
                  <span className="text-xs text-center">{flirt.label}</span>
                </Button>
              ))}
            </div>
          </div>
        );
      })}
      
      {customFlirts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold capitalize text-muted-foreground">
            ✨ Personalized
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {customFlirts.map((flirt, index) => (
              <Button
                key={`custom-${index}`}
                variant="outline"
                className="h-20 flex-col gap-1 text-sm"
                onClick={() => sendFlirt(`custom_${index}`, flirt.label, flirt.emoji)}
                disabled={sending}
              >
                <span className="text-2xl">{flirt.emoji}</span>
                <span className="text-xs text-center">{flirt.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowPersonalize(true)}
      >
        ✨ Personalize ({customFlirts.length}/10)
      </Button>
    </div>
  );

  return (
    <>
      {inline ? (
        <section className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="text-base font-semibold flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Instant Flirt
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-4">
            {grid}
          </div>
        </section>
      ) : (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Instant Flirt
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
                  <Settings className="w-4 h-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            {grid}
          </DialogContent>
        </Dialog>
      )}

      <PreferencesSettings
        coupleId={coupleId}
        type="flirt"
        open={showSettings}
        onClose={() => {
          setShowSettings(false);
          loadPreferences();
        }}
      />

      <Dialog open={showPersonalize} onOpenChange={setShowPersonalize}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Personalize Flirts (Up to 10)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {customFlirts.map((flirt, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={flirt.emoji}
                  onChange={(e) => {
                    const updated = [...customFlirts];
                    updated[index].emoji = e.target.value;
                    setCustomFlirts(updated);
                  }}
                  placeholder="Emoji"
                  className="w-16 px-2 py-2 text-center text-2xl bg-background border rounded"
                  maxLength={2}
                />
                <input
                  type="text"
                  value={flirt.label}
                  onChange={(e) => {
                    const updated = [...customFlirts];
                    updated[index].label = e.target.value;
                    setCustomFlirts(updated);
                  }}
                  placeholder="Flirt label"
                  className="flex-1 px-3 py-2 bg-background border rounded"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const updated = customFlirts.filter((_, i) => i !== index);
                    setCustomFlirts(updated);
                  }}
                >
                  ✕
                </Button>
              </div>
            ))}
            {customFlirts.length < 10 && (
              <Button
                variant="outline"
                onClick={() => setCustomFlirts([...customFlirts, { emoji: '💖', label: '' }])}
                className="w-full"
              >
                + Add Custom Flirt
              </Button>
            )}
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowPersonalize(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await saveCustomFlirts(customFlirts);
                toast({ title: "Custom flirts saved!" });
                setShowPersonalize(false);
              }}
              className="flex-1"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
