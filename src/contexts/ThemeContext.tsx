import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type ColorPalette = 'default' | 'feminine' | 'masculine';

interface ThemeContextType {
  palette: ColorPalette;
  setPalette: (palette: ColorPalette, coupleId?: string) => void;
  coupleId: string | null;
  setCoupleId: (id: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const palettes = {
  default: {
    '--primary': '330 65% 48%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '280 55% 45%',
    '--secondary-foreground': '0 0% 100%',
    '--accent': '25 75% 55%',
    '--accent-foreground': '0 0% 100%',
    '--gradient-romantic': 'linear-gradient(135deg, hsl(330 65% 48%), hsl(280 55% 50%))',
    '--gradient-vibrant': 'linear-gradient(135deg, hsl(330 65% 48%), hsl(25 75% 55%))',
  },
  feminine: {
    '--primary': '340 80% 60%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '320 70% 65%',
    '--secondary-foreground': '0 0% 100%',
    '--accent': '280 60% 70%',
    '--accent-foreground': '0 0% 100%',
    '--gradient-romantic': 'linear-gradient(135deg, hsl(340 80% 60%), hsl(320 70% 65%))',
    '--gradient-vibrant': 'linear-gradient(135deg, hsl(340 80% 60%), hsl(280 60% 70%))',
  },
  masculine: {
    '--primary': '220 70% 50%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '200 60% 45%',
    '--secondary-foreground': '0 0% 100%',
    '--accent': '180 50% 50%',
    '--accent-foreground': '0 0% 100%',
    '--gradient-romantic': 'linear-gradient(135deg, hsl(220 70% 50%), hsl(200 60% 45%))',
    '--gradient-vibrant': 'linear-gradient(135deg, hsl(220 70% 50%), hsl(180 50% 50%))',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [palette, setPaletteState] = useState<ColorPalette>('default');
  const [coupleId, setCoupleId] = useState<string | null>(null);

  const setPalette = async (newPalette: ColorPalette, cId?: string) => {
    setPaletteState(newPalette);
    
    // Update database if couple ID is available
    const targetCoupleId = cId || coupleId;
    if (targetCoupleId) {
      try {
        await supabase
          .from('couples')
          .update({ theme: newPalette })
          .eq('id', targetCoupleId);
      } catch (error) {
        console.error('Error updating theme:', error);
      }
    }
  };

  // Load theme from database when couple ID changes
  useEffect(() => {
    if (!coupleId) return;

    const loadTheme = async () => {
      const { data } = await supabase
        .from('couples')
        .select('theme')
        .eq('id', coupleId)
        .single();

      if (data?.theme) {
        setPaletteState(data.theme as ColorPalette);
      }
    };

    loadTheme();

    // Subscribe to theme changes
    const channel = supabase
      .channel('theme-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'couples',
          filter: `id=eq.${coupleId}`
        },
        (payload: any) => {
          if (payload.new?.theme) {
            setPaletteState(payload.new.theme as ColorPalette);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  useEffect(() => {
    const root = document.documentElement;
    const paletteColors = palettes[palette];
    
    Object.entries(paletteColors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [palette]);

  return (
    <ThemeContext.Provider value={{ palette, setPalette, coupleId, setCoupleId }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
