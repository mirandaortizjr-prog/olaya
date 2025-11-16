import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import despia from "despia-native";

export const useOneSignal = () => {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    registerOneSignal();
  }, []);

  const registerOneSignal = async () => {
    try {
      // Get OneSignal Player ID from Despia SDK
      const playerIdFromDespia = despia.onesignalplayerid;
      
      if (!playerIdFromDespia) {
        console.log('OneSignal Player ID not available yet');
        return;
      }

      console.log('OneSignal Player ID obtained:', playerIdFromDespia);
      setPlayerId(playerIdFromDespia);

      // Save to user profile
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user logged in');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ onesignal_player_id: playerIdFromDespia })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving OneSignal Player ID:', error);
        toast({
          title: "Error",
          description: "Failed to register for push notifications",
          variant: "destructive",
        });
        return;
      }

      setIsRegistered(true);
      console.log('OneSignal Player ID saved to profile');
      
      toast({
        title: "Push Notifications Enabled",
        description: "You'll now receive notifications via OneSignal",
      });
    } catch (error) {
      console.error('Error registering OneSignal:', error);
    }
  };

  return {
    playerId,
    isRegistered,
    registerOneSignal,
  };
};
