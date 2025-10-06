import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Heart, Sparkles, Plus, Check, Lock, Unlock, Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface DesireVaultProps {
  coupleId: string;
  userId: string;
}

const categoryConfig = {
  fantasy: { color: 'bg-purple-500/10 border-purple-500/30 text-purple-600', emoji: '✨' },
  roleplay: { color: 'bg-pink-500/10 border-pink-500/30 text-pink-600', emoji: '🎭' },
  fetish: { color: 'bg-red-500/10 border-red-500/30 text-red-600', emoji: '🔥' },
  toy: { color: 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-600', emoji: '🎁' },
  position: { color: 'bg-rose-500/10 border-rose-500/30 text-rose-600', emoji: '💕' },
  location: { color: 'bg-orange-500/10 border-orange-500/30 text-orange-600', emoji: '📍' },
  intimate: { color: 'bg-red-600/10 border-red-600/30 text-red-700', emoji: '❤️' },
  romantic: { color: 'bg-pink-400/10 border-pink-400/30 text-pink-500', emoji: '🌹' },
  adventure: { color: 'bg-blue-500/10 border-blue-500/30 text-blue-600', emoji: '🌟' },
  experience: { color: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600', emoji: '💫' },
};

export const DesireVault = ({ coupleId, userId }: DesireVaultProps) => {
  const [desires, setDesires] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('fantasy');
  const [isPrivate, setIsPrivate] = useState(true);
  const [showFulfilled, setShowFulfilled] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchDesires();

    const channel = supabase
      .channel('desire_vault_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'desire_vault',
          filter: `couple_id=eq.${coupleId}`
        },
        () => {
          fetchDesires();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const fetchDesires = async () => {
    const { data, error } = await supabase
      .from('desire_vault')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching desires:', error);
      return;
    }

    setDesires(data || []);
  };

  const addDesire = async () => {
    if (!title.trim()) {
      toast({
        title: t('error'),
        description: t('desireTitleRequired'),
        variant: 'destructive',
      });
      return;
    }

    const { error } = await supabase.from('desire_vault').insert({
      couple_id: coupleId,
      user_id: userId,
      title,
      description,
      category,
      is_private: isPrivate,
    });

    if (error) {
      toast({
        title: t('error'),
        description: t('failedToAddDesire'),
        variant: 'destructive',
      });
      return;
    }

    setTitle('');
    setDescription('');
    setIsOpen(false);
    fetchDesires();
    toast({
      title: t('success'),
      description: t('desireAdded'),
    });
  };

  const toggleFulfilled = async (id: string, fulfilled: boolean) => {
    const { error } = await supabase
      .from('desire_vault')
      .update({ 
        fulfilled: !fulfilled,
        fulfilled_at: !fulfilled ? new Date().toISOString() : null 
      })
      .eq('id', id);

    if (!error) {
      fetchDesires();
      toast({
        title: !fulfilled ? t('desireFulfilled') : t('desireUnfulfilled'),
        description: !fulfilled ? '🔥' : '',
      });
    }
  };

  const deleteDesire = async (id: string) => {
    const { error } = await supabase
      .from('desire_vault')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      toast({
        title: t('error'),
        description: t('failedToDelete'),
        variant: 'destructive',
      });
    }
  };

  const activeDesires = desires.filter(d => !d.fulfilled);
  const fulfilledDesires = desires.filter(d => d.fulfilled);
  const displayedDesires = showFulfilled ? fulfilledDesires : activeDesires;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 shadow-glow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            {t('desireVault')}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFulfilled(!showFulfilled)}
              className="text-xs"
            >
              {showFulfilled ? t('showActive') : t('showFulfilled')}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              {t('addDesire')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('addNewDesire')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t('desireTitle')}</Label>
                <Input
                  id="title"
                  placeholder={t('desireTitlePlaceholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">{t('desireDescription')}</Label>
                <Textarea
                  id="description"
                  placeholder={t('desireDescriptionPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">{t('desireCategory')}</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fantasy">{t('category_fantasy')}</SelectItem>
                    <SelectItem value="roleplay">{t('category_roleplay')}</SelectItem>
                    <SelectItem value="fetish">{t('category_fetish')}</SelectItem>
                    <SelectItem value="toy">{t('category_toy')}</SelectItem>
                    <SelectItem value="position">{t('category_position')}</SelectItem>
                    <SelectItem value="location">{t('category_location')}</SelectItem>
                    <SelectItem value="intimate">{t('category_intimate')}</SelectItem>
                    <SelectItem value="romantic">{t('category_romantic')}</SelectItem>
                    <SelectItem value="adventure">{t('category_adventure')}</SelectItem>
                    <SelectItem value="experience">{t('category_experience')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <Label htmlFor="private" className="cursor-pointer flex items-center gap-2">
                  {isPrivate ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  <span>{isPrivate ? t('onlyMeCanSee') : t('partnerCanSee')}</span>
                </Label>
                <Switch
                  id="private"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
              </div>
              
              <Button onClick={addDesire} className="w-full">{t('addToVault')}</Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {displayedDesires.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">
                {showFulfilled ? t('noFulfilledDesires') : t('noActiveDesires')}
              </p>
            </div>
          ) : (
            displayedDesires.map((desire) => {
              const config = categoryConfig[desire.category as keyof typeof categoryConfig];
              const isMine = desire.user_id === userId;
              const canView = !desire.is_private || isMine;

              if (!canView) return null;

              return (
                <Card 
                  key={desire.id} 
                  className={cn(
                    "transition-all hover:shadow-md",
                    desire.fulfilled && "opacity-60"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xl">{config?.emoji}</span>
                          <h4 className="font-medium truncate">{desire.title}</h4>
                          {desire.is_private && (
                            <Badge variant="secondary" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              {t('private')}
                            </Badge>
                          )}
                          <Badge variant="outline" className={cn("text-xs", config?.color)}>
                            {t(`category_${desire.category}` as any)}
                          </Badge>
                        </div>
                        {desire.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {desire.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={desire.fulfilled ? 'secondary' : 'ghost'}
                          onClick={() => toggleFulfilled(desire.id, desire.fulfilled)}
                          className="shrink-0"
                        >
                          {desire.fulfilled ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        </Button>
                        {isMine && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteDesire(desire.id)}
                            className="shrink-0 hover:text-destructive"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          {showFulfilled 
            ? `${fulfilledDesires.length} ${t('fulfilled')}`
            : `${activeDesires.length} ${t('active')}`}
        </div>
      </CardContent>
    </Card>
  );
};
