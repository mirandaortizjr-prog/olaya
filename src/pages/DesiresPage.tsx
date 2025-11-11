import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import DesireCustomization from "@/components/DesireCustomization";

const DESIRES_CATEGORIES = {
  emotional: {
    icon: "💖",
    titleEn: "Emotional & Relational Desires",
    titleEs: "Deseos Emocionales y Relacionales",
    items: [
      { key: "quality_time", labelEn: "Quality time", labelEs: "Tiempo de calidad" },
      { key: "undivided_attention", labelEn: "Undivided attention", labelEs: "Atención plena" },
      { key: "deep_talk", labelEn: "Deep talk", labelEs: "Plática profunda" },
      { key: "light_banter", labelEn: "Light banter", labelEs: "Charla ligera" },
      { key: "reassurance", labelEn: "Reassurance", labelEs: "Reafirmación" },
      { key: "validation", labelEn: "Validation", labelEs: "Validación" },
      { key: "affection", labelEn: "Affection", labelEs: "Afecto" },
      { key: "loyalty", labelEn: "Loyalty", labelEs: "Lealtad" },
      { key: "playfulness", labelEn: "Playfulness", labelEs: "Jugueteo" },
      { key: "shared_silence", labelEn: "Shared silence", labelEs: "Silencio compartido" },
      { key: "eye_contact", labelEn: "Eye contact", labelEs: "Contacto visual" },
      { key: "inside_joke", labelEn: "Inside joke", labelEs: "Broma interna" },
      { key: "ritual_checkin", labelEn: "Ritual check-in", labelEs: "Ritual de conexión" },
      { key: "tell_me_you_love_me", labelEn: "Tell me you love me", labelEs: "Dime que me amas" },
      { key: "say_my_name", labelEn: "Say my name", labelEs: "Di mi nombre" },
      { key: "miss_me", labelEn: "Miss me", labelEs: "Extrañame" },
      { key: "choose_me", labelEn: "Choose me", labelEs: "Escógeme" },
      { key: "be_proud_of_me", labelEn: "Be proud of me", labelEs: "Siéntete orgulloso de mí" },
    ]
  },
  sensory: {
    icon: "🔥",
    titleEn: "Sensory & Physical Desires",
    titleEs: "Deseos Sensoriales y Físicos",
    items: [
      { key: "yum_yum", labelEn: "Yum yum (food play or craving)", labelEs: "Yum yum (juego con comida)" },
      { key: "coffee", labelEn: "Coffee", labelEs: "Café" },
      { key: "chocolate", labelEn: "Chocolate", labelEs: "Chocolate" },
      { key: "wine_night", labelEn: "Wine night", labelEs: "Noche de vino" },
      { key: "skin_contact", labelEn: "Skin contact", labelEs: "Contacto piel a piel" },
      { key: "oral", labelEn: "Oral", labelEs: "Oral" },
      { key: "backdoor", labelEn: "Backdoor", labelEs: "Puerta trasera" },
      { key: "neck_kiss", labelEn: "Neck kiss", labelEs: "Beso en el cuello" },
      { key: "lip_bite", labelEn: "Lip bite", labelEs: "Mordida de labios" },
      { key: "breath_on_skin", labelEn: "Breath on skin", labelEs: "Aliento en la piel" },
      { key: "touch_me_here", labelEn: "Touch me here", labelEs: "Tócame aquí" },
      { key: "undress_me", labelEn: "Undress me", labelEs: "Desvísteme" },
      { key: "watch_me", labelEn: "Watch me", labelEs: "Mírame" },
      { key: "tease_me", labelEn: "Tease me", labelEs: "Provócame" },
      { key: "pin_me", labelEn: "Pin me", labelEs: "Inmovilízame" },
      { key: "straddle_me", labelEn: "Straddle me", labelEs: "Móntame" },
      { key: "lap_sit", labelEn: "Lap sit", labelEs: "Siéntate en mis piernas" },
      { key: "slow_dance", labelEn: "Slow dance", labelEs: "Baile lento" },
      { key: "make_me_beg", labelEn: "Make me beg", labelEs: "Hazme suplicar" },
      { key: "let_me_please_you", labelEn: "Let me please you", labelEs: "Déjame complacerte" },
    ]
  },
  comfort: {
    icon: "🤗",
    titleEn: "Comfort & Care Desires",
    titleEs: "Deseos de Confort y Cuidado",
    items: [
      { key: "a_hug", labelEn: "A hug", labelEs: "Un abrazo" },
      { key: "a_kiss", labelEn: "A kiss", labelEs: "Un beso" },
      { key: "cuddle", labelEn: "Cuddle", labelEs: "Acurrucarse" },
      { key: "backrub", labelEn: "Backrub", labelEs: "Masaje de espalda" },
      { key: "head_scratch", labelEn: "Head scratch", labelEs: "Rascar la cabeza" },
      { key: "blanket_tuck", labelEn: "Blanket tuck", labelEs: "Arroparme" },
      { key: "warm_drink", labelEn: "Warm drink", labelEs: "Bebida caliente" },
      { key: "foot_massage", labelEn: "Foot massage", labelEs: "Masaje de pies" },
      { key: "hair_play", labelEn: "Hair play", labelEs: "Jugar con mi cabello" },
      { key: "shoulder_squeeze", labelEn: "Shoulder squeeze", labelEs: "Apretar los hombros" },
      { key: "hand_hold", labelEn: "Hand hold", labelEs: "Tomar la mano" },
      { key: "nap_together", labelEn: "Nap together", labelEs: "Siesta juntos" },
      { key: "bath_run_for_me", labelEn: "Bath run for me", labelEs: "Preparar baño para mí" },
      { key: "cook_for_me", labelEn: "Cook for me", labelEs: "Cocinar para mí" },
      { key: "tuck_me_in", labelEn: "Tuck me in", labelEs: "Arroparme" },
      { key: "sing_to_me", labelEn: "Sing to me", labelEs: "Cántame" },
      { key: "gentle_wake_up", labelEn: "Gentle wake-up", labelEs: "Despertar gentil" },
      { key: "just_stay", labelEn: "Just stay", labelEs: "Solo quédate" },
    ]
  },
  playful: {
    icon: "😈",
    titleEn: "Playful & Mischievous Desires",
    titleEs: "Deseos Juguetones y Traviesos",
    items: [
      { key: "flirt_with_me", labelEn: "Flirt with me", labelEs: "Coquetéame" },
      { key: "chase_me", labelEn: "Chase me", labelEs: "Persígueme" },
      { key: "steal_a_kiss", labelEn: "Steal a kiss", labelEs: "Roba un beso" },
      { key: "dare_me", labelEn: "Dare me", labelEs: "Rétame" },
      { key: "roleplay", labelEn: "Roleplay", labelEs: "Juego de roles" },
      { key: "secret_photo", labelEn: "Secret photo", labelEs: "Foto secreta" },
      { key: "naughty_text", labelEn: "Naughty text", labelEs: "Mensaje atrevido" },
      { key: "surprise_me", labelEn: "Surprise me", labelEs: "Sorpréndeme" },
      { key: "hide_and_seek", labelEn: "Hide and seek", labelEs: "Escondidas" },
      { key: "make_me_blush", labelEn: "Make me blush", labelEs: "Hazme sonrojar" },
      { key: "be_my_distraction", labelEn: "Be my distraction", labelEs: "Sé mi distracción" },
      { key: "interrupt_me", labelEn: "Interrupt me", labelEs: "Interrúmpeme" },
      { key: "tempt_me", labelEn: "Tempt me", labelEs: "Tiéntame" },
      { key: "catch_me", labelEn: "Catch me", labelEs: "Atrápame" },
      { key: "mess_up_my_hair", labelEn: "Mess up my hair", labelEs: "Despeina mi cabello" },
    ]
  }
};

