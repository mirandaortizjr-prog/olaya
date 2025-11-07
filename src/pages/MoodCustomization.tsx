import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

// Mood configuration with translation keys
const getMoodCategories = (t: any) => [
  {
    titleKey: "moodCategoryPositive",
    subtitleKey: "moodSubtitleHighEnergy",
    color: "text-yellow-400",
    moods: [
      { key: "mood_ecstatic", label: t("mood_ecstatic") },
      { key: "mood_elated", label: t("mood_elated") },
      { key: "mood_euphoric", label: t("mood_euphoric") },
      { key: "mood_giddy", label: t("mood_giddy") },
      { key: "mood_playful", label: t("mood_playful") },
      { key: "mood_flirtatious", label: t("mood_flirtatious") },
      { key: "mood_excited", label: t("mood_excited") },
      { key: "mood_jubilant", label: t("mood_jubilant") },
      { key: "mood_triumphant", label: t("mood_triumphant") },
      { key: "mood_inspired", label: t("mood_inspired") }
    ]
  },
  {
    titleKey: "moodCategoryWarmContent",
    color: "text-pink-400",
    moods: [
      { key: "mood_loved", label: t("mood_loved") },
      { key: "mood_grateful", label: t("mood_grateful") },
      { key: "mood_peaceful", label: t("mood_peaceful") },
      { key: "mood_safe", label: t("mood_safe") },
      { key: "mood_cozy", label: t("mood_cozy") },
      { key: "mood_affectionate", label: t("mood_affectionate") },
      { key: "mood_fulfilled", label: t("mood_fulfilled") },
      { key: "mood_hopeful", label: t("mood_hopeful") },
      { key: "mood_proud", label: t("mood_proud") },
      { key: "mood_serene", label: t("mood_serene") }
    ]
  },
  {
    titleKey: "moodCategoryRomantic",
    color: "text-rose-400",
    moods: [
      { key: "mood_inLove", label: t("mood_inLove") },
      { key: "mood_tender", label: t("mood_tender") },
      { key: "mood_passionate", label: t("mood_passionate") },
      { key: "mood_longing", label: t("mood_longing") },
      { key: "mood_connected", label: t("mood_connected") },
      { key: "mood_turnedOn", label: t("mood_turnedOn") },
      { key: "mood_vulnerable", label: t("mood_vulnerable") },
      { key: "mood_cravingCloseness", label: t("mood_cravingCloseness") }
    ]
  },
  {
    titleKey: "moodCategoryNeutral",
    color: "text-gray-300",
    moods: [
      { key: "mood_curious", label: t("mood_curious") },
      { key: "mood_thoughtful", label: t("mood_thoughtful") },
      { key: "mood_pensive", label: t("mood_pensive") },
      { key: "mood_dreamy", label: t("mood_dreamy") },
      { key: "mood_nostalgic", label: t("mood_nostalgic") },
      { key: "mood_indifferent", label: t("mood_indifferent") },
      { key: "mood_distracted", label: t("mood_distracted") },
      { key: "mood_ambivalent", label: t("mood_ambivalent") },
      { key: "mood_observant", label: t("mood_observant") },
      { key: "mood_open", label: t("mood_open") }
    ]
  },
  {
    titleKey: "moodCategoryNegative",
    subtitleKey: "moodSubtitleLowEnergy",
    color: "text-blue-400",
    moods: [
      { key: "mood_lonely", label: t("mood_lonely") },
      { key: "mood_disappointed", label: t("mood_disappointed") },
      { key: "mood_hurt", label: t("mood_hurt") },
      { key: "mood_melancholy", label: t("mood_melancholy") },
      { key: "mood_numb", label: t("mood_numb") },
      { key: "mood_rejected", label: t("mood_rejected") },
      { key: "mood_insecure", label: t("mood_insecure") },
      { key: "mood_discouraged", label: t("mood_discouraged") },
      { key: "mood_homesick", label: t("mood_homesick") },
      { key: "mood_drained", label: t("mood_drained") }
    ]
  },
  {
    titleKey: "moodCategoryDistressed",
    color: "text-red-400",
    moods: [
      { key: "mood_anxious", label: t("mood_anxious") },
      { key: "mood_frustrated", label: t("mood_frustrated") },
      { key: "mood_angry", label: t("mood_angry") },
      { key: "mood_jealous", label: t("mood_jealous") },
      { key: "mood_overwhelmed", label: t("mood_overwhelmed") },
      { key: "mood_defensive", label: t("mood_defensive") },
      { key: "mood_irritated", label: t("mood_irritated") },
      { key: "mood_resentful", label: t("mood_resentful") },
      { key: "mood_restless", label: t("mood_restless") },
      { key: "mood_misunderstood", label: t("mood_misunderstood") }
    ]
  },
  {
    titleKey: "moodCategorySexual",
    color: "text-fuchsia-400",
    moods: [
      { key: "mood_horny", label: t("mood_horny") },
      { key: "mood_ravenous", label: t("mood_ravenous") },
      { key: "mood_thirsty", label: t("mood_thirsty") },
      { key: "mood_lustful", label: t("mood_lustful") },
      { key: "mood_feral", label: t("mood_feral") },
      { key: "mood_needy", label: t("mood_needy") },
      { key: "mood_overheated", label: t("mood_overheated") },
      { key: "mood_starved", label: t("mood_starved") },
      { key: "mood_obsessed", label: t("mood_obsessed") },
      { key: "mood_frisky", label: t("mood_frisky") }
    ]
  }
];

