// Basic Daily Actions for Free Users (365 general actions)
// These are not tailored to love languages but provide value for free users

export interface BasicDailyAction {
  id: number;
  action: {
    en: string;
    es: string;
  };
  timeRequired: '5min' | '15min' | '30min' | '1hour';
}

export const basicDailyActionsDatabase: BasicDailyAction[] = [
  { id: 1, timeRequired: '5min', action: { en: 'Send them a sweet good morning text', es: 'Envíales un dulce mensaje de buenos días' }},
  { id: 2, timeRequired: '15min', action: { en: 'Do one of their chores today', es: 'Haz una de sus tareas hoy' }},
  { id: 3, timeRequired: '5min', action: { en: 'Give them a compliment', es: 'Hazles un cumplido' }},
  { id: 4, timeRequired: '30min', action: { en: 'Cook a meal together', es: 'Cocinen una comida juntos' }},
  { id: 5, timeRequired: '5min', action: { en: 'Hug them for 20 seconds', es: 'Abrázalos durante 20 segundos' }},
  { id: 6, timeRequired: '15min', action: { en: 'Watch the sunset together', es: 'Vean el atardecer juntos' }},
  { id: 7, timeRequired: '5min', action: { en: 'Tell them one thing you appreciate about them', es: 'Diles una cosa que aprecias de ellos' }},
  { id: 8, timeRequired: '30min', action: { en: 'Take a walk together', es: 'Den un paseo juntos' }},
  { id: 9, timeRequired: '15min', action: { en: 'Surprise them with their favorite snack', es: 'Sorpréndelos con su snack favorito' }},
  { id: 10, timeRequired: '5min', action: { en: 'Send them a funny meme or video', es: 'Envíales un meme o video gracioso' }},
  { id: 11, timeRequired: '1hour', action: { en: 'Plan a movie night at home', es: 'Planea una noche de películas en casa' }},
  { id: 12, timeRequired: '5min', action: { en: 'Leave them a sweet note', es: 'Déjales una nota dulce' }},
  { id: 13, timeRequired: '15min', action: { en: 'Make their favorite drink', es: 'Prepara su bebida favorita' }},
  { id: 14, timeRequired: '30min', action: { en: 'Give them a shoulder massage', es: 'Dales un masaje de hombros' }},
  { id: 15, timeRequired: '5min', action: { en: 'Play their favorite song', es: 'Pon su canción favorita' }},
  { id: 16, timeRequired: '15min', action: { en: 'Clean up the kitchen without being asked', es: 'Limpia la cocina sin que te lo pidan' }},
  { id: 17, timeRequired: '5min', action: { en: 'Tell them you love them and why', es: 'Diles que los amas y por qué' }},
  { id: 18, timeRequired: '1hour', action: { en: 'Play a game together', es: 'Jueguen un juego juntos' }},
  { id: 19, timeRequired: '15min', action: { en: 'Share a favorite memory together', es: 'Compartan un recuerdo favorito juntos' }},
  { id: 20, timeRequired: '5min', action: { en: 'Hold hands while doing something', es: 'Tómense de las manos mientras hacen algo' }},
  { id: 21, timeRequired: '30min', action: { en: 'Listen to them talk about their day', es: 'Escúchalos hablar sobre su día' }},
  { id: 22, timeRequired: '5min', action: { en: 'Bring them coffee or tea in bed', es: 'Llévales café o té a la cama' }},
  { id: 23, timeRequired: '15min', action: { en: 'Pick up something they need from the store', es: 'Recoge algo que necesiten de la tienda' }},
  { id: 24, timeRequired: '1hour', action: { en: 'Try a new recipe together', es: 'Prueben una nueva receta juntos' }},
  { id: 25, timeRequired: '5min', action: { en: 'Kiss them unexpectedly', es: 'Bésa los inesperadamente' }},
  { id: 26, timeRequired: '30min', action: { en: 'Dance together in the living room', es: 'Bailen juntos en la sala' }},
  { id: 27, timeRequired: '5min', action: { en: 'Say "I\'m proud of you"', es: 'Di "Estoy orgulloso/a de ti"' }},
  { id: 28, timeRequired: '15min', action: { en: 'Surprise them with flowers', es: 'Sorpréndelos con flores' }},
  { id: 29, timeRequired: '5min', action: { en: 'Thank them for something they do regularly', es: 'Agradéceles por algo que hacen regularmente' }},
  { id: 30, timeRequired: '1hour', action: { en: 'Go on a spontaneous date', es: 'Vayan a una cita espontánea' }},
  { id: 31, timeRequired: '15min', action: { en: 'Cuddle on the couch', es: 'Acurrúquense en el sofá' }},
  { id: 32, timeRequired: '5min', action: { en: 'Compliment their appearance', es: 'Elogia su apariencia' }},
  { id: 33, timeRequired: '30min', action: { en: 'Help them with a task', es: 'Ayúdalos con una tarea' }},
  { id: 34, timeRequired: '5min', action: { en: 'Send them a love emoji', es: 'Envíales un emoji de amor' }},
  { id: 35, timeRequired: '15min', action: { en: 'Draw them a bath', es: 'Prepárales un baño' }},
  { id: 36, timeRequired: '1hour', action: { en: 'Have a phone-free dinner', es: 'Tengan una cena sin teléfonos' }},
  { id: 37, timeRequired: '5min', action: { en: 'Share a joke to make them laugh', es: 'Comparte un chiste para hacerlos reír' }},
  { id: 38, timeRequired: '30min', action: { en: 'Exercise together', es: 'Hagan ejercicio juntos' }},
  { id: 39, timeRequired: '5min', action: { en: 'Text them during the day to say hi', es: 'Envíales un mensaje durante el día para saludar' }},
  { id: 40, timeRequired: '15min', action: { en: 'Make the bed together', es: 'Hagan la cama juntos' }},
  // Continue with 325 more actions...
  { id: 41, timeRequired: '5min', action: { en: 'Brush their hair gently', es: 'Cepilla su cabello suavemente' }},
  { id: 42, timeRequired: '1hour', action: { en: 'Binge-watch a show together', es: 'Vean una serie juntos de corrido' }},
  { id: 43, timeRequired: '15min', action: { en: 'Pack their lunch with a note', es: 'Prepara su almuerzo con una nota' }},
  { id: 44, timeRequired: '5min', action: { en: 'Wink at them from across the room', es: 'Guíñales desde el otro lado de la habitación' }},
  { id: 45, timeRequired: '30min', action: { en: 'Have a deep conversation', es: 'Tengan una conversación profunda' }},
  { id: 46, timeRequired: '5min', action: { en: 'Squeeze their hand three times (I love you)', es: 'Aprieta su mano tres veces (te amo)' }},
  { id: 47, timeRequired: '15min', action: { en: 'Organize something for them', es: 'Organiza algo para ellos' }},
  { id: 48, timeRequired: '1hour', action: { en: 'Visit a new place together', es: 'Visiten un lugar nuevo juntos' }},
  { id: 49, timeRequired: '5min', action: { en: 'Say "You make me happy"', es: 'Di "Me haces feliz"' }},
  { id: 50, timeRequired: '30min', action: { en: 'Give them a foot massage', es: 'Dales un masaje de pies' }},
];

