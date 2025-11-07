import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { localNotifications } from "@/utils/localNotifications";
import { useToast } from "@/hooks/use-toast";
import { Bell, Calendar, Heart } from "lucide-react";
import { Capacitor } from "@capacitor/core";

interface LocalNotificationSettingsProps {
  anniversaryDate?: Date;
}

export const LocalNotificationSettings = ({ anniversaryDate }: LocalNotificationSettingsProps) => {
  const [dailyReminder, setDailyReminder] = useState(false);
  const [anniversaryReminder, setAnniversaryReminder] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkNotifications();
  }, []);

  const checkNotifications = async () => {
    if (!Capacitor.isNativePlatform()) return;
    
    const pending = await localNotifications.getPending();
    setDailyReminder(pending.some(n => n.id === 2));
    setAnniversaryReminder(pending.some(n => n.id === 1));
  };

  const handleDailyReminderToggle = async (enabled: boolean) => {
    if (!Capacitor.isNativePlatform()) {
      toast({
        title: "Not Available",
        description: "Local notifications are only available on mobile devices",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (enabled) {
        await localNotifications.scheduleDailyCheckIn(20); // 8 PM
        toast({
          title: "Daily Reminder Set",
          description: "You'll get a daily reminder at 8 PM to connect with your partner",
        });
      } else {
        await localNotifications.cancel(2);
        toast({
          title: "Daily Reminder Cancelled",
          description: "Daily reminders have been turned off",
        });
      }
      setDailyReminder(enabled);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update daily reminder",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnniversaryReminderToggle = async (enabled: boolean) => {
    if (!Capacitor.isNativePlatform()) {
      toast({
        title: "Not Available",
        description: "Local notifications are only available on mobile devices",
        variant: "destructive",
      });
      return;
    }

    if (!anniversaryDate && enabled) {
      toast({
        title: "No Anniversary Date",
        description: "Please set your anniversary date in couple settings first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (enabled && anniversaryDate) {
        await localNotifications.scheduleAnniversaryReminder(anniversaryDate);
        toast({
          title: "Anniversary Reminder Set",
          description: "You'll get a reminder on your anniversary!",
        });
      } else {
        await localNotifications.cancel(1);
        toast({
          title: "Anniversary Reminder Cancelled",
          description: "Anniversary reminders have been turned off",
        });
      }
      setAnniversaryReminder(enabled);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update anniversary reminder",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Local Reminders</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Get reminded to connect with your partner
        </p>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="daily-reminder" className="cursor-pointer">
              Daily Check-in (8 PM)
            </Label>
          </div>
          <Switch
            id="daily-reminder"
            checked={dailyReminder}
            onCheckedChange={handleDailyReminderToggle}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="anniversary-reminder" className="cursor-pointer">
              Anniversary Reminder
            </Label>
          </div>
          <Switch
            id="anniversary-reminder"
            checked={anniversaryReminder}
            onCheckedChange={handleAnniversaryReminderToggle}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};
