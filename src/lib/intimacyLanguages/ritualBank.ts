import { Ritual } from './types';

type RitualBank = {
  [key: string]: Ritual[];
};

export const ritualBank: RitualBank = {
  'Romantic': [
    {
      title: 'Love Letter Exchange',
      description: 'Write each other a love letter. Read them aloud by candlelight.',
      emotionalTone: 'affirming',
    },
    {
      title: 'Memory Lane',
      description: 'Share three favorite memories from your relationship. Why do they matter?',
      emotionalTone: 'warm',
    },
    {
      title: 'Eye Gazing',
      description: 'Sit facing each other. Gaze into each other\'s eyes for 5 minutes without speaking.',
      emotionalTone: 'soft',
    },
  ],
  'Romántico/a': [
    {
      title: 'Intercambio de Cartas de Amor',
      description: 'Escríbanse una carta de amor. Léanlas en voz alta a la luz de las velas.',
      emotionalTone: 'affirming',
    },
    {
      title: 'Camino de Memorias',
      description: 'Compartan tres recuerdos favoritos de su relación. ¿Por qué importan?',
      emotionalTone: 'warm',
    },
    {
      title: 'Miradas Profundas',
      description: 'Siéntense frente a frente. Mírense a los ojos durante 5 minutos sin hablar.',
      emotionalTone: 'soft',
    },
  ],
  'Sensual': [
    {
      title: 'Texture Tease',
      description: 'Explore five different textures on each other\'s skin. No words allowed.',
      emotionalTone: 'soft',
    },
    {
      title: 'Blindfold Breath',
      description: 'One partner blindfolded. The other guides with breath and touch only.',
      emotionalTone: 'neutral',
    },
    {
      title: 'Slow Dance',
      description: 'Dance together slowly with no music. Focus on feeling each other\'s movements.',
      emotionalTone: 'inviting',
    },
  ],
  'Playful': [
    {
      title: 'Flirt Tag',
      description: 'Each touch must be followed by a compliment or playful tease.',
      emotionalTone: 'cheeky',
    },
    {
      title: 'Truth or Dare',
      description: 'Take turns with intimate truths or playful dares. Keep it light and fun.',
      emotionalTone: 'spontaneous',
    },
    {
      title: 'Strip Questions',
      description: 'Ask each other questions. Wrong answers = remove an item of clothing.',
      emotionalTone: 'cheeky',
    },
  ],
  'Juguetón/a': [
    {
      title: 'Coqueteo y Toque',
      description: 'Cada toque debe ir seguido de un cumplido o broma juguetona.',
      emotionalTone: 'cheeky',
    },
    {
      title: 'Verdad o Reto',
      description: 'Túrnense con verdades íntimas o retos divertidos. Mantenganlo ligero y divertido.',
      emotionalTone: 'spontaneous',
    },
    {
      title: 'Preguntas Strip',
      description: 'Háganse preguntas. Respuestas incorrectas = quitar una prenda.',
      emotionalTone: 'cheeky',
    },
  ],
  'Dominant': [
    {
      title: 'Command Night',
      description: 'One partner gives 3 commands. The other follows. Then switch.',
      emotionalTone: 'direct',
    },
    {
      title: 'Power Play',
      description: 'Decide who leads tonight. That person controls the pace and activities.',
      emotionalTone: 'intense',
    },
    {
      title: 'Yes/No Game',
      description: 'One asks yes/no questions. The other can only nod or shake their head.',
      emotionalTone: 'direct',
    },
  ],
  'Dominante': [
    {
      title: 'Noche de Comandos',
      description: 'Un compañero da 3 comandos. El otro sigue. Luego cambian.',
      emotionalTone: 'direct',
    },
    {
      title: 'Juego de Poder',
      description: 'Decidan quién lidera esta noche. Esa persona controla el ritmo y actividades.',
      emotionalTone: 'intense',
    },
    {
      title: 'Juego Sí/No',
      description: 'Uno hace preguntas de sí/no. El otro solo puede asentir o negar.',
      emotionalTone: 'direct',
    },
  ],
  'Fun': [
    {
      title: 'Location Challenge',
      description: 'Pick 3 unusual places in your home. Be intimate in each one.',
      emotionalTone: 'spontaneous',
    },
    {
      title: 'Role Swap',
      description: 'Switch who usually initiates. Try each other\'s typical approach.',
      emotionalTone: 'cheeky',
    },
  ],
  'Diversión': [
    {
      title: 'Desafío de Ubicación',
      description: 'Elijan 3 lugares inusuales en su hogar. Sean íntimos en cada uno.',
      emotionalTone: 'spontaneous',
    },
    {
      title: 'Intercambio de Roles',
      description: 'Cambien quién suele iniciar. Prueben el enfoque típico del otro.',
      emotionalTone: 'cheeky',
    },
  ],
  'Desire': [
    {
      title: 'Craving Confession',
      description: 'Tell your partner exactly what you want tonight. Be specific and honest.',
      emotionalTone: 'intense',
    },
    {
      title: 'No Touch First',
      description: 'Spend 10 minutes describing desires without touching. Then release.',
      emotionalTone: 'intense',
    },
  ],
  'Deseo': [
    {
      title: 'Confesión de Anhelo',
      description: 'Dile a tu pareja exactamente lo que quieres esta noche. Sé específico/a y honesto/a.',
      emotionalTone: 'intense',
    },
    {
      title: 'Sin Tocar Primero',
      description: 'Pasen 10 minutos describiendo deseos sin tocarse. Luego liberen.',
      emotionalTone: 'intense',
    },
  ],
  'Pleasure': [
    {
      title: 'Give & Receive',
      description: 'Take turns. 10 minutes of receiving, 10 of giving. Focus fully on each role.',
      emotionalTone: 'inviting',
    },
    {
      title: 'Yes/More Game',
      description: 'Partner A explores. Partner B can only say "yes" or "more" to guide.',
      emotionalTone: 'neutral',
    },
  ],
  'Placer': [
    {
      title: 'Dar y Recibir',
      description: 'Túrnense. 10 minutos recibiendo, 10 dando. Enfóquense en cada rol.',
      emotionalTone: 'inviting',
    },
    {
      title: 'Juego Sí/Más',
      description: 'Pareja A explora. Pareja B solo puede decir "sí" o "más" para guiar.',
      emotionalTone: 'neutral',
    },
  ],
  'Patience': [
    {
      title: 'Slow Build',
      description: 'Set a timer for 30 minutes. Nothing is rushed. Savor every moment.',
      emotionalTone: 'slow',
    },
    {
      title: 'Meditation First',
      description: 'Start with 5 minutes of breathing together. Then move into intimacy mindfully.',
      emotionalTone: 'slow',
    },
  ],
  'Paciencia': [
    {
      title: 'Construcción Lenta',
      description: 'Pongan un temporizador de 30 minutos. Nada se apresura. Saboreen cada momento.',
      emotionalTone: 'slow',
    },
    {
      title: 'Meditación Primero',
      description: 'Comiencen con 5 minutos respirando juntos. Luego pasen a intimidad conscientemente.',
      emotionalTone: 'slow',
    },
  ],
  'Celebration': [
    {
      title: 'Gratitude Round',
      description: 'Before intimacy, each share 3 things you love about the other.',
      emotionalTone: 'warm',
    },
    {
      title: 'Special Setup',
      description: 'Create a special environment: candles, music, comfort. Make it feel like an event.',
      emotionalTone: 'affirming',
    },
  ],
  'Celebración': [
    {
      title: 'Ronda de Gratitud',
      description: 'Antes de la intimidad, cada uno comparte 3 cosas que ama del otro.',
      emotionalTone: 'warm',
    },
    {
      title: 'Preparación Especial',
      description: 'Creen un ambiente especial: velas, música, comodidad. Háganlo sentir como un evento.',
      emotionalTone: 'affirming',
    },
  ],
};

export function getNextRitual(
  language: string, 
  entryCount: number, 
  emotionalState?: string
): Ritual {
  const pool = ritualBank[language] || ritualBank['Romantic'];
  
  if (emotionalState) {
    const filtered = pool.filter(r => 
      r.emotionalTone === emotionalState || r.emotionalTone === 'neutral'
    );
    return filtered[entryCount % filtered.length] || pool[0];
  }
  
  return pool[entryCount % pool.length];
}
