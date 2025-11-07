import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

// Flirt configuration with translation keys
const getFlirtCategories = (t: any) => [
  {
    titleKey: "flirtCategoryClassical",
    emoji: "💋",
    color: "text-pink-400",
    flirts: [
      { key: "flirt_kiss", label: t("flirt_kiss") },
      { key: "flirt_wink", label: t("flirt_wink") },
      { key: "flirt_lick", label: t("flirt_lick") },
      { key: "flirt_bite", label: t("flirt_bite") },
      { key: "flirt_hug", label: t("flirt_hug") },
      { key: "flirt_cuddle", label: t("flirt_cuddle") },
      { key: "flirt_nuzzle", label: t("flirt_nuzzle") },
      { key: "flirt_caress", label: t("flirt_caress") },
      { key: "flirt_stroke", label: t("flirt_stroke") },
      { key: "flirt_graze", label: t("flirt_graze") },
      { key: "flirt_tickle", label: t("flirt_tickle") },
      { key: "flirt_tease", label: t("flirt_tease") },
      { key: "flirt_squeeze", label: t("flirt_squeeze") },
      { key: "flirt_tap", label: t("flirt_tap") },
      { key: "flirt_tug", label: t("flirt_tug") },
      { key: "flirt_pullCloser", label: t("flirt_pullCloser") },
      { key: "flirt_brushLips", label: t("flirt_brushLips") },
      { key: "flirt_traceSkin", label: t("flirt_traceSkin") },
      { key: "flirt_holdHands", label: t("flirt_holdHands") },
      { key: "flirt_restHeadOnShoulder", label: t("flirt_restHeadOnShoulder") }
    ]
  },
  {
    titleKey: "flirtCategoryPlayful",
    emoji: "😊",
    color: "text-yellow-400",
    flirts: [
      { key: "flirt_pout", label: t("flirt_pout") },
      { key: "flirt_giggle", label: t("flirt_giggle") },
      { key: "flirt_chase", label: t("flirt_chase") },
      { key: "flirt_hideAndSeek", label: t("flirt_hideAndSeek") },
      { key: "flirt_peekaboo", label: t("flirt_peekaboo") },
      { key: "flirt_fakeJealousy", label: t("flirt_fakeJealousy") },
      { key: "flirt_playFight", label: t("flirt_playFight") },
      { key: "flirt_stealBlanket", label: t("flirt_stealBlanket") },
      { key: "flirt_stealKiss", label: t("flirt_stealKiss") },
      { key: "flirt_flashSmile", label: t("flirt_flashSmile") },
      { key: "flirt_raiseEyebrow", label: t("flirt_raiseEyebrow") },
      { key: "flirt_sendEmoji", label: t("flirt_sendEmoji") },
      { key: "flirt_sendVoiceNote", label: t("flirt_sendVoiceNote") },
      { key: "flirt_leaveLipstickMark", label: t("flirt_leaveLipstickMark") },
      { key: "flirt_sendSecretPhoto", label: t("flirt_sendSecretPhoto") },
      { key: "flirt_sendCodedMessage", label: t("flirt_sendCodedMessage") },
      { key: "flirt_pretendToIgnore", label: t("flirt_pretendToIgnore") },
      { key: "flirt_complimentSneakily", label: t("flirt_complimentSneakily") },
      { key: "flirt_flirtThenFlee", label: t("flirt_flirtThenFlee") }
    ]
  },
  {
    titleKey: "flirtCategorySensual",
    emoji: "🔥",
    color: "text-orange-400",
    flirts: [
      { key: "flirt_whisperInEar", label: t("flirt_whisperInEar") },
      { key: "flirt_slowGaze", label: t("flirt_slowGaze") },
      { key: "flirt_lipBite", label: t("flirt_lipBite") },
      { key: "flirt_neckKiss", label: t("flirt_neckKiss") },
      { key: "flirt_backTouch", label: t("flirt_backTouch") },
      { key: "flirt_hipPull", label: t("flirt_hipPull") },
      { key: "flirt_hairTug", label: t("flirt_hairTug") },
      { key: "flirt_fingerTrail", label: t("flirt_fingerTrail") },
      { key: "flirt_breathOnSkin", label: t("flirt_breathOnSkin") },
      { key: "flirt_tongueFlick", label: t("flirt_tongueFlick") },
      { key: "flirt_collarGrab", label: t("flirt_collarGrab") },
      { key: "flirt_shirtLift", label: t("flirt_shirtLift") },
      { key: "flirt_thighTouch", label: t("flirt_thighTouch") },
      { key: "flirt_moanSoftly", label: t("flirt_moanSoftly") },
      { key: "flirt_pinGently", label: t("flirt_pinGently") },
      { key: "flirt_straddle", label: t("flirt_straddle") },
      { key: "flirt_lapSit", label: t("flirt_lapSit") },
      { key: "flirt_undoButton", label: t("flirt_undoButton") },
      { key: "flirt_slideHandUnder", label: t("flirt_slideHandUnder") }
    ]
  },
  {
    titleKey: "flirtCategoryVerbal",
    emoji: "🗣️",
    color: "text-amber-400",
    flirts: [
      { key: "flirt_iMissYou", label: t("flirt_iMissYou") },
      { key: "flirt_youreTrouble", label: t("flirt_youreTrouble") },
      { key: "flirt_youreMine", label: t("flirt_youreMine") },
      { key: "flirt_sayItAgain", label: t("flirt_sayItAgain") },
      { key: "flirt_youMakeMeBlush", label: t("flirt_youMakeMeBlush") },
      { key: "flirt_iDareYou", label: t("flirt_iDareYou") },
      { key: "flirt_youreSoHot", label: t("flirt_youreSoHot") },
      { key: "flirt_iWantYouNow", label: t("flirt_iWantYouNow") },
      { key: "flirt_youreIrresistible", label: t("flirt_youreIrresistible") },
      { key: "flirt_favoriteDistraction", label: t("flirt_favoriteDistraction") },
      { key: "flirt_thinkingLastNight", label: t("flirt_thinkingLastNight") },
      { key: "flirt_reasonISmile", label: t("flirt_reasonISmile") },
      { key: "flirt_notWearingAnything", label: t("flirt_notWearingAnything") },
      { key: "flirt_guessWhatImImagining", label: t("flirt_guessWhatImImagining") },
      { key: "flirt_youreMyWeakness", label: t("flirt_youreMyWeakness") }
    ]
  }
];

