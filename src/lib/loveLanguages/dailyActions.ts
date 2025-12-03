// 5 Years (1825+ days) of Daily Love Actions for Each Love Language

export interface DailyAction {
  id: number;
  language: 'words' | 'quality_time' | 'gifts' | 'acts' | 'touch';
  intensity: 'primary' | 'secondary' | 'tertiary';
  action: {
    en: string;
    es: string;
  };
  difficulty: 'easy' | 'medium' | 'challenging';
  timeRequired: '5min' | '15min' | '30min' | '1hour' | '2hours+';
}

import { LoveLanguageScore } from './scoring';

const createAction = (
  id: number,
  language: DailyAction['language'],
  intensity: DailyAction['intensity'],
  difficulty: DailyAction['difficulty'],
  timeRequired: DailyAction['timeRequired'],
  en: string,
  es: string
): DailyAction => ({
  id,
  language,
  intensity,
  difficulty,
  timeRequired,
  action: { en, es }
});

// Base actions for each language (will be extended programmatically)
const baseWordsActions: DailyAction[] = [
  createAction(1, 'words', 'primary', 'easy', '5min', 'Send a text saying exactly what you love about them', 'Envía un mensaje diciendo exactamente qué amas de ellos'),
  createAction(2, 'words', 'primary', 'easy', '5min', 'Leave a love note on their pillow', 'Deja una nota de amor en su almohada'),
  createAction(3, 'words', 'primary', 'medium', '15min', 'Write them a heartfelt letter about your journey together', 'Escríbeles una carta sincera sobre su viaje juntos'),
  createAction(4, 'words', 'primary', 'easy', '5min', 'Compliment something specific they did today', 'Elogia algo específico que hicieron hoy'),
  createAction(5, 'words', 'primary', 'easy', '5min', 'Tell them you are proud of them and why', 'Diles que estás orgulloso/a de ellos y por qué'),
  createAction(6, 'words', 'secondary', 'easy', '5min', 'Share your favorite memory together', 'Comparte tu recuerdo favorito juntos'),
  createAction(7, 'words', 'primary', 'medium', '15min', 'Record a voice message expressing your love', 'Graba un mensaje de voz expresando tu amor'),
  createAction(8, 'words', 'primary', 'easy', '5min', 'Say I appreciate you and list three reasons', 'Di te aprecio y enumera tres razones'),
  createAction(9, 'words', 'secondary', 'easy', '5min', 'Publicly compliment them on social media', 'Felicítalos públicamente en redes sociales'),
  createAction(10, 'words', 'primary', 'easy', '5min', 'Text them a quote that reminds you of them', 'Envíales una cita que te recuerde a ellos'),
];

const baseQualityTimeActions: DailyAction[] = [
  createAction(101, 'quality_time', 'primary', 'medium', '1hour', 'Plan a phone-free dinner date at home', 'Planea una cena sin teléfonos en casa'),
  createAction(102, 'quality_time', 'primary', 'easy', '30min', 'Take a walk together and just talk', 'Den un paseo juntos y solo hablen'),
  createAction(103, 'quality_time', 'primary', 'medium', '2hours+', 'Cook a meal together from scratch', 'Cocinen una comida juntos desde cero'),
  createAction(104, 'quality_time', 'secondary', 'easy', '15min', 'Have coffee together with no distractions', 'Tomen café juntos sin distracciones'),
  createAction(105, 'quality_time', 'primary', 'medium', '1hour', 'Play a board game or card game together', 'Jueguen un juego de mesa juntos'),
  createAction(106, 'quality_time', 'primary', 'challenging', '2hours+', 'Plan and execute a surprise date', 'Planea y ejecuta una cita sorpresa'),
  createAction(107, 'quality_time', 'secondary', 'easy', '30min', 'Watch the sunset together', 'Vean el atardecer juntos'),
  createAction(108, 'quality_time', 'primary', 'medium', '1hour', 'Start a new hobby together', 'Comiencen un nuevo pasatiempo juntos'),
  createAction(109, 'quality_time', 'tertiary', 'easy', '15min', 'Sit together and share about your day', 'Siéntense juntos y compartan sobre su día'),
  createAction(110, 'quality_time', 'primary', 'medium', '2hours+', 'Have a movie marathon', 'Tengan un maratón de películas'),
];

