import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { compareLanguages, getSharedPrompts, getContrastPrompts } from "@/lib/intimacyLanguages/partnerSync";
import { Heart, TrendingUp, Lightbulb } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PartnerComparisonProps {
  userLanguages: string[];
  partnerLanguages: string[];
}

export const PartnerComparison = ({ userLanguages, partnerLanguages }: PartnerComparisonProps) => {
  const { t } = useLanguage();
  const comparison = compareLanguages(userLanguages, partnerLanguages);
  const compatibilityPercent = Math.round(comparison.compatibilityScore * 100);

  return (
    <div className="space-y-4 p-4">
      <Card className="p-6 bg-gradient-to-br from-pink-500/10 to-rose-500/10">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-rose-500" />
          <h3 className="text-xl font-semibold">
            {t('compatibility')}
          </h3>
        </div>
        <div className="mb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              {t('languageAlignment')}
            </span>
            <span className="text-2xl font-bold text-primary">{compatibilityPercent}%</span>
          </div>
          <Progress value={compatibilityPercent} className="h-3" />
        </div>
      </Card>

      {comparison.shared.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold">
              {t('sharedLanguages')}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {comparison.shared.map((lang, i) => (
              <span key={i} className="px-4 py-2 bg-green-500/20 text-green-700 dark:text-green-300 rounded-full font-medium">
                {lang}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            {getSharedPrompts(comparison.shared, t).map((prompt, i) => (
              <p key={i} className="text-sm text-muted-foreground italic">"{prompt}"</p>
            ))}
          </div>
        </Card>
      )}

      {comparison.contrast.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            <h3 className="text-lg font-semibold">
              {t('exploreTogether')}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {t('uniqueLanguagesEnrich')}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {comparison.contrast.map((lang, i) => (
              <span key={i} className="px-4 py-2 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full font-medium">
                {lang}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            {getContrastPrompts(comparison.contrast, t).map((prompt, i) => (
              <p key={i} className="text-sm text-muted-foreground italic">"{prompt}"</p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