export const FlirtCustomization = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedFlirts, setSelectedFlirts] = useState<string[]>([]);
  const [customFlirt, setCustomFlirt] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [personalizedFlirts, setPersonalizedFlirts] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [coupleId, setCoupleId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const FLIRT_CATEGORIES = getFlirtCategories(t);

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
      loadPersonalizedFlirts(membership.couple_id, user.id);
    }
  };

  const loadPersonalizedFlirts = async (cId: string, uId: string) => {
    const { data } = await supabase
      .from('couple_preferences')
      .select('enabled_items')
      .eq('couple_id', cId)
      .eq('preference_type', 'personalized_flirts')
      .maybeSingle();

    if (data?.enabled_items) {
      setPersonalizedFlirts(data.enabled_items as string[]);
    }
  };

  const toggleFlirtSelection = (flirt: string) => {
    if (selectedFlirts.includes(flirt)) {
      setSelectedFlirts(selectedFlirts.filter(f => f !== flirt));
    } else if (selectedFlirts.length < 20) {
      setSelectedFlirts([...selectedFlirts, flirt]);
    } else {
      toast({ title: t("flirtMaximum20"), variant: "destructive" });
    }
  };

  const savePersonalizedFlirts = async () => {
    if (selectedFlirts.length === 0) {
      toast({ title: t("flirtSelectAtLeastOne"), variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('couple_preferences')
      .upsert({
        couple_id: coupleId,
        preference_type: 'personalized_flirts',
        enabled_items: selectedFlirts
      }, { onConflict: 'couple_id,preference_type' });

    setSaving(false);

    if (error) {
      toast({ title: t("flirtErrorSaving"), variant: "destructive" });
    } else {
      toast({ title: t("flirtsSaved") });
      setPersonalizedFlirts(selectedFlirts);
      setSelectedFlirts([]);
    }
  };

  const sendFlirt = async (flirt: string) => {
    if (!coupleId || !userId) return;

    setSaving(true);
    
    // Create a post with the flirt
    const { error } = await supabase
      .from('posts')
      .insert({
        couple_id: coupleId,
        author_id: userId,
        content: `💋 ${flirt}`
      });

    setSaving(false);

    if (error) {
      toast({ title: t("flirtErrorSending"), variant: "destructive" });
    } else {
      toast({ title: t("flirtSent") });
      navigate("/dashboard");
    }
  };

  const saveCustomFlirt = () => {
    if (!customFlirt.trim()) {
      toast({ title: t("flirtEnterCustom"), variant: "destructive" });
      return;
    }
    sendFlirt(customFlirt.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-purple-300 hover:text-purple-200"
          >
            <X className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">{t('flirtCustomizeTitle')}</h1>
          <div className="w-10" />
        </div>

        {/* Instructions */}
        <p className="text-center text-purple-200 mb-8">
          {t('flirtCustomizeInstructions')}
        </p>

        {/* Personalized Flirts Section */}
        {personalizedFlirts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-purple-200">{t('flirtPersonalizedFlirts')}</h2>
            <div className="grid grid-cols-2 gap-2">
              {personalizedFlirts.map((flirt) => (
                <Button
                  key={flirt}
                  variant="outline"
                  className="bg-purple-600/30 border-purple-400/50 text-white hover:bg-purple-600/50"
                  onClick={() => sendFlirt(flirt)}
                  disabled={saving}
                >
                  {flirt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Selection Mode Controls */}
        {selectedFlirts.length > 0 && (
          <div className="mb-6 bg-purple-600/30 border border-purple-400/50 rounded-lg p-4">
            <p className="text-sm mb-2">{t('flirtSelected')}: {selectedFlirts.length}/20</p>
            <div className="flex gap-2">
              <Button
                onClick={savePersonalizedFlirts}
                disabled={saving}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {t('flirtSavePersonalized')}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedFlirts([])}
                disabled={saving}
              >
                {t('moodClear')}
              </Button>
            </div>
          </div>
        )}

        {/* Flirt Categories */}
        <div className="space-y-8">
          {FLIRT_CATEGORIES.map((category, idx) => (
            <div key={idx}>
              <h2 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${category.color}`}>
                <span className="text-2xl">{category.emoji}</span>
                {t(category.titleKey as any)}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {category.flirts.map((flirt) => (
                  <div key={flirt.key} className="relative">
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left ${
                        selectedFlirts.includes(flirt.label)
                          ? 'bg-yellow-500/30 border-yellow-400'
                          : 'bg-purple-800/30 border-purple-600/50 hover:bg-purple-700/40'
                      }`}
                      onClick={() => sendFlirt(flirt.label)}
                      disabled={saving}
                    >
                      - {flirt.label}
                    </Button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlirtSelection(flirt.label);
                      }}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                        selectedFlirts.includes(flirt.label) ? 'text-yellow-400' : 'text-purple-400 hover:text-yellow-400'
                      }`}
                      disabled={saving}
                    >
                      <Star className="w-4 h-4" fill={selectedFlirts.includes(flirt.label) ? "currentColor" : "none"} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Customize Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-purple-200">{t('moodCustomize')}</h2>
          {!showCustomInput ? (
            <Button
              variant="outline"
              className="w-full bg-purple-800/30 border-purple-600/50 hover:bg-purple-700/40"
              onClick={() => setShowCustomInput(true)}
            >
              {t('flirtWriteOwn')}
            </Button>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder={t('flirtEnterYourFlirt')}
                value={customFlirt}
                onChange={(e) => setCustomFlirt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveCustomFlirt()}
                className="bg-purple-800/30 border-purple-600/50 text-white placeholder:text-purple-300"
                autoFocus
              />
              <div className="flex gap-2">
                <Button onClick={saveCustomFlirt} disabled={saving || !customFlirt.trim()} className="flex-1">
                  {t('flirtSendFlirt')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomFlirt("");
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
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-900 to-transparent pointer-events-none" />
    </div>
  );
};