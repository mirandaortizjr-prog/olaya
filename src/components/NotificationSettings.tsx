import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { subscribeToPushNotifications } from "@/utils/notifications";
import { useToast } from "@/hooks/use-toast";
import { NotificationPreferences } from "./NotificationPreferences";
import { LocalNotificationSettings } from "./LocalNotificationSettings";
import { Separator } from "./ui/separator";
import { supabase } from "@/integrations/supabase/client";

export const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anniversaryDate, setAnniversaryDate] = useState<Date | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    loadAnniversaryDate();
  }, []);

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

  useEffect(() => {
    // Check current notification permission status
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleToggleNotifications = async () => {
    if (notificationsEnabled) {
      toast({
        title: "Notifications Enabled",
        description: "To disable notifications, please use your browser settings.",
      });
      return;
    }

    setLoading(true);
    try {
      const success = await subscribeToPushNotifications();
      
      if (success) {
        setNotificationsEnabled(true);
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive push notifications!",
        });
      } else {
        toast({
          title: "Unable to Enable Notifications",
          description: "Please check your browser settings and allow notifications.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error enabling notifications:', error);
      
      // More specific error messages
      let description = "Failed to enable notifications. Please try again.";
      if (error?.message?.includes('not supported')) {
        description = "Your browser doesn't support push notifications.";
      } else if (error?.message?.includes('denied')) {
        description = "Notification permission was denied. Please enable it in browser settings.";
      }
      
      toast({
        title: "Error",
        description,
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
          {notificationsEnabled ? (
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
