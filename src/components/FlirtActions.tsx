import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flame, Heart, Eye, Sparkles, Wind, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PreferencesSettings } from "./PreferencesSettings";

const FLIRT_ACTIONS = [
  { value: "wink", label: "Wink", icon: Eye, emoji: "😉" },
  { value: "kiss", label: "Kiss", icon: Heart, emoji: "💋" },
  { value: "bite", label: "Bite", icon: Sparkles, emoji: "🦷" },
  { value: "lick", label: "Lick", icon: Wind, emoji: "👅" },
  { value: "heart", label: "Send Heart", icon: Heart, emoji: "❤️" },
  { value: "fire", label: "Fire", icon: Flame, emoji: "🔥" },
];

interface FlirtActionsProps {
  coupleId: string;
  senderId: string;
  open: boolean;
  onClose: () => void;
}

export const FlirtActions = ({ coupleId, senderId, open, onClose }: FlirtActionsProps) => {
  const [sending, setSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [enabledFlirts, setEnabledFlirts] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadPreferences();
    }
  }, [open, coupleId]);

  const loadPreferences = async () => {
    const { data } = await supabase
      .from('couple_preferences')
      .select('enabled_items')
      .eq('couple_id', coupleId)
      .eq('preference_type', 'flirt')
      .maybeSingle();

    if (data && data.enabled_items) {
      setEnabledFlirts(data.enabled_items as string[]);
    } else {
      // Enable all by default
      setEnabledFlirts(FLIRT_ACTIONS.map(f => f.value));
    }
  };

  const sendFlirt = async (flirtType: string, label: string, emoji: string) => {
    setSending(true);
    console.log('Sending flirt:', { couple_id: coupleId, sender_id: senderId, flirt_type: flirtType });
    
    const { data, error } = await supabase
      .from('flirts')
      .insert({
        couple_id: coupleId,
        sender_id: senderId,
        flirt_type: flirtType
      })
      .select();

    console.log('Flirt response:', { data, error });

    if (error) {
      console.error('Flirt error:', error);
      toast({ 
        title: "Error sending flirt", 
        description: error.message,
        variant: "destructive" 
      });
    } else {
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
      onClose();
    }
    setSending(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                Instant Flirt
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {FLIRT_ACTIONS.filter(flirt => enabledFlirts.includes(flirt.value)).map((flirt) => (
              <Button
                key={flirt.value}
                variant="outline"
                className="h-24 flex-col gap-2 text-lg"
                onClick={() => sendFlirt(flirt.value, flirt.label, flirt.emoji)}
                disabled={sending}
              >
                <span className="text-3xl">{flirt.emoji}</span>
                <flirt.icon className="w-5 h-5" />
                <span>{flirt.label}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      <PreferencesSettings
        coupleId={coupleId}
        type="flirt"
        open={showSettings}
        onClose={() => {
          setShowSettings(false);
          loadPreferences();
        }}
      />
    </>
  );
};
