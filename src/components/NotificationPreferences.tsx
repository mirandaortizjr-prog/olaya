import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bell, MessageSquare, Heart, Smile, Image } from "lucide-react";

export const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    messages_enabled: true,
    flirts_enabled: true,
    love_notes_enabled: true,
    mood_updates_enabled: true,
    posts_enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
        return;
      }

      if (data) {
        setPreferences({
          messages_enabled: data.messages_enabled,
          flirts_enabled: data.flirts_enabled,
          love_notes_enabled: data.love_notes_enabled,
          mood_updates_enabled: data.mood_updates_enabled,
          posts_enabled: data.posts_enabled,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key: keyof typeof preferences, value: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);

      // Use upsert with onConflict to handle the unique constraint
      const { error } = await supabase
        .from('notification_preferences')
        .upsert(
          {
            user_id: user.id,
            ...newPreferences,
          },
          { onConflict: 'user_id' }
        );

      if (error) throw error;

      toast({
        title: "Preferences Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading preferences...</div>;
  }

  const options = [
    { key: 'messages_enabled' as const, label: 'Messages', icon: MessageSquare },
    { key: 'flirts_enabled' as const, label: 'Flirts', icon: Heart },
    { key: 'love_notes_enabled' as const, label: 'Love Notes', icon: Bell },
    { key: 'mood_updates_enabled' as const, label: 'Mood Updates', icon: Smile },
    { key: 'posts_enabled' as const, label: 'New Posts', icon: Image },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Notification Types</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Choose which notifications you want to receive
        </p>
      </div>
      
      <div className="space-y-3">
        {options.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor={key} className="cursor-pointer">{label}</Label>
            </div>
            <Switch
              id={key}
              checked={preferences[key]}
              onCheckedChange={(checked) => updatePreference(key, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
