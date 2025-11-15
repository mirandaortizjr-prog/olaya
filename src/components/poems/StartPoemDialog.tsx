import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Database } from "@/integrations/supabase/types";

type PoemInsert = Database["public"]["Tables"]["poems"]["Insert"];

interface StartPoemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupleId: string;
  userId: string;
  onSuccess: () => void;
}

const POEM_TYPES = [
  { value: "Haiku", maxLines: 3 },
  { value: "Sonnet", maxLines: 14 },
  { value: "EightVerse", maxLines: 8 },
  { value: "FreePlay", maxLines: null },
];

const CATEGORIES = [
  "Funny",
  "Romantic",
  "Kinky",
  "Deep",
  "Wildcard",
  "FreePlay",
];

export function StartPoemDialog({
  open,
  onOpenChange,
  coupleId,
  userId,
  onSuccess,
}: StartPoemDialogProps) {
  const [poemType, setPoemType] = useState("Haiku");
  const [category, setCategory] = useState("Romantic");
  const [firstLine, setFirstLine] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleStart = async () => {
    if (!firstLine.trim()) {
      toast({
        title: t('poemsFirstLineRequired'),
        description: t('poemsFirstLineRequiredDesc'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const poemData: PoemInsert = {
      couple_id: coupleId,
      created_by: userId,
      category: category as PoemInsert["category"],
      poem_type: poemType as PoemInsert["poem_type"],
      lines: [
        {
          text: firstLine,
          user_id: userId,
          timestamp: new Date().toISOString(),
        },
      ] as any,
      status: "Active",
    };

    const { error } = await supabase.from("poems").insert(poemData);

    setLoading(false);

    if (error) {
      toast({
        title: t('poemsErrorCreating'),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t('poemsStarted'),
        description: t('poemsStartedDesc'),
      });
      setFirstLine("");
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('poemsStartPoem')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>{t('poemsPoemType')}</Label>
            <select
              value={poemType}
              onChange={(e) => setPoemType(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background"
            >
              {POEM_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {t(`poemType${type.value}` as any)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>{t('poemsCategory')}</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`poemCategory${cat}` as any)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>{t('poemsFirstLine')}</Label>
            <Textarea
              placeholder={t('poemsFirstLinePlaceholder')}
              value={firstLine}
              onChange={(e) => setFirstLine(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <Button onClick={handleStart} disabled={loading} className="w-full">
            {loading ? t('poemsStarting') : t('poemsStartPoem')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
