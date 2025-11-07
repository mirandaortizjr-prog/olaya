// Comprehensive game questions database with level-based progression
// 10,000 levels with questions getting more intimate and thought-provoking as levels increase

export interface GameQuestion {
  id: string;
  en: string;
  es: string;
  minLevel: number;
  maxLevel: number;
  category: 'surface' | 'personal' | 'deep' | 'intimate' | 'profound';
}

// Question generators for infinite variety
export const generateHowWellQuestions = (level: number, language: 'en' | 'es'): string[] => {
  const questions: GameQuestion[] = [
    // Level 1-100: Surface level questions
    { id: 'hw1', en: "What's my favorite color?", es: "¿Cuál es mi color favorito?", minLevel: 1, maxLevel: 100, category: 'surface' },
    { id: 'hw2', en: "What's my favorite food?", es: "¿Cuál es mi comida favorita?", minLevel: 1, maxLevel: 100, category: 'surface' },
    { id: 'hw3', en: "What's my favorite movie?", es: "¿Cuál es mi película favorita?", minLevel: 1, maxLevel: 100, category: 'surface' },
    { id: 'hw4', en: "What's my favorite song?", es: "¿Cuál es mi canción favorita?", minLevel: 1, maxLevel: 100, category: 'surface' },
    { id: 'hw5', en: "What's my favorite season?", es: "¿Cuál es mi estación favorita?", minLevel: 1, maxLevel: 100, category: 'surface' },
    { id: 'hw6', en: "What's my go-to comfort food?", es: "¿Cuál es mi comida reconfortante preferida?", minLevel: 1, maxLevel: 100, category: 'surface' },
    { id: 'hw7', en: "What time do I usually wake up?", es: "¿A qué hora suelo despertar?", minLevel: 1, maxLevel: 100, category: 'surface' },
    { id: 'hw8', en: "What's my favorite type of music?", es: "¿Cuál es mi tipo de música favorito?", minLevel: 1, maxLevel: 100, category: 'surface' },
    
    // Level 100-500: Personal preferences
    { id: 'hw9', en: "What's one thing I always forget?", es: "¿Qué es algo que siempre olvido?", minLevel: 100, maxLevel: 500, category: 'personal' },
    { id: 'hw10', en: "What's my biggest pet peeve?", es: "¿Cuál es mi mayor molestia?", minLevel: 100, maxLevel: 500, category: 'personal' },
    { id: 'hw11', en: "What makes me laugh the hardest?", es: "¿Qué me hace reír más fuerte?", minLevel: 100, maxLevel: 500, category: 'personal' },
    { id: 'hw12', en: "What's my secret talent?", es: "¿Cuál es mi talento secreto?", minLevel: 100, maxLevel: 500, category: 'personal' },
    { id: 'hw13', en: "What's my favorite way to spend a lazy Sunday?", es: "¿Cuál es mi forma favorita de pasar un domingo tranquilo?", minLevel: 100, maxLevel: 500, category: 'personal' },
    { id: 'hw14', en: "What would I order at my favorite restaurant?", es: "¿Qué pediría en mi restaurante favorito?", minLevel: 100, maxLevel: 500, category: 'personal' },
    { id: 'hw15', en: "What's my go-to karaoke song?", es: "¿Cuál es mi canción de karaoke preferida?", minLevel: 100, maxLevel: 500, category: 'personal' },
    { id: 'hw16', en: "What's one thing that instantly improves my mood?", es: "¿Qué es algo que mejora instantáneamente mi ánimo?", minLevel: 100, maxLevel: 500, category: 'personal' },
    
    // Level 500-2000: Deeper understanding
    { id: 'hw17', en: "What's my biggest fear?", es: "¿Cuál es mi mayor miedo?", minLevel: 500, maxLevel: 2000, category: 'deep' },
    { id: 'hw18', en: "What's something I'm secretly proud of?", es: "¿De qué estoy secretamente orgulloso/a?", minLevel: 500, maxLevel: 2000, category: 'deep' },
    { id: 'hw19', en: "What's my favorite childhood memory?", es: "¿Cuál es mi recuerdo favorito de la infancia?", minLevel: 500, maxLevel: 2000, category: 'deep' },
    { id: 'hw20', en: "What would my perfect day look like?", es: "¿Cómo sería mi día perfecto?", minLevel: 500, maxLevel: 2000, category: 'deep' },
    { id: 'hw21', en: "What's one thing I wish people knew about me?", es: "¿Qué es algo que desearía que la gente supiera de mí?", minLevel: 500, maxLevel: 2000, category: 'deep' },
    { id: 'hw22', en: "What makes me feel most loved?", es: "¿Qué me hace sentir más amado/a?", minLevel: 500, maxLevel: 2000, category: 'deep' },
    { id: 'hw23', en: "What's my biggest regret?", es: "¿Cuál es mi mayor arrepentimiento?", minLevel: 500, maxLevel: 2000, category: 'deep' },
    { id: 'hw24', en: "What's one thing I would change about myself?", es: "¿Qué es algo que cambiaría de mí mismo/a?", minLevel: 500, maxLevel: 2000, category: 'deep' },
    
    // Level 2000-5000: Intimate questions
    { id: 'hw25', en: "What's my deepest insecurity?", es: "¿Cuál es mi inseguridad más profunda?", minLevel: 2000, maxLevel: 5000, category: 'intimate' },
    { id: 'hw26', en: "What do I need most when I'm upset?", es: "¿Qué necesito más cuando estoy molesto/a?", minLevel: 2000, maxLevel: 5000, category: 'intimate' },
    { id: 'hw27', en: "What's my love language?", es: "¿Cuál es mi lenguaje de amor?", minLevel: 2000, maxLevel: 5000, category: 'intimate' },
    { id: 'hw28', en: "What's one dream I'm afraid to pursue?", es: "¿Cuál es un sueño que tengo miedo de perseguir?", minLevel: 2000, maxLevel: 5000, category: 'intimate' },
    { id: 'hw29', en: "What makes me feel most vulnerable?", es: "¿Qué me hace sentir más vulnerable?", minLevel: 2000, maxLevel: 5000, category: 'intimate' },
    { id: 'hw30', en: "What's the best way to comfort me when I'm sad?", es: "¿Cuál es la mejor forma de consolarme cuando estoy triste?", minLevel: 2000, maxLevel: 5000, category: 'intimate' },
    
    // Level 5000-10000: Profound connection
    { id: 'hw31', en: "What's the most vulnerable I've ever felt with you?", es: "¿Cuándo me he sentido más vulnerable contigo?", minLevel: 5000, maxLevel: 10000, category: 'profound' },
    { id: 'hw32', en: "What do I value most in our relationship?", es: "¿Qué valoro más en nuestra relación?", minLevel: 5000, maxLevel: 10000, category: 'profound' },
    { id: 'hw33', en: "What's my greatest hope for our future together?", es: "¿Cuál es mi mayor esperanza para nuestro futuro juntos?", minLevel: 5000, maxLevel: 10000, category: 'profound' },
    { id: 'hw34', en: "What moment made me fall deeper in love with you?", es: "¿Qué momento me hizo enamorarme más profundamente de ti?", minLevel: 5000, maxLevel: 10000, category: 'profound' },
    { id: 'hw35', en: "What's the most important lesson I've learned from you?", es: "¿Cuál es la lección más importante que he aprendido de ti?", minLevel: 5000, maxLevel: 10000, category: 'profound' },
    { id: 'hw36', en: "What's one way our relationship has changed me for the better?", es: "¿De qué forma nuestra relación me ha cambiado para mejor?", minLevel: 5000, maxLevel: 10000, category: 'profound' },
  ];

  // Filter questions by level
  const levelQuestions = questions.filter(q => level >= q.minLevel && level <= q.maxLevel);
  
  // Mix in random questions from lower levels for variety
  const allAvailableQuestions = questions.filter(q => level >= q.minLevel);
  
  // Shuffle and select 10 questions
  const shuffled = [...allAvailableQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10).map(q => q[language]);
};

