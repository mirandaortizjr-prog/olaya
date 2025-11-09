import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getGenderedMood } from "@/lib/translations";
import { useUserGender } from "@/hooks/useUserGender";

// Mood configuration with translation keys
const getMoodCategories = (t: any, gender: string | null, language: any) => [
  {
    titleKey: "moodCategoryPositive",
    subtitleKey: "moodSubtitleHighEnergy",
    color: "text-yellow-400",
    moods: [
      { key: "mood_ecstatic", label: getGenderedMood("mood_ecstatic", gender, language) },
      { key: "mood_elated", label: getGenderedMood("mood_elated", gender, language) },
      { key: "mood_euphoric", label: getGenderedMood("mood_euphoric", gender, language) },
      { key: "mood_giddy", label: getGenderedMood("mood_giddy", gender, language) },
      { key: "mood_playful", label: t("mood_playful") },
      { key: "mood_flirtatious", label: getGenderedMood("mood_flirtatious", gender, language) },
      { key: "mood_excited", label: t("mood_excited") },
      { key: "mood_jubilant", label: getGenderedMood("mood_jubilant", gender, language) },
      { key: "mood_triumphant", label: getGenderedMood("mood_triumphant", gender, language) },
      { key: "mood_inspired", label: getGenderedMood("mood_inspired", gender, language) }
    ]
  },
  {
    titleKey: "moodCategoryWarmContent",
    color: "text-pink-400",
    moods: [
      { key: "mood_loved", label: getGenderedMood("mood_loved", gender, language) },
      { key: "mood_grateful", label: t("mood_grateful") },
      { key: "mood_peaceful", label: t("mood_peaceful") },
      { key: "mood_safe", label: getGenderedMood("mood_safe", gender, language) },
      { key: "mood_cozy", label: getGenderedMood("mood_cozy", gender, language) },
      { key: "mood_affectionate", label: getGenderedMood("mood_affectionate", gender, language) },
      { key: "mood_fulfilled", label: getGenderedMood("mood_fulfilled", gender, language) },
      { key: "mood_hopeful", label: getGenderedMood("mood_hopeful", gender, language) },
      { key: "mood_proud", label: getGenderedMood("mood_proud", gender, language) },
      { key: "mood_serene", label: getGenderedMood("mood_serene", gender, language) }
    ]
  },
  {
    titleKey: "moodCategoryRomantic",
    color: "text-rose-400",
    moods: [
      { key: "mood_inLove", label: getGenderedMood("mood_inLove", gender, language) },
      { key: "mood_tender", label: t("mood_tender") },
      { key: "mood_passionate", label: getGenderedMood("mood_passionate", gender, language) },
      { key: "mood_longing", label: getGenderedMood("mood_longing", gender, language) },
      { key: "mood_connected", label: getGenderedMood("mood_connected", gender, language) },
      { key: "mood_turnedOn", label: getGenderedMood("mood_turnedOn", gender, language) },
      { key: "mood_vulnerable", label: getGenderedMood("mood_vulnerable", gender, language) },
      { key: "mood_cravingCloseness", label: getGenderedMood("mood_cravingCloseness", gender, language) }
    ]
  },
  {
    titleKey: "moodCategoryNeutral",
    color: "text-gray-300",
    moods: [
      { key: "mood_curious", label: getGenderedMood("mood_curious", gender, language) },
      { key: "mood_thoughtful", label: getGenderedMood("mood_thoughtful", gender, language) },
      { key: "mood_pensive", label: getGenderedMood("mood_pensive", gender, language) },
      { key: "mood_dreamy", label: getGenderedMood("mood_dreamy", gender, language) },
      { key: "mood_nostalgic", label: getGenderedMood("mood_nostalgic", gender, language) },
      { key: "mood_indifferent", label: getGenderedMood("mood_indifferent", gender, language) },
      { key: "mood_distracted", label: getGenderedMood("mood_distracted", gender, language) },
      { key: "mood_ambivalent", label: getGenderedMood("mood_ambivalent", gender, language) },
      { key: "mood_observant", label: getGenderedMood("mood_observant", gender, language) },
      { key: "mood_open", label: getGenderedMood("mood_open", gender, language) }
    ]
  },
  {
    titleKey: "moodCategoryNegative",
    subtitleKey: "moodSubtitleLowEnergy",
    color: "text-blue-400",
    moods: [
      { key: "mood_lonely", label: getGenderedMood("mood_lonely", gender, language) },
      { key: "mood_disappointed", label: getGenderedMood("mood_disappointed", gender, language) },
      { key: "mood_hurt", label: getGenderedMood("mood_hurt", gender, language) },
      { key: "mood_melancholy", label: getGenderedMood("mood_melancholy", gender, language) },
      { key: "mood_numb", label: getGenderedMood("mood_numb", gender, language) },
      { key: "mood_rejected", label: getGenderedMood("mood_rejected", gender, language) },
      { key: "mood_insecure", label: getGenderedMood("mood_insecure", gender, language) },
      { key: "mood_discouraged", label: getGenderedMood("mood_discouraged", gender, language) },
      { key: "mood_homesick", label: getGenderedMood("mood_homesick", gender, language) },
      { key: "mood_drained", label: getGenderedMood("mood_drained", gender, language) }
    ]
  },
  {
    titleKey: "moodCategoryDistressed",
    color: "text-red-400",
    moods: [
      { key: "mood_anxious", label: t("mood_anxious") },
      { key: "mood_frustrated", label: t("mood_frustrated") },
      { key: "mood_angry", label: getGenderedMood("mood_angry", gender, language) },
      { key: "mood_jealous", label: getGenderedMood("mood_jealous", gender, language) },
      { key: "mood_overwhelmed", label: getGenderedMood("mood_overwhelmed", gender, language) },
      { key: "mood_defensive", label: getGenderedMood("mood_defensive", gender, language) },
      { key: "mood_irritated", label: getGenderedMood("mood_irritated", gender, language) },
      { key: "mood_resentful", label: getGenderedMood("mood_resentful", gender, language) },
      { key: "mood_restless", label: getGenderedMood("mood_restless", gender, language) },
      { key: "mood_misunderstood", label: getGenderedMood("mood_misunderstood", gender, language) }
    ]
  },
  {
    titleKey: "moodCategorySexual",
    color: "text-fuchsia-400",
    moods: [
      { key: "mood_horny", label: t("mood_horny") },
      { key: "mood_ravenous", label: getGenderedMood("mood_ravenous", gender, language) },
      { key: "mood_thirsty", label: getGenderedMood("mood_thirsty", gender, language) },
      { key: "mood_lustful", label: getGenderedMood("mood_lustful", gender, language) },
      { key: "mood_feral", label: getGenderedMood("mood_feral", gender, language) },
      { key: "mood_needy", label: getGenderedMood("mood_needy", gender, language) },
      { key: "mood_overheated", label: getGenderedMood("mood_overheated", gender, language) },
      { key: "mood_starved", label: getGenderedMood("mood_starved", gender, language) },
      { key: "mood_obsessed", label: getGenderedMood("mood_obsessed", gender, language) },
      { key: "mood_frisky", label: getGenderedMood("mood_frisky", gender, language) }
    ]
  }
];

export const MoodCustomization = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [customMood, setCustomMood] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [currentMood, setCurrentMood] = useState<string>("");
  const [personalizedMoods, setPersonalizedMoods] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [coupleId, setCoupleId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const { gender } = useUserGender(userId);

  const MOOD_CATEGORIES = getMoodCategories(t, gender, language);

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
