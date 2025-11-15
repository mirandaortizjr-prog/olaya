import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Send, Check } from "lucide-react";
import { CompletePoemDialog } from "./CompletePoemDialog";
import { format } from "date-fns";

interface ActivePoemCardProps {
  poem: {
    id: string;
    category: string;
    poem_type: string;
    lines: Array<{ text: string; user_id: string; timestamp: string }>;
    couple_id: string;
  };
  userId: string;
  onUpdate: () => void;
}

const POEM_TYPE_LIMITS: Record<string, number | null> = {
  Haiku: 3,
  Sonnet: 14,
  EightVerse: 8,
  FreePlay: null,
};

export function ActivePoemCard({ poem, userId, onUpdate }: ActivePoemCardProps) {
  const [newLine, setNewLine] = useState("");
  const [loading, setLoading] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const maxLines = POEM_TYPE_LIMITS[poem.poem_type];
  const canAddLine = !maxLines || poem.lines.length < maxLines;
  const lastLine = poem.lines[poem.lines.length - 1];
  const isMyTurn = lastLine?.user_id !== userId;

  const handleAddLine = async () => {
    if (!newLine.trim()) return;

    setLoading(true);

    const updatedLines = [
      ...poem.lines,
      {
        text: newLine,
        user_id: userId,
        timestamp: new Date().toISOString(),
      },
    ];

    const { error } = await supabase
      .from("poems")
      .update({ lines: updatedLines })
      .eq("id", poem.id);

    setLoading(false);

    if (error) {
      toast({
        title: t('poemsErrorAdding'),
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Send notification to partner
      await supabase.functions.invoke("send-push-notification", {
        body: {
          userId: lastLine.user_id,
          title: t('poemsLineAdded'),
          body: t('poemsLineAddedDesc').replace('{category}', t(`poemCategory${poem.category}` as any)),
          data: { type: "poem_line", poemId: poem.id },
        },
      });

      setNewLine("");
      onUpdate();
    }
  };

  return (
    <>
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <Badge variant="secondary">{t(`poemCategory${poem.category}` as any)}</Badge>
              <Badge variant="outline" className="ml-2">
                {t(`poemType${poem.poem_type}` as any)}
              </Badge>
            </div>
          </div>
          {maxLines && (
            <span className="text-sm text-muted-foreground">
              {poem.lines.length}/{maxLines} {t('poemsLineCount')}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {poem.lines.map((line, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                line.user_id === userId
                  ? "bg-primary/10 ml-8"
                  : "bg-muted mr-8"
              }`}
            >
              <p className="text-foreground italic">{line.text}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(line.timestamp), "MMM d, h:mm a")}
              </p>
            </div>
          ))}
        </div>

        {canAddLine && isMyTurn ? (
          <div className="space-y-2">
            <Textarea
              placeholder={t('poemsAddLine')}
              value={newLine}
              onChange={(e) => setNewLine(e.target.value)}
              rows={2}
            />
            <Button
              onClick={handleAddLine}
              disabled={loading || !newLine.trim()}
              className="w-full gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? t('poemsAdding') : t('poemsAddLineButton')}
            </Button>
          </div>
        ) : !canAddLine ? (
          <Button onClick={() => setShowComplete(true)} className="w-full gap-2">
            <Check className="w-4 h-4" />
            {t('poemsCompletePoem')}
          </Button>
        ) : (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t('poemsWaitingForPartner')}
            </p>
          </div>
        )}
      </Card>

      <CompletePoemDialog
        open={showComplete}
        onOpenChange={setShowComplete}
        poemId={poem.id}
        onSuccess={onUpdate}
      />
    </>
  );
}