export const MoodCustomization = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [customMood, setCustomMood] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [currentMood, setCurrentMood] = useState<string>("");
  const [personalizedMoods, setPersonalizedMoods] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [coupleId, setCoupleId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const MOOD_CATEGORIES = getMoodCategories(t);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUserId(user.id);

    const { data: membership } = await supabase
      .from('couple_members')
      .select('couple_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (membership) {
      setCoupleId(membership.couple_id);
      loadCurrentMood(membership.couple_id, user.id);
      loadPersonalizedMoods(membership.couple_id, user.id);
    }
  };

  const loadCurrentMood = async (cId: string, uId: string) => {
    const { data } = await supabase
      .from('feeling_status')
      .select('status, custom_message')
      .eq('couple_id', cId)
      .eq('user_id', uId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setCurrentMood(data.custom_message || data.status);
    }
  };

  const loadPersonalizedMoods = async (cId: string, uId: string) => {
    const { data } = await supabase
      .from('couple_preferences')
      .select('enabled_items')
      .eq('couple_id', cId)
      .eq('preference_type', 'personalized_moods')
      .maybeSingle();

    if (data?.enabled_items) {
      setPersonalizedMoods(data.enabled_items as string[]);
    }
  };

  const toggleMoodSelection = (mood: string) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter(m => m !== mood));
    } else if (selectedMoods.length < 20) {
      setSelectedMoods([...selectedMoods, mood]);
    } else {
      toast({ title: "Maximum 20 moods", description: "You can select up to 20 moods", variant: "destructive" });
    }
  };

  const savePersonalizedMoods = async () => {
    if (selectedMoods.length === 0) {
      toast({ title: "Select at least one mood", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('couple_preferences')
      .upsert({
        couple_id: coupleId,
        preference_type: 'personalized_moods',
        enabled_items: selectedMoods
      }, { onConflict: 'couple_id,preference_type' });

    setSaving(false);

    if (error) {
      toast({ title: "Error saving moods", variant: "destructive" });
    } else {
      toast({ title: "Moods saved!" });
      setPersonalizedMoods(selectedMoods);
      setSelectedMoods([]);
    }
  };

  const updateCurrentMood = async (mood: string) => {
    setSaving(true);
    const { error } = await supabase
      .from('feeling_status')
      .upsert({
        user_id: userId,
        couple_id: coupleId,
        status: 'custom',
        custom_message: mood,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,couple_id' });

    setSaving(false);

    if (error) {
      toast({ title: "Error updating mood", variant: "destructive" });
    } else {
      toast({ title: "Mood updated!" });
      setCurrentMood(mood);
      navigate("/dashboard");
    }
  };

  const saveCustomMood = () => {
    if (!customMood.trim()) {
      toast({ title: "Please enter a mood", variant: "destructive" });
      return;
    }
    updateCurrentMood(customMood.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-purple-400 hover:text-purple-300"
          >
            <X className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">{t('moodCustomizeTitle')}</h1>
          <div className="w-10" />
        </div>

        {/* Instructions */}
        <p className="text-center text-gray-300 mb-8">
          {t('moodCustomizeInstructions')}
        </p>

        {/* Current Mood Display */}
        {currentMood && (
          <Card className="bg-gray-800/50 border-gray-700 p-4 mb-6 text-center">
            <p className="text-sm text-gray-400 mb-1">{t('moodCurrentMood')}</p>
            <p className="text-lg font-semibold text-purple-300">{currentMood}</p>
          </Card>
        )}

        {/* Personalized Moods Section */}
        {personalizedMoods.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">{t('moodPersonalizedMoods')}</h2>
            <div className="grid grid-cols-2 gap-2">
              {personalizedMoods.map((mood) => (
                <Button
                  key={mood}
                  variant="outline"
                  className="bg-purple-600/20 border-purple-500/50 text-white hover:bg-purple-600/40"
                  onClick={() => updateCurrentMood(mood)}
                  disabled={saving}
                >
                  {mood}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Selection Mode Controls */}
        {selectedMoods.length > 0 && (
          <div className="mb-6 bg-purple-600/20 border border-purple-500/50 rounded-lg p-4">
            <p className="text-sm mb-2">{t('moodSelected')}: {selectedMoods.length}/20</p>
            <div className="flex gap-2">
              <Button
                onClick={savePersonalizedMoods}
                disabled={saving}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {t('moodSavePersonalized')}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedMoods([])}
                disabled={saving}
              >
                {t('moodClear')}
              </Button>
            </div>
          </div>
        )}

        {/* Mood Categories */}
        <div className="space-y-8">
          {MOOD_CATEGORIES.map((category, idx) => (
            <div key={idx}>
              <h2 className={`text-lg font-semibold mb-2 ${category.color}`}>
                {t(category.titleKey as any)}
                {category.subtitleKey && <span className="text-sm ml-2">/ {t(category.subtitleKey as any)}</span>}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {category.moods.map((mood) => (
                  <div key={mood.key} className="relative">
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${
                        selectedMoods.includes(mood.label)
                          ? 'bg-yellow-500/30 border-yellow-400'
                          : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                      }`}
                      onClick={() => updateCurrentMood(mood.label)}
                      disabled={saving}
                    >
                      - {mood.label}
                    </Button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMoodSelection(mood.label);
                      }}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                        selectedMoods.includes(mood.label) ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'
                      }`}
                      disabled={saving}
                    >
                      <Star className="w-4 h-4" fill={selectedMoods.includes(mood.label) ? "currentColor" : "none"} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Customize Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">{t('moodCustomize')}</h2>
          {!showCustomInput ? (
            <Button
              variant="outline"
              className="w-full bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
              onClick={() => setShowCustomInput(true)}
            >
              {t('moodWriteOwn')}
            </Button>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder={t('moodEnterYourMood')}
                value={customMood}
                onChange={(e) => setCustomMood(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveCustomMood()}
                className="bg-gray-800/50 border-gray-700 text-white"
                autoFocus
              />
              <div className="flex gap-2">
                <Button onClick={saveCustomMood} disabled={saving || !customMood.trim()} className="flex-1">
                  {t('moodSetMood')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomMood("");
                  }}
                  disabled={saving}
                >
                  {t('cancel')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
    </div>
  );
};
