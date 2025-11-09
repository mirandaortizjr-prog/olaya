import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface DesireCustomizationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupleId: string;
  allDesires: Array<{ key: string; labelEn: string; labelEs: string; category: string }>;
  onPreferencesUpdate: () => void;
}

export default function DesireCustomization({
  open,
  onOpenChange,
  coupleId,
  allDesires,
  onPreferencesUpdate
}: DesireCustomizationProps) {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [showAll, setShowAll] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [customDesires, setCustomDesires] = useState<Array<{ id: string; labelEn: string; labelEs: string }>>([]);
  const [newDesireEn, setNewDesireEn] = useState("");
  const [newDesireEs, setNewDesireEs] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadPreferences();
    }
  }, [open, coupleId]);

  const loadPreferences = async () => {
    const { data, error } = await supabase
      .from("couple_desire_preferences")
      .select("*")
      .eq("couple_id", coupleId)
      .maybeSingle();

    if (data) {
      setShowAll(data.show_all || false);
      setFavorites(data.favorite_desires || []);
      setCustomDesires(data.custom_desires || []);
    }
  };

  const toggleFavorite = (desireKey: string) => {
    setFavorites(prev => {
      if (prev.includes(desireKey)) {
        return prev.filter(k => k !== desireKey);
      } else {
        if (prev.length >= 20 && !showAll) {
          toast({
            title: language === 'es' ? 'Límite alcanzado' : 'Limit reached',
            description: language === 'es' ? 'Máximo 20 favoritos cuando no muestras todos' : 'Maximum 20 favorites when not showing all',
            variant: "destructive"
          });
          return prev;
        }
        return [...prev, desireKey];
      }
    });
  };

  const addCustomDesire = () => {
    if (!newDesireEn.trim() || !newDesireEs.trim()) {
      toast({
        title: language === 'es' ? 'Campos requeridos' : 'Required fields',
        description: language === 'es' ? 'Ingresa el deseo en ambos idiomas' : 'Enter the desire in both languages',
        variant: "destructive"
      });
      return;
    }

    const newDesire = {
      id: `custom_${Date.now()}`,
      labelEn: newDesireEn.trim(),
      labelEs: newDesireEs.trim()
    };

    setCustomDesires(prev => [...prev, newDesire]);
    setNewDesireEn("");
    setNewDesireEs("");
  };

  const removeCustomDesire = (id: string) => {
    setCustomDesires(prev => prev.filter(d => d.id !== id));
  };

  const savePreferences = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("couple_desire_preferences")
      .upsert({
        couple_id: coupleId,
        favorite_desires: favorites,
        custom_desires: customDesires,
        show_all: showAll,
        updated_at: new Date().toISOString()
      });

    if (error) {
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es' ? 'No se pudo guardar' : 'Failed to save',
        variant: "destructive"
      });
    } else {
      toast({
        title: language === 'es' ? '✨ Guardado' : '✨ Saved',
        description: language === 'es' ? 'Preferencias actualizadas' : 'Preferences updated'
      });
      onPreferencesUpdate();
      onOpenChange(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{language === 'es' ? 'Personalizar Deseos' : 'Customize Desires'}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Show All Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-base font-medium">
                  {language === 'es' ? 'Mostrar todos los deseos' : 'Show all desires'}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'es' ? 'O selecciona hasta 20 favoritos' : 'Or select up to 20 favorites'}
                </p>
              </div>
              <Switch checked={showAll} onCheckedChange={setShowAll} />
            </div>

            {/* Favorites Selection */}
            {!showAll && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    {language === 'es' ? 'Favoritos' : 'Favorites'} ({favorites.length}/20)
                  </Label>
                </div>
                <div className="grid gap-2">
                  {allDesires.map((desire) => (
                    <div
                      key={desire.key}
                      onClick={() => toggleFavorite(desire.key)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        favorites.includes(desire.key)
                          ? 'bg-primary/10 border-primary'
                          : 'bg-background hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {language === 'es' ? desire.labelEs : desire.labelEn}
                        </span>
                        {favorites.includes(desire.key) && (
                          <Badge variant="secondary" className="ml-2">✓</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Desires */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                {language === 'es' ? 'Deseos Personalizados' : 'Custom Desires'}
              </Label>
              
              {/* Add Custom Desire */}
              <div className="space-y-2">
                <Input
                  placeholder={language === 'es' ? 'Deseo en inglés' : 'Desire in English'}
                  value={newDesireEn}
                  onChange={(e) => setNewDesireEn(e.target.value)}
                />
                <Input
                  placeholder={language === 'es' ? 'Deseo en español' : 'Desire in Spanish'}
                  value={newDesireEs}
                  onChange={(e) => setNewDesireEs(e.target.value)}
                />
                <Button onClick={addCustomDesire} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Agregar' : 'Add'}
                </Button>
              </div>

              {/* Custom Desires List */}
              {customDesires.length > 0 && (
                <div className="space-y-2">
                  {customDesires.map((desire) => (
                    <div key={desire.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">
                        {language === 'es' ? desire.labelEs : desire.labelEn}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCustomDesire(desire.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            {language === 'es' ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button onClick={savePreferences} disabled={loading} className="flex-1">
            {language === 'es' ? 'Guardar' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