export const generateWouldYouRatherQuestions = (level: number, language: 'en' | 'es'): Array<{question: string, optionA: string, optionB: string}> => {
  const questions: Array<{id: string, en: {question: string, optionA: string, optionB: string}, es: {question: string, optionA: string, optionB: string}, minLevel: number, maxLevel: number}> = [
    // Level 1-100: Fun, lighthearted
    { 
      id: 'wyr1', 
      en: { question: "Would you rather...", optionA: "Have pizza for every meal", optionB: "Never eat pizza again" },
      es: { question: "¿Preferirías...?", optionA: "Comer pizza en cada comida", optionB: "Nunca comer pizza otra vez" },
      minLevel: 1, maxLevel: 100
    },
    { 
      id: 'wyr2', 
      en: { question: "Would you rather...", optionA: "Be able to fly", optionB: "Be invisible" },
      es: { question: "¿Preferirías...?", optionA: "Poder volar", optionB: "Ser invisible" },
      minLevel: 1, maxLevel: 100
    },
    
    // Level 500-2000: Relationship-focused
    { 
      id: 'wyr3', 
      en: { question: "Would you rather...", optionA: "A romantic dinner at home", optionB: "A fancy restaurant date" },
      es: { question: "¿Preferirías...?", optionA: "Una cena romántica en casa", optionB: "Una cita en un restaurante elegante" },
      minLevel: 500, maxLevel: 2000
    },
    { 
      id: 'wyr4', 
      en: { question: "Would you rather...", optionA: "Spend a day in nature together", optionB: "Have a movie marathon at home" },
      es: { question: "¿Preferirías...?", optionA: "Pasar un día en la naturaleza juntos", optionB: "Tener un maratón de películas en casa" },
      minLevel: 500, maxLevel: 2000
    },
    
    // Level 2000-5000: Deep preferences
    { 
      id: 'wyr5', 
      en: { question: "Would you rather...", optionA: "Know all my past", optionB: "See all my future" },
      es: { question: "¿Preferirías...?", optionA: "Conocer todo mi pasado", optionB: "Ver todo mi futuro" },
      minLevel: 2000, maxLevel: 5000
    },
    
    // Level 5000-10000: Profound choices
    { 
      id: 'wyr6', 
      en: { question: "Would you rather...", optionA: "Grow old together slowly", optionB: "Stay young together forever" },
      es: { question: "¿Preferirías...?", optionA: "Envejecer juntos lentamente", optionB: "Permanecer jóvenes juntos para siempre" },
      minLevel: 5000, maxLevel: 10000
    },
  ];

  const levelQuestions = questions.filter(q => level >= q.minLevel && level <= q.maxLevel);
  const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 8).map(q => q[language]);
};

