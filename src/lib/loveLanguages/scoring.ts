// Love Language Scoring System - Ranks all 5 languages and generates personalized profile

export interface LoveLanguageScore {
  language: 'words' | 'quality_time' | 'gifts' | 'acts' | 'touch';
  score: number;
  percentage: number;
  rank: number;
}

export interface LoveLanguageProfile {
  scores: LoveLanguageScore[];
  profileTitle: string;
  profileDescription: { en: string; es: string };
  primaryLanguage: string;
  secondaryLanguage: string;
}

const languageNames = {
  words: { en: 'Words of Affirmation', es: 'Palabras de Afirmación' },
  quality_time: { en: 'Quality Time', es: 'Tiempo de Calidad' },
  gifts: { en: 'Receiving Gifts', es: 'Recibir Regalos' },
  acts: { en: 'Acts of Service', es: 'Actos de Servicio' },
  touch: { en: 'Physical Touch', es: 'Contacto Físico' }
};

export function scoreLoveLanguageQuiz(
  answers: Array<'words' | 'quality_time' | 'gifts' | 'acts' | 'touch'>
): LoveLanguageProfile {
  // Count occurrences of each language
  const counts = {
    words: 0,
    quality_time: 0,
    gifts: 0,
    acts: 0,
    touch: 0
  };

  answers.forEach(answer => {
    counts[answer]++;
  });

  const total = answers.length;

  // Create scored array
  const scores: LoveLanguageScore[] = Object.entries(counts)
    .map(([language, score]) => ({
      language: language as 'words' | 'quality_time' | 'gifts' | 'acts' | 'touch',
      score,
      percentage: Math.round((score / total) * 100),
      rank: 0
    }))
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  // Generate profile title based on top 2 languages
  const primary = scores[0].language;
  const secondary = scores[1].language;
  
  const profileTitle = generateProfileTitle(primary, secondary);
  const profileDescription = generateProfileDescription(primary, secondary);

  return {
    scores,
    profileTitle,
    profileDescription,
    primaryLanguage: primary,
    secondaryLanguage: secondary
  };
}

function generateProfileTitle(
  primary: string,
  secondary: string
): string {
  const combinations: Record<string, string> = {
    'words_quality_time': 'The Devoted Conversationalist',
    'words_gifts': 'The Romantic Poet',
    'words_acts': 'The Encouraging Partner',
    'words_touch': 'The Affectionate Communicator',
    'quality_time_words': 'The Present Listener',
    'quality_time_gifts': 'The Thoughtful Companion',
    'quality_time_acts': 'The Reliable Teammate',
    'quality_time_touch': 'The Intimate Companion',
    'gifts_words': 'The Generous Admirer',
    'gifts_quality_time': 'The Celebratory Giver',
    'gifts_acts': 'The Thoughtful Provider',
    'gifts_touch': 'The Sensual Gift-Giver',
    'acts_words': 'The Supportive Helper',
    'acts_quality_time': 'The Collaborative Partner',
    'acts_gifts': 'The Practical Romantic',
    'acts_touch': 'The Caring Nurturer',
    'touch_words': 'The Passionate Lover',
    'touch_quality_time': 'The Connected Soul',
    'touch_gifts': 'The Sensory Romantic',
    'touch_acts': 'The Physical Caregiver'
  };

  const key = `${primary}_${secondary}`;
  return combinations[key] || 'The Unique Lover';
}

