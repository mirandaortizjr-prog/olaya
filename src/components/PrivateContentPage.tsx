import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lock, Plus, Trash2, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrivateContent {
  id: string;
  content_type: string;
  title: string;
  description: string | null;
  is_shared: boolean;
  user_id: string;
  created_at: string;
}

interface PrivateContentPageProps {
  coupleId: string;
  userId: string;
  onClose: () => void;
}

export const PrivateContentPage = ({ coupleId, userId, onClose }: PrivateContentPageProps) => {
  const [contents, setContents] = useState<PrivateContent[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState("fantasy");
  const [isShared, setIsShared] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContents();
  }, [coupleId]);

  const loadContents = async () => {
    const { data, error } = await supabase
      .from('private_content')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setContents(data);
    }
  };

  const addContent = async () => {
    if (!title.trim()) return;

    const { error } = await supabase
      .from('private_content')
      .insert({
        couple_id: coupleId,
        user_id: userId,
        content_type: contentType,
        title: title.trim(),
        description: description.trim() || null,
        is_shared: isShared
      });

    if (error) {
      toast({ title: "Error adding content", variant: "destructive" });
    } else {
      toast({ title: "Content added!" });
      setTitle("");
      setDescription("");
      setIsShared(false);
      setShowDialog(false);
      loadContents();
    }
  };

  const deleteContent = async (id: string) => {
    const { error } = await supabase
      .from('private_content')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Error deleting", variant: "destructive" });
    } else {
      loadContents();
    }
  };

  const toggleShared = async (id: string, currentShared: boolean) => {
    const { error } = await supabase
      .from('private_content')
      .update({ is_shared: !currentShared })
      .eq('id', id);

    if (error) {
      toast({ title: "Error updating", variant: "destructive" });
    } else {
      loadContents();
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Private Vault</h2>
        </div>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <Button onClick={() => setShowDialog(true)} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add New Entry
          </Button>

          {contents.map((content) => (
            <Card key={content.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold flex items-center gap-2">
                    {content.title}
                    {content.is_shared && <Share2 className="w-4 h-4 text-primary" />}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{content.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {content.content_type} • {new Date(content.created_at).toLocaleDateString()}
                  </p>
                </div>
                {content.user_id === userId && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleShared(content.id, content.is_shared)}
                    >
                      <Share2 className={`w-4 h-4 ${content.is_shared ? 'text-primary' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteContent(content.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Private Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option value="fantasy">Fantasy</option>
                <option value="experience">Experience</option>
                <option value="fetish">Fetish</option>
                <option value="wish">Wish</option>
              </select>
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give it a title..."
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe it..."
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isShared} onCheckedChange={setIsShared} />
              <Label>Share with partner</Label>
            </div>
            <Button onClick={addContent} className="w-full">Add Entry</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
