import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Heart, Home, Briefcase, Plane, Sparkles, Target, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCoupleProgress } from "@/hooks/useCoupleProgress";
import { useTogetherCoins } from "@/hooks/useTogetherCoins";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

interface GameProps {
  coupleId: string;
  userId: string;
  partnerId: string | null;
  onBack: () => void;
}

type GameMode = 'instructions' | 'category' | 'question' | 'waiting' | 'reveal' | 'summary';
type Category = 'romance' | 'family' | 'career' | 'adventure' | 'life' | 'dreams';

interface Question {
  id: string;
  category: Category;
  text: { en: string; es: string };
  type: 'scale' | 'choice' | 'timeline';
  options?: { en: string[]; es: string[] };
  minLabel?: { en: string; es: string };
  maxLabel?: { en: string; es: string };
}

interface Answer {
  questionId: string;
  value: number | string;
  userId: string;
}

const QUESTIONS: Question[] = [
  // Romance Category (10 questions)
  { id: 'r1', category: 'romance', type: 'timeline', text: { en: 'When do you see us getting engaged?', es: '¿Cuándo nos vemos comprometidos?' }, minLabel: { en: 'Soon', es: 'Pronto' }, maxLabel: { en: 'In a few years', es: 'En unos años' } },
  { id: 'r2', category: 'romance', type: 'choice', text: { en: 'What type of wedding do you envision?', es: '¿Qué tipo de boda imaginas?' }, options: { en: ['Intimate & small', 'Medium celebration', 'Big & grand', 'Destination wedding'], es: ['Íntima y pequeña', 'Celebración mediana', 'Grande y lujosa', 'Boda destino'] } },
  { id: 'r3', category: 'romance', type: 'scale', text: { en: 'How important are romantic surprises to you?', es: '¿Qué tan importantes son las sorpresas románticas?' }, minLabel: { en: 'Nice to have', es: 'Agradable' }, maxLabel: { en: 'Essential', es: 'Esencial' } },
  { id: 'r4', category: 'romance', type: 'choice', text: { en: 'Perfect date night activity?', es: '¿Actividad perfecta para una cita?' }, options: { en: ['Movie & cuddles', 'Dancing & music', 'Cooking together', 'Outdoor adventure'], es: ['Película y mimos', 'Bailar y música', 'Cocinar juntos', 'Aventura al aire libre'] } },
  { id: 'r5', category: 'romance', type: 'scale', text: { en: 'How often should we say "I love you"?', es: '¿Con qué frecuencia deberíamos decir "te amo"?' }, minLabel: { en: 'Special moments', es: 'Momentos especiales' }, maxLabel: { en: 'Multiple times daily', es: 'Varias veces al día' } },
  { id: 'r6', category: 'romance', type: 'choice', text: { en: 'Dream romantic getaway location?', es: '¿Lugar soñado para escapada romántica?' }, options: { en: ['Beach paradise', 'Mountain retreat', 'European city', 'Tropical island'], es: ['Paraíso playero', 'Retiro montañoso', 'Ciudad europea', 'Isla tropical'] } },
  { id: 'r7', category: 'romance', type: 'scale', text: { en: 'How important are couple traditions to you?', es: '¿Qué tan importantes son las tradiciones de pareja?' }, minLabel: { en: 'Flexible', es: 'Flexible' }, maxLabel: { en: 'Very important', es: 'Muy importante' } },
  { id: 'r8', category: 'romance', type: 'timeline', text: { en: 'When should we renew our vows?', es: '¿Cuándo deberíamos renovar nuestros votos?' }, minLabel: { en: '5 years', es: '5 años' }, maxLabel: { en: '25+ years', es: '25+ años' } },
  { id: 'r9', category: 'romance', type: 'choice', text: { en: 'How should we celebrate Valentine\'s Day?', es: '¿Cómo deberíamos celebrar San Valentín?' }, options: { en: ['Skip it/casual', 'Nice dinner out', 'Big romantic gesture', 'Weekend getaway'], es: ['Omitir/casual', 'Buena cena fuera', 'Gran gesto romántico', 'Escapada de fin de semana'] } },
  { id: 'r10', category: 'romance', type: 'scale', text: { en: 'How much should we prioritize couple time vs. social time?', es: '¿Cuánto priorizar tiempo de pareja vs. social?' }, minLabel: { en: 'Balanced', es: 'Equilibrado' }, maxLabel: { en: 'Couple first', es: 'Pareja primero' } },
  
  // Family Category (10 questions)
  { id: 'f1', category: 'family', type: 'choice', text: { en: 'How many kids do you want?', es: '¿Cuántos hijos quieres?' }, options: { en: ['None', '1-2 kids', '3-4 kids', '5+ kids'], es: ['Ninguno', '1-2 hijos', '3-4 hijos', '5+ hijos'] } },
  { id: 'f2', category: 'family', type: 'timeline', text: { en: 'When should we start trying for our first child?', es: '¿Cuándo deberíamos intentar tener nuestro primer hijo?' }, minLabel: { en: 'Soon', es: 'Pronto' }, maxLabel: { en: 'In 5+ years', es: 'En 5+ años' } },
  { id: 'f3', category: 'family', type: 'scale', text: { en: 'How close should we live to extended family?', es: '¿Qué tan cerca vivir de la familia extendida?' }, minLabel: { en: 'Far/independent', es: 'Lejos/independiente' }, maxLabel: { en: 'Same city/close', es: 'Misma ciudad/cerca' } },
  { id: 'f4', category: 'family', type: 'choice', text: { en: 'Ideal parenting style?', es: '¿Estilo de crianza ideal?' }, options: { en: ['Relaxed/flexible', 'Structured routine', 'Mix of both', 'Child-led'], es: ['Relajado/flexible', 'Rutina estructurada', 'Mezcla de ambos', 'Guiado por niño'] } },
  { id: 'f5', category: 'family', type: 'scale', text: { en: 'How important are family traditions and rituals?', es: '¿Qué tan importantes son las tradiciones familiares?' }, minLabel: { en: 'Flexible', es: 'Flexible' }, maxLabel: { en: 'Essential', es: 'Esencial' } },
  { id: 'f6', category: 'family', type: 'choice', text: { en: 'Ideal family vacation style?', es: '¿Estilo ideal de vacaciones familiares?' }, options: { en: ['Relaxing beach', 'Adventure trips', 'Cultural cities', 'Stay-cations'], es: ['Playa relajante', 'Viajes de aventura', 'Ciudades culturales', 'Vacaciones en casa'] } },
  { id: 'f7', category: 'family', type: 'scale', text: { en: 'How important is having pets in our family?', es: '¿Qué tan importante es tener mascotas?' }, minLabel: { en: 'Not important', es: 'No importante' }, maxLabel: { en: 'Must have', es: 'Debe tener' } },
  { id: 'f8', category: 'family', type: 'choice', text: { en: 'How should we divide household responsibilities?', es: '¿Cómo dividir responsabilidades del hogar?' }, options: { en: ['Equal split', 'By preference', 'Hire help', 'Flexible/rotating'], es: ['División igual', 'Por preferencia', 'Contratar ayuda', 'Flexible/rotativo'] } },
  { id: 'f9', category: 'family', type: 'scale', text: { en: 'How important is work-life balance for our family?', es: '¿Qué tan importante es el equilibrio trabajo-vida?' }, minLabel: { en: 'Career focused', es: 'Enfocado en carrera' }, maxLabel: { en: 'Balance is key', es: 'Equilibrio es clave' } },
  { id: 'f10', category: 'family', type: 'timeline', text: { en: 'When should we buy our family home?', es: '¿Cuándo deberíamos comprar nuestra casa familiar?' }, minLabel: { en: 'Before kids', es: 'Antes de hijos' }, maxLabel: { en: 'After kids grow', es: 'Después que crezcan' } },

  // Career Category (10 questions)
  { id: 'c1', category: 'career', type: 'scale', text: { en: 'How important is career success vs. personal happiness?', es: '¿Qué tan importante es el éxito profesional vs. felicidad?' }, minLabel: { en: 'Happiness first', es: 'Felicidad primero' }, maxLabel: { en: 'Career success', es: 'Éxito profesional' } },
  { id: 'c2', category: 'career', type: 'choice', text: { en: 'Would you relocate for a career opportunity?', es: '¿Te mudarías por una oportunidad laboral?' }, options: { en: ['Absolutely', 'Only if mutual', 'Prefer not to', 'Never'], es: ['Absolutamente', 'Solo si es mutuo', 'Prefiero no', 'Nunca'] } },
  { id: 'c3', category: 'career', type: 'timeline', text: { en: 'When do you want to retire?', es: '¿Cuándo quieres retirarte?' }, minLabel: { en: 'Early (50s)', es: 'Temprano (50s)' }, maxLabel: { en: 'Traditional (65+)', es: 'Tradicional (65+)' } },
  { id: 'c4', category: 'career', type: 'scale', text: { en: 'How much should we prioritize building wealth?', es: '¿Cuánto priorizar construir riqueza?' }, minLabel: { en: 'Live comfortably', es: 'Vivir cómodo' }, maxLabel: { en: 'Maximum wealth', es: 'Máxima riqueza' } },
  { id: 'c5', category: 'career', type: 'choice', text: { en: 'Should one partner stay home with kids?', es: '¿Debería uno quedarse en casa con los niños?' }, options: { en: ['Both work', 'One stays home', 'Flexible/part-time', 'Depends on situation'], es: ['Ambos trabajan', 'Uno se queda', 'Flexible/medio tiempo', 'Depende situación'] } },
  { id: 'c6', category: 'career', type: 'scale', text: { en: 'How important is having separate vs. joint finances?', es: '¿Qué tan importante tener finanzas separadas vs. conjuntas?' }, minLabel: { en: 'Fully joint', es: 'Totalmente conjunto' }, maxLabel: { en: 'Mostly separate', es: 'Mayormente separado' } },
  { id: 'c7', category: 'career', type: 'choice', text: { en: 'Would you support a partner starting a business?', es: '¿Apoyarías a tu pareja iniciando un negocio?' }, options: { en: ['Fully support', 'Support with plan', 'Cautious support', 'Prefer stable job'], es: ['Apoyo total', 'Apoyo con plan', 'Apoyo cauteloso', 'Prefiero trabajo estable'] } },
  { id: 'c8', category: 'career', type: 'scale', text: { en: 'How important is having an emergency fund?', es: '¿Qué tan importante es tener fondo de emergencia?' }, minLabel: { en: 'Nice to have', es: 'Bueno tener' }, maxLabel: { en: 'Must have', es: 'Debe tener' } },
  { id: 'c9', category: 'career', type: 'timeline', text: { en: 'When should we have our finances fully merged?', es: '¿Cuándo fusionar completamente nuestras finanzas?' }, minLabel: { en: 'Before marriage', es: 'Antes del matrimonio' }, maxLabel: { en: 'After years together', es: 'Después de años juntos' } },
  { id: 'c10', category: 'career', type: 'scale', text: { en: 'How much should we save vs. enjoy now?', es: '¿Cuánto ahorrar vs. disfrutar ahora?' }, minLabel: { en: 'Enjoy life now', es: 'Disfrutar ahora' }, maxLabel: { en: 'Save for future', es: 'Ahorrar para futuro' } },

  // Adventure Category (10 questions)
  { id: 'a1', category: 'adventure', type: 'choice', text: { en: 'Dream vacation destination?', es: '¿Destino de vacaciones soñado?' }, options: { en: ['Tropical paradise', 'European adventure', 'Asian exploration', 'African safari'], es: ['Paraíso tropical', 'Aventura europea', 'Exploración asiática', 'Safari africano'] } },
  { id: 'a2', category: 'adventure', type: 'scale', text: { en: 'How often should we travel internationally?', es: '¿Con qué frecuencia viajar internacionalmente?' }, minLabel: { en: 'Rarely', es: 'Rara vez' }, maxLabel: { en: 'Multiple times/year', es: 'Varias veces/año' } },
  { id: 'a3', category: 'adventure', type: 'choice', text: { en: 'Preferred travel style?', es: '¿Estilo de viaje preferido?' }, options: { en: ['Luxury & comfort', 'Mid-range comfort', 'Budget backpacking', 'Mix based on trip'], es: ['Lujo y comodidad', 'Comodidad media', 'Mochilero económico', 'Mezcla según viaje'] } },
  { id: 'a4', category: 'adventure', type: 'scale', text: { en: 'How adventurous should our trips be?', es: '¿Qué tan aventureros deben ser nuestros viajes?' }, minLabel: { en: 'Relaxing & safe', es: 'Relajante y seguro' }, maxLabel: { en: 'Extreme & thrilling', es: 'Extremo y emocionante' } },
  { id: 'a5', category: 'adventure', type: 'choice', text: { en: 'Would you try extreme sports together?', es: '¿Probarían deportes extremos juntos?' }, options: { en: ['Absolutely!', 'Some activities', 'Watch only', 'No thanks'], es: ['¡Absolutamente!', 'Algunas actividades', 'Solo mirar', 'No gracias'] } },
  { id: 'a6', category: 'adventure', type: 'scale', text: { en: 'How important is traveling before having kids?', es: '¿Qué tan importante es viajar antes de tener hijos?' }, minLabel: { en: 'Not crucial', es: 'No crucial' }, maxLabel: { en: 'Very important', es: 'Muy importante' } },
  { id: 'a7', category: 'adventure', type: 'choice', text: { en: 'Would you live abroad for a year?', es: '¿Vivirían en el extranjero por un año?' }, options: { en: ['Yes, absolutely', 'Maybe someday', 'Prefer not to', 'Never'], es: ['Sí, absolutamente', 'Quizás algún día', 'Prefiero no', 'Nunca'] } },
  { id: 'a8', category: 'adventure', type: 'scale', text: { en: 'How important is trying new cuisines together?', es: '¿Qué tan importante es probar nuevas cocinas juntos?' }, minLabel: { en: 'Stick to familiar', es: 'Familiar' }, maxLabel: { en: 'Always adventurous', es: 'Siempre aventurero' } },
  { id: 'a9', category: 'adventure', type: 'choice', text: { en: 'Preferred outdoor activity together?', es: '¿Actividad al aire libre preferida juntos?' }, options: { en: ['Hiking & camping', 'Beach & water sports', 'Skiing & snow', 'City exploring'], es: ['Senderismo y camping', 'Playa y deportes acuáticos', 'Esquí y nieve', 'Explorar ciudades'] } },
  { id: 'a10', category: 'adventure', type: 'scale', text: { en: 'How much spontaneity vs. planning for trips?', es: '¿Cuánta espontaneidad vs. planificación en viajes?' }, minLabel: { en: 'Plan everything', es: 'Planear todo' }, maxLabel: { en: 'Go with flow', es: 'Ir con la corriente' } },

  // Life Goals Category (10 questions)
  { id: 'l1', category: 'life', type: 'choice', text: { en: 'Where do you see us living long-term?', es: '¿Dónde nos ves viviendo a largo plazo?' }, options: { en: ['Big city', 'Suburbs', 'Small town', 'Countryside'], es: ['Gran ciudad', 'Suburbios', 'Pueblo pequeño', 'Campo'] } },
  { id: 'l2', category: 'life', type: 'scale', text: { en: 'How important is owning vs. renting?', es: '¿Qué tan importante es comprar vs. rentar?' }, minLabel: { en: 'Renting is fine', es: 'Rentar está bien' }, maxLabel: { en: 'Must own', es: 'Debe comprar' } },
  { id: 'l3', category: 'life', type: 'timeline', text: { en: 'When should we buy our dream home?', es: '¿Cuándo comprar nuestra casa soñada?' }, minLabel: { en: 'In 2-3 years', es: 'En 2-3 años' }, maxLabel: { en: 'In 10+ years', es: 'En 10+ años' } },
  { id: 'l4', category: 'life', type: 'choice', text: { en: 'Ideal home type?', es: '¿Tipo de casa ideal?' }, options: { en: ['Modern apartment', 'Classic house', 'Farmhouse', 'Eco-friendly home'], es: ['Apartamento moderno', 'Casa clásica', 'Casa de campo', 'Casa ecológica'] } },
  { id: 'l5', category: 'life', type: 'scale', text: { en: 'How important is environmental sustainability to us?', es: '¿Qué tan importante es la sostenibilidad ambiental?' }, minLabel: { en: 'Moderate effort', es: 'Esfuerzo moderado' }, maxLabel: { en: 'Top priority', es: 'Máxima prioridad' } },
  { id: 'l6', category: 'life', type: 'choice', text: { en: 'How should we spend our golden years?', es: '¿Cómo pasar nuestros años dorados?' }, options: { en: ['Travel the world', 'Close to family', 'Quiet retirement', 'Active community'], es: ['Viajar el mundo', 'Cerca de familia', 'Jubilación tranquila', 'Comunidad activa'] } },
  { id: 'l7', category: 'life', type: 'scale', text: { en: 'How important is maintaining close friendships?', es: '¿Qué tan importante mantener amistades cercanas?' }, minLabel: { en: 'Couple focused', es: 'Enfocado en pareja' }, maxLabel: { en: 'Very important', es: 'Muy importante' } },
  { id: 'l8', category: 'life', type: 'choice', text: { en: 'Approach to health and fitness?', es: '¿Enfoque para salud y fitness?' }, options: { en: ['Very active lifestyle', 'Moderate exercise', 'Casual activities', 'Flexible approach'], es: ['Estilo muy activo', 'Ejercicio moderado', 'Actividades casuales', 'Enfoque flexible'] } },
  { id: 'l9', category: 'life', type: 'scale', text: { en: 'How much should we invest in self-improvement?', es: '¿Cuánto invertir en auto-mejora?' }, minLabel: { en: 'Natural growth', es: 'Crecimiento natural' }, maxLabel: { en: 'Constant learning', es: 'Aprendizaje constante' } },
  { id: 'l10', category: 'life', type: 'scale', text: { en: 'How important is leaving a legacy?', es: '¿Qué tan importante es dejar un legado?' }, minLabel: { en: 'Live for now', es: 'Vivir el ahora' }, maxLabel: { en: 'Very important', es: 'Muy importante' } },

  // Dreams Category (10 questions)
  { id: 'd1', category: 'dreams', type: 'choice', text: { en: 'What\'s your wildest dream for us?', es: '¿Cuál es tu sueño más salvaje para nosotros?' }, options: { en: ['Build empire together', 'Travel the world', 'Big family', 'Change the world'], es: ['Construir imperio juntos', 'Viajar el mundo', 'Familia grande', 'Cambiar el mundo'] } },
  { id: 'd2', category: 'dreams', type: 'scale', text: { en: 'How important is achieving fame or recognition?', es: '¿Qué tan importante es lograr fama o reconocimiento?' }, minLabel: { en: 'Not important', es: 'No importante' }, maxLabel: { en: 'Major goal', es: 'Meta importante' } },
  { id: 'd3', category: 'dreams', type: 'timeline', text: { en: 'When should we start our passion project together?', es: '¿Cuándo empezar nuestro proyecto de pasión juntos?' }, minLabel: { en: 'This year', es: 'Este año' }, maxLabel: { en: 'In retirement', es: 'En jubilación' } },
  { id: 'd4', category: 'dreams', type: 'choice', text: { en: 'If money wasn\'t an issue, what would you do?', es: 'Si el dinero no fuera problema, ¿qué harías?' }, options: { en: ['Build dream house', 'Start foundation', 'Travel forever', 'Pursue art/passion'], es: ['Construir casa soñada', 'Iniciar fundación', 'Viajar para siempre', 'Perseguir arte/pasión'] } },
  { id: 'd5', category: 'dreams', type: 'scale', text: { en: 'How much should we sacrifice for our dreams?', es: '¿Cuánto sacrificar por nuestros sueños?' }, minLabel: { en: 'Be practical', es: 'Ser práctico' }, maxLabel: { en: 'Go all in', es: 'Ir con todo' } },
  { id: 'd6', category: 'dreams', type: 'choice', text: { en: 'Would you pursue a creative career later in life?', es: '¿Perseguirías carrera creativa más adelante?' }, options: { en: ['Absolutely', 'Maybe as hobby', 'Probably not', 'Already doing it'], es: ['Absolutamente', 'Quizás como hobby', 'Probablemente no', 'Ya lo hago'] } },
  { id: 'd7', category: 'dreams', type: 'scale', text: { en: 'How important is living an extraordinary life?', es: '¿Qué tan importante es vivir una vida extraordinaria?' }, minLabel: { en: 'Simple is good', es: 'Simple es bueno' }, maxLabel: { en: 'Must be epic', es: 'Debe ser épico' } },
  { id: 'd8', category: 'dreams', type: 'choice', text: { en: 'What type of adventure would you take a year for?', es: '¿Qué aventura tomarías por un año?' }, options: { en: ['Sail around world', 'Live in another country', 'Build something big', 'Spiritual journey'], es: ['Navegar el mundo', 'Vivir en otro país', 'Construir algo grande', 'Viaje espiritual'] } },
  { id: 'd9', category: 'dreams', type: 'scale', text: { en: 'How much risk should we take for dreams?', es: '¿Cuánto riesgo tomar por sueños?' }, minLabel: { en: 'Play it safe', es: 'Jugar seguro' }, maxLabel: { en: 'Big risks', es: 'Grandes riesgos' } },
  { id: 'd10', category: 'dreams', type: 'scale', text: { en: 'How important is personal growth vs. stability?', es: '¿Qué tan importante es crecimiento personal vs. estabilidad?' }, minLabel: { en: 'Stability', es: 'Estabilidad' }, maxLabel: { en: 'Growth', es: 'Crecimiento' } },
];