export const getDailySyncQuestions = (level: number, language: 'en' | 'es') => getQuestionsByCategory('daily', level, language);
export const getFutureForecastQuestions = (level: number, language: 'en' | 'es') => getQuestionsByCategory('future', level, language);
export const getLoveLanguageQuestions = (level: number, language: 'en' | 'es') => getQuestionsByCategory('love_language', level, language);
export const getWouldYouRatherQuestions = (level: number, language: 'en' | 'es') => getQuestionsByCategory('would_you_rather', level, language);
export const getTruthOrTenderQuestions = (level: number, language: 'en' | 'es') => getQuestionsByCategory('truth_or_tender', level, language);

// Generic question generator by category
const getQuestionsByCategory = (category: string, level: number, language: 'en' | 'es'): Array<{ question: string; options?: string[]; type?: string }> => {
  const questionData: Record<string, Array<any>> = {
    'daily': [
      { id: 'd1', en: "How are you feeling today?", es: "¿Cómo te sientes hoy?", minLevel: 1, maxLevel: 10000 },
      { id: 'd2', en: "What made you smile today?", es: "¿Qué te hizo sonreír hoy?", minLevel: 1, maxLevel: 10000 },
      { id: 'd3', en: "What's on your mind right now?", es: "¿Qué tienes en mente ahora mismo?", minLevel: 1, maxLevel: 10000 },
      { id: 'd4', en: "What are you grateful for today?", es: "¿Por qué estás agradecido/a hoy?", minLevel: 1, maxLevel: 10000 },
      { id: 'd5', en: "What's something you'd like to share with me?", es: "¿Qué es algo que te gustaría compartir conmigo?", minLevel: 100, maxLevel: 10000 },
    ],
    'future': [
      { id: 'f1', en: "Where do you see us in 5 years?", es: "¿Dónde nos ves en 5 años?", minLevel: 1, maxLevel: 5000 },
      { id: 'f2', en: "What's one dream you have for our future?", es: "¿Cuál es un sueño que tienes para nuestro futuro?", minLevel: 1, maxLevel: 5000 },
      { id: 'f3', en: "What kind of home would you like us to have?", es: "¿Qué tipo de hogar te gustaría que tuviéramos?", minLevel: 500, maxLevel: 10000 },
      { id: 'f4', en: "What adventures do you want us to experience together?", es: "¿Qué aventuras quieres que experimentemos juntos?", minLevel: 1000, maxLevel: 10000 },
      { id: 'f5', en: "How do you imagine us growing old together?", es: "¿Cómo nos imaginas envejeciendo juntos?", minLevel: 2000, maxLevel: 10000 },
    ],
    'love_language': [
      { id: 'll1', en: "How do you prefer to receive love?", es: "¿Cómo prefieres recibir amor?", minLevel: 1, maxLevel: 10000, options: ["Words of Affirmation", "Quality Time", "Physical Touch", "Acts of Service", "Receiving Gifts"] },
      { id: 'll2', en: "What makes you feel most appreciated?", es: "¿Qué te hace sentir más apreciado/a?", minLevel: 1, maxLevel: 10000, options: ["Verbal compliments", "Spending time together", "Hugs and kisses", "Help with tasks", "Thoughtful gifts"] },
      { id: 'll3', en: "When you're upset, what helps you feel better?", es: "Cuando estás molesto/a, ¿qué te ayuda a sentirte mejor?", minLevel: 100, maxLevel: 10000, options: ["Talking it through", "Just being together", "Physical comfort", "Practical help", "A small surprise"] },
      { id: 'll4', en: "How do you show love to others?", es: "¿Cómo demuestras amor a los demás?", minLevel: 500, maxLevel: 10000, options: ["Saying kind words", "Making time for them", "Affectionate gestures", "Doing things for them", "Giving presents"] },
    ],
    'would_you_rather': [
      { id: 'wyr1', en: "Adventure vacation or relaxing beach getaway?", es: "¿Vacaciones de aventura o escapada relajante a la playa?", minLevel: 1, maxLevel: 5000, options: ["Adventure vacation", "Relaxing beach getaway"] },
      { id: 'wyr2', en: "Cook dinner together or go out to eat?", es: "¿Cocinar la cena juntos o salir a comer?", minLevel: 1, maxLevel: 5000, options: ["Cook dinner together", "Go out to eat"] },
      { id: 'wyr3', en: "Movie night at home or concert out?", es: "¿Noche de películas en casa o concierto fuera?", minLevel: 100, maxLevel: 5000, options: ["Movie night at home", "Concert out"] },
      { id: 'wyr4', en: "City life or countryside living?", es: "¿Vida en la ciudad o vivir en el campo?", minLevel: 500, maxLevel: 10000, options: ["City life", "Countryside living"] },
      { id: 'wyr5', en: "Know my past or see my future?", es: "¿Conocer mi pasado o ver mi futuro?", minLevel: 2000, maxLevel: 10000, options: ["Know my past", "See my future"] },
    ],
    'truth_or_tender': [
      { id: 'tt1', en: "What's the silliest thing that makes you laugh?", es: "¿Qué es lo más tonto que te hace reír?", minLevel: 1, maxLevel: 10000, type: 'truth' },
      { id: 'tt2', en: "Tell me your favorite memory of us", es: "Cuéntame tu recuerdo favorito de nosotros", minLevel: 1, maxLevel: 10000, type: 'truth' },
      { id: 'tt3', en: "Share something you've been too shy to say", es: "Comparte algo que has tenido demasiada timidez para decir", minLevel: 500, maxLevel: 10000, type: 'truth' },
      { id: 'tt4', en: "Give me a 10-second hug", es: "Dame un abrazo de 10 segundos", minLevel: 1, maxLevel: 10000, type: 'tender' },
      { id: 'tt5', en: "Do your best impression of me", es: "Haz tu mejor imitación de mí", minLevel: 1, maxLevel: 10000, type: 'tender' },
      { id: 'tt6', en: "Write me a short love note", es: "Escríbeme una nota de amor corta", minLevel: 500, maxLevel: 10000, type: 'tender' },
      { id: 'tt7', en: "Kiss me in a new way", es: "Bésame de una forma nueva", minLevel: 1000, maxLevel: 10000, type: 'tender' },
    ]
  };

  const questions = questionData[category] || [];
  const levelQuestions = questions.filter((q: any) => level >= q.minLevel && level <= q.maxLevel);
  const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 5);
  
  return selected.map((q: any) => ({
    question: q[language],
    options: q.options,
    type: q.type
  }));
};

