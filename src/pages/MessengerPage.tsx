import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, Plus, Camera, Image as ImageIcon, Smile, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, isToday, isYesterday } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  media_url?: string;
  media_type?: 'image' | 'video' | string | null;
  created_at: string;
  read_at: string | null;
}

interface MessengerPageProps {
  coupleId: string;
  currentUserId: string;
  partnerName: string;
  onClose: () => void;
}

export const MessengerPage = ({ coupleId, currentUserId, partnerName, onClose }: MessengerPageProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
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

  const handleMediaSelect = (file: File) => {
    setSelectedMedia(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleMediaSelect(file);
    }
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleMediaSelect(file);
    }
  };

  const uploadMedia = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${currentUserId}-${Date.now()}.${fileExt}`;
    const filePath = `${coupleId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('couple_media')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    return filePath;
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && !selectedMedia) || loading) return;

    setLoading(true);
    setUploading(true);
    const messageContent = newMessage.trim();
    let mediaUrl: string | null = null;
    let mediaType: 'image' | 'video' | undefined;

    if (selectedMedia) {
      mediaUrl = await uploadMedia(selectedMedia);
      mediaType = selectedMedia.type.startsWith('image/') ? 'image' : 'video';
    }

    setNewMessage("");
    setSelectedMedia(null);
    setMediaPreview(null);

    const { error } = await supabase
      .from('messages')
      .insert({
        couple_id: coupleId,
        sender_id: currentUserId,
        content: messageContent || null,
        media_url: mediaUrl,
        media_type: mediaType
      });

    if (error) {
      console.error('Error sending message:', error);
      toast({ title: "Failed to send", variant: "destructive" });
      setNewMessage(messageContent);
    } else {
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
            body: messageContent || 'Sent a media'
          }
        });
      }
    }
    setLoading(false);
    setUploading(false);
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

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const file = new File([blob], 'clipboard-image.png', { type });
            handleMediaSelect(file);
            toast({ title: "Image pasted from clipboard" });
            return;
          }
        }
      }
      
      const text = await navigator.clipboard.readText();
      if (text) {
        setNewMessage(prev => prev + text);
        toast({ title: "Text pasted from clipboard" });
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      toast({ title: "Could not access clipboard", variant: "destructive" });
    }
  };

  const getMediaUrl = async (path: string) => {
    const { data } = await supabase.storage
      .from('couple_media')
      .createSignedUrl(path, 60 * 60 * 24);
    return data?.signedUrl || '';
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        className="hidden"
        onChange={handleCameraCapture}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleGallerySelect}
      />

      {/* Header */}
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
                    {msg.media_url && (
                      <MessageMedia mediaUrl={msg.media_url} mediaType={msg.media_type} />
                    )}
                    {msg.content && (
                      <p className="text-[15px] leading-[20px] break-words whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Media Preview */}
      {mediaPreview && (
        <div className="px-4 py-2 border-t bg-card/80">
          <div className="relative inline-block">
            <img src={mediaPreview} alt="Preview" className="h-20 rounded-lg" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => {
                setSelectedMedia(null);
                setMediaPreview(null);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t bg-card/80 backdrop-blur-sm">
        <div className="flex items-end gap-2 max-w-2xl mx-auto">
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                <Plus className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="ghost"
                  className="flex flex-col gap-1 h-auto py-3"
                  onClick={() => {
                    setShowEmojiPicker(false);
                    setShowGifPicker(!showGifPicker);
                  }}
                >
                  <Smile className="w-5 h-5" />
                  <span className="text-xs">Emoji</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex flex-col gap-1 h-auto py-3"
                  onClick={() => {
                    setShowEmojiPicker(false);
                    // GIF picker would go here - simplified for now
                    toast({ title: "GIF picker coming soon!" });
                  }}
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-xs">GIF</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex flex-col gap-1 h-auto py-3"
                  onClick={() => {
                    setShowEmojiPicker(false);
                    handlePasteFromClipboard();
                  }}
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-xs">Paste</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {showGifPicker && (
            <div className="absolute bottom-20 left-4 z-50 bg-card rounded-lg shadow-lg">
              <Picker
                data={data}
                onEmojiSelect={(emoji: any) => {
                  setNewMessage(prev => prev + emoji.native);
                  setShowGifPicker(false);
                }}
                theme="dark"
              />
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="w-5 h-5" />
          </Button>

          <div className="flex-1 relative">
            <Textarea
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
              className="rounded-full bg-muted border-0 pr-10 resize-none min-h-[36px] max-h-32 py-2"
              disabled={loading}
              rows={1}
            />
          </div>
          <Button 
            onClick={sendMessage} 
            disabled={loading || (!newMessage.trim() && !selectedMedia)}
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

const MessageMedia = ({ mediaUrl, mediaType }: { mediaUrl: string; mediaType?: string | null }) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const fetchUrl = async () => {
      const { data } = await supabase.storage
        .from('couple_media')
        .createSignedUrl(mediaUrl, 60 * 60 * 24);
      if (data?.signedUrl) {
        setUrl(data.signedUrl);
      }
    };
    fetchUrl();
  }, [mediaUrl]);

  if (!url) return null;

  if (mediaType === 'video') {
    return <video src={url} controls className="rounded-lg max-w-full mb-2" preload="metadata" playsInline />;
  }

  return <img src={url} alt="Shared media" className="rounded-lg max-w-full mb-2" />;
};