export const FutureForecastGame = ({ coupleId, userId, partnerId, onBack }: GameProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { progress } = useCoupleProgress(coupleId);
  const { addCoins } = useTogetherCoins(userId);
  
  const [gameMode, setGameMode] = useState<GameMode>('instructions');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [partnerAnswers, setPartnerAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<number | string>(50);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [alignmentScore, setAlignmentScore] = useState(0);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);

  const categories = [
    { id: 'romance' as Category, icon: Heart, color: 'from-pink-500 to-rose-500', label: language === 'es' ? 'Romance' : 'Romance' },
    { id: 'family' as Category, icon: Home, color: 'from-blue-500 to-cyan-500', label: language === 'es' ? 'Familia' : 'Family' },
    { id: 'career' as Category, icon: Briefcase, color: 'from-purple-500 to-indigo-500', label: language === 'es' ? 'Carrera' : 'Career' },
    { id: 'adventure' as Category, icon: Plane, color: 'from-green-500 to-emerald-500', label: language === 'es' ? 'Aventura' : 'Adventure' },
    { id: 'life' as Category, icon: Target, color: 'from-orange-500 to-amber-500', label: language === 'es' ? 'Vida' : 'Life Goals' },
    { id: 'dreams' as Category, icon: Sparkles, color: 'from-violet-500 to-fuchsia-500', label: language === 'es' ? 'Sueños' : 'Dreams' },
  ];

  const categoryQuestions = selectedCategory 
    ? QUESTIONS.filter(q => q.category === selectedCategory)
    : [];

  const currentQuestion = categoryQuestions[currentQuestionIndex];

  useEffect(() => {
    checkIfPlayedToday();
  }, []);

  const checkIfPlayedToday = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('game_sessions')
        .select('id')
        .eq('couple_id', coupleId)
        .eq('user_id', userId)
        .eq('game_type', 'future_forecast')
        .gte('created_at', today)
        .single();
      
      setHasPlayedToday(!!data);
    } catch (error) {
      // No session today
      setHasPlayedToday(false);
    }
  };

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setPartnerAnswers([]);
    setQuestionsCompleted(0);
    setCurrentAnswer(50);
    setGameMode('question');
  };

  const submitAnswer = () => {
    if (!currentQuestion) return;

    const answer: Answer = {
      questionId: currentQuestion.id,
      value: currentAnswer,
      userId
    };

    setUserAnswers([...userAnswers, answer]);
    setGameMode('waiting');

    // Simulate partner answer (in real app, wait for actual partner)
    setTimeout(() => {
      const partnerAnswer: Answer = {
        questionId: currentQuestion.id,
        value: typeof currentAnswer === 'number' 
          ? Math.floor(Math.random() * 101)
          : currentQuestion.options?.[language]?.[Math.floor(Math.random() * (currentQuestion.options[language]?.length || 1))] || '',
        userId: partnerId || 'partner'
      };
      setPartnerAnswers([...partnerAnswers, partnerAnswer]);
      setGameMode('reveal');
    }, 2000);
  };

  const nextQuestion = () => {
    const newCompleted = questionsCompleted + 1;
    setQuestionsCompleted(newCompleted);

    // Calculate alignment
    if (currentQuestion && userAnswers.length > 0 && partnerAnswers.length > 0) {
      const userAns = userAnswers[userAnswers.length - 1];
      const partnerAns = partnerAnswers[partnerAnswers.length - 1];
      
      let score = 0;
      if (typeof userAns.value === 'number' && typeof partnerAns.value === 'number') {
        const diff = Math.abs(userAns.value - partnerAns.value);
        score = Math.round(100 - diff);
      } else if (userAns.value === partnerAns.value) {
        score = 100;
      }
      
      const avgScore = Math.round((alignmentScore * (newCompleted - 1) + score) / newCompleted);
      setAlignmentScore(avgScore);
    }

    if (newCompleted >= 5) {
      setGameMode('summary');
      completeGame();
    } else if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer(50);
      setGameMode('question');
    } else {
      setGameMode('summary');
      completeGame();
    }
  };

  const completeGame = async () => {
    try {
      if (!hasPlayedToday && partnerId) {
        await supabase.from('game_sessions').insert({
          session_id: `future_forecast_${Date.now()}`,
          couple_id: coupleId,
          initiated_by: userId,
          partner_id: partnerId,
          game_type: 'future_forecast',
          status: 'completed'
        });

        await addCoins(10, 'Future Forecast game completed', coupleId);
        
        toast({
          title: t('gameComplete') || "Game Complete! 🎉",
          description: t('earnedCoins')?.replace('{amount}', '10') || "You earned 10 Together Coins!",
        });
      }
    } catch (error) {
      console.error('Error completing game:', error);
    }
  };

  const resetGame = () => {
    setGameMode('category');
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setPartnerAnswers([]);
    setQuestionsCompleted(0);
    setAlignmentScore(0);
    setCurrentAnswer(50);
  };

  // Instructions
  if (gameMode === 'instructions') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{t('futureForecast') || 'Future Forecast'}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
          <Card className="p-6 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border-violet-200 dark:border-violet-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                {language === 'es' ? 'Explora Tu Futuro Juntos' : 'Explore Your Future Together'}
              </h3>
            </div>
            <p className="text-muted-foreground">
              {language === 'es' 
                ? 'Descubre qué tan alineados están en sus sueños, metas y visión del futuro. Responde preguntas sobre romance, familia, carrera, aventura y más.'
                : 'Discover how aligned you are on your dreams, goals, and vision for the future. Answer questions about romance, family, career, adventure, and more.'}
            </p>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              {language === 'es' ? 'Cómo Jugar' : 'How to Play'}
            </h4>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>{language === 'es' ? 'Elige una categoría que te emocione explorar' : 'Choose a category you\'re excited to explore'}</li>
              <li>{language === 'es' ? 'Ambos responden la misma pregunta por separado' : 'Both answer the same question separately'}</li>
              <li>{language === 'es' ? 'Revela y compara tus respuestas' : 'Reveal and compare your answers'}</li>
              <li>{language === 'es' ? 'Descubre tu porcentaje de alineación' : 'Discover your alignment percentage'}</li>
              <li>{language === 'es' ? 'Completa 5 preguntas para terminar el juego' : 'Complete 5 questions to finish the game'}</li>
            </ol>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {language === 'es' ? 'Cómo Ganar' : 'How to Win'}
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              {language === 'es'
                ? 'No se trata de estar de acuerdo en todo, ¡sino de entender la visión del otro! Cuanto mayor sea tu puntuación de alineación, mejor están sincronizados para el futuro.'
                : 'It\'s not about agreeing on everything—it\'s about understanding each other\'s vision! The higher your alignment score, the better you\'re in sync for the future.'}
            </p>
            <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
              <p className="text-sm font-medium">
                {language === 'es'
                  ? '¡Completa el juego para ganar 10 Monedas Juntos (una vez al día)!'
                  : 'Complete the game to earn 10 Together Coins (once per day)!'}
              </p>
            </div>
          </Card>

          {hasPlayedToday && (
            <Card className="p-4 bg-amber-500/10 border-amber-200 dark:border-amber-800">
              <p className="text-sm text-center text-amber-900 dark:text-amber-100">
                {language === 'es'
                  ? '¡Ya jugaste hoy! Puedes jugar de nuevo, pero las recompensas se otorgan una vez al día.'
                  : 'You\'ve already played today! You can play again, but rewards are given once per day.'}
              </p>
            </Card>
          )}
        </div>

        <div className="p-4 border-t flex-shrink-0">
          <Button onClick={() => setGameMode('category')} className="w-full" size="lg">
            {language === 'es' ? 'Comenzar Juego' : 'Start Game'}
          </Button>
        </div>
      </div>
    );
  }

  // Category Selection
  if (gameMode === 'category') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setGameMode('instructions')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{language === 'es' ? 'Elige Categoría' : 'Choose Category'}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto overscroll-contain p-4">
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Card
                  key={cat.id}
                  className="p-6 cursor-pointer hover:scale-105 transition-all duration-200 active:scale-95"
                  onClick={() => selectCategory(cat.id)}
                >
                  <div className={`w-full h-24 bg-gradient-to-br ${cat.color} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-center font-semibold">{cat.label}</h3>
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    {QUESTIONS.filter(q => q.category === cat.id).length} {language === 'es' ? 'preguntas' : 'questions'}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Question
  if (gameMode === 'question' && currentQuestion) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setGameMode('category')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{categories.find(c => c.id === selectedCategory)?.label}</h2>
            <p className="text-xs text-muted-foreground">
              {language === 'es' ? 'Pregunta' : 'Question'} {questionsCompleted + 1}/5
            </p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-6">
          <Progress value={(questionsCompleted / 5) * 100} className="h-2" />
          
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
            <h3 className="text-xl font-bold mb-6 text-center">
              {currentQuestion.text[language]}
            </h3>
            
            {currentQuestion.type === 'scale' && (
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-4xl font-bold text-primary">{currentAnswer}</span>
                </div>
                <Slider
                  value={[currentAnswer as number]}
                  onValueChange={(val) => setCurrentAnswer(val[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{currentQuestion.minLabel?.[language]}</span>
                  <span>{currentQuestion.maxLabel?.[language]}</span>
                </div>
              </div>
            )}

            {currentQuestion.type === 'timeline' && (
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-4xl font-bold text-primary">{currentAnswer}</span>
                </div>
                <Slider
                  value={[currentAnswer as number]}
                  onValueChange={(val) => setCurrentAnswer(val[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{currentQuestion.minLabel?.[language]}</span>
                  <span>{currentQuestion.maxLabel?.[language]}</span>
                </div>
              </div>
            )}

            {currentQuestion.type === 'choice' && currentQuestion.options && (
              <div className="space-y-2">
                {currentQuestion.options[language]?.map((option, index) => (
                  <Button
                    key={index}
                    variant={currentAnswer === option ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => setCurrentAnswer(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="p-4 border-t flex-shrink-0">
          <Button onClick={submitAnswer} className="w-full" size="lg">
            {language === 'es' ? 'Enviar Respuesta' : 'Submit Answer'}
          </Button>
        </div>
      </div>
    );
  }

  // Waiting
  if (gameMode === 'waiting') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold">{t('futureForecast') || 'Future Forecast'}</h2>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="p-8 text-center max-w-md">
            <div className="animate-pulse mb-4">
              <Clock className="w-16 h-16 mx-auto text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {language === 'es' ? 'Esperando respuesta...' : 'Waiting for response...'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'es' 
                ? 'Tu pareja está compartiendo su visión del futuro'
                : 'Your partner is sharing their vision of the future'}
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Reveal
  if (gameMode === 'reveal' && currentQuestion) {
    const userAns = userAnswers[userAnswers.length - 1];
    const partnerAns = partnerAnswers[partnerAnswers.length - 1];
    
    let matchScore = 0;
    if (typeof userAns.value === 'number' && typeof partnerAns.value === 'number') {
      const diff = Math.abs(userAns.value - partnerAns.value);
      matchScore = Math.round(100 - diff);
    } else if (userAns.value === partnerAns.value) {
      matchScore = 100;
    }

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold">{language === 'es' ? 'Resultados' : 'Results'}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/20">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-primary mb-2">{matchScore}%</div>
              <p className="text-lg font-semibold">
                {language === 'es' ? 'Alineación' : 'Alignment'}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">{language === 'es' ? 'Tu respuesta' : 'Your answer'}</p>
                <p className="font-semibold text-lg">{userAns.value}</p>
              </div>
              
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  {language === 'es' ? 'Respuesta de tu pareja' : 'Partner\'s answer'}
                </p>
                <p className="font-semibold text-lg">{partnerAns.value}</p>
              </div>
            </div>

            {matchScore >= 80 && (
              <p className="text-center mt-4 text-green-600 dark:text-green-400 font-medium">
                {language === 'es' ? '¡Increíble alineación! 🎯' : 'Amazing alignment! 🎯'}
              </p>
            )}
            {matchScore >= 50 && matchScore < 80 && (
              <p className="text-center mt-4 text-amber-600 dark:text-amber-400 font-medium">
                {language === 'es' ? '¡Buena sincronización! 👍' : 'Good sync! 👍'}
              </p>
            )}
            {matchScore < 50 && (
              <p className="text-center mt-4 text-blue-600 dark:text-blue-400 font-medium">
                {language === 'es' ? 'Interesantes perspectivas diferentes 💭' : 'Interesting different perspectives 💭'}
              </p>
            )}
          </Card>
        </div>

        <div className="p-4 border-t flex-shrink-0">
          <Button onClick={nextQuestion} className="w-full" size="lg">
            {questionsCompleted >= 4 
              ? (language === 'es' ? 'Ver Resumen' : 'View Summary')
              : (language === 'es' ? 'Siguiente Pregunta' : 'Next Question')}
          </Button>
        </div>
      </div>
    );
  }

  // Summary
  if (gameMode === 'summary') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{language === 'es' ? 'Resumen del Juego' : 'Game Summary'}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
          <Card className="p-8 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 text-center">
            <Sparkles className="w-16 h-16 mx-auto text-primary mb-4" />
            <h3 className="text-3xl font-bold mb-2">{language === 'es' ? '¡Juego Completo!' : 'Game Complete!'}</h3>
            <div className="text-6xl font-bold text-primary my-4">{alignmentScore}%</div>
            <p className="text-lg font-semibold mb-2">
              {language === 'es' ? 'Alineación General del Futuro' : 'Overall Future Alignment'}
            </p>
            <p className="text-muted-foreground">
              {language === 'es' 
                ? `Completaste ${questionsCompleted} preguntas sobre ${categories.find(c => c.id === selectedCategory)?.label}`
                : `You completed ${questionsCompleted} questions about ${categories.find(c => c.id === selectedCategory)?.label}`}
            </p>
          </Card>

          {!hasPlayedToday && (
            <Card className="p-6 bg-primary/10 border-primary/20">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-primary">
                  <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold">{language === 'es' ? '¡Ganaste 10 Monedas Juntos!' : 'Earned 10 Together Coins!'}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'es' ? 'Regresa mañana para más recompensas' : 'Come back tomorrow for more rewards'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h4 className="font-semibold mb-3">
              {language === 'es' ? 'Tus Respuestas' : 'Your Answers'}
            </h4>
            <div className="space-y-2">
              {userAnswers.map((ans, idx) => {
                const q = QUESTIONS.find(q => q.id === ans.questionId);
                return (
                  <div key={idx} className="p-3 bg-muted rounded-lg text-sm">
                    <p className="font-medium mb-1">{q?.text[language]}</p>
                    <p className="text-muted-foreground">{ans.value}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="p-4 border-t space-y-2 flex-shrink-0">
          <Button onClick={resetGame} className="w-full" size="lg">
            {language === 'es' ? 'Jugar de Nuevo' : 'Play Again'}
          </Button>
          <Button onClick={onBack} variant="outline" className="w-full">
            {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
          </Button>
        </div>
      </div>
    );
  }

  return null;
};