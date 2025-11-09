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
    // Level 1-100: Playful & Fun (50 questions)
    { id: 'td1', en: { truth: "What's the silliest thing that makes you laugh?", dare: "Do your best impression of me" }, es: { truth: "¿Qué es lo más tonto que te hace reír?", dare: "Haz tu mejor imitación de mí" }, minLevel: 1, maxLevel: 100 },
    { id: 'td2', en: { truth: "What's your favorite childhood memory?", dare: "Sing me your favorite song" }, es: { truth: "¿Cuál es tu recuerdo favorito de la infancia?", dare: "Cántame tu canción favorita" }, minLevel: 1, maxLevel: 100 },
    { id: 'td3', en: { truth: "What's your go-to karaoke song?", dare: "Dance for 30 seconds without music" }, es: { truth: "¿Cuál es tu canción de karaoke preferida?", dare: "Baila durante 30 segundos sin música" }, minLevel: 1, maxLevel: 100 },
    { id: 'td4', en: { truth: "What's your guilty pleasure TV show?", dare: "Do 10 jumping jacks while saying 'I love you'" }, es: { truth: "¿Cuál es tu programa de TV culposo?", dare: "Haz 10 saltos diciendo 'te amo'" }, minLevel: 1, maxLevel: 100 },
    { id: 'td5', en: { truth: "What's the weirdest food combination you enjoy?", dare: "Make a funny face and hold it for 10 seconds" }, es: { truth: "¿Cuál es la combinación de comida más rara que disfrutas?", dare: "Haz una cara graciosa y mantenla por 10 segundos" }, minLevel: 1, maxLevel: 100 },
    { id: 'td6', en: { truth: "What's your most embarrassing moment?", dare: "Tell me a joke and try to make me laugh" }, es: { truth: "¿Cuál es tu momento más vergonzoso?", dare: "Cuéntame un chiste e intenta hacerme reír" }, minLevel: 1, maxLevel: 100 },
    { id: 'td7', en: { truth: "What's your favorite way to procrastinate?", dare: "Do your best celebrity impression" }, es: { truth: "¿Cuál es tu forma favorita de procrastinar?", dare: "Haz tu mejor imitación de una celebridad" }, minLevel: 1, maxLevel: 100 },
    { id: 'td8', en: { truth: "What's the last thing you googled?", dare: "Show me your best dance move" }, es: { truth: "¿Qué fue lo último que buscaste en Google?", dare: "Muéstrame tu mejor paso de baile" }, minLevel: 1, maxLevel: 100 },
    { id: 'td9', en: { truth: "What's your favorite ice cream flavor?", dare: "Give me a high five in slow motion" }, es: { truth: "¿Cuál es tu sabor favorito de helado?", dare: "Dame un choca esos cinco en cámara lenta" }, minLevel: 1, maxLevel: 100 },
    { id: 'td10', en: { truth: "What's your biggest pet peeve?", dare: "Do your best robot dance" }, es: { truth: "¿Cuál es tu mayor molestia?", dare: "Haz tu mejor baile de robot" }, minLevel: 1, maxLevel: 100 },
    { id: 'td11', en: { truth: "What's something you're secretly good at?", dare: "Compliment me using only hand gestures" }, es: { truth: "¿En qué eres secretamente bueno/a?", dare: "Hazme un cumplido usando solo gestos con las manos" }, minLevel: 1, maxLevel: 100 },
    { id: 'td12', en: { truth: "What's your favorite pizza topping?", dare: "Hop on one foot for 20 seconds" }, es: { truth: "¿Cuál es tu topping favorito de pizza?", dare: "Salta en un pie durante 20 segundos" }, minLevel: 1, maxLevel: 100 },
    { id: 'td13', en: { truth: "What's your dream vacation spot?", dare: "Do 5 pushups" }, es: { truth: "¿Cuál es tu lugar de vacaciones soñado?", dare: "Haz 5 flexiones" }, minLevel: 1, maxLevel: 100 },
    { id: 'td14', en: { truth: "What's your favorite childhood cartoon?", dare: "Speak in an accent for the next minute" }, es: { truth: "¿Cuál es tu caricatura favorita de la infancia?", dare: "Habla con acento durante el próximo minuto" }, minLevel: 1, maxLevel: 100 },
    { id: 'td15', en: { truth: "What's your coffee or tea order?", dare: "Do your best animal impression" }, es: { truth: "¿Cuál es tu orden de café o té?", dare: "Haz tu mejor imitación de un animal" }, minLevel: 1, maxLevel: 100 },
    { id: 'td16', en: { truth: "What's your favorite season and why?", dare: "Balance on one leg for 30 seconds" }, es: { truth: "¿Cuál es tu estación favorita y por qué?", dare: "Mantén el equilibrio en una pierna durante 30 segundos" }, minLevel: 1, maxLevel: 100 },
    { id: 'td17', en: { truth: "What's your go-to comfort food?", dare: "Do the chicken dance" }, es: { truth: "¿Cuál es tu comida reconfortante preferida?", dare: "Haz el baile del pollo" }, minLevel: 1, maxLevel: 100 },
    { id: 'td18', en: { truth: "What's your favorite board game?", dare: "Spin around 5 times then walk in a straight line" }, es: { truth: "¿Cuál es tu juego de mesa favorito?", dare: "Gira 5 veces y luego camina en línea recta" }, minLevel: 1, maxLevel: 100 },
    { id: 'td19', en: { truth: "What's your favorite type of music?", dare: "Beatbox for 15 seconds" }, es: { truth: "¿Cuál es tu tipo de música favorito?", dare: "Haz beatbox durante 15 segundos" }, minLevel: 1, maxLevel: 100 },
    { id: 'td20', en: { truth: "What's your hidden talent?", dare: "Do the moonwalk across the room" }, es: { truth: "¿Cuál es tu talento oculto?", dare: "Haz el moonwalk por la habitación" }, minLevel: 1, maxLevel: 100 },
    
    // Level 100-500: Personal & Romantic (60 questions)
    { id: 'td21', en: { truth: "What's your favorite thing about me?", dare: "Give me a 30-second shoulder massage" }, es: { truth: "¿Qué es lo que más te gusta de mí?", dare: "Dame un masaje de hombros de 30 segundos" }, minLevel: 100, maxLevel: 500 },
    { id: 'td22', en: { truth: "When did you first know you liked me?", dare: "Kiss me in a way you've never done before" }, es: { truth: "¿Cuándo supiste por primera vez que te gustaba?", dare: "Bésame de una forma que nunca hayas hecho antes" }, minLevel: 100, maxLevel: 500 },
    { id: 'td23', en: { truth: "What's your favorite memory of us?", dare: "Slow dance with me for one song" }, es: { truth: "¿Cuál es tu recuerdo favorito de nosotros?", dare: "Baila lento conmigo durante una canción" }, minLevel: 100, maxLevel: 500 },
    { id: 'td24', en: { truth: "What's something I do that makes you smile?", dare: "Give me three different types of kisses" }, es: { truth: "¿Qué es algo que hago que te hace sonreír?", dare: "Dame tres tipos diferentes de besos" }, minLevel: 100, maxLevel: 500 },
    { id: 'td25', en: { truth: "What's your ideal date night?", dare: "Write me a short love note right now" }, es: { truth: "¿Cuál es tu noche de cita ideal?", dare: "Escríbeme una nota de amor corta ahora mismo" }, minLevel: 100, maxLevel: 500 },
    { id: 'td26', en: { truth: "What song reminds you of me?", dare: "Serenade me with that song" }, es: { truth: "¿Qué canción te recuerda a mí?", dare: "Dame una serenata con esa canción" }, minLevel: 100, maxLevel: 500 },
    { id: 'td27', en: { truth: "What was your first impression of me?", dare: "Look into my eyes for 30 seconds without talking" }, es: { truth: "¿Cuál fue tu primera impresión de mí?", dare: "Mírame a los ojos durante 30 segundos sin hablar" }, minLevel: 100, maxLevel: 500 },
    { id: 'td28', en: { truth: "What's something you find attractive about me?", dare: "Trace my hand with your fingers slowly" }, es: { truth: "¿Qué encuentras atractivo de mí?", dare: "Traza mi mano con tus dedos lentamente" }, minLevel: 100, maxLevel: 500 },
    { id: 'td29', en: { truth: "What's your love language?", dare: "Demonstrate your love language on me" }, es: { truth: "¿Cuál es tu lenguaje de amor?", dare: "Demuestra tu lenguaje de amor conmigo" }, minLevel: 100, maxLevel: 500 },
    { id: 'td30', en: { truth: "What's your dream life with me?", dare: "Give me a 10-second forehead kiss" }, es: { truth: "¿Cuál es tu vida soñada conmigo?", dare: "Dame un beso en la frente de 10 segundos" }, minLevel: 100, maxLevel: 500 },
    { id: 'td31', en: { truth: "What's the most romantic thing I've done?", dare: "Hold my hand and tell me why you love me" }, es: { truth: "¿Qué es lo más romántico que he hecho?", dare: "Toma mi mano y dime por qué me amas" }, minLevel: 100, maxLevel: 500 },
    { id: 'td32', en: { truth: "Where would you want to travel with me?", dare: "Give me a hug from behind" }, es: { truth: "¿A dónde querrías viajar conmigo?", dare: "Dame un abrazo por detrás" }, minLevel: 100, maxLevel: 500 },
    { id: 'td33', en: { truth: "What's your favorite physical feature of mine?", dare: "Kiss that feature gently" }, es: { truth: "¿Cuál es tu característica física favorita mía?", dare: "Besa esa característica suavemente" }, minLevel: 100, maxLevel: 500 },
    { id: 'td34', en: { truth: "What's something you want to do together?", dare: "Whisper three things you love about me" }, es: { truth: "¿Qué es algo que quieres hacer juntos?", dare: "Susurra tres cosas que amas de mí" }, minLevel: 100, maxLevel: 500 },
    { id: 'td35', en: { truth: "What makes you feel loved by me?", dare: "Give me butterfly kisses on my cheek" }, es: { truth: "¿Qué te hace sentir amado/a por mí?", dare: "Dame besos de mariposa en mi mejilla" }, minLevel: 100, maxLevel: 500 },
    { id: 'td36', en: { truth: "What's a dream date you want us to have?", dare: "Plan our next date night right now" }, es: { truth: "¿Cuál es una cita soñada que quieres que tengamos?", dare: "Planea nuestra próxima cita ahora mismo" }, minLevel: 100, maxLevel: 500 },
    { id: 'td37', en: { truth: "What's your favorite nickname I've given you?", dare: "Come up with a new cute nickname for me" }, es: { truth: "¿Cuál es tu apodo favorito que te he dado?", dare: "Inventa un nuevo apodo lindo para mí" }, minLevel: 100, maxLevel: 500 },
    { id: 'td38', en: { truth: "What's something I do that comforts you?", dare: "Do that comforting thing to me" }, es: { truth: "¿Qué es algo que hago que te reconforta?", dare: "Haz esa cosa reconfortante conmigo" }, minLevel: 100, maxLevel: 500 },
    { id: 'td39', en: { truth: "What's your favorite way to cuddle?", dare: "Show me right now" }, es: { truth: "¿Cuál es tu forma favorita de acurrucarse?", dare: "Muéstramelo ahora mismo" }, minLevel: 100, maxLevel: 500 },
    { id: 'td40', en: { truth: "What's a little thing I do that you appreciate?", dare: "Give me a thank you kiss" }, es: { truth: "¿Qué es una pequeña cosa que hago que aprecias?", dare: "Dame un beso de agradecimiento" }, minLevel: 100, maxLevel: 500 },
    
    // Level 500-2000: Deeper & Flirty (80 questions)
    { id: 'td41', en: { truth: "What's your biggest fantasy about us?", dare: "Whisper something you've been too shy to say" }, es: { truth: "¿Cuál es tu mayor fantasía sobre nosotros?", dare: "Susurra algo que has tenido demasiada timidez para decir" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td42', en: { truth: "When do you feel most attracted to me?", dare: "Show me through touch" }, es: { truth: "¿Cuándo te sientes más atraído/a hacia mí?", dare: "Muéstramelo a través del tacto" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td43', en: { truth: "What's something new you want to try with me?", dare: "Give me a sensual massage for 2 minutes" }, es: { truth: "¿Qué es algo nuevo que quieres probar conmigo?", dare: "Dame un masaje sensual durante 2 minutos" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td44', en: { truth: "What's your favorite way I touch you?", dare: "Demonstrate on me" }, es: { truth: "¿Cuál es tu forma favorita en que te toco?", dare: "Demuéstralo conmigo" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td45', en: { truth: "What turns you on about me?", dare: "Kiss me passionately for 30 seconds" }, es: { truth: "¿Qué te excita de mí?", dare: "Bésame apasionadamente durante 30 segundos" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td46', en: { truth: "What's a secret desire you have?", dare: "Trace my lips with your finger" }, es: { truth: "¿Cuál es un deseo secreto que tienes?", dare: "Traza mis labios con tu dedo" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td47', en: { truth: "Where's your favorite place to be kissed?", dare: "Let me kiss you there" }, es: { truth: "¿Dónde es tu lugar favorito para ser besado/a?", dare: "Déjame besarte ahí" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td48', en: { truth: "What's the sexiest thing I've worn?", dare: "Tell me what you want to see me wear" }, es: { truth: "¿Qué es lo más sexy que he usado?", dare: "Dime qué quieres verme usar" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td49', en: { truth: "What's your favorite intimate memory of us?", dare: "Recreate part of it" }, es: { truth: "¿Cuál es tu recuerdo íntimo favorito de nosotros?", dare: "Recrea parte de él" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td50', en: { truth: "What's something you find irresistible about me?", dare: "Show me with actions, not words" }, es: { truth: "¿Qué encuentras irresistible de mí?", dare: "Muéstramelo con acciones, no palabras" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td51', en: { truth: "What's a romantic gesture you've always wanted?", dare: "Sit on my lap and tell me your feelings" }, es: { truth: "¿Cuál es un gesto romántico que siempre has querido?", dare: "Siéntate en mi regazo y cuéntame tus sentimientos" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td52', en: { truth: "What makes you feel most desired by me?", dare: "Kiss my neck gently" }, es: { truth: "¿Qué te hace sentir más deseado/a por mí?", dare: "Besa mi cuello suavemente" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td53', en: { truth: "What's your ideal romantic evening?", dare: "Run your fingers through my hair slowly" }, es: { truth: "¿Cuál es tu noche romántica ideal?", dare: "Pasa tus dedos por mi cabello lentamente" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td54', en: { truth: "What's the most attractive thing about my personality?", dare: "Give me kisses along my jawline" }, es: { truth: "¿Qué es lo más atractivo de mi personalidad?", dare: "Dame besos a lo largo de mi mandíbula" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td55', en: { truth: "What do you love about how we connect?", dare: "Hold me close and breathe together for 1 minute" }, es: { truth: "¿Qué amas de cómo nos conectamos?", dare: "Abrázame fuerte y respiremos juntos durante 1 minuto" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td56', en: { truth: "What's something you want more of in our relationship?", dare: "Caress my face while looking into my eyes" }, es: { truth: "¿Qué es algo que quieres más en nuestra relación?", dare: "Acaricia mi rostro mientras me miras a los ojos" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td57', en: { truth: "What's your favorite quality time activity with me?", dare: "Nuzzle against me" }, es: { truth: "¿Cuál es tu actividad favorita de tiempo de calidad conmigo?", dare: "Acurrúcate contra mí" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td58', en: { truth: "What makes you feel closest to me?", dare: "Whisper sweet nothings in my ear" }, es: { truth: "¿Qué te hace sentir más cerca de mí?", dare: "Susurra palabras dulces en mi oído" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td59', en: { truth: "What's a romantic surprise you'd love?", dare: "Trace patterns on my back with your fingertips" }, es: { truth: "¿Cuál es una sorpresa romántica que te encantaría?", dare: "Traza patrones en mi espalda con las yemas de tus dedos" }, minLevel: 500, maxLevel: 2000 },
    { id: 'td60', en: { truth: "What do you find most appealing about me?", dare: "Give me a lingering kiss on my forehead" }, es: { truth: "¿Qué encuentras más atractivo de mí?", dare: "Dame un beso prolongado en mi frente" }, minLevel: 500, maxLevel: 2000 },
    
    // Level 2000-5000: Intimate & Deep (50 questions)
    { id: 'td61', en: { truth: "What's your deepest desire?", dare: "Express your love without using words for 2 minutes" }, es: { truth: "¿Cuál es tu deseo más profundo?", dare: "Expresa tu amor sin usar palabras durante 2 minutos" }, minLevel: 2000, maxLevel: 5000 },
    { id: 'td62', en: { truth: "What's something you've never told anyone?", dare: "Make me feel cherished through touch" }, es: { truth: "¿Qué es algo que nunca le has dicho a nadie?", dare: "Hazme sentir querido/a a través del tacto" }, minLevel: 2000, maxLevel: 5000 },
    { id: 'td63', en: { truth: "What makes you feel most vulnerable with me?", dare: "Hold me and tell me your deepest feelings" }, es: { truth: "¿Qué te hace sentir más vulnerable conmigo?", dare: "Abrázame y cuéntame tus sentimientos más profundos" }, minLevel: 2000, maxLevel: 5000 },
    { id: 'td64', en: { truth: "What's your biggest fear about us?", dare: "Show me how much I mean to you" }, es: { truth: "¿Cuál es tu mayor miedo sobre nosotros?", dare: "Muéstrame cuánto significo para ti" }, minLevel: 2000, maxLevel: 5000 },
    { id: 'td65', en: { truth: "What's something you need from me?", dare: "Create an intimate moment between us" }, es: { truth: "¿Qué es algo que necesitas de mí?", dare: "Crea un momento íntimo entre nosotros" }, minLevel: 2000, maxLevel: 5000 },
    { id: 'td66', en: { truth: "What's the most intimate thing we've shared?", dare: "Recreate that connection now" }, es: { truth: "¿Qué es lo más íntimo que hemos compartido?", dare: "Recrea esa conexión ahora" }, minLevel: 2000, maxLevel: 5000 },
    { id: 'td67', en: { truth: "What do you crave most from our relationship?", dare: "Fulfill one of my unspoken desires" }, es: { truth: "¿Qué anhelas más de nuestra relación?", dare: "Cumple uno de mis deseos no expresados" }, minLevel: 2000, maxLevel: 5000 },
    { id: 'td68', en: { truth: "What's your most secret fantasy?", dare: "Seduce me with your eyes and touch" }, es: { truth: "¿Cuál es tu fantasía más secreta?", dare: "Sedúceme con tus ojos y tu tacto" }, minLevel: 2000, maxLevel: 5000 },
    { id: 'td69', en: { truth: "What makes you feel completely safe with me?", dare: "Be completely present with me for 3 minutes" }, es: { truth: "¿Qué te hace sentir completamente seguro/a conmigo?", dare: "Está completamente presente conmigo durante 3 minutos" }, minLevel: 2000, maxLevel: 5000 },
    { id: 'td70', en: { truth: "What's the deepest connection we've had?", dare: "Connect with me on that level now" }, es: { truth: "¿Cuál es la conexión más profunda que hemos tenido?", dare: "Conéctate conmigo a ese nivel ahora" }, minLevel: 2000, maxLevel: 5000 },
    
    // Level 5000-10000: Profound & Soulful (40 questions)
    { id: 'td71', en: { truth: "What's one fear you have about our future?", dare: "Express your love without using words" }, es: { truth: "¿Qué es un miedo que tienes sobre nuestro futuro?", dare: "Expresa tu amor sin usar palabras" }, minLevel: 5000, maxLevel: 10000 },
    { id: 'td72', en: { truth: "How has loving me changed you?", dare: "Show me the depth of your feelings" }, es: { truth: "¿Cómo te ha cambiado amarme?", dare: "Muéstrame la profundidad de tus sentimientos" }, minLevel: 5000, maxLevel: 10000 },
    { id: 'td73', en: { truth: "What's your vision for us in 10 years?", dare: "Make a promise to our future selves" }, es: { truth: "¿Cuál es tu visión para nosotros en 10 años?", dare: "Haz una promesa a nuestro yo futuro" }, minLevel: 5000, maxLevel: 10000 },
    { id: 'td74', en: { truth: "What's the most profound moment we've shared?", dare: "Create a sacred moment between us" }, es: { truth: "¿Cuál es el momento más profundo que hemos compartido?", dare: "Crea un momento sagrado entre nosotros" }, minLevel: 5000, maxLevel: 10000 },
    { id: 'td75', en: { truth: "What does forever mean to you with me?", dare: "Declare your commitment to me" }, es: { truth: "¿Qué significa para siempre contigo para mí?", dare: "Declara tu compromiso conmigo" }, minLevel: 5000, maxLevel: 10000 },
    { id: 'td76', en: { truth: "What's your soul's deepest wish for us?", dare: "Merge your energy with mine in silence" }, es: { truth: "¿Cuál es el deseo más profundo de tu alma para nosotros?", dare: "Fusiona tu energía con la mía en silencio" }, minLevel: 5000, maxLevel: 10000 },
    { id: 'td77', en: { truth: "How do you want to grow old with me?", dare: "Paint me a picture of our future with your words" }, es: { truth: "¿Cómo quieres envejecer conmigo?", dare: "Píntame un cuadro de nuestro futuro con tus palabras" }, minLevel: 5000, maxLevel: 10000 },
    { id: 'td78', en: { truth: "What's the greatest gift our love has given you?", dare: "Honor our love with a meaningful gesture" }, es: { truth: "¿Cuál es el mayor regalo que nuestro amor te ha dado?", dare: "Honra nuestro amor con un gesto significativo" }, minLevel: 5000, maxLevel: 10000 },
    { id: 'td79', en: { truth: "What truth about us do you hold most sacred?", dare: "Create a ritual that's just ours" }, es: { truth: "¿Qué verdad sobre nosotros consideras más sagrada?", dare: "Crea un ritual que sea solo nuestro" }, minLevel: 5000, maxLevel: 10000 },
    { id: 'td80', en: { truth: "What makes our love extraordinary?", dare: "Celebrate our uniqueness together" }, es: { truth: "¿Qué hace que nuestro amor sea extraordinario?", dare: "Celebra nuestra singularidad juntos" }, minLevel: 5000, maxLevel: 10000 },
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
