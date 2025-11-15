import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface CompletePoemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  poemId: string;
  onSuccess: () => void;
}

export function CompletePoemDialog({
  open,
  onOpenChange,
  poemId,
  onSuccess,
}: CompletePoemDialogProps) {
  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [publishToFeed, setPublishToFeed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleComplete = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please give your poem a title",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("poems")
      .update({
        title: title.trim(),
        tags,
        status: "Completed",
        saved_at: new Date().toISOString(),
        published_to_feed: publishToFeed,
      })
      .eq("id", poemId);

    setLoading(false);

    if (error) {
      toast({
        title: "Error completing poem",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Poem completed!",
        description: publishToFeed
          ? "Your poem has been saved and published to the feed"
          : "Your poem has been saved",
      });
      setTitle("");
      setTags([]);
      setPublishToFeed(false);
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Poem</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Poem Title *</Label>
            <Input
              placeholder="Give your poem a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Tags (optional)</Label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button onClick={handleAddTag} variant="secondary" size="sm">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="publish"
              checked={publishToFeed}
              onChange={(e) => setPublishToFeed(e.target.checked)}
              className="w-4 h-4 rounded border-input"
            />
            <Label htmlFor="publish" className="cursor-pointer">
              Publish to Feed
            </Label>
          </div>

          <Button onClick={handleComplete} disabled={loading} className="w-full">
            {loading ? "Saving..." : "Complete Poem"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
