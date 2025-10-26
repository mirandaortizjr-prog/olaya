import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Heart, Coffee, MessageCircle, Hand, Flame, Sparkles, Calendar, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

const DESIRE_ACTIONS = [
  { value: "kiss", labelKey: "kiss", icon: Heart, emoji: "💋" },
  { value: "hug", labelKey: "hug", icon: Heart, emoji: "🤗" },
  { value: "quality_time", labelKey: "qualityTime", icon: Calendar, emoji: "⏰" },
  { value: "back_rub", labelKey: "backRub", icon: Hand, emoji: "💆" },
  { value: "video_games", labelKey: "videoGames", icon: Heart, emoji: "🎮" },
  { value: "yum_yum", labelKey: "yumYum", icon: Flame, emoji: "🔥" },
  { value: "oral", labelKey: "oral", icon: Sparkles, emoji: "✨" },
  { value: "talk", labelKey: "talk", icon: MessageCircle, emoji: "💬" },
  { value: "coffee", labelKey: "coffee", icon: Coffee, emoji: "☕" },
  { value: "date_night", labelKey: "dateNight", icon: Star, emoji: "🌟" },
  { value: "adventure", labelKey: "adventure", icon: Heart, emoji: "🗺️" },
];

// Map local DesireActions values to canonical craving_board types used across the app
// This prevents DB check-constraint errors and keeps UI labels flexible
const CANONICAL_CRAVING_TYPES: Record<string, string> = {
  kiss: "kiss",
  hug: "hug",
  quality_time: "qualityTime",
  back_rub: "massage",
  video_games: "videoGames",
  yum_yum: "yumyum",
  oral: "oralSex",
  talk: "qualityTime",
  coffee: "coffee",
  date_night: "date",
  adventure: "adventure",
  custom: "custom",
};

interface DesireActionsProps {
  coupleId: string;
  userId: string;
  open: boolean;
  onClose: () => void;
}

export const DesireActions = ({ coupleId, userId, open, onClose }: DesireActionsProps) => {
  const [sending, setSending] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customDesire, setCustomDesire] = useState("");
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  console.log('DesireActions render:', { coupleId, userId, language });
  
  let desires;
  try {
    desires = translations[language]?.desires ?? translations.en.desires;
    console.log('Desires loaded successfully:', desires);
  } catch (error) {
    console.error('Error loading desires translations:', error);
    desires = translations.en.desires; // fallback
  }

  const sendDesire = async (desireType: string, customMessage?: string) => {
    setSending(true);
    const mappedType = CANONICAL_CRAVING_TYPES[desireType] || desireType;
    console.log('Sending desire:', { desireType, mappedType, customMessage, coupleId, userId });
    
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;
      if (authError || !currentUserId) {
        console.error('Auth error before sending desire:', authError);
        toast({ title: t('error'), description: 'Please sign in again to send desires.', variant: 'destructive' });
        setSending(false);
        return;
      }

      const { data, error } = await supabase
        .from('craving_board')
        .insert({
          couple_id: coupleId,
          user_id: currentUserId,
          craving_type: mappedType,
          custom_message: customMessage || null
        })
        .select();

      console.log('Desire response:', { data, error });

      if (error) {
        console.error('Desire error:', error);
        const msg = (error.message || '').toLowerCase();
        const friendly = msg.includes('row-level security')
          ? 'You do not have permission for this couple space. Make sure you joined the same couple.'
          : error.message;
        toast({ title: t('error'), description: friendly, variant: 'destructive' });
      } else {
        // Send push notification to partner
        const { data: partner } = await supabase
          .from('couple_members')
          .select('user_id')
          .eq('couple_id', coupleId)
          .neq('user_id', currentUserId)
          .single();

        if (partner) {
          const desire = DESIRE_ACTIONS.find(d => d.value === desireType);
          const label = desire ? desires[desire.labelKey as keyof typeof desires] : customMessage;
          await supabase.functions.invoke('send-push-notification', {
            body: {
              userId: partner.user_id,
              title: '💝 New desire from your partner',
              body: label || 'Your partner sent you a desire'
            }
          });
        }

        const desire = DESIRE_ACTIONS.find(d => d.value === desireType);
        const label = desire ? desires[desire.labelKey as keyof typeof desires] : customMessage;
        toast({ 
          title: `${desire?.emoji || "💝"} ${label}`,
          description: desires.desireSent
        });
        setCustomDesire("");
        setShowCustom(false);
        onClose();
      }
    } catch (error) {
      console.error('Unexpected error sending desire:', error);
      toast({ title: t("error"), description: "Unexpected error occurred", variant: "destructive" });
    }
    setSending(false);
  };

  const handleCustomSubmit = () => {
    if (customDesire.trim()) {
      sendDesire("custom", customDesire.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              {desires?.title || "Desires"}
            </DialogTitle>
            <DialogDescription className="sr-only">Send a desire to your partner</DialogDescription>
          </DialogHeader>
        
        {!showCustom ? (
          <div className="grid grid-cols-2 gap-2">
            {DESIRE_ACTIONS.map((desire) => {
              const labelText = desires?.[desire.labelKey as keyof typeof desires] || desire.labelKey;
              return (
                <Button
                  key={desire.value}
                  variant="outline"
                  className="h-20 flex-col gap-1 text-sm"
                  onClick={() => sendDesire(desire.value)}
                  disabled={sending}
                >
                  <span className="text-2xl">{desire.emoji}</span>
                  <span className="text-xs">{labelText}</span>
                </Button>
              );
            })}
            <Button
              variant="outline"
              className="h-20 flex-col gap-1 text-sm col-span-2"
              onClick={() => setShowCustom(true)}
              disabled={sending}
            >
              <span className="text-2xl">✍️</span>
              <span className="text-xs">{desires?.custom || "Custom"}</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              placeholder={desires?.customPlaceholder || "Enter your desire..."}
              value={customDesire}
              onChange={(e) => setCustomDesire(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomSubmit()}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCustom(false)}
                className="flex-1"
              >
                {t("back")}
              </Button>
              <Button
                onClick={handleCustomSubmit}
                disabled={!customDesire.trim() || sending}
                className="flex-1"
              >
                {t("send")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
