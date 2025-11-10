export interface WouldYouRatherQuestion {
  id: string;
  en: { question: string; optionA: string; optionB: string };
  es: { question: string; optionA: string; optionB: string };
  minLevel: number;
  spicy?: boolean;
}

export const wouldYouRatherQuestions: WouldYouRatherQuestion[] = [
  // Fun & Lighthearted (Level 1+)
  {
    id: 'wyr1',
    en: { question: 'Would you rather...', optionA: 'Always know what I\'m thinking', optionB: 'Always know what I\'m feeling' },
    es: { question: '¿Preferirías...?', optionA: 'Saber siempre lo que estoy pensando', optionB: 'Saber siempre lo que estoy sintiendo' },
    minLevel: 1
  },
  {
    id: 'wyr2',
    en: { question: 'Would you rather...', optionA: 'Get a surprise date every month', optionB: 'Plan the perfect date together every month' },
    es: { question: '¿Preferirías...?', optionA: 'Recibir una cita sorpresa cada mes', optionB: 'Planear la cita perfecta juntos cada mes' },
    minLevel: 1
  },
  {
    id: 'wyr3',
    en: { question: 'Would you rather...', optionA: 'Receive a handwritten love letter', optionB: 'Receive a heartfelt video message' },
    es: { question: '¿Preferirías...?', optionA: 'Recibir una carta de amor escrita a mano', optionB: 'Recibir un video mensaje sincero' },
    minLevel: 1
  },
  {
    id: 'wyr4',
    en: { question: 'Would you rather...', optionA: 'Cook a romantic dinner together', optionB: 'Go out to a fancy restaurant' },
    es: { question: '¿Preferirías...?', optionA: 'Cocinar una cena romántica juntos', optionB: 'Ir a un restaurante elegante' },
    minLevel: 1
  },
  {
    id: 'wyr5',
    en: { question: 'Would you rather...', optionA: 'Spend a weekend in the mountains', optionB: 'Spend a weekend at the beach' },
    es: { question: '¿Preferirías...?', optionA: 'Pasar un fin de semana en las montañas', optionB: 'Pasar un fin de semana en la playa' },
    minLevel: 1
  },
  
  // Deeper Connection (Level 5+)
  {
    id: 'wyr6',
    en: { question: 'Would you rather...', optionA: 'Relive our first kiss', optionB: 'Preview our future together 10 years from now' },
    es: { question: '¿Preferirías...?', optionA: 'Revivir nuestro primer beso', optionB: 'Ver nuestro futuro juntos en 10 años' },
    minLevel: 5
  },
  {
    id: 'wyr7',
    en: { question: 'Would you rather...', optionA: 'Have me read your mind for a day', optionB: 'Read my mind for a day' },
    es: { question: '¿Preferirías...?', optionA: 'Que yo lea tu mente por un día', optionB: 'Leer mi mente por un día' },
    minLevel: 5
  },
  {
    id: 'wyr8',
    en: { question: 'Would you rather...', optionA: 'Always have deep conversations', optionB: 'Always share comfortable silences' },
    es: { question: '¿Preferirías...?', optionA: 'Siempre tener conversaciones profundas', optionB: 'Siempre compartir silencios cómodos' },
    minLevel: 5
  },
  {
    id: 'wyr9',
    en: { question: 'Would you rather...', optionA: 'Solve all our problems through talking', optionB: 'Solve all our problems through physical affection' },
    es: { question: '¿Preferirías...?', optionA: 'Resolver todos nuestros problemas hablando', optionB: 'Resolver todos nuestros problemas con afecto físico' },
    minLevel: 5
  },
  
  // Spicy & Intimate (Level 10+)
  {
    id: 'wyr10',
    en: { question: 'Would you rather...', optionA: 'Have passionate, spontaneous intimacy', optionB: 'Have slow, romantic intimacy' },
    es: { question: '¿Preferirías...?', optionA: 'Tener intimidad apasionada y espontánea', optionB: 'Tener intimidad lenta y romántica' },
    minLevel: 10,
    spicy: true
  },
  {
    id: 'wyr11',
    en: { question: 'Would you rather...', optionA: 'Be teased all day before intimacy', optionB: 'Have immediate passionate connection' },
    es: { question: '¿Preferirías...?', optionA: 'Ser provocado todo el día antes de la intimidad', optionB: 'Tener conexión apasionada inmediata' },
    minLevel: 10,
    spicy: true
  },
  {
    id: 'wyr12',
    en: { question: 'Would you rather...', optionA: 'Try something new in the bedroom every month', optionB: 'Perfect what we already love' },
    es: { question: '¿Preferirías...?', optionA: 'Probar algo nuevo en la cama cada mes', optionB: 'Perfeccionar lo que ya nos encanta' },
    minLevel: 10,
    spicy: true
  },
  {
    id: 'wyr13',
    en: { question: 'Would you rather...', optionA: 'Have me whisper what I want', optionB: 'Have me show you what I want' },
    es: { question: '¿Preferirías...?', optionA: 'Que te susurre lo que quiero', optionB: 'Que te muestre lo que quiero' },
    minLevel: 10,
    spicy: true
  },
  {
    id: 'wyr14',
    en: { question: 'Would you rather...', optionA: 'Morning intimacy', optionB: 'Late night intimacy' },
    es: { question: '¿Preferirías...?', optionA: 'Intimidad por la mañana', optionB: 'Intimidad por la noche' },
    minLevel: 10,
    spicy: true
  },
  
  // Vulnerable & Deep (Level 15+)
  {
    id: 'wyr15',
    en: { question: 'Would you rather...', optionA: 'Share your deepest fear with me', optionB: 'Hear my deepest fear' },
    es: { question: '¿Preferirías...?', optionA: 'Compartir tu miedo más profundo conmigo', optionB: 'Escuchar mi miedo más profundo' },
    minLevel: 15
  },
  {
    id: 'wyr16',
    en: { question: 'Would you rather...', optionA: 'Know all my past relationships in detail', optionB: 'Keep the past in the past' },
    es: { question: '¿Preferirías...?', optionA: 'Conocer todas mis relaciones pasadas en detalle', optionB: 'Dejar el pasado en el pasado' },
    minLevel: 15
  },
  {
    id: 'wyr17',
    en: { question: 'Would you rather...', optionA: 'I always tell you the complete truth', optionB: 'I protect your feelings when necessary' },
    es: { question: '¿Preferirías...?', optionA: 'Que siempre te diga la verdad completa', optionB: 'Que proteja tus sentimientos cuando sea necesario' },
    minLevel: 15
  },
  {
    id: 'wyr18',
    en: { question: 'Would you rather...', optionA: 'Fight passionately and make up intensely', optionB: 'Discuss calmly and resolve peacefully' },
    es: { question: '¿Preferirías...?', optionA: 'Pelear apasionadamente y reconciliarse intensamente', optionB: 'Discutir con calma y resolver pacíficamente' },
    minLevel: 15
  },
  
  // Very Spicy (Level 20+)
  {
    id: 'wyr19',
    en: { question: 'Would you rather...', optionA: 'Explore each other\'s fantasies', optionB: 'Create new fantasies together' },
    es: { question: '¿Preferirías...?', optionA: 'Explorar las fantasías del otro', optionB: 'Crear nuevas fantasías juntos' },
    minLevel: 20,
    spicy: true
  },
  {
    id: 'wyr20',
    en: { question: 'Would you rather...', optionA: 'Receive a sensual massage that leads somewhere', optionB: 'Give a sensual massage that leads somewhere' },
    es: { question: '¿Preferirías...?', optionA: 'Recibir un masaje sensual que lleve a algo más', optionB: 'Dar un masaje sensual que lleve a algo más' },
    minLevel: 20,
    spicy: true
  },
  {
    id: 'wyr21',
    en: { question: 'Would you rather...', optionA: 'Have control in intimate moments', optionB: 'Let me take control in intimate moments' },
    es: { question: '¿Preferirías...?', optionA: 'Tener control en momentos íntimos', optionB: 'Dejarme tomar el control en momentos íntimos' },
    minLevel: 20,
    spicy: true
  },
  {
    id: 'wyr22',
    en: { question: 'Would you rather...', optionA: 'Spend a day fulfilling my desires', optionB: 'Spend a day having me fulfill yours' },
    es: { question: '¿Preferirías...?', optionA: 'Pasar un día cumpliendo mis deseos', optionB: 'Pasar un día donde yo cumpla los tuyos' },
    minLevel: 20,
    spicy: true
  },
  {
    id: 'wyr23',
    en: { question: 'Would you rather...', optionA: 'Tell me your wildest fantasy', optionB: 'Hear my wildest fantasy' },
    es: { question: '¿Preferirías...?', optionA: 'Contarme tu fantasía más salvaje', optionB: 'Escuchar mi fantasía más salvaje' },
    minLevel: 20,
    spicy: true
  },
  {
    id: 'wyr24',
    en: { question: 'Would you rather...', optionA: 'Be surprised with something new tonight', optionB: 'Plan something adventurous together for tonight' },
    es: { question: '¿Preferirías...?', optionA: 'Ser sorprendido con algo nuevo esta noche', optionB: 'Planear algo aventurero juntos para esta noche' },
    minLevel: 20,
    spicy: true
  },
];

export const getWouldYouRatherQuestions = (
  level: number, 
  language: 'en' | 'es',
  includeSpicy: boolean = true
): Array<{ question: string; optionA: string; optionB: string; id: string }> => {
  let availableQuestions = wouldYouRatherQuestions.filter(q => q.minLevel <= level);
  
  if (!includeSpicy) {
    availableQuestions = availableQuestions.filter(q => !q.spicy);
  }
  
  const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10).map(q => ({ ...q[language], id: q.id }));
};
