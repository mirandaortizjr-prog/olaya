import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Bell, Send } from 'lucide-react';

export default function Notifications() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and message",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to send notifications",
          variant: "destructive",
        });
        return;
      }

      // Send notification to yourself
      const { data, error } = await supabase.functions.invoke('send-onesignal-notification', {
        body: {
          userId: user.id,
          title: title.trim(),
          message: message.trim(),
          data: {
            type: 'test',
            route: '/notifications',
          },
        },
      });

      if (error) {
        console.error('Error sending notification:', error);
        toast({
          title: "Error",
          description: "Failed to send notification. Make sure your device is linked.",
          variant: "destructive",
        });
        return;
      }

      console.log('Notification sent:', data);
      
      toast({
        title: "Notification Sent! 📱",
        description: "Check your device for the test notification",
      });

      // Clear form
      setTitle('');
      setMessage('');
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 pb-20">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Push Notifications</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Test Notification
            </CardTitle>
            <CardDescription>
              Send a test push notification to your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                placeholder="Enter notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Notification Message</Label>
              <Textarea
                id="message"
                placeholder="Enter notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                rows={4}
              />
            </div>

            <Button
              onClick={handleSendNotification}
              disabled={loading || !title.trim() || !message.trim()}
              className="w-full"
            >
              {loading ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Test Notification
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Push Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              • Test notifications will be sent to your currently linked device
            </p>
            <p>
              • Make sure you're using the app in Despia to receive notifications
            </p>
            <p>
              • Your partner will automatically receive notifications for their interactions
            </p>
            <p>
              • Notification preferences can be managed in your settings
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
