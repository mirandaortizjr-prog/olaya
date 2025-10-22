import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flame, Heart, Eye, Sparkles, Lips, Wind } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FLIRT_ACTIONS = [
  { value: "wink", label: "Wink", icon: Eye, emoji: "😉" },
  { value: "kiss", label: "Kiss", icon: Lips, emoji: "💋" },
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
  const { toast } = useToast();

  const sendFlirt = async (flirtType: string, label: string, emoji: string) => {
    setSending(true);
    const { error } = await supabase
      .from('flirts')
      .insert({
        couple_id: coupleId,
        sender_id: senderId,
        flirt_type: flirtType
      });

    if (error) {
      toast({ title: "Error sending flirt", variant: "destructive" });
    } else {
      toast({ 
        title: `${emoji} ${label} sent!`,
        description: "Your partner will feel the love!"
      });
      onClose();
    }
    setSending(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Instant Flirt
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {FLIRT_ACTIONS.map((flirt) => (
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
  );
};
