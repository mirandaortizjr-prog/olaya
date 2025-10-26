import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, isToday, isYesterday } from "date-fns";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

interface MessengerChatProps {
  coupleId: string;
  currentUserId: string;
  partnerName: string;
  onClose: () => void;
}

export const MessengerChat = ({ coupleId, currentUserId, partnerName, onClose }: MessengerChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
    inputRef.current?.focus();
    
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `couple_id=eq.${coupleId}`
      }, () => {
        loadMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      toast({ title: "Error loading messages", variant: "destructive" });
    } else {
      setMessages(data || []);
      markMessagesAsRead(data || []);
    }
  };

  const markMessagesAsRead = async (msgs: Message[]) => {
    const unreadMessages = msgs.filter(m => m.sender_id !== currentUserId && !m.read_at);
    for (const msg of unreadMessages) {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', msg.id);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    const messageContent = newMessage.trim();
    setNewMessage("");

    const { error } = await supabase
      .from('messages')
      .insert({
        couple_id: coupleId,
        sender_id: currentUserId,
        content: messageContent
      });

    if (error) {
      console.error('Error sending message:', error);
      toast({ title: "Failed to send", variant: "destructive" });
      setNewMessage(messageContent);
    } else {
      // Get partner's user_id and send push notification
      const { data: partner } = await supabase
        .from('couple_members')
        .select('user_id')
        .eq('couple_id', coupleId)
        .neq('user_id', currentUserId)
        .single();

      if (partner) {
        await supabase.functions.invoke('send-push-notification', {
          body: {
            userId: partner.user_id,
            title: `New message from ${partnerName}`,
            body: messageContent.substring(0, 100)
          }
        });
      }
    }
    setLoading(false);
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header - iOS style */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-card/50 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{partnerName}</h2>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 py-4 bg-muted/30">
        <div className="space-y-2 max-w-2xl mx-auto">
          {messages.map((msg, index) => {
            const isCurrentUser = msg.sender_id === currentUserId;
            const showTimestamp = index === 0 || 
              new Date(msg.created_at).getTime() - new Date(messages[index - 1].created_at).getTime() > 300000;

            return (
              <div key={msg.id}>
                {showTimestamp && (
                  <div className="text-center text-xs text-muted-foreground my-3">
                    {formatMessageTime(msg.created_at)}
                  </div>
                )}
                <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] rounded-[18px] px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-card text-foreground rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p className="text-[15px] leading-[20px] break-words whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area - iOS style */}
      <div className="p-3 border-t bg-card/80 backdrop-blur-sm">
        <div className="flex items-end gap-2 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="rounded-full bg-muted border-0 pr-10 resize-none h-9 min-h-[36px] max-h-32"
              disabled={loading}
            />
          </div>
          <Button 
            onClick={sendMessage} 
            disabled={loading || !newMessage.trim()}
            size="icon"
            className="rounded-full h-9 w-9 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
