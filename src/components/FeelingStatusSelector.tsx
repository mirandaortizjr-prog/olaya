import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Heart, Smile, Meh, Frown, Flame, Zap, Star, Cloud, Sparkles, Coffee, Moon, Sun, Music, Edit3 } from "lucide-react";
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
  { value: "horny", label: "Horny", icon: Flame, color: "text-rose-500" },
  { value: "excited", label: "Excited", icon: Sparkles, color: "text-amber-500" },
  { value: "tired", label: "Tired", icon: Coffee, color: "text-slate-500" },
  { value: "romantic", label: "Romantic", icon: Moon, color: "text-violet-500" },
  { value: "playful", label: "Playful", icon: Sun, color: "text-orange-400" },
  { value: "peaceful", label: "Peaceful", icon: Music, color: "text-teal-500" },
  { value: "custom", label: "Custom", icon: Edit3, color: "text-gray-600" },
];

interface FeelingStatusSelectorProps {
  coupleId: string;
  userId: string;
  currentStatus?: string;
  currentCustomMessage?: string;
  onStatusChange: (status: string, customMessage?: string) => void;
}

export const FeelingStatusSelector = ({ coupleId, userId, currentStatus, currentCustomMessage, onStatusChange }: FeelingStatusSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customFeeling, setCustomFeeling] = useState("");
  const { toast } = useToast();

  const updateStatus = async (status: string, customMessage?: string) => {
    try {
      setSaving(true);
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        toast({ title: "Not signed in", description: "Please log in and try again.", variant: "destructive" });
        return;
      }

      if (user.id !== userId) {
        console.error('User ID mismatch', { authUserId: user.id, propUserId: userId });
        toast({ title: "Permission error", description: "You're not allowed to update this status.", variant: "destructive" });
        return;
      }

      const { error } = await supabase
        .from('feeling_status')
        .upsert(
          {
            user_id: userId,
            couple_id: coupleId,
            status,
            custom_message: customMessage || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,couple_id' }
        );

      if (error) {
        console.error('Feeling status update error:', error);
        toast({ title: "Error updating status", description: error.message || "Please try again.", variant: "destructive" });
        return;
      }

      onStatusChange(status, customMessage);
      setOpen(false);
      setShowCustomInput(false);
      setCustomFeeling("");
      toast({ title: "Status updated!" });
    } finally {
      setSaving(false);
    }
  };

  const handleCustomSubmit = () => {
    if (!customFeeling.trim()) {
      toast({ title: "Please enter a feeling", variant: "destructive" });
      return;
    }
    updateStatus("custom", customFeeling.trim());
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
        {currentStatus === "custom" && currentCustomMessage 
          ? currentCustomMessage 
          : currentStatus || "Set feeling"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>How are you feeling?</DialogTitle>
            <DialogDescription>Select a mood to share with your partner</DialogDescription>
          </DialogHeader>
          
          {!showCustomInput ? (
            <div className="grid grid-cols-2 gap-3">
              {FEELING_OPTIONS.map((feeling) => (
                <Button
                  key={feeling.value}
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  disabled={saving}
                  onClick={() => {
                    if (feeling.value === "custom") {
                      setShowCustomInput(true);
                    } else {
                      updateStatus(feeling.value);
                    }
                  }}
                >
                  <feeling.icon className={`w-8 h-8 ${feeling.color}`} />
                  <span>{feeling.label}</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Enter your feeling..."
                  value={customFeeling}
                  onChange={(e) => setCustomFeeling(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomSubmit();
                    }
                  }}
                  disabled={saving}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCustomSubmit}
                  disabled={saving || !customFeeling.trim()}
                  className="flex-1"
                >
                  Set Feeling
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomFeeling("");
                  }}
                  disabled={saving}
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
