import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { giftImages } from "@/lib/giftImages";

interface ReceivedGift {
  id: string;
  gift_name: string;
  gift_image: string;
  purchased_at: string;
  sender_id: string;
  collection_name?: string;
}

const GiftCollections = () => {
  const navigate = useNavigate();
  const [gifts, setGifts] = useState<ReceivedGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [senderName, setSenderName] = useState<string>("Your Partner");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchReceivedGifts(user.id);
      }
    };
    getUser();
  }, []);

  const fetchReceivedGifts = async (userId: string) => {
    try {
      // Get couple_id
      const { data: coupleData } = await supabase
        .from('couple_members')
        .select('couple_id')
        .eq('user_id', userId)
        .single();

      if (!coupleData) {
        setLoading(false);
        return;
      }

      // Get partner info for sender name
      const { data: partner } = await supabase.rpc('get_partner_profile', { c_id: coupleData.couple_id });
      if (partner && partner.length > 0) {
        setSenderName(partner[0].full_name || "Your Partner");
      }

      // Fetch gifts received (sent by partner, not by current user)
      const { data, error } = await supabase
        .from('purchased_gifts')
        .select('*')
        .eq('couple_id', coupleData.couple_id)
        .neq('sender_id', userId)
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      
      setGifts(data || []);
    } catch (error) {
      console.error('Error fetching received gifts:', error);
      toast.error("Failed to load gift collections");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background pb-20 overscroll-contain">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Gift Collections</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <Gift className="w-12 h-12 mx-auto text-primary animate-pulse" />
          <h2 className="text-2xl font-bold text-foreground">Gifts from {senderName}</h2>
          <p className="text-muted-foreground">
            Your collection of special gifts
          </p>
          <div className="text-sm text-muted-foreground">
            Total: {gifts.length} {gifts.length === 1 ? 'gift' : 'gifts'}
          </div>
        </div>

        {/* Gifts Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 bg-accent animate-pulse rounded-lg" />
            ))}
          </div>
        ) : gifts.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <Gift className="w-16 h-16 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No gifts received yet</p>
            <p className="text-sm text-muted-foreground">
              Gifts sent to you will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {gifts.map((gift) => (
              <Card
                key={gift.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square bg-accent/20 relative overflow-hidden">
                  {giftImages[gift.gift_image] ? (
                    <img
                      src={giftImages[gift.gift_image]}
                      alt={gift.gift_name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gift className="w-16 h-16 text-muted-foreground opacity-20" />
                    </div>
                  )}
                  {gift.collection_name && (
                    <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground text-xs">
                      {gift.collection_name}
                    </Badge>
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                    {gift.gift_name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Received {format(new Date(gift.purchased_at), 'PP')}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftCollections;
