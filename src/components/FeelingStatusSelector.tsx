import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, Smile, Meh, Frown, Flame, Zap, Star, Cloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FEELING_OPTIONS = [
  { value: "loved", label: "Loved", icon: Heart, color: "text-red-500" },
  { value: "happy", label: "Happy", icon: Smile, color: "text-yellow-500" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "text-gray-500" },
  { value: "sad", label: "Sad", icon: Frown, color: "text-blue-500" },
  { value: "passionate", label: "Passionate", icon: Flame, color: "text-orange-500" },
  { value: "energetic", label: "Energetic", icon: Zap, color: "text-purple-500" },
  { value: "dreamy", label: "Dreamy", icon: Star, color: "text-pink-500" },
  { value: "calm", label: "Calm", icon: Cloud, color: "text-cyan-500" },
];

interface FeelingStatusSelectorProps {
  coupleId: string;
  userId: string;
  currentStatus?: string;
  onStatusChange: (status: string) => void;
}

export const FeelingStatusSelector = ({ coupleId, userId, currentStatus, onStatusChange }: FeelingStatusSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const updateStatus = async (status: string) => {
    const { error } = await supabase
      .from('feeling_status')
      .upsert({
        user_id: userId,
        couple_id: coupleId,
        status,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,couple_id'
      });

    if (error) {
      toast({ title: "Error updating status", variant: "destructive" });
    } else {
      onStatusChange(status);
      setOpen(false);
      toast({ title: "Status updated!" });
    }
  };

  const CurrentIcon = FEELING_OPTIONS.find(f => f.value === currentStatus)?.icon || Meh;
  const currentColor = FEELING_OPTIONS.find(f => f.value === currentStatus)?.color || "text-gray-500";

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <CurrentIcon className={`w-4 h-4 ${currentColor}`} />
        {currentStatus || "Set feeling"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How are you feeling?</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {FEELING_OPTIONS.map((feeling) => (
              <Button
                key={feeling.value}
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => updateStatus(feeling.value)}
              >
                <feeling.icon className={`w-8 h-8 ${feeling.color}`} />
                <span>{feeling.label}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
