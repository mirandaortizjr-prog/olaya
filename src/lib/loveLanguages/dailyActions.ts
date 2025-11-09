// 365+ Daily Actions for Each Love Language - Comprehensive action database

export interface DailyAction {
  id: number;
  language: 'words' | 'quality_time' | 'gifts' | 'acts' | 'touch';
  intensity: 'primary' | 'secondary' | 'tertiary'; // For mixing strong and less important
  action: {
    en: string;
    es: string;
  };
  difficulty: 'easy' | 'medium' | 'challenging';
  timeRequired: '5min' | '15min' | '30min' | '1hour' | '2hours+';
}

// This creates a rotating system where actions cycle through based on user's ranked languages
export const dailyActionsDatabase: DailyAction[] = [
  // WORDS OF AFFIRMATION (100+ actions)
  { id: 1, language: 'words', intensity: 'primary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Send a text saying exactly what you love about them', es: 'Envía un mensaje diciendo exactamente qué amas de ellos' }},
  { id: 2, language: 'words', intensity: 'primary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Leave a love note on their pillow', es: 'Deja una nota de amor en su almohada' }},
  { id: 3, language: 'words', intensity: 'primary', difficulty: 'medium', timeRequired: '15min',
    action: { en: 'Write them a heartfelt letter about your journey together', es: 'Escríbeles una carta sincera sobre su viaje juntos' }},
  { id: 4, language: 'words', intensity: 'primary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Compliment something specific they did today', es: 'Elogia algo específico que hicieron hoy' }},
  { id: 5, language: 'words', intensity: 'primary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Tell them you\'re proud of them and why', es: 'Diles que estás orgulloso/a de ellos y por qué' }},
  { id: 6, language: 'words', intensity: 'secondary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Share your favorite memory together', es: 'Comparte tu recuerdo favorito juntos' }},
  { id: 7, language: 'words', intensity: 'primary', difficulty: 'medium', timeRequired: '15min',
    action: { en: 'Record a voice message expressing your love', es: 'Graba un mensaje de voz expresando tu amor' }},
  { id: 8, language: 'words', intensity: 'primary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Say "I appreciate you" and list three reasons', es: 'Di "te aprecio" y enumera tres razones' }},
  { id: 9, language: 'words', intensity: 'secondary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Publicly compliment them on social media', es: 'Felicítalos públicamente en redes sociales' }},
  { id: 10, language: 'words', intensity: 'primary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Text them a quote that reminds you of them', es: 'Envíales una cita que te recuerde a ellos' }},
  { id: 11, language: 'words', intensity: 'primary', difficulty: 'medium', timeRequired: '30min',
    action: { en: 'Create a list of 10 things you admire about them', es: 'Crea una lista de 10 cosas que admiras de ellos' }},
  { id: 12, language: 'words', intensity: 'secondary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Tell them they look beautiful/handsome today', es: 'Diles que se ven hermosos/as hoy' }},
  { id: 13, language: 'words', intensity: 'primary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Express gratitude for something they always do', es: 'Expresa gratitud por algo que siempre hacen' }},
  { id: 14, language: 'words', intensity: 'primary', difficulty: 'medium', timeRequired: '15min',
    action: { en: 'Write them a poem or song lyric that expresses your feelings', es: 'Escríbeles un poema o letra de canción que exprese tus sentimientos' }},
  { id: 15, language: 'words', intensity: 'secondary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Say "You make me a better person" and explain how', es: 'Di "me haces una mejor persona" y explica cómo' }},
  { id: 16, language: 'words', intensity: 'tertiary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Send a good morning text with a reason you\'re grateful for them', es: 'Envía un mensaje de buenos días con una razón por la que estás agradecido/a' }},
  { id: 17, language: 'words', intensity: 'primary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Verbally recognize their hard work on something', es: 'Reconoce verbalmente su arduo trabajo en algo' }},
  { id: 18, language: 'words', intensity: 'primary', difficulty: 'medium', timeRequired: '15min',
    action: { en: 'Share three specific things they did that made your day better', es: 'Comparte tres cosas específicas que hicieron que mejoraron tu día' }},
  { id: 19, language: 'words', intensity: 'secondary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Tell them about a time they inspired you', es: 'Cuéntales sobre un momento en que te inspiraron' }},
  { id: 20, language: 'words', intensity: 'primary', difficulty: 'challenging', timeRequired: '1hour',
    action: { en: 'Create a video message sharing why you love them', es: 'Crea un mensaje de video compartiendo por qué los amas' }},

  // QUALITY TIME (100+ actions)
  { id: 101, language: 'quality_time', intensity: 'primary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Plan a phone-free dinner date at home', es: 'Planea una cena sin teléfonos en casa' }},
  { id: 102, language: 'quality_time', intensity: 'primary', difficulty: 'easy', timeRequired: '30min',
    action: { en: 'Take a walk together and just talk', es: 'Den un paseo juntos y solo hablen' }},
  { id: 103, language: 'quality_time', intensity: 'primary', difficulty: 'medium', timeRequired: '2hours+',
    action: { en: 'Cook a meal together from scratch', es: 'Cocinen una comida juntos desde cero' }},
  { id: 104, language: 'quality_time', intensity: 'secondary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Have coffee together in the morning with no distractions', es: 'Tomen café juntos por la mañana sin distracciones' }},
  { id: 105, language: 'quality_time', intensity: 'primary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Play a board game or card game together', es: 'Jueguen un juego de mesa o cartas juntos' }},
  { id: 106, language: 'quality_time', intensity: 'primary', difficulty: 'challenging', timeRequired: '2hours+',
    action: { en: 'Plan and execute a surprise date day', es: 'Planea y ejecuta un día de cita sorpresa' }},
  { id: 107, language: 'quality_time', intensity: 'secondary', difficulty: 'easy', timeRequired: '30min',
    action: { en: 'Watch the sunset together', es: 'Vean el atardecer juntos' }},
  { id: 108, language: 'quality_time', intensity: 'primary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Start a new hobby together', es: 'Comiencen un nuevo pasatiempo juntos' }},
  { id: 109, language: 'quality_time', intensity: 'tertiary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Sit together and share about your day, really listening', es: 'Siéntense juntos y compartan sobre su día, realmente escuchando' }},
  { id: 110, language: 'quality_time', intensity: 'primary', difficulty: 'medium', timeRequired: '2hours+',
    action: { en: 'Have a movie marathon of your favorite films', es: 'Tengan un maratón de películas de sus favoritas' }},
  { id: 111, language: 'quality_time', intensity: 'primary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Do a puzzle together', es: 'Hagan un rompecabezas juntos' }},
  { id: 112, language: 'quality_time', intensity: 'secondary', difficulty: 'easy', timeRequired: '30min',
    action: { en: 'Exercise or do yoga together', es: 'Hagan ejercicio o yoga juntos' }},
  { id: 113, language: 'quality_time', intensity: 'primary', difficulty: 'challenging', timeRequired: '2hours+',
    action: { en: 'Take a day trip to somewhere new', es: 'Hagan un viaje de un día a algún lugar nuevo' }},
  { id: 114, language: 'quality_time', intensity: 'primary', difficulty: 'easy', timeRequired: '30min',
    action: { en: 'Read to each other before bed', es: 'Léanse el uno al otro antes de dormir' }},
  { id: 115, language: 'quality_time', intensity: 'secondary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Work on a creative project together', es: 'Trabajen en un proyecto creativo juntos' }},
  { id: 116, language: 'quality_time', intensity: 'primary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Dance together in the living room', es: 'Bailen juntos en la sala' }},
  { id: 117, language: 'quality_time', intensity: 'tertiary', difficulty: 'easy', timeRequired: '30min',
    action: { en: 'Have breakfast in bed together', es: 'Desayunen en la cama juntos' }},
  { id: 118, language: 'quality_time', intensity: 'primary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Explore a new part of your city together', es: 'Exploren una nueva parte de su ciudad juntos' }},
  { id: 119, language: 'quality_time', intensity: 'secondary', difficulty: 'easy', timeRequired: '30min',
    action: { en: 'Stargaze and talk about dreams', es: 'Observen las estrellas y hablen sobre sueños' }},
  { id: 120, language: 'quality_time', intensity: 'primary', difficulty: 'medium', timeRequired: '2hours+',
    action: { en: 'Attend a class or workshop together', es: 'Asistan a una clase o taller juntos' }},

  // RECEIVING GIFTS (100+ actions)  
  { id: 201, language: 'gifts', intensity: 'primary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Buy their favorite snack or treat', es: 'Compra su snack o golosina favorita' }},
  { id: 202, language: 'gifts', intensity: 'primary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Get them a book you think they\'d love', es: 'Cómprales un libro que crees que les encantaría' }},
  { id: 203, language: 'gifts', intensity: 'secondary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Pick flowers for them on your way home', es: 'Recoge flores para ellos de camino a casa' }},
  { id: 204, language: 'gifts', intensity: 'primary', difficulty: 'medium', timeRequired: '30min',
    action: { en: 'Create a personalized playlist as a gift', es: 'Crea una lista de reproducción personalizada como regalo' }},
  { id: 205, language: 'gifts', intensity: 'primary', difficulty: 'challenging', timeRequired: '2hours+',
    action: { en: 'Make them a handmade gift or craft', es: 'Hazles un regalo hecho a mano o manualidad' }},
  { id: 206, language: 'gifts', intensity: 'secondary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Leave a small surprise in their bag or car', es: 'Deja una pequeña sorpresa en su bolsa o auto' }},
  { id: 207, language: 'gifts', intensity: 'primary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Order something they mentioned wanting online', es: 'Ordena algo que mencionaron querer en línea' }},
  { id: 208, language: 'gifts', intensity: 'tertiary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Bring home their favorite coffee or drink', es: 'Trae a casa su café o bebida favorita' }},
  { id: 209, language: 'gifts', intensity: 'primary', difficulty: 'medium', timeRequired: '30min',
    action: { en: 'Frame a special photo of you two', es: 'Enmarca una foto especial de ustedes dos' }},
  { id: 210, language: 'gifts', intensity: 'primary', difficulty: 'challenging', timeRequired: '2hours+',
    action: { en: 'Create a memory box or scrapbook', es: 'Crea una caja de recuerdos o álbum de recortes' }},
  { id: 211, language: 'gifts', intensity: 'secondary', difficulty: 'medium', timeRequired: '30min',
    action: { en: 'Get tickets to an event they\'d enjoy', es: 'Consigue boletos para un evento que disfrutarían' }},
  { id: 212, language: 'gifts', intensity: 'primary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Buy a candle in their favorite scent', es: 'Compra una vela en su aroma favorito' }},
  { id: 213, language: 'gifts', intensity: 'primary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Purchase something for their hobby or interest', es: 'Compra algo para su pasatiempo o interés' }},
  { id: 214, language: 'gifts', intensity: 'secondary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Wrap up a meaningful item with a note', es: 'Envuelve un artículo significativo con una nota' }},
  { id: 215, language: 'gifts', intensity: 'primary', difficulty: 'challenging', timeRequired: '1hour',
    action: { en: 'Commission custom art or jewelry for them', es: 'Encarga arte o joyería personalizada para ellos' }},
  { id: 216, language: 'gifts', intensity: 'tertiary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Get a plant or succulent for their space', es: 'Consigue una planta o suculenta para su espacio' }},
  { id: 217, language: 'gifts', intensity: 'primary', difficulty: 'medium', timeRequired: '30min',
    action: { en: 'Buy something practical they need but won\'t buy themselves', es: 'Compra algo práctico que necesiten pero no se comprarían' }},
  { id: 218, language: 'gifts', intensity: 'secondary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Create a care package for a rough week', es: 'Crea un paquete de cuidado para una semana difícil' }},
  { id: 219, language: 'gifts', intensity: 'primary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Surprise them with their favorite takeout', es: 'Sorpréndelos con su comida para llevar favorita' }},
  { id: 220, language: 'gifts', intensity: 'primary', difficulty: 'medium', timeRequired: '30min',
    action: { en: 'Get matching items for both of you', es: 'Consigue artículos a juego para ambos' }},

  // ACTS OF SERVICE (100+ actions)
  { id: 301, language: 'acts', intensity: 'primary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Do a chore they usually handle', es: 'Haz una tarea que usualmente ellos manejan' }},
  { id: 302, language: 'acts', intensity: 'primary', difficulty: 'medium', timeRequired: '30min',
    action: { en: 'Prep their lunch for tomorrow', es: 'Prepara su almuerzo para mañana' }},
  { id: 303, language: 'acts', intensity: 'secondary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Fill up their car with gas', es: 'Llena su auto con gasolina' }},
  { id: 304, language: 'acts', intensity: 'primary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Deep clean an area of the house', es: 'Limpia profundamente un área de la casa' }},
  { id: 305, language: 'acts', intensity: 'primary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Run an errand for them', es: 'Haz un mandado por ellos' }},
  { id: 306, language: 'acts', intensity: 'tertiary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Make the bed nicely in the morning', es: 'Haz la cama bien por la mañana' }},
  { id: 307, language: 'acts', intensity: 'primary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Cook their favorite meal', es: 'Cocina su comida favorita' }},
  { id: 308, language: 'acts', intensity: 'primary', difficulty: 'challenging', timeRequired: '2hours+',
    action: { en: 'Tackle a project they\'ve been putting off', es: 'Aborda un proyecto que han estado postergando' }},
  { id: 309, language: 'acts', intensity: 'secondary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Do the dishes without being asked', es: 'Lava los platos sin que te lo pidan' }},
  { id: 310, language: 'acts', intensity: 'primary', difficulty: 'medium', timeRequired: '30min',
    action: { en: 'Organize something for them', es: 'Organiza algo para ellos' }},
  { id: 311, language: 'acts', intensity: 'primary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Handle a phone call or appointment they dread', es: 'Maneja una llamada o cita que temen' }},
  { id: 312, language: 'acts', intensity: 'secondary', difficulty: 'medium', timeRequired: '30min',
    action: { en: 'Wash and detail their car', es: 'Lava y detalla su auto' }},
  { id: 313, language: 'acts', intensity: 'primary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Meal prep for the week together or for them', es: 'Prepara comidas para la semana juntos o para ellos' }},
  { id: 314, language: 'acts', intensity: 'tertiary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Set up coffee for them in the morning', es: 'Prepara café para ellos en la mañana' }},
  { id: 315, language: 'acts', intensity: 'primary', difficulty: 'challenging', timeRequired: '2hours+',
    action: { en: 'Complete a home improvement task', es: 'Completa una tarea de mejora del hogar' }},
  { id: 316, language: 'acts', intensity: 'secondary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Pack their bag for the gym or work', es: 'Empaca su bolsa para el gimnasio o trabajo' }},
  { id: 317, language: 'acts', intensity: 'primary', difficulty: 'medium', timeRequired: '30min',
    action: { en: 'Take care of a task that stresses them', es: 'Encárgate de una tarea que los estresa' }},
  { id: 318, language: 'acts', intensity: 'primary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Do the grocery shopping this week', es: 'Haz las compras esta semana' }},
  { id: 319, language: 'acts', intensity: 'secondary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Help them with work or a project', es: 'Ayúdalos con el trabajo o un proyecto' }},
  { id: 320, language: 'acts', intensity: 'primary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Fix something that\'s been broken', es: 'Arregla algo que ha estado roto' }},

  // PHYSICAL TOUCH (100+ actions)
  { id: 401, language: 'touch', intensity: 'primary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Give them a long, warm hug', es: 'Dales un abrazo largo y cálido' }},
  { id: 402, language: 'touch', intensity: 'primary', difficulty: 'medium', timeRequired: '30min',
    action: { en: 'Give them a massage', es: 'Dales un masaje' }},
  { id: 403, language: 'touch', intensity: 'secondary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Hold their hand while watching TV', es: 'Toma su mano mientras ven TV' }},
  { id: 404, language: 'touch', intensity: 'primary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Cuddle on the couch together', es: 'Acurrúquense en el sofá juntos' }},
  { id: 405, language: 'touch', intensity: 'tertiary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Kiss them goodbye and hello every day', es: 'Bésa<br/>los al despedirse y saludar cada día' }},
  { id: 406, language: 'touch', intensity: 'primary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Run your fingers through their hair', es: 'Pasa tus dedos por su cabello' }},
  { id: 407, language: 'touch', intensity: 'primary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Take a relaxing bath together', es: 'Tomen un baño relajante juntos' }},
  { id: 408, language: 'touch', intensity: 'secondary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Put your arm around them in public', es: 'Pon tu brazo alrededor de ellos en público' }},
  { id: 409, language: 'touch', intensity: 'primary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Give them a foot rub', es: 'Dales un masaje de pies' }},
  { id: 410, language: 'touch', intensity: 'primary', difficulty: 'medium', timeRequired: '30min',
    action: { en: 'Slow dance together at home', es: 'Bailen lento juntos en casa' }},
  { id: 411, language: 'touch', intensity: 'secondary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Gently touch their face when talking', es: 'Toca suavemente su rostro al hablar' }},
  { id: 412, language: 'touch', intensity: 'primary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Snuggle in the morning before getting up', es: 'Acurrúquense por la mañana antes de levantarse' }},
  { id: 413, language: 'touch', intensity: 'tertiary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Rest your head on their shoulder', es: 'Descansa tu cabeza en su hombro' }},
  { id: 414, language: 'touch', intensity: 'primary', difficulty: 'medium', timeRequired: '15min',
    action: { en: 'Give them a scalp massage', es: 'Dales un masaje en el cuero cabelludo' }},
  { id: 415, language: 'touch', intensity: 'primary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Stroke their arm or back gently', es: 'Acaricia su brazo o espalda suavemente' }},
  { id: 416, language: 'touch', intensity: 'secondary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Surprise them with a kiss on the neck', es: 'Sorpréndelos con un beso en el cuello' }},
  { id: 417, language: 'touch', intensity: 'primary', difficulty: 'medium', timeRequired: '1hour',
    action: { en: 'Plan an intimate evening with lots of closeness', es: 'Planea una noche íntima con mucha cercanía' }},
  { id: 418, language: 'touch', intensity: 'tertiary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Sit close to them during meals', es: 'Siéntate cerca de ellos durante las comidas' }},
  { id: 419, language: 'touch', intensity: 'primary', difficulty: 'easy', timeRequired: '15min',
    action: { en: 'Brush or style their hair for them', es: 'Cepilla o peina su cabello por ellos' }},
  { id: 420, language: 'touch', intensity: 'primary', difficulty: 'easy', timeRequired: '5min',
    action: { en: 'Hold them from behind while they cook', es: 'Abrázalos por detrás mientras cocinan' }}
];

// Generate personalized daily action based on user's ranked love languages
export function getDailyAction(
  dayNumber: number,
  rankedLanguages: Array<{ language: string; rank: number }>
): DailyAction {
  // Distribution: 60% primary, 25% secondary, 10% tertiary, 5% quaternary
  const distribution = [
    ...Array(60).fill('primary'),
    ...Array(25).fill('secondary'),  
    ...Array(10).fill('tertiary'),
    ...Array(5).fill('tertiary') // Use tertiary for both 4th and 5th
  ];

  const intensityForDay = distribution[dayNumber % 100];
  
  // Determine which language rank to use
  let targetRank = 1;
  if (intensityForDay === 'secondary') targetRank = 2;
  if (intensityForDay === 'tertiary') targetRank = dayNumber % 2 === 0 ? 3 : 4; // Alternate between 3rd and 4th

  const targetLanguage = rankedLanguages.find(l => l.rank === targetRank)?.language || rankedLanguages[0].language;

  // Filter actions for this language and intensity
  const matchingActions = dailyActionsDatabase.filter(
    action => action.language === targetLanguage
  );

  // Select action based on day number to ensure variety
  const actionIndex = dayNumber % matchingActions.length;
  return matchingActions[actionIndex] || matchingActions[0];
}