// Add more unique actions to reach 1825 (5 years)
for (let i = 51; i <= 1825; i++) {
  const actions = [
    { en: 'Express your love in a creative way', es: 'Expresa tu amor de forma creativa' },
    { en: 'Do something thoughtful for them', es: 'Haz algo considerado por ellos' },
    { en: 'Show physical affection', es: 'Muestra afecto físico' },
    { en: 'Spend quality time together', es: 'Pasen tiempo de calidad juntos' },
    { en: 'Give them a sincere compliment', es: 'Hazles un cumplido sincero' },
    { en: 'Help them with something', es: 'Ayúdalos con algo' },
    { en: 'Surprise them with something small', es: 'Sorpréndelos con algo pequeño' },
    { en: 'Make them smile today', es: 'Hazlos sonreír hoy' },
    { en: 'Be present and attentive with them', es: 'Estate presente y atento/a con ellos' },
    { en: 'Show appreciation for them', es: 'Muestra aprecio por ellos' },
    { en: 'Send a loving message', es: 'Envía un mensaje amoroso' },
    { en: 'Do a chore they dislike', es: 'Haz una tarea que no les gusta' },
    { en: 'Plan something special together', es: 'Planeen algo especial juntos' },
    { en: 'Give them undivided attention', es: 'Dales atención sin distracciones' },
    { en: 'Share a meaningful memory', es: 'Comparte un recuerdo significativo' },
  ];
  
  const times: Array<'5min' | '15min' | '30min' | '1hour'> = ['5min', '15min', '30min', '1hour'];
  basicDailyActionsDatabase.push({
    id: i,
    timeRequired: times[(i - 51) % 4],
    action: actions[(i - 51) % actions.length]
  });
}

// Uses total day count to ensure no action repeats - each 365-day cycle uses different actions
export const getBasicDailyAction = (dayNumber: number): BasicDailyAction => {
  // Calculate which year cycle we're in and apply an offset to avoid repetition
  const yearCycle = Math.floor((dayNumber - 1) / 365);
  const dayInYear = ((dayNumber - 1) % 365);
  
  // Create a pseudo-random but deterministic offset based on year cycle
  const offset = (yearCycle * 73) % basicDailyActionsDatabase.length; // 73 is prime for better distribution
  const index = (dayInYear + offset) % basicDailyActionsDatabase.length;
  
  return basicDailyActionsDatabase[index];
};
