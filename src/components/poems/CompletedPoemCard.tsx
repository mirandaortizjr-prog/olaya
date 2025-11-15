import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, GlobeLock, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface CompletedPoemCardProps {
  poem: {
    id: string;
    title: string | null;
    category: string;
    poem_type: string;
    lines: Array<{ text: string; user_id: string; timestamp: string }>;
    tags: string[];
    published_to_feed: boolean;
    saved_at: string | null;
    created_by: string;
  };
  userId: string;
  onUpdate: () => void;
}

export function CompletedPoemCard({ poem, userId, onUpdate }: CompletedPoemCardProps) {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this poem?")) return;

    const { error } = await supabase.from("poems").delete().eq("id", poem.id);

    if (error) {
      toast({
        title: t('poemsErrorDeleting'),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: t('poemsDeleted') });
      onUpdate();
    }
  };

  const togglePublish = async () => {
    const { error } = await supabase
      .from("poems")
      .update({ published_to_feed: !poem.published_to_feed })
      .eq("id", poem.id);

    if (error) {
      toast({
        title: "Error updating poem",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: poem.published_to_feed ? t('poemsUnpublishedSuccess') : t('poemsPublishedSuccess'),
      });
      onUpdate();
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{poem.title || "Untitled"}</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="secondary">{t(`poemCategory${poem.category}` as any)}</Badge>
            <Badge variant="outline">{t(`poemType${poem.poem_type}` as any)}</Badge>
            {poem.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
          {poem.saved_at && (
            <p className="text-xs text-muted-foreground">
              Completed {format(new Date(poem.saved_at), "MMM d, yyyy")}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePublish}
            title={poem.published_to_feed ? t('poemsUnpublish') : t('poemsPublish')}
          >
            {poem.published_to_feed ? (
              <Globe className="w-4 h-4" />
            ) : (
              <GlobeLock className="w-4 h-4" />
            )}
          </Button>
          {poem.created_by === userId && (
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2 border-l-2 border-primary/20 pl-4">
        {poem.lines.map((line, index) => (
          <p key={index} className="text-foreground italic">
            {line.text}
          </p>
        ))}
      </div>
    </Card>
  );
}
