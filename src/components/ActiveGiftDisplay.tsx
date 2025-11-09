import { useEffect, useState, useRef } from "react";
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number }>({
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0
  });

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isExpanded) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    setPosition({
      x: dragRef.current.startPosX + deltaX,
      y: dragRef.current.startPosY + deltaY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, position]);

  if (!activeGift) return null;

  const glowColor = senderGender === 'female' 
    ? 'drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]' // pink glow
    : senderGender === 'male' 
    ? 'drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]' // blue glow
    : 'drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]'; // purple glow (default)

  const ringColor = senderGender === 'female'
    ? 'ring-pink-500'
    : senderGender === 'male'
    ? 'ring-blue-500'
    : 'ring-purple-500';

  return (
    <div 
      className="fixed bottom-24 right-4 z-40 pointer-events-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
      }}
    >
      <div className="pointer-events-auto">
        {!isExpanded ? (
          // Collapsed view - draggable gift
          <div 
            className={`cursor-move ${isDragging ? 'opacity-80' : ''}`}
            onMouseDown={handleMouseDown}
            onClick={(e) => {
              if (!isDragging) setIsExpanded(true);
            }}
          >
            {giftImages[activeGift.gift_image] ? (
              <img
                src={giftImages[activeGift.gift_image]}
                alt={activeGift.gift_name}
                className="w-32 h-32 object-contain select-none"
                style={{
                  filter: `drop-shadow(0 0 20px ${
                    senderGender === 'female' 
                      ? 'rgba(236,72,153,0.8)'
                      : senderGender === 'male'
                      ? 'rgba(59,130,246,0.8)'
                      : 'rgba(168,85,247,0.8)'
                  })`
                }}
                draggable={false}
              />
            ) : (
              <Gift className={`w-28 h-28 text-primary ${glowColor}`} />
            )}
          </div>
        ) : (
          // Expanded view - full details
          <Card
            className={`
              w-72
              transition-all duration-500 ease-in-out
              ${glowColor}
              ring-2 ${ringColor}
              cursor-pointer
              overflow-hidden
              bg-background/95 backdrop-blur-sm
            `}
            onClick={() => setIsExpanded(false)}
          >
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
          </Card>
        )}
      </div>
    </div>
  );
};
