import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, Gift } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PurchasedGift {
  id: string;
  gift_name: string;
  gift_image: string;
  purchased_at: string;
  sender_id: string;
  couple_id: string;
}

interface ActiveGiftDisplayProps {
  userId: string;
  coupleId: string;
  giftImages: { [key: string]: string };
}

export const ActiveGiftDisplay = ({ userId, coupleId, giftImages }: ActiveGiftDisplayProps) => {
  const [activeGift, setActiveGift] = useState<PurchasedGift | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [senderGender, setSenderGender] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!userId || !coupleId) return;

    fetchActiveGift();

    // Subscribe to new gifts
    const channel = supabase
      .channel('active-gift-display')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'purchased_gifts',
          filter: `couple_id=eq.${coupleId}`,
        },
        () => {
          fetchActiveGift();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, coupleId]);

  useEffect(() => {
    if (!activeGift) return;

    const updateTimer = () => {
      const purchasedTime = new Date(activeGift.purchased_at).getTime();
      const now = Date.now();
      const expiryTime = purchasedTime + (24 * 60 * 60 * 1000); // 24 hours
      const remaining = expiryTime - now;

      if (remaining <= 0) {
        setActiveGift(null);
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      setTimeRemaining(`${hours}h ${minutes}m left`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [activeGift]);

  const fetchActiveGift = async () => {
    try {
      // Get gifts from last 24 hours where user is NOT the sender
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data: gifts, error } = await supabase
        .from('purchased_gifts')
        .select('*')
        .eq('couple_id', coupleId)
        .neq('sender_id', userId)
        .gte('purchased_at', twentyFourHoursAgo)
        .order('purchased_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (gifts && gifts.length > 0) {
        setActiveGift(gifts[0] as PurchasedGift);
        
        // Use a simple gender determination (could be enhanced)
        // For now, we'll use a default purple glow
        setSenderGender('');
      } else {
        setActiveGift(null);
      }
    } catch (error) {
      console.error('Error fetching active gift:', error);
    }
  };

  if (!activeGift) return null;

  const glowColor = senderGender === 'female' 
    ? 'shadow-[0_0_20px_rgba(236,72,153,0.6)]' // pink glow
    : senderGender === 'male' 
    ? 'shadow-[0_0_20px_rgba(59,130,246,0.6)]' // blue glow
    : 'shadow-[0_0_20px_rgba(168,85,247,0.6)]'; // purple glow (default)

  const ringColor = senderGender === 'female'
    ? 'ring-pink-500'
    : senderGender === 'male'
    ? 'ring-blue-500'
    : 'ring-purple-500';

  return (
    <div className="fixed bottom-24 right-4 z-40 pointer-events-none">
      <div className="pointer-events-auto">
        <Card
          className={`
            ${isExpanded ? 'w-72' : 'w-20 h-20'}
            transition-all duration-500 ease-in-out
            ${glowColor}
            ring-2 ${ringColor}
            animate-pulse
            cursor-pointer
            overflow-hidden
            bg-background/95 backdrop-blur-sm
          `}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {!isExpanded ? (
            // Collapsed view - just the gift icon
            <div className="w-full h-full flex items-center justify-center relative">
              {giftImages[activeGift.gift_image] ? (
                <img
                  src={giftImages[activeGift.gift_image]}
                  alt={activeGift.gift_name}
                  className="w-14 h-14 object-contain"
                />
              ) : (
                <Gift className="w-10 h-10 text-primary" />
              )}
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white px-1 py-0 text-[10px]">
                New
              </Badge>
            </div>
          ) : (
            // Expanded view - full details
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-sm">Gift from Partner</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mt-1 -mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-accent/30 rounded-lg p-3 flex items-center justify-center">
                {giftImages[activeGift.gift_image] ? (
                  <img
                    src={giftImages[activeGift.gift_image]}
                    alt={activeGift.gift_name}
                    className="w-24 h-24 object-contain"
                  />
                ) : (
                  <div className="text-4xl">🎁</div>
                )}
              </div>

              <div className="text-center space-y-1">
                <p className="font-medium text-foreground">{activeGift.gift_name}</p>
                <p className="text-xs text-muted-foreground">{timeRemaining}</p>
              </div>

              <div className="text-[10px] text-center text-muted-foreground">
                Tap to collapse • Hover for details
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
