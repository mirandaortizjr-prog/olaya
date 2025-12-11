import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotificationPreferences } from "./NotificationPreferences";
import { LocalNotificationSettings } from "./LocalNotificationSettings";
import { Separator } from "./ui/separator";
import { supabase } from "@/integrations/supabase/client";
import despia from "despia-native";

// Check if running in Despia native app
const isDespiaNative = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('despia');
};

// Check if OneSignal player ID is available
const getOneSignalPlayerId = (): string | null => {
  try {
    return despia.onesignalplayerid || null;
  } catch {
    return null;
  }
};

export const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anniversaryDate, setAnniversaryDate] = useState<Date | undefined>();
  const [isNative, setIsNative] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsNative(isDespiaNative());
    loadAnniversaryDate();
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    // For Despia native, check if we have a OneSignal player ID saved
    if (isDespiaNative()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('onesignal_player_id')
          .eq('id', user.id)
          .single();
        
        if (data?.onesignal_player_id) {
          setNotificationsEnabled(true);
        }
      }
    } else if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  };

  const loadAnniversaryDate = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: members } = await supabase
        .from('couple_members')
        .select('couple_id')
        .eq('user_id', user.id)
        .single();

      if (members) {
        const { data: couple } = await supabase
          .from('couples')
          .select('anniversary_date')
          .eq('id', members.couple_id)
          .single();

        if (couple?.anniversary_date) {
          setAnniversaryDate(new Date(couple.anniversary_date));
        }
      }
    } catch (error) {
      console.error('Error loading anniversary date:', error);
    }
  };

  const handleToggleNotifications = async () => {
    if (notificationsEnabled) {
      toast({
        title: "Notifications Enabled",
        description: "To disable notifications, please use your device settings.",
      });
      return;
    }

    setLoading(true);
    try {
      let success = false;

      if (isDespiaNative()) {
        // Use OneSignal via Despia native
        const playerIdFromDespia = getOneSignalPlayerId();
        console.log('Despia native detected, OneSignal Player ID:', playerIdFromDespia);
        
        if (playerIdFromDespia) {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            const { error } = await supabase
              .from('profiles')
              .update({ onesignal_player_id: playerIdFromDespia } as any)
              .eq('id', user.id);

            if (!error) {
              success = true;
              console.log('OneSignal Player ID saved:', playerIdFromDespia);
            } else {
              console.error('Error saving OneSignal Player ID:', error);
            }
          }
        } else {
          console.log('OneSignal Player ID not available from Despia yet');
          toast({
            title: "Notifications Not Available",
            description: "Please ensure notifications are enabled in your device settings for this app, then try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      } else {
        // Web push - check permission status first
        if (!('Notification' in window)) {
          toast({
            title: "Notifications Not Supported",
            description: "Push notifications are only available in the native app.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        if (Notification.permission === 'denied') {
          toast({
            title: "Notifications Blocked",
            description: "Please allow notifications in your browser settings, then refresh the page.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        const permission = await Notification.requestPermission();
        success = permission === 'granted';
      }

      if (success) {
        setNotificationsEnabled(true);
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive push notifications!",
        });
      } else if (!isDespiaNative()) {
        toast({
          title: "Notifications Not Granted",
          description: "You declined the notification permission. Enable it in browser settings to receive notifications.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error enabling notifications:', error);
      toast({
        title: "Error",
        description: "Failed to enable notifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Push Notifications</h3>
        <Button
          variant={notificationsEnabled ? "default" : "outline"}
          className="w-full mt-2"
          onClick={handleToggleNotifications}
          disabled={loading}
        >
          {loading ? (
            "Enabling..."
          ) : notificationsEnabled ? (
            <>
              <Bell className="w-4 h-4 mr-2" />
              Notifications Enabled
            </>
          ) : (
            <>
              <BellOff className="w-4 h-4 mr-2" />
              Enable Notifications
            </>
          )}
        </Button>
        {notificationsEnabled && (
          <p className="text-xs text-muted-foreground mt-2">
            You're all set to receive notifications from Olaya!
          </p>
        )}
        {!notificationsEnabled && isNative && (
          <p className="text-xs text-muted-foreground mt-2">
            Make sure notifications are enabled in your device settings for this app.
          </p>
        )}
        {!notificationsEnabled && !isNative && (
          <p className="text-xs text-muted-foreground mt-2">
            Push notifications work best in the native app.
          </p>
        )}
      </div>

      {notificationsEnabled && (
        <>
          <Separator />
          <NotificationPreferences />
          <Separator />
          <LocalNotificationSettings anniversaryDate={anniversaryDate} />
        </>
      )}
    </div>
  );
};
