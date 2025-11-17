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
        const isDespia = /despia/.test(navigator.userAgent.toLowerCase());

        if (!isDespia) {
          console.log('[DeviceLink] Not in Despia environment, skipping device linking');
          return;
        }

        // Get OneSignal Player ID from Despia SDK
        const playerIdRaw = despia.onesignalplayerid;
        const deviceUuidRaw = despia.uuid;

        console.log('[DeviceLink] Raw values:', { playerIdRaw, deviceUuidRaw });

        // Handle both string values and undefined/null
        const onesignalPlayerId = typeof playerIdRaw === 'string' ? playerIdRaw : undefined;
        const deviceUuid = typeof deviceUuidRaw === 'string' ? deviceUuidRaw : undefined;

        console.log('[DeviceLink] Parsed values:', { onesignalPlayerId, deviceUuid });

        if (!onesignalPlayerId || !deviceUuid) {
          console.log('[DeviceLink] No device identifiers available yet');
          return;
        }

        // Update profile with OneSignal Player ID
        if (onesignalPlayerId) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ 
              onesignal_player_id: onesignalPlayerId 
            } as any)
            .eq('id', userId);

          if (profileError) {
            console.error('[DeviceLink] Error updating profile:', profileError);
            toast({
              title: "Device Link Error",
              description: "Failed to link device for notifications",
              variant: "destructive",
            });
            return;
          }

          console.log('[DeviceLink] Device linked successfully:', { 
            deviceUuid, 
            onesignalPlayerId 
          });
        }
        
      } catch (error) {
        console.error('[DeviceLink] Error in linkDevice:', error);
      }
    };

    linkDevice();
  }, [userId, navigate]);
}
