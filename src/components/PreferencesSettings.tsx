import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Flame, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface PreferencesSettingsProps {
  coupleId: string;
  type: "desire" | "flirt";
  open: boolean;
  onClose: () => void;
}

const DESIRE_ITEMS = [
  { value: "kiss", emoji: "💋" },
  { value: "hug", emoji: "🤗" },
  { value: "qualityTime", emoji: "⏰" },
  { value: "backRub", emoji: "💆" },
  { value: "videoGames", emoji: "🎮" },
  { value: "yumYum", emoji: "🔥" },
  { value: "oral", emoji: "✨" },
  { value: "talk", emoji: "💬" },
  { value: "coffee", emoji: "☕" },
  { value: "dateNight", emoji: "🌟" },
  { value: "adventure", emoji: "🗺️" },
  { value: "custom", emoji: "✍️" },
];

const FLIRT_ITEMS = [
  // Physical
  { value: "kiss", emoji: "💋" },
  { value: "wink", emoji: "😉" },
  { value: "lick", emoji: "👅" },
  { value: "bite", emoji: "🦷" },
  { value: "hug", emoji: "🤗" },
  { value: "cuddle", emoji: "🫂" },
  { value: "nuzzle", emoji: "🥰" },
  { value: "caress", emoji: "✨" },
  { value: "stroke", emoji: "👋" },
  { value: "graze", emoji: "🌊" },
  { value: "tickle", emoji: "🤭" },
  { value: "tease", emoji: "😏" },
  { value: "squeeze", emoji: "🤲" },
  { value: "tap", emoji: "👆" },
  { value: "tug", emoji: "🫴" },
  { value: "pull_closer", emoji: "🫶" },
  { value: "brush_lips", emoji: "💋" },
  { value: "trace_skin", emoji: "✨" },
  { value: "hold_hands", emoji: "🤝" },
  { value: "rest_head", emoji: "🥺" },
  // Sensual
  { value: "whisper", emoji: "🗣️" },
  { value: "slow_gaze", emoji: "👀" },
  { value: "lip_bite", emoji: "😈" },
  { value: "neck_kiss", emoji: "💋" },
  { value: "back_touch", emoji: "🫳" },
  { value: "hip_pull", emoji: "🔥" },
  { value: "hair_tug", emoji: "😏" },
  { value: "finger_trail", emoji: "✨" },
  { value: "breath_on_skin", emoji: "💨" },
  { value: "tongue_flick", emoji: "👅" },
  { value: "collar_grab", emoji: "🫴" },
  { value: "shirt_lift", emoji: "👕" },
  { value: "thigh_touch", emoji: "🔥" },
  { value: "moan_softly", emoji: "😩" },
  { value: "pin_gently", emoji: "😈" },
  { value: "straddle", emoji: "🔥" },
  { value: "lap_sit", emoji: "🪑" },
  { value: "undo_button", emoji: "👔" },
  { value: "slide_hand_under", emoji: "🫳" },
  // Playful
  { value: "pout", emoji: "🥺" },
  { value: "giggle", emoji: "🤭" },
  { value: "chase", emoji: "🏃" },
  { value: "hide_and_seek", emoji: "🙈" },
  { value: "peekaboo", emoji: "👀" },
  { value: "fake_jealousy", emoji: "😤" },
  { value: "play_fight", emoji: "🤺" },
  { value: "steal_blanket", emoji: "🛏️" },
  { value: "steal_kiss", emoji: "💋" },
  { value: "flash_smile", emoji: "😊" },
  { value: "raise_eyebrow", emoji: "🤨" },
  { value: "send_emoji", emoji: "💬" },
  { value: "send_voice_note", emoji: "🎙️" },
  { value: "leave_lipstick_mark", emoji: "💋" },
  { value: "send_secret_photo", emoji: "📸" },
  { value: "send_coded_message", emoji: "🔐" },
  { value: "pretend_to_ignore", emoji: "🙄" },
  { value: "compliment_sneakily", emoji: "😌" },
  { value: "flirt_then_flee", emoji: "🏃‍♀️" },
  // Verbal
  { value: "i_miss_you", emoji: "💕" },
  { value: "youre_trouble", emoji: "😈" },
  { value: "youre_mine", emoji: "❤️" },
  { value: "say_it_again", emoji: "🗣️" },
  { value: "you_make_me_blush", emoji: "😊" },
  { value: "i_dare_you", emoji: "😏" },
  { value: "youre_so_hot", emoji: "🔥" },
  { value: "i_want_you_now", emoji: "😈" },
  { value: "youre_irresistible", emoji: "😍" },
  { value: "favorite_distraction", emoji: "💭" },
  { value: "thinking_last_night", emoji: "🌙" },
  { value: "reason_i_smile", emoji: "😊" },
  { value: "not_wearing_anything", emoji: "😏" },
  { value: "guess_what_imagining", emoji: "💭" },
  { value: "youre_my_weakness", emoji: "🥺" },
];

export const PreferencesSettings = ({ coupleId, type, open, onClose }: PreferencesSettingsProps) => {
  const [enabledItems, setEnabledItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const items = type === "desire" ? DESIRE_ITEMS : FLIRT_ITEMS;

  useEffect(() => {
    if (open) {
      loadPreferences();
    }
  }, [open, coupleId, type]);

  const loadPreferences = async () => {
    const { data, error } = await supabase
      .from('couple_preferences')
      .select('enabled_items')
      .eq('couple_id', coupleId)
      .eq('preference_type', type)
      .maybeSingle();

    if (data && data.enabled_items) {
      setEnabledItems(data.enabled_items as string[]);
    } else if (!error) {
      // If no preferences exist, enable all by default
      setEnabledItems(items.map(item => item.value));
    }
  };

  const savePreferences = async () => {
    setLoading(true);
    
    const { error } = await supabase
      .from('couple_preferences')
      .upsert({
        couple_id: coupleId,
        preference_type: type,
        enabled_items: enabledItems
      }, {
        onConflict: 'couple_id,preference_type'
      });

    if (error) {
      toast({
        title: t('error'),
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: t('success'),
        description: type === 'desire' 
          ? 'Desire preferences saved!' 
          : 'Flirt preferences saved!'
      });
      onClose();
    }
    
    setLoading(false);
  };

  const toggleItem = (value: string) => {
    setEnabledItems(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const getItemLabel = (value: string) => {
    if (type === 'desire') {
      return t(`desires.${value}` as any);
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {type === 'desire' ? 'Customize Desires' : 'Customize Flirts'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {items.map((item) => (
            <div 
              key={item.value}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <span className="font-medium">{getItemLabel(item.value)}</span>
              </div>
              <Checkbox
                checked={enabledItems.includes(item.value)}
                onCheckedChange={() => toggleItem(item.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {t('cancel')}
          </Button>
          <Button onClick={savePreferences} disabled={loading} className="flex-1">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