const baseGiftsActions: DailyAction[] = [
  createAction(201, 'gifts', 'primary', 'easy', '15min', 'Buy their favorite snack or treat', 'Compra su snack o golosina favorita'),
  createAction(202, 'gifts', 'primary', 'medium', '1hour', 'Get them a book you think they would love', 'Cómprales un libro que crees que les encantaría'),
  createAction(203, 'gifts', 'secondary', 'easy', '15min', 'Pick flowers for them on your way home', 'Recoge flores para ellos de camino a casa'),
  createAction(204, 'gifts', 'primary', 'medium', '30min', 'Create a personalized playlist as a gift', 'Crea una lista de reproducción personalizada'),
  createAction(205, 'gifts', 'primary', 'challenging', '2hours+', 'Make them a handmade gift', 'Hazles un regalo hecho a mano'),
  createAction(206, 'gifts', 'secondary', 'easy', '5min', 'Leave a small surprise in their bag', 'Deja una pequeña sorpresa en su bolsa'),
  createAction(207, 'gifts', 'primary', 'medium', '1hour', 'Order something they mentioned wanting', 'Ordena algo que mencionaron querer'),
  createAction(208, 'gifts', 'tertiary', 'easy', '15min', 'Bring home their favorite coffee', 'Trae a casa su café favorito'),
  createAction(209, 'gifts', 'primary', 'medium', '30min', 'Frame a special photo of you two', 'Enmarca una foto especial de ustedes dos'),
  createAction(210, 'gifts', 'primary', 'challenging', '2hours+', 'Create a memory box or scrapbook', 'Crea una caja de recuerdos o álbum'),
];

const baseActsActions: DailyAction[] = [
  createAction(301, 'acts', 'primary', 'easy', '15min', 'Do a chore they usually handle', 'Haz una tarea que usualmente ellos manejan'),
  createAction(302, 'acts', 'primary', 'medium', '30min', 'Prep their lunch for tomorrow', 'Prepara su almuerzo para mañana'),
  createAction(303, 'acts', 'secondary', 'easy', '5min', 'Fill up their car with gas', 'Llena su auto con gasolina'),
  createAction(304, 'acts', 'primary', 'medium', '1hour', 'Deep clean an area of the house', 'Limpia profundamente un área de la casa'),
  createAction(305, 'acts', 'primary', 'easy', '15min', 'Run an errand for them', 'Haz un mandado por ellos'),
  createAction(306, 'acts', 'tertiary', 'easy', '5min', 'Make the bed nicely in the morning', 'Haz la cama bien por la mañana'),
  createAction(307, 'acts', 'primary', 'medium', '1hour', 'Cook their favorite meal', 'Cocina su comida favorita'),
  createAction(308, 'acts', 'primary', 'challenging', '2hours+', 'Tackle a project they have been putting off', 'Aborda un proyecto que han estado postergando'),
  createAction(309, 'acts', 'secondary', 'easy', '15min', 'Do the dishes without being asked', 'Lava los platos sin que te lo pidan'),
  createAction(310, 'acts', 'primary', 'medium', '30min', 'Organize something for them', 'Organiza algo para ellos'),
];

const baseTouchActions: DailyAction[] = [
  createAction(401, 'touch', 'primary', 'easy', '5min', 'Give them a long, warm hug', 'Dales un abrazo largo y cálido'),
  createAction(402, 'touch', 'primary', 'medium', '30min', 'Give them a massage', 'Dales un masaje'),
  createAction(403, 'touch', 'secondary', 'easy', '5min', 'Hold their hand while watching TV', 'Toma su mano mientras ven TV'),
  createAction(404, 'touch', 'primary', 'easy', '15min', 'Cuddle on the couch together', 'Acurrúquense en el sofá juntos'),
  createAction(405, 'touch', 'tertiary', 'easy', '5min', 'Kiss them goodbye and hello every day', 'Bésalos al despedirse y saludar cada día'),
  createAction(406, 'touch', 'primary', 'easy', '5min', 'Run your fingers through their hair', 'Pasa tus dedos por su cabello'),
  createAction(407, 'touch', 'secondary', 'easy', '5min', 'Give them a back scratch', 'Ráscales la espalda'),
  createAction(408, 'touch', 'primary', 'medium', '15min', 'Give them a foot massage', 'Dales un masaje de pies'),
  createAction(409, 'touch', 'primary', 'easy', '5min', 'Sit close to them with your arm around them', 'Siéntate cerca con tu brazo alrededor'),
  createAction(410, 'touch', 'tertiary', 'easy', '5min', 'Touch their face gently while talking', 'Toca su cara suavemente mientras hablan'),
];

