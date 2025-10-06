import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check } from "lucide-react";

interface ThemeSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThemeSettings = ({ open, onOpenChange }: ThemeSettingsProps) => {
  const { palette, setPalette } = useTheme();
  const { t } = useLanguage();

  const palettes = [
    { id: 'default' as const, name: t('paletteDefault'), preview: 'bg-gradient-romantic' },
    { id: 'feminine' as const, name: t('paletteFeminine'), preview: 'bg-gradient-to-r from-[hsl(340,80%,60%)] to-[hsl(320,70%,65%)]' },
    { id: 'masculine' as const, name: t('paletteMasculine'), preview: 'bg-gradient-to-r from-[hsl(220,70%,50%)] to-[hsl(200,60%,45%)]' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('themeSettings')}</DialogTitle>
          <DialogDescription>
            {t('themeSettingsDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {palettes.map((p) => (
            <button
              key={p.id}
              onClick={() => setPalette(p.id)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:scale-[1.02] ${
                palette === p.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-md ${p.preview} shadow-md`} />
                <span className="font-medium">{p.name}</span>
              </div>
              {palette === p.id && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