function generateProfileDescription(
  primary: string,
  secondary: string
): { en: string; es: string } {
  const descriptions: Record<string, { en: string; es: string }> = {
    'words_quality_time': {
      en: 'You thrive on meaningful conversations and deep connection. Words matter deeply to you, but they mean even more when accompanied by undivided attention.',
      es: 'Prosperas con conversaciones significativas y conexión profunda. Las palabras importan profundamente para ti, pero significan aún más cuando se acompañan de atención completa.'
    },
    'words_gifts': {
      en: 'You appreciate both verbal expressions of love and tangible symbols of affection. A heartfelt note with a meaningful gift makes your heart sing.',
      es: 'Aprecias tanto las expresiones verbales de amor como los símbolos tangibles de afecto. Una nota sincera con un regalo significativo hace cantar tu corazón.'
    },
    'words_acts': {
      en: 'You value verbal encouragement especially when backed by supportive actions. When words align with deeds, you feel truly loved.',
      es: 'Valoras el aliento verbal especialmente cuando está respaldado por acciones de apoyo. Cuando las palabras se alinean con los hechos, te sientes verdaderamente amado/a.'
    },
    'words_touch': {
      en: 'You need both verbal reassurance and physical closeness to feel loved. Sweet words whispered during an embrace feel like perfection.',
      es: 'Necesitas tanto tranquilidad verbal como cercanía física para sentirte amado/a. Palabras dulces susurradas durante un abrazo se sienten como perfección.'
    },
    'quality_time_words': {
      en: 'You cherish focused attention paired with meaningful dialogue. Being truly present with your partner, talking about what matters, fills your love tank.',
      es: 'Aprecias la atención enfocada combinada con diálogo significativo. Estar verdaderamente presente con tu pareja, hablando de lo que importa, llena tu tanque de amor.'
    },
    'quality_time_gifts': {
      en: 'You love shared experiences and appreciate when they\'re marked by thoughtful tokens. A gift from a day spent together becomes a cherished memory.',
      es: 'Amas las experiencias compartidas y aprecias cuando están marcadas por tokens thoughtful. Un regalo de un día pasado juntos se convierte en un recuerdo preciado.'
    },
    'quality_time_acts': {
      en: 'You value partnership and collaboration. When your partner spends time working alongside you on tasks, you feel deeply connected and loved.',
      es: 'Valoras la asociación y colaboración. Cuando tu pareja pasa tiempo trabajando junto a ti en tareas, te sientes profundamente conectado/a y amado/a.'
    },
    'quality_time_touch': {
      en: 'You crave both presence and physical closeness. Cuddling while watching a movie or holding hands during a walk are your perfect moments.',
      es: 'Anhelas tanto presencia como cercanía física. Acurrucarse mientras ves una película o tomarse de las manos durante un paseo son tus momentos perfectos.'
    },
    'gifts_words': {
      en: 'You treasure tangible expressions of love paired with heartfelt words. A meaningful gift with a beautiful card makes you feel completely adored.',
      es: 'Atesoras las expresiones tangibles de amor combinadas con palabras sinceras. Un regalo significativo con una tarjeta hermosa te hace sentir completamente adorado/a.'
    },
    'gifts_quality_time': {
      en: 'You appreciate thoughtful presents and the time spent selecting them. When your partner invests time finding the perfect gift, you feel truly seen.',
      es: 'Aprecias los regalos thoughtful y el tiempo dedicado a seleccionarlos. Cuando tu pareja invierte tiempo encontrando el regalo perfecto, te sientes verdaderamente visto/a.'
    },
    'gifts_acts': {
      en: 'You value both thoughtful gifts and helpful actions. When your partner brings you something useful and practical, you feel cared for in the best way.',
      es: 'Valoras tanto los regalos thoughtful como las acciones útiles. Cuando tu pareja te trae algo útil y práctico, te sientes cuidado/a de la mejor manera.'
    },
    'gifts_touch': {
      en: 'You love receiving tokens of affection delivered with physical warmth. A gift presented with a loving embrace feels doubly special.',
      es: 'Amas recibir tokens de afecto entregados con calidez física. Un regalo presentado con un abrazo amoroso se siente doblemente especial.'
    },
    'acts_words': {
      en: 'You appreciate when actions speak louder than words, but you also need to hear appreciation. Recognition of your efforts means everything.',
      es: 'Aprecias cuando las acciones hablan más que las palabras, pero también necesitas escuchar aprecio. El reconocimiento de tus esfuerzos significa todo.'
    },
    'acts_quality_time': {
      en: 'You feel loved when your partner rolls up their sleeves and works alongside you. Teamwork and shared accomplishments strengthen your bond.',
      es: 'Te sientes amado/a cuando tu pareja se arremanga y trabaja junto a ti. El trabajo en equipo y los logros compartidos fortalecen tu vínculo.'
    },
    'acts_gifts': {
      en: 'You value practical help and thoughtful gifts that make life easier. When your partner anticipates your needs, you feel truly cherished.',
      es: 'Valoras la ayuda práctica y los regalos thoughtful que facilitan la vida. Cuando tu pareja anticipa tus necesidades, te sientes verdaderamente apreciado/a.'
    },
    'acts_touch': {
      en: 'You appreciate both helpful actions and physical affection. A partner who helps around the house and offers warm hugs is your ideal.',
      es: 'Aprecias tanto las acciones útiles como el afecto físico. Una pareja que ayuda en casa y ofrece abrazos cálidos es tu ideal.'
    },
    'touch_words': {
      en: 'You need physical connection paired with verbal affirmation. Holding hands while hearing "I love you" creates your perfect moment.',
      es: 'Necesitas conexión física combinada con afirmación verbal. Tomarse de las manos mientras escuchas "te amo" crea tu momento perfecto.'
    },
    'touch_quality_time': {
      en: 'You thrive on physical presence and closeness. Simply being near your partner, touching and connecting, fills your heart completely.',
      es: 'Prosperas con la presencia física y cercanía. Simplemente estar cerca de tu pareja, tocando y conectando, llena tu corazón completamente.'
    },
    'touch_gifts': {
      en: 'You appreciate physical affection and thoughtful tokens. A massage oil or cozy blanket as a gift shows perfect understanding of your needs.',
      es: 'Aprecias el afecto físico y los tokens thoughtful. Un aceite de masaje o manta acogedora como regalo muestra comprensión perfecta de tus necesidades.'
    },
    'touch_acts': {
      en: 'You value physical care and practical support. When your partner both tends to your needs and offers loving touch, you feel completely cared for.',
      es: 'Valoras el cuidado físico y el apoyo práctico. Cuando tu pareja atiende tus necesidades y ofrece tacto amoroso, te sientes completamente cuidado/a.'
    }
  };

  const key = `${primary}_${secondary}`;
  return descriptions[key] || {
    en: 'You have a unique combination of love languages that makes you special.',
    es: 'Tienes una combinación única de lenguajes de amor que te hace especial.'
  };
}

export { languageNames };
