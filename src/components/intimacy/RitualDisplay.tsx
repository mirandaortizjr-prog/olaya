import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getNextRitual } from "@/lib/intimacyLanguages/ritualBank";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

interface RitualDisplayProps {
  primaryLanguage: string;
  entryCount: number;
}

export const RitualDisplay = ({ primaryLanguage, entryCount }: RitualDisplayProps) => {
  const { t } = useLanguage();
  const [ritualIndex, setRitualIndex] = useState(0);
  
  const ritual = getNextRitual(primaryLanguage, entryCount + ritualIndex);

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold">
            {t('suggestedRitual')}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setRitualIndex(ritualIndex + 1)}
        >
          <RefreshCw className="w-5 h-5" />
        </Button>
      </div>
      
      <h4 className="text-2xl font-bold mb-3 text-primary">{ritual.title}</h4>
      <p className="text-muted-foreground leading-relaxed">{ritual.description}</p>
      
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          {t('designedForLanguage')} {primaryLanguage}
        </p>
      </div>
    </Card>
  );
};