// Extended action templates for generating 5 years worth
const wordsTemplates = [
  { en: 'Share something new you appreciate about them today', es: 'Comparte algo nuevo que aprecias de ellos hoy' },
  { en: 'Write a short note about why you chose them', es: 'Escribe una nota corta sobre por qué los elegiste' },
  { en: 'Tell them three things they do that make you smile', es: 'Diles tres cosas que hacen que te hacen sonreír' },
  { en: 'Express how much their presence means in your life', es: 'Expresa cuánto significa su presencia en tu vida' },
  { en: 'Compliment their dedication to something they care about', es: 'Elogia su dedicación a algo que les importa' },
  { en: 'Send a loving message during their busy day', es: 'Envía un mensaje amoroso durante su día ocupado' },
  { en: 'Tell them about a quality they have that you admire', es: 'Cuéntales sobre una cualidad que tienen que admiras' },
  { en: 'Write about what makes your relationship special', es: 'Escribe sobre qué hace especial tu relación' },
  { en: 'Thank them for always being there for you', es: 'Agradéceles por siempre estar ahí para ti' },
  { en: 'Share a specific way they made your life better this week', es: 'Comparte una forma específica en que mejoraron tu vida esta semana' },
];

const qualityTimeTemplates = [
  { en: 'Spend 30 minutes together with no screens', es: 'Pasen 30 minutos juntos sin pantallas' },
  { en: 'Take a walk and share what is on your minds', es: 'Den un paseo y compartan lo que tienen en mente' },
  { en: 'Do something your partner enjoys together', es: 'Haz algo que tu pareja disfrute juntos' },
  { en: 'Have a meal together with meaningful conversation', es: 'Tengan una comida con conversación significativa' },
  { en: 'Plan your next adventure or trip together', es: 'Planeen su próxima aventura juntos' },
  { en: 'Dedicate one hour to doing whatever they want', es: 'Dediquen una hora a hacer lo que quieran' },
  { en: 'Watch a documentary and discuss it afterwards', es: 'Vean un documental y discútanlo después' },
  { en: 'Create something together', es: 'Creen algo juntos' },
  { en: 'Exercise or stretch together', es: 'Hagan ejercicio o estiren juntos' },
  { en: 'Have a deep conversation about your hopes and dreams', es: 'Tengan una conversación profunda sobre sus esperanzas' },
];

const giftsTemplates = [
  { en: 'Surprise them with a small thoughtful gift', es: 'Sorpréndelos con un pequeño regalo considerado' },
  { en: 'Get something related to a recent conversation', es: 'Consigue algo relacionado con una conversación reciente' },
  { en: 'Buy them their favorite comfort item or food', es: 'Cómprales su artículo o comida reconfortante favorita' },
  { en: 'Create a handwritten coupon book of favors', es: 'Crea un libro de cupones escritos a mano' },
  { en: 'Order something from their wishlist', es: 'Ordena algo de su lista de deseos' },
  { en: 'Get a gift that supports one of their goals', es: 'Consigue un regalo que apoye una de sus metas' },
  { en: 'Buy something to make their daily routine easier', es: 'Compra algo para facilitar su rutina diaria' },
  { en: 'Create a photo gift with your memories together', es: 'Crea un regalo fotográfico con sus recuerdos' },
  { en: 'Get them a subscription to something they enjoy', es: 'Consígueles una suscripción a algo que disfruten' },
  { en: 'Surprise them with something from their favorite store', es: 'Sorpréndelos con algo de su tienda favorita' },
];

const actsTemplates = [
  { en: 'Do something to make their day easier without being asked', es: 'Haz algo para facilitar su día sin que te lo pidan' },
  { en: 'Take care of a responsibility they usually handle', es: 'Encárgate de una responsabilidad que usualmente manejan' },
  { en: 'Complete a household task before they notice', es: 'Completa una tarea del hogar antes de que noten' },
  { en: 'Prepare something they need for tomorrow', es: 'Prepara algo que necesiten para mañana' },
  { en: 'Run an errand that would save them time', es: 'Haz un mandado que les ahorre tiempo' },
  { en: 'Fix or maintain something in your home', es: 'Arregla o da mantenimiento a algo en tu hogar' },
  { en: 'Cook a meal so they can relax', es: 'Cocina una comida para que puedan relajarse' },
  { en: 'Handle something on their to-do list', es: 'Maneja algo de su lista de pendientes' },
  { en: 'Take over their duties for a portion of the day', es: 'Asume sus deberes por una parte del día' },
  { en: 'Do something that shows you pay attention to their needs', es: 'Haz algo que demuestre que prestas atención a sus necesidades' },
];

