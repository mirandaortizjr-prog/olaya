import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// Comprehensive mood configuration from reference image
const MOOD_CATEGORIES = [
  {
    title: "Positive Moods",
    subtitle: "High Energy / Joyful",
    color: "text-yellow-400",
    moods: [
      "Ecstatic", "Elated", "Euphoric", "Giddy", "Playful", 
      "Flirtatious", "Excited", "Jubilant", "Triumphant", "Inspired"
    ]
  },
  {
    title: "Warm / Content",
    color: "text-pink-400",
    moods: [
      "Loved", "Grateful", "Peaceful", "Safe", "Cozy",
      "Affectionate", "Fulfilled", "Hopeful", "Proud", "Serene"
    ]
  },
  {
    title: "Romantic / Intimate",
    color: "text-rose-400",
    moods: [
      "In love", "Tender", "Passionate", "Longing", "Connected",
      "Turned on", "Vulnerable (in a good way)", "Craving closeness"
    ]
  },
  {
    title: "Neutral / Reflective Moods",
    color: "text-gray-300",
    moods: [
      "Curious", "Thoughtful", "Pensive", "Dreamy", "Nostalgic",
      "Indifferent", "Distracted", "Ambivalent", "Observant", "Open"
    ]
  },
  {
    title: "Negative Moods",
    subtitle: "Low Energy / Sad",
    color: "text-blue-400",
    moods: [
      "Lonely", "Disappointed", "Hurt", "Melancholy", "Numb",
      "Rejected", "Insecure", "Discouraged", "Homesick", "Drained"
    ]
  },
  {
    title: "High Energy / Distressed",
    color: "text-red-400",
    moods: [
      "Anxious", "Frustrated", "Angry", "Jealous", "Overwhelmed",
      "Defensive", "Irritated", "Resentful", "Restless", "Misunderstood"
    ]
  },
  {
    title: "Sexual Moods",
    color: "text-fuchsia-400",
    moods: [
      "Horny", "Ravenous", "Thirsty", "Lustful", "Feral",
      "Needy", "Overheated", "Starved", "Obsessed", "Frisky"
    ]
  }
];

export const MoodCustomization = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [customMood, setCustomMood] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [currentMood, setCurrentMood] = useState<string>("");
  const [personalizedMoods, setPersonalizedMoods] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [coupleId, setCoupleId] = useState<string>("");
  const [saving, setSaving] = useState(false);

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
          <h1 className="text-2xl font-bold">Customize</h1>
          <div className="w-10" />
        </div>

        {/* Instructions */}
        <p className="text-center text-gray-300 mb-8">
          Choose up to 20 moods by pressing the personalize button (yellow star), or choose one to update status
        </p>

        {/* Current Mood Display */}
        {currentMood && (
          <Card className="bg-gray-800/50 border-gray-700 p-4 mb-6 text-center">
            <p className="text-sm text-gray-400 mb-1">Your current mood:</p>
            <p className="text-lg font-semibold text-purple-300">{currentMood}</p>
          </Card>
        )}

        {/* Personalized Moods Section */}
        {personalizedMoods.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Your Personalized Moods</h2>
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
            <p className="text-sm mb-2">Selected: {selectedMoods.length}/20</p>
            <div className="flex gap-2">
              <Button
                onClick={savePersonalizedMoods}
                disabled={saving}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Save Personalized Moods
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedMoods([])}
                disabled={saving}
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Mood Categories */}
        <div className="space-y-8">
          {MOOD_CATEGORIES.map((category, idx) => (
            <div key={idx}>
              <h2 className={`text-lg font-semibold mb-2 ${category.color}`}>
                {category.title}
                {category.subtitle && <span className="text-sm ml-2">/ {category.subtitle}</span>}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {category.moods.map((mood) => (
                  <div key={mood} className="relative">
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${
                        selectedMoods.includes(mood)
                          ? 'bg-yellow-500/30 border-yellow-400'
                          : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                      }`}
                      onClick={() => updateCurrentMood(mood)}
                      disabled={saving}
                    >
                      - {mood}
                    </Button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMoodSelection(mood);
                      }}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                        selectedMoods.includes(mood) ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'
                      }`}
                      disabled={saving}
                    >
                      <Star className="w-4 h-4" fill={selectedMoods.includes(mood) ? "currentColor" : "none"} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Customize Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Customize</h2>
          {!showCustomInput ? (
            <Button
              variant="outline"
              className="w-full bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
              onClick={() => setShowCustomInput(true)}
            >
              Write your own mood
            </Button>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder="Enter your mood..."
                value={customMood}
                onChange={(e) => setCustomMood(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveCustomMood()}
                className="bg-gray-800/50 border-gray-700 text-white"
                autoFocus
              />
              <div className="flex gap-2">
                <Button onClick={saveCustomMood} disabled={saving || !customMood.trim()} className="flex-1">
                  Set Mood
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomMood("");
                  }}
                  disabled={saving}
                >
                  Cancel
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
