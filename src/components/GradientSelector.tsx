import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { GRADIENTS, GradientId } from "@/lib/gradientData";
import { useLanguage } from "@/contexts/LanguageContext";

interface GradientSelectorProps {
  purchasedGradients: GradientId[];
  activeGradient: GradientId;
  onSelectGradient: (gradientId: GradientId) => void;
}

export const GradientSelector = ({
  purchasedGradients,
  activeGradient,
  onSelectGradient,
}: GradientSelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        {t('yourGradients') || 'Your Gradients'}
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {purchasedGradients.map((gradientId) => {
          const gradient = GRADIENTS[gradientId];
          const isActive = activeGradient === gradientId;

          return (
            <Card
              key={gradientId}
              className="relative overflow-hidden cursor-pointer transition-all hover:scale-105"
              onClick={() => onSelectGradient(gradientId)}
            >
              <div
                className="h-24 w-full"
                style={{ background: gradient.css }}
              />
              <div className="p-3 bg-card">
                <p className="text-sm font-medium text-card-foreground truncate">
                  {gradient.name}
                </p>
                {isActive && (
                  <div className="flex items-center gap-1 mt-1">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-xs text-primary">Active</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
