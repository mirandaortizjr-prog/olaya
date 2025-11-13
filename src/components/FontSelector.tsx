import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

interface FontSelectorProps {
  userId: string;
  currentFont?: string;
  onFontChange?: (font: string) => void;
}

const fontOptions = [
  { id: 'default', name: 'Default', class: 'font-default', example: 'Clean & Modern' },
  { id: 'elegant', name: 'Elegant', class: 'font-elegant', example: 'Sophisticated & Timeless' },
  { id: 'modern', name: 'Modern', class: 'font-modern', example: 'Bold & Contemporary' },
  { id: 'romantic', name: 'Romantic', class: 'font-romantic', example: 'Flowing & Beautiful' },
  { id: 'classic', name: 'Classic', class: 'font-classic', example: 'Traditional & Refined' },
  { id: 'sophisticated', name: 'Sophisticated', class: 'font-sophisticated', example: 'Graceful & Polished' },
  { id: 'playful', name: 'Playful', class: 'font-playful', example: 'Fun & Expressive' },
  { id: 'casual', name: 'Casual', class: 'font-casual', example: 'Relaxed & Friendly' },
];

export const FontSelector = ({ userId, currentFont = 'default', onFontChange }: FontSelectorProps) => {
  const { toast } = useToast();
  const [selectedFont, setSelectedFont] = useState(currentFont);
  const [saving, setSaving] = useState(false);

  const handleSelectFont = async (fontId: string) => {
    setSelectedFont(fontId);
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ font_preference: fontId })
        .eq('id', userId);

      if (error) throw error;

      // Apply font to document root
      document.documentElement.className = document.documentElement.className
        .split(' ')
        .filter(c => !c.startsWith('font-'))
        .concat(`font-${fontId}`)
        .join(' ');

      toast({
        title: "Font updated!",
        description: "Your font preference has been saved",
      });

      onFontChange?.(fontId);
    } catch (error) {
      console.error('Error saving font:', error);
      toast({
        title: "Save failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Your Font</h3>
        <p className="text-sm text-muted-foreground">
          Select a font that matches your style
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {fontOptions.map((font) => (
          <Card
            key={font.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedFont === font.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleSelectFont(font.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">{font.name}</p>
                  {selectedFont === font.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className={`text-lg ${font.class}`}>{font.example}</p>
              </div>
              {saving && selectedFont === font.id && (
                <div className="text-xs text-muted-foreground">Saving...</div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
