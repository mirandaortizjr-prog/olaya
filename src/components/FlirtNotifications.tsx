import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Eye, Heart, Sparkles, Wind, Flame } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Flirt {
  id: string;
  flirt_type: string;
  sender_id: string;
  created_at: string;
}

interface FlirtNotificationsProps {
  coupleId: string;
  userId: string;
  partnerName: string;
}

const FLIRT_ICONS: Record<string, { icon: any; emoji: string; label: string }> = {
  wink: { icon: Eye, emoji: "😉", label: "Winked at you" },
  kiss: { icon: Heart, emoji: "💋", label: "Sent you a kiss" },
  bite: { icon: Sparkles, emoji: "🦷", label: "Playfully bit you" },
  lick: { icon: Wind, emoji: "👅", label: "Licked you" },
  heart: { icon: Heart, emoji: "❤️", label: "Sent you hearts" },
  fire: { icon: Flame, emoji: "🔥", label: "Is feeling fire" },
};

export const FlirtNotifications = ({ coupleId, userId, partnerName }: FlirtNotificationsProps) => {
  const [recentFlirts, setRecentFlirts] = useState<Flirt[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentFlirts();

    // Set up real-time subscription for new flirts
    const channel = supabase
      .channel('flirts-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'flirts',
          filter: `couple_id=eq.${coupleId}`
        },
        (payload) => {
          const newFlirt = payload.new as Flirt;
          
          // Only show notification if it's from partner
          if (newFlirt.sender_id !== userId) {
            const flirtInfo = FLIRT_ICONS[newFlirt.flirt_type];
            if (flirtInfo) {
              toast({
                title: `${flirtInfo.emoji} ${partnerName} ${flirtInfo.label}!`,
                description: "Check your flirt notifications",
              });
            }
            
            setRecentFlirts(prev => [newFlirt, ...prev].slice(0, 5));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId, userId, partnerName, toast]);

  const fetchRecentFlirts = async () => {
    const { data, error } = await supabase
      .from('flirts')
      .select('*')
      .eq('couple_id', coupleId)
      .neq('sender_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data && !error) {
      setRecentFlirts(data);
    }
  };

  if (recentFlirts.length === 0) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-950/20 dark:to-red-950/20 border-pink-200 dark:border-pink-800">
      <h3 className="text-sm font-semibold mb-3 text-pink-700 dark:text-pink-300 flex items-center gap-2">
        <Flame className="w-4 h-4" />
        Recent Flirts from {partnerName}
      </h3>
      <div className="space-y-2">
        {recentFlirts.map((flirt) => {
          const flirtInfo = FLIRT_ICONS[flirt.flirt_type];
          if (!flirtInfo) return null;

          const FlirtIcon = flirtInfo.icon;
          
          return (
            <div
              key={flirt.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50"
            >
              <span className="text-2xl">{flirtInfo.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{flirtInfo.label}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(flirt.created_at), { addSuffix: true })}
                </p>
              </div>
              <FlirtIcon className="w-4 h-4 text-pink-500" />
            </div>
          );
        })}
      </div>
    </Card>
  );
};
