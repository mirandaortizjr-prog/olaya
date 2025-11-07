import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { subscribeToPushNotifications } from "@/utils/notifications";
import { useToast } from "@/hooks/use-toast";

export const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    <div className="space-y-2">
      <h3 className="font-semibold">Notifications</h3>
      <Button
        variant={notificationsEnabled ? "default" : "outline"}
        className="w-full"
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
        <p className="text-xs text-muted-foreground">
          You're all set to receive notifications from Olaya!
        </p>
      )}
    </div>
  );
};
