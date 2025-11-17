import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import despia from 'despia-native';

/**
 * Hook to link device UUID and OneSignal Player ID
 * Should be called in the main App component after login
 */
export function useDeviceLink(userId: string | undefined) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const linkDevice = async () => {
      try {
        // Check if we're in Despia environment
        const isDespia = /despia/.test(navigator.userAgent);

        if (!isDespia) {
          console.log('[DeviceLink] Not in Despia environment');
          return;
        }

        // Get device UUID from Despia
        const deviceUuid = despia.deviceuuid;
        
        // Get OneSignal Player ID from Despia
        const oneSignalPlayerId = despia.onesignalplayerid;

        if (!deviceUuid || !oneSignalPlayerId) {
          console.log('[DeviceLink] Missing device UUID or OneSignal Player ID');
          return;
        }

        console.log('[DeviceLink] Linking device:', { deviceUuid, oneSignalPlayerId });

        // Save to user profile
        const { error } = await supabase
          .from('profiles')
          .update({ 
            onesignal_player_id: oneSignalPlayerId 
          } as any)
          .eq('id', userId);

        if (error) {
          console.error('[DeviceLink] Error linking device:', error);
          toast({
            title: "Device Link Error",
            description: "Failed to link device for notifications",
            variant: "destructive",
          });
          return;
        }

        console.log('[DeviceLink] Device linked successfully');
        
      } catch (error) {
        console.error('[DeviceLink] Error in linkDevice:', error);
      }
    };

    linkDevice();
  }, [userId, navigate]);
}
