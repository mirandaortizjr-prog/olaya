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
  return typeof navigator !== 'undefined' && 
         navigator.userAgent.toLowerCase().includes('despia');
};

export const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anniversaryDate, setAnniversaryDate] = useState<Date | undefined>();
  const { toast } = useToast();

  useEffect(() => {
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
        const playerIdFromDespia = despia.onesignalplayerid;
        
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
          console.log('OneSignal Player ID not available from Despia');
          toast({
            title: "Notifications Not Available",
            description: "Please ensure notifications are enabled in your device settings for this app.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      } else {
        // Web push - simplified
        if ('Notification' in window && Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission();
          success = permission === 'granted';
        }
      }

      if (success) {
        setNotificationsEnabled(true);
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive push notifications!",
        });
      } else {
        toast({
          title: "Unable to Enable Notifications",
          description: "Please check your device settings and allow notifications for this app.",
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
        {!notificationsEnabled && isDespiaNative() && (
          <p className="text-xs text-muted-foreground mt-2">
            Make sure notifications are enabled in your device settings for this app.
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