export default function DesiresPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [preferences, setPreferences] = useState<any>(null);
  const [displayedDesires, setDisplayedDesires] = useState(DESIRES_CATEGORIES);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (coupleId) {
      loadPreferences();
    }
  }, [coupleId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);

    const { data: membership } = await supabase
      .from("couple_members")
      .select("couple_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (membership) {
      setCoupleId(membership.couple_id);
    }
  };

  const loadPreferences = async () => {
    if (!coupleId) return;

    const { data } = await supabase
      .from("couple_desire_preferences")
      .select("*")
      .eq("couple_id", coupleId)
      .maybeSingle();

    setPreferences(data);
    updateDisplayedDesires(data);
  };

  const updateDisplayedDesires = (prefs: any) => {
    if (!prefs) {
      setDisplayedDesires(DESIRES_CATEGORIES);
      return;
    }

    const { show_all, favorite_desires, custom_desires } = prefs;

    if (show_all) {
      // Show all + custom
      const newCategories = { ...DESIRES_CATEGORIES };
      
      if (custom_desires && custom_desires.length > 0) {
        newCategories.playful = {
          ...newCategories.playful,
          items: [...newCategories.playful.items, ...custom_desires.map((d: any) => ({
            key: d.id,
            labelEn: d.labelEn,
            labelEs: d.labelEs
          }))]
        };
      }
      
      setDisplayedDesires(newCategories);
    } else {
      // Show only favorites + custom
      const newCategories = {
        emotional: { ...DESIRES_CATEGORIES.emotional, items: [] },
        sensory: { ...DESIRES_CATEGORIES.sensory, items: [] },
        comfort: { ...DESIRES_CATEGORIES.comfort, items: [] },
        playful: { ...DESIRES_CATEGORIES.playful, items: [] }
      };

      Object.entries(DESIRES_CATEGORIES).forEach(([category, data]) => {
        const filteredItems = data.items.filter((item: any) => 
          favorite_desires?.includes(item.key)
        );
        (newCategories as any)[category].items = filteredItems;
      });

      // Add custom desires to playful
      if (custom_desires && custom_desires.length > 0) {
        newCategories.playful.items = [
          ...newCategories.playful.items,
          ...custom_desires.map((d: any) => ({
            key: d.id,
            labelEn: d.labelEn,
            labelEs: d.labelEs
          }))
        ];
      }

      setDisplayedDesires(newCategories);
    }
  };

  const sendDesire = async (desireKey: string, desireLabel: string) => {
    if (!coupleId || !user) return;

    setSending(desireKey);

    const { error } = await supabase
      .from("craving_board")
      .insert({
        couple_id: coupleId,
        user_id: user.id,
        craving_type: desireKey,
        custom_message: desireLabel,
        fulfilled: false
      });

    if (error) {
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es' ? 'No se pudo enviar el deseo' : 'Failed to send desire',
        variant: "destructive"
      });
    } else {
      toast({
        title: language === 'es' ? '💕 Deseo enviado' : '💕 Desire sent',
        description: language === 'es' ? `Le hiciste saber que deseas: ${desireLabel}` : `You let them know you desire: ${desireLabel}`
      });
    }

    setSending(null);
  };

  if (!user || !coupleId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-500/10 via-background to-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">{language === 'es' ? 'Deseos' : 'Desires'}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCustomizeOpen(true)}
          >
            <Settings className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Content - 2x2 Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Emotional & Relational */}
          <Card className="p-6 bg-gradient-to-br from-pink-500/10 to-rose-500/10 flex flex-col max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 flex-shrink-0">
              <span className="text-2xl">{displayedDesires.emotional.icon}</span>
              {language === 'es' ? displayedDesires.emotional.titleEs : displayedDesires.emotional.titleEn}
            </h2>
            <ScrollArea className="flex-1">
              <div className="space-y-1 pr-4">
                {displayedDesires.emotional.items.map((item) => (
                  <Button
                    key={item.key}
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto py-2 hover:bg-pink-500/20"
                    onClick={() => sendDesire(item.key, language === 'es' ? item.labelEs : item.labelEn)}
                    disabled={sending === item.key}
                  >
                    <span className="mr-2">-</span>
                    {language === 'es' ? item.labelEs : item.labelEn}
                    {sending === item.key && <Send className="ml-auto w-4 h-4 animate-pulse" />}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Sensory & Physical */}
          <Card className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 flex flex-col max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 flex-shrink-0">
              <span className="text-2xl">{displayedDesires.sensory.icon}</span>
              {language === 'es' ? displayedDesires.sensory.titleEs : displayedDesires.sensory.titleEn}
            </h2>
            <ScrollArea className="flex-1">
              <div className="space-y-1 pr-4">
                {displayedDesires.sensory.items.map((item) => (
                  <Button
                    key={item.key}
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto py-2 hover:bg-red-500/20"
                    onClick={() => sendDesire(item.key, language === 'es' ? item.labelEs : item.labelEn)}
                    disabled={sending === item.key}
                  >
                    <span className="mr-2">-</span>
                    {language === 'es' ? item.labelEs : item.labelEn}
                    {sending === item.key && <Send className="ml-auto w-4 h-4 animate-pulse" />}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Comfort & Care */}
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex flex-col max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 flex-shrink-0">
              <span className="text-2xl">{displayedDesires.comfort.icon}</span>
              {language === 'es' ? displayedDesires.comfort.titleEs : displayedDesires.comfort.titleEn}
            </h2>
            <ScrollArea className="flex-1">
              <div className="space-y-1 pr-4">
                {displayedDesires.comfort.items.map((item) => (
                  <Button
                    key={item.key}
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto py-2 hover:bg-blue-500/20"
                    onClick={() => sendDesire(item.key, language === 'es' ? item.labelEs : item.labelEn)}
                    disabled={sending === item.key}
                  >
                    <span className="mr-2">-</span>
                    {language === 'es' ? item.labelEs : item.labelEn}
                    {sending === item.key && <Send className="ml-auto w-4 h-4 animate-pulse" />}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Playful & Mischievous */}
          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 flex flex-col max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 flex-shrink-0">
              <span className="text-2xl">{displayedDesires.playful.icon}</span>
              {language === 'es' ? displayedDesires.playful.titleEs : displayedDesires.playful.titleEn}
            </h2>
            <ScrollArea className="flex-1">
              <div className="space-y-1 pr-4">
                {displayedDesires.playful.items.map((item) => (
                  <Button
                    key={item.key}
                    variant="ghost"
                    className="w-full justify-start text-sm h-auto py-2 hover:bg-purple-500/20"
                    onClick={() => sendDesire(item.key, language === 'es' ? item.labelEs : item.labelEn)}
                    disabled={sending === item.key}
                  >
                    <span className="mr-2">-</span>
                    {language === 'es' ? item.labelEs : item.labelEn}
                    {sending === item.key && <Send className="ml-auto w-4 h-4 animate-pulse" />}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {/* Customization Dialog */}
      {coupleId && (
        <DesireCustomization
          open={customizeOpen}
          onOpenChange={setCustomizeOpen}
          coupleId={coupleId}
          allDesires={Object.values(DESIRES_CATEGORIES).flatMap(cat => 
            cat.items.map(item => ({ ...item, category: cat.titleEn }))
          )}
          onPreferencesUpdate={loadPreferences}
        />
      )}
    </div>
  );
}