const touchTemplates = [
  { en: 'Initiate physical affection at an unexpected moment', es: 'Inicia afecto físico en un momento inesperado' },
  { en: 'Hold them close while relaxing together', es: 'Abrázalos mientras se relajan juntos' },
  { en: 'Give them a long hug when you reunite today', es: 'Dales un abrazo largo cuando se reúnan hoy' },
  { en: 'Reach for their hand while walking or sitting', es: 'Busca su mano mientras caminan o están sentados' },
  { en: 'Offer a comforting touch when they seem stressed', es: 'Ofrece un toque reconfortante cuando parezcan estresados' },
  { en: 'Give them a gentle massage on their tense spots', es: 'Dales un masaje suave en sus puntos tensos' },
  { en: 'Sit close enough to touch while doing activities', es: 'Siéntate lo suficientemente cerca para tocarse' },
  { en: 'Greet them with a kiss and embrace', es: 'Salúdalos con un beso y abrazo' },
  { en: 'Play with their hair while relaxing together', es: 'Juega con su cabello mientras se relajan juntos' },
  { en: 'End the day with extended physical closeness', es: 'Terminen el día con cercanía física extendida' },
];

// Build the full database
export const dailyActionsDatabase: DailyAction[] = [
  ...baseWordsActions,
  ...baseQualityTimeActions,
  ...baseGiftsActions,
  ...baseActsActions,
  ...baseTouchActions,
];

// Extend to 1825+ actions for 5 years
const intensities: DailyAction['intensity'][] = ['primary', 'secondary', 'tertiary'];
const difficulties: DailyAction['difficulty'][] = ['easy', 'medium', 'easy'];
const times: DailyAction['timeRequired'][] = ['5min', '15min', '30min'];

for (let i = 0; i < 365; i++) {
  const template = wordsTemplates[i % wordsTemplates.length];
  dailyActionsDatabase.push(createAction(500 + i, 'words', intensities[i % 3], difficulties[i % 3], times[i % 3], template.en, template.es));
}

for (let i = 0; i < 365; i++) {
  const template = qualityTimeTemplates[i % qualityTimeTemplates.length];
  dailyActionsDatabase.push(createAction(900 + i, 'quality_time', intensities[i % 3], difficulties[i % 3], times[i % 3], template.en, template.es));
}

for (let i = 0; i < 365; i++) {
  const template = giftsTemplates[i % giftsTemplates.length];
  dailyActionsDatabase.push(createAction(1300 + i, 'gifts', intensities[i % 3], difficulties[i % 3], times[i % 3], template.en, template.es));
}

for (let i = 0; i < 365; i++) {
  const template = actsTemplates[i % actsTemplates.length];
  dailyActionsDatabase.push(createAction(1700 + i, 'acts', intensities[i % 3], difficulties[i % 3], times[i % 3], template.en, template.es));
}

for (let i = 0; i < 365; i++) {
  const template = touchTemplates[i % touchTemplates.length];
  dailyActionsDatabase.push(createAction(2100 + i, 'touch', intensities[i % 3], difficulties[i % 3], times[i % 3], template.en, template.es));
}

// Map language names to action language keys
const langMap: Record<string, DailyAction['language']> = {
  'Words of Affirmation': 'words',
  'Quality Time': 'quality_time',
  'Receiving Gifts': 'gifts',
  'Acts of Service': 'acts',
  'Physical Touch': 'touch',
};

// Get daily action based on day and partner's love languages
export function getDailyAction(dayNumber: number, rankedLanguages: LoveLanguageScore[]): DailyAction {
  if (!rankedLanguages || rankedLanguages.length === 0) {
    const wordsActions = dailyActionsDatabase.filter(a => a.language === 'words');
    return wordsActions[dayNumber % wordsActions.length];
  }

  const sorted = [...rankedLanguages].sort((a, b) => b.score - a.score);
  const primaryLang = sorted[0]?.language || 'Words of Affirmation';
  const secondaryLang = sorted[1]?.language || 'Quality Time';

  const primaryKey = langMap[primaryLang] || 'words';
  const secondaryKey = langMap[secondaryLang] || 'quality_time';

  // 70% primary language, 30% secondary
  const useSecondary = dayNumber % 10 >= 7;
  const targetLang = useSecondary ? secondaryKey : primaryKey;

  const languageActions = dailyActionsDatabase.filter(a => a.language === targetLang);
  const actionIndex = dayNumber % languageActions.length;
  return languageActions[actionIndex];
}