export const generateTruthOrDareQuestions = (level: number, language: 'en' | 'es'): Array<{truth: string, dare: string}> => {
  const questions: Array<{id: string, en: {truth: string, dare: string}, es: {truth: string, dare: string}, minLevel: number, maxLevel: number}> = [
    // Level 1-100: Playful
    { 
      id: 'td1', 
      en: { truth: "What's the silliest thing that makes you laugh?", dare: "Do your best impression of me" },
      es: { truth: "¿Qué es lo más tonto que te hace reír?", dare: "Haz tu mejor imitación de mí" },
      minLevel: 1, maxLevel: 100
    },
    
    // Level 500-2000: Flirty
    { 
      id: 'td2', 
      en: { truth: "When did you first know you liked me?", dare: "Kiss me in a way you've never done before" },
      es: { truth: "¿Cuándo supiste por primera vez que te gustaba?", dare: "Bésame de una forma que nunca hayas hecho antes" },
      minLevel: 500, maxLevel: 2000
    },
    
    // Level 2000-5000: Intimate
    { 
      id: 'td3', 
      en: { truth: "What's your deepest fantasy about us?", dare: "Whisper something you've been too shy to say" },
      es: { truth: "¿Cuál es tu fantasía más profunda sobre nosotros?", dare: "Susurra algo que has tenido demasiada timidez para decir" },
      minLevel: 2000, maxLevel: 5000
    },
    
    // Level 5000-10000: Profound
    { 
      id: 'td4', 
      en: { truth: "What's one fear you have about our future?", dare: "Express your love without using words" },
      es: { truth: "¿Qué es un miedo que tienes sobre nuestro futuro?", dare: "Expresa tu amor sin usar palabras" },
      minLevel: 5000, maxLevel: 10000
    },
  ];

  const levelQuestions = questions.filter(q => level >= q.minLevel && level <= q.maxLevel);
  const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10).map(q => q[language]);
};

export const calculateExperienceGain = (level: number, result: 'correct' | 'partial' | 'incorrect'): number => {
  const baseExp = Math.floor(10 + (level / 10)); // Scales with level
  
  const multipliers = {
    'correct': 1.0,
    'partial': 0.5,
    'incorrect': 0.25
  };
  
  return Math.floor(baseExp * multipliers[result]);
};
