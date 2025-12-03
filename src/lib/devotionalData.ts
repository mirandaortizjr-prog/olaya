export interface BilingualText {
  en: string;
  es: string;
}

export interface DevotionalEntry {
  day: number;
  title: BilingualText;
  quote: BilingualText;
  author: string;
  devotional: BilingualText;
  reflectionQuestions: BilingualText[];
  practiceBox: BilingualText[];
  category: BilingualText;
}

// Category definitions
const categoryNames: Record<string, BilingualText> = {
  emotional: { en: 'Emotional Intelligence', es: 'Inteligencia Emocional' },
  communication: { en: 'Communication Mastery', es: 'Dominio de la Comunicación' },
  intimacy: { en: 'Intimacy & Affection', es: 'Intimidad y Afecto' },
  goals: { en: 'Shared Goals & Growth', es: 'Metas Compartidas y Crecimiento' },
  personality: { en: 'Personality & Attachment Styles', es: 'Personalidad y Estilos de Apego' },
  repair: { en: 'Repair & Resilience', es: 'Reparación y Resiliencia' },
  daily: { en: 'Daily Nourishment', es: 'Nutrición Diaria' },
};

export const getCategory = (day: number, lang: 'en' | 'es' = 'en'): string => {
  if (day <= 60) return categoryNames.emotional[lang];
  if (day <= 120) return categoryNames.communication[lang];
  if (day <= 180) return categoryNames.intimacy[lang];
  if (day <= 240) return categoryNames.goals[lang];
  if (day <= 300) return categoryNames.personality[lang];
  if (day <= 330) return categoryNames.repair[lang];
  return categoryNames.daily[lang];
};

export const getCategoryBilingual = (day: number): BilingualText => {
  if (day <= 60) return categoryNames.emotional;
  if (day <= 120) return categoryNames.communication;
  if (day <= 180) return categoryNames.intimacy;
  if (day <= 240) return categoryNames.goals;
  if (day <= 300) return categoryNames.personality;
  if (day <= 330) return categoryNames.repair;
  return categoryNames.daily;
};

// Sample devotional entries with full bilingual content
const devotionalEntries: DevotionalEntry[] = [
  {
    day: 1,
    title: { en: "Listening as Love", es: "Escuchar como Amor" },
    quote: { 
      en: "We have two ears and one mouth so that we can listen twice as much as we speak.", 
      es: "Tenemos dos oídos y una boca para poder escuchar el doble de lo que hablamos." 
    },
    author: "Epictetus",
    devotional: { 
      en: "Attentive listening is more than silence while your partner speaks. It means resisting the urge to plan your reply, noticing tone and pauses, and reflecting back both words and emotions. Psychology calls this active empathy: mirroring not just content but the feeling beneath it. Couples who practice attentive listening report higher trust and intimacy because it communicates: your inner world matters to me.",
      es: "Escuchar atentamente es más que guardar silencio mientras tu pareja habla. Significa resistir el impulso de planificar tu respuesta, notar el tono y las pausas, y reflejar tanto las palabras como las emociones. La psicología llama a esto empatía activa: reflejar no solo el contenido sino el sentimiento detrás de él. Las parejas que practican la escucha atenta reportan mayor confianza e intimidad porque comunica: tu mundo interior me importa."
    },
    reflectionQuestions: [
      { en: "When was the last time you felt truly attended to rather than just heard?", es: "¿Cuándo fue la última vez que te sentiste verdaderamente atendido/a en lugar de solo escuchado/a?" },
      { en: "What habits block your attentive listening?", es: "¿Qué hábitos bloquean tu escucha atenta?" },
      { en: "How can you show your partner today that their emotions—not just their words—are important?", es: "¿Cómo puedes mostrarle a tu pareja hoy que sus emociones, no solo sus palabras, son importantes?" }
    ],
    practiceBox: [
      { en: "Tonight, ask your partner about their day. Repeat back what you heard, including the emotion.", es: "Esta noche, pregúntale a tu pareja sobre su día. Repite lo que escuchaste, incluyendo la emoción." },
      { en: "Pause for 3 seconds before responding, to ensure you're not rushing to reply.", es: "Pausa 3 segundos antes de responder, para asegurarte de no apresurarte a contestar." },
      { en: "End by asking: 'Did I get that right?'", es: "Termina preguntando: '¿Entendí bien?'" }
    ],
    category: categoryNames.emotional
  },
  {
    day: 2,
    title: { en: "The Power of Emotional Validation", es: "El Poder de la Validación Emocional" },
    quote: { 
      en: "Being heard is so close to being loved that for the average person, they are almost indistinguishable.", 
      es: "Ser escuchado está tan cerca de ser amado que para la persona promedio, son casi indistinguibles." 
    },
    author: "David Augsburger",
    devotional: { 
      en: "Emotional validation doesn't mean agreeing with everything your partner feels—it means acknowledging that their feelings make sense given their perspective. When we validate, we communicate acceptance of our partner's emotional experience without judgment. Research shows that validation reduces emotional escalation and creates safety for deeper sharing.",
      es: "La validación emocional no significa estar de acuerdo con todo lo que tu pareja siente—significa reconocer que sus sentimientos tienen sentido desde su perspectiva. Cuando validamos, comunicamos aceptación de la experiencia emocional de nuestra pareja sin juzgar. Las investigaciones muestran que la validación reduce la escalada emocional y crea seguridad para compartir más profundamente."
    },
    reflectionQuestions: [
      { en: "Do you tend to fix problems before acknowledging feelings?", es: "¿Tiendes a arreglar problemas antes de reconocer sentimientos?" },
      { en: "How does it feel when your emotions are dismissed versus validated?", es: "¿Cómo se siente cuando tus emociones son descartadas versus validadas?" },
      { en: "What phrases help you feel emotionally understood?", es: "¿Qué frases te ayudan a sentirte emocionalmente comprendido/a?" }
    ],
    practiceBox: [
      { en: "Use phrases like 'That makes sense' or 'I can see why you'd feel that way.'", es: "Usa frases como 'Eso tiene sentido' o 'Puedo ver por qué te sentirías así.'" },
      { en: "Resist the urge to offer solutions until your partner feels heard.", es: "Resiste el impulso de ofrecer soluciones hasta que tu pareja se sienta escuchada." },
      { en: "Notice when you want to defend yourself instead of validating—pause and choose connection.", es: "Nota cuando quieres defenderte en lugar de validar—pausa y elige la conexión." }
    ],
    category: categoryNames.emotional
  },
  {
    day: 365,
    title: { en: "A Year of Growth", es: "Un Año de Crecimiento" },
    quote: { 
      en: "Love does not consist in gazing at each other, but in looking outward together in the same direction.", 
      es: "El amor no consiste en mirarse el uno al otro, sino en mirar juntos en la misma dirección." 
    },
    author: "Antoine de Saint-Exupéry",
    devotional: { 
      en: "You've journeyed through 365 days of intentional relationship growth. You've explored emotional intelligence, communication, intimacy, shared goals, personality dynamics, repair, and daily nourishment. But this isn't an ending—it's a foundation. The skills and insights you've gathered are seeds planted. Continue watering them with practice, patience, and presence. Your relationship is a living thing that grows with attention and care.",
      es: "Has viajado a través de 365 días de crecimiento intencional en tu relación. Has explorado inteligencia emocional, comunicación, intimidad, metas compartidas, dinámicas de personalidad, reparación y nutrición diaria. Pero esto no es un final—es una base. Las habilidades y perspectivas que has reunido son semillas plantadas. Continúa regándolas con práctica, paciencia y presencia. Tu relación es algo vivo que crece con atención y cuidado."
    },
    reflectionQuestions: [
      { en: "What was your most significant insight this year?", es: "¿Cuál fue tu perspectiva más significativa este año?" },
      { en: "How has your relationship grown through this practice?", es: "¿Cómo ha crecido tu relación a través de esta práctica?" },
      { en: "What will you carry forward into the next year?", es: "¿Qué llevarás contigo al próximo año?" }
    ],
    practiceBox: [
      { en: "Celebrate completing this journey together.", es: "Celebren completar este viaje juntos." },
      { en: "Share your three biggest takeaways with your partner.", es: "Comparte tus tres mayores aprendizajes con tu pareja." },
      { en: "Commit to continuing daily practices that served you well.", es: "Comprométete a continuar las prácticas diarias que te sirvieron bien." }
    ],
    category: categoryNames.daily
  }
];

// Templates for generating remaining days
const templates: Record<string, DevotionalEntry[]> = {
  emotional: [
    {
      day: 0,
      title: { en: "Emotional Awareness", es: "Conciencia Emocional" },
      quote: { en: "Know thyself.", es: "Conócete a ti mismo." },
      author: "Socrates",
      devotional: { 
        en: "Self-awareness is the foundation of emotional intelligence. Before we can manage our emotions or understand our partner's, we must first become aware of our own inner landscape. Pay attention to what you feel without judgment—simply notice and name.",
        es: "La autoconciencia es la base de la inteligencia emocional. Antes de poder manejar nuestras emociones o entender las de nuestra pareja, primero debemos ser conscientes de nuestro propio paisaje interior. Presta atención a lo que sientes sin juzgar—simplemente nota y nombra."
      },
      reflectionQuestions: [
        { en: "What emotions did you experience today?", es: "¿Qué emociones experimentaste hoy?" },
        { en: "What triggered your strongest emotions?", es: "¿Qué desencadenó tus emociones más fuertes?" },
        { en: "How aware are you of your emotional patterns?", es: "¿Qué tan consciente eres de tus patrones emocionales?" }
      ],
      practiceBox: [
        { en: "Check in with your emotions three times today.", es: "Revisa tus emociones tres veces hoy." },
        { en: "Name the emotion without judging it.", es: "Nombra la emoción sin juzgarla." },
        { en: "Notice where you feel emotions in your body.", es: "Nota dónde sientes las emociones en tu cuerpo." }
      ],
      category: categoryNames.emotional
    },
    {
      day: 0,
      title: { en: "Emotional Regulation", es: "Regulación Emocional" },
      quote: { en: "He who controls others may be powerful, but he who has mastered himself is mightier still.", es: "Quien controla a otros puede ser poderoso, pero quien se ha dominado a sí mismo es aún más poderoso." },
      author: "Lao Tzu",
      devotional: { 
        en: "Emotional regulation isn't suppressing feelings—it's choosing how to express them constructively. When intense emotions arise, we can pause before reacting, creating space for thoughtful response rather than reactive behavior.",
        es: "La regulación emocional no es suprimir sentimientos—es elegir cómo expresarlos constructivamente. Cuando surgen emociones intensas, podemos pausar antes de reaccionar, creando espacio para una respuesta reflexiva en lugar de un comportamiento reactivo."
      },
      reflectionQuestions: [
        { en: "How do you typically respond to intense emotions?", es: "¿Cómo respondes típicamente a emociones intensas?" },
        { en: "What helps you regulate when overwhelmed?", es: "¿Qué te ayuda a regularte cuando estás abrumado/a?" },
        { en: "How does your emotional expression affect your partner?", es: "¿Cómo afecta tu expresión emocional a tu pareja?" }
      ],
      practiceBox: [
        { en: "Practice the pause: count to 10 before responding in anger.", es: "Practica la pausa: cuenta hasta 10 antes de responder con enojo." },
        { en: "Use deep breathing when emotions intensify.", es: "Usa respiración profunda cuando las emociones se intensifiquen." },
        { en: "Ask yourself: 'How do I want to handle this?'", es: "Pregúntate: '¿Cómo quiero manejar esto?'" }
      ],
      category: categoryNames.emotional
    },
    {
      day: 0,
      title: { en: "Empathy in Action", es: "Empatía en Acción" },
      quote: { en: "Empathy is seeing with the eyes of another.", es: "La empatía es ver con los ojos de otro." },
      author: "Alfred Adler",
      devotional: { 
        en: "Empathy requires temporarily setting aside your own perspective to fully inhabit your partner's experience. It's not sympathy but genuine understanding of their inner world. When partners feel truly understood, defensiveness melts and connection deepens.",
        es: "La empatía requiere dejar de lado temporalmente tu propia perspectiva para habitar completamente la experiencia de tu pareja. No es simpatía sino comprensión genuina de su mundo interior. Cuando las parejas se sienten verdaderamente comprendidas, la defensividad se derrite y la conexión se profundiza."
      },
      reflectionQuestions: [
        { en: "When has someone's empathy profoundly impacted you?", es: "¿Cuándo la empatía de alguien te ha impactado profundamente?" },
        { en: "What makes it difficult for you to empathize?", es: "¿Qué te dificulta empatizar?" },
        { en: "How can you show more curiosity about your partner's perspective?", es: "¿Cómo puedes mostrar más curiosidad sobre la perspectiva de tu pareja?" }
      ],
      practiceBox: [
        { en: "Summarize your partner's position before stating your own.", es: "Resume la posición de tu pareja antes de expresar la tuya." },
        { en: "Ask: 'Help me understand what this feels like for you.'", es: "Pregunta: 'Ayúdame a entender cómo se siente esto para ti.'" },
        { en: "Practice empathy even when you disagree.", es: "Practica la empatía incluso cuando no estés de acuerdo." }
      ],
      category: categoryNames.emotional
    }
  ],
  communication: [
    {
      day: 0,
      title: { en: "Speaking Your Truth Kindly", es: "Hablar Tu Verdad con Amabilidad" },
      quote: { en: "Honesty without kindness is brutality.", es: "La honestidad sin amabilidad es brutalidad." },
      author: "Unknown",
      devotional: { 
        en: "Truth-telling in relationships requires both courage and compassion. We must speak honestly about our needs, concerns, and feelings—but how we speak matters as much as what we say. Harsh truths delivered without care become weapons. Kind truths, shared with love, become bridges.",
        es: "Decir la verdad en las relaciones requiere tanto coraje como compasión. Debemos hablar honestamente sobre nuestras necesidades, preocupaciones y sentimientos—pero cómo hablamos importa tanto como lo que decimos. Las verdades duras entregadas sin cuidado se convierten en armas. Las verdades amables, compartidas con amor, se convierten en puentes."
      },
      reflectionQuestions: [
        { en: "Do you tend toward too much honesty or too much kindness?", es: "¿Tiendes hacia demasiada honestidad o demasiada amabilidad?" },
        { en: "How can you be more honest without being hurtful?", es: "¿Cómo puedes ser más honesto/a sin herir?" },
        { en: "What truths have you been avoiding speaking?", es: "¿Qué verdades has estado evitando decir?" }
      ],
      practiceBox: [
        { en: "Share one difficult truth today using 'I' statements.", es: "Comparte una verdad difícil hoy usando declaraciones 'Yo'." },
        { en: "Before speaking hard truths, ask: 'Is this the right time?'", es: "Antes de decir verdades difíciles, pregunta: '¿Es este el momento adecuado?'" },
        { en: "Lead with appreciation before addressing concerns.", es: "Comienza con apreciación antes de abordar preocupaciones." }
      ],
      category: categoryNames.communication
    }
  ],
  intimacy: [
    {
      day: 0,
      title: { en: "The Languages of Touch", es: "Los Lenguajes del Tacto" },
      quote: { en: "Touch is the first language we learn.", es: "El tacto es el primer lenguaje que aprendemos." },
      author: "Unknown",
      devotional: { 
        en: "Physical touch communicates what words sometimes cannot—comfort, desire, presence, love. But touch is not one-size-fits-all. What feels nurturing to one partner may feel overwhelming to another. Understanding each other's touch preferences allows touch to become a fluent language of love.",
        es: "El tacto físico comunica lo que las palabras a veces no pueden—consuelo, deseo, presencia, amor. Pero el tacto no es igual para todos. Lo que se siente nutritivo para una pareja puede sentirse abrumador para otra. Entender las preferencias de tacto del otro permite que el tacto se convierta en un lenguaje fluido de amor."
      },
      reflectionQuestions: [
        { en: "What kinds of touch feel most nurturing to you?", es: "¿Qué tipos de tacto se sienten más nutritivos para ti?" },
        { en: "How do you and your partner differ in touch preferences?", es: "¿Cómo difieren tú y tu pareja en preferencias de tacto?" },
        { en: "When does touch feel most meaningful to you?", es: "¿Cuándo el tacto se siente más significativo para ti?" }
      ],
      practiceBox: [
        { en: "Ask your partner: 'What kind of touch do you crave right now?'", es: "Pregúntale a tu pareja: '¿Qué tipo de tacto deseas ahora mismo?'" },
        { en: "Offer non-sexual affection today—a hug or gentle touch.", es: "Ofrece afecto no sexual hoy—un abrazo o toque gentil." },
        { en: "Notice your partner's response to different types of touch.", es: "Nota la respuesta de tu pareja a diferentes tipos de tacto." }
      ],
      category: categoryNames.intimacy
    }
  ],
  goals: [
    {
      day: 0,
      title: { en: "Dreaming Together", es: "Soñar Juntos" },
      quote: { en: "A dream you dream together is reality.", es: "Un sueño que sueñan juntos es realidad." },
      author: "John Lennon",
      devotional: { 
        en: "Couples who share dreams and goals build a sense of 'we-ness' that transcends individual desires. Shared vision doesn't mean identical goals but creating a future that honors both partners' aspirations. Dreaming together requires vulnerability and the willingness to weave your dreams into a shared tapestry.",
        es: "Las parejas que comparten sueños y metas construyen un sentido de 'nosotros' que trasciende los deseos individuales. Una visión compartida no significa metas idénticas sino crear un futuro que honre las aspiraciones de ambos. Soñar juntos requiere vulnerabilidad y la voluntad de tejer sus sueños en un tapiz compartido."
      },
      reflectionQuestions: [
        { en: "What dreams do you hold for your relationship's future?", es: "¿Qué sueños tienes para el futuro de tu relación?" },
        { en: "Do you know your partner's deepest aspirations?", es: "¿Conoces las aspiraciones más profundas de tu pareja?" },
        { en: "Where do your dreams align, and where do they differ?", es: "¿Dónde se alinean sus sueños y dónde difieren?" }
      ],
      practiceBox: [
        { en: "Schedule a 'dream date' to share your visions.", es: "Programa una 'cita de sueños' para compartir sus visiones." },
        { en: "Create a shared bucket list of experiences.", es: "Crea una lista de deseos compartida de experiencias." },
        { en: "Revisit and update your shared dreams annually.", es: "Revisa y actualiza sus sueños compartidos anualmente." }
      ],
      category: categoryNames.goals
    }
  ],
  personality: [
    {
      day: 0,
      title: { en: "Understanding Attachment", es: "Entendiendo el Apego" },
      quote: { en: "We are wounded in relationship, and we can be healed in relationship.", es: "Somos heridos en relación, y podemos ser sanados en relación." },
      author: "Harville Hendrix",
      devotional: { 
        en: "Attachment theory reveals that our earliest relationships create templates for how we connect in adulthood. Secure attachment means trusting your partner will be there. Anxious attachment involves fear of abandonment. Avoidant attachment involves discomfort with closeness. Understanding your styles illuminates many patterns.",
        es: "La teoría del apego revela que nuestras primeras relaciones crean plantillas para cómo nos conectamos en la adultez. El apego seguro significa confiar en que tu pareja estará ahí. El apego ansioso involucra miedo al abandono. El apego evitativo involucra incomodidad con la cercanía. Entender sus estilos ilumina muchos patrones."
      },
      reflectionQuestions: [
        { en: "What is your attachment style?", es: "¿Cuál es tu estilo de apego?" },
        { en: "What is your partner's attachment style?", es: "¿Cuál es el estilo de apego de tu pareja?" },
        { en: "How do your attachment styles interact?", es: "¿Cómo interactúan sus estilos de apego?" }
      ],
      practiceBox: [
        { en: "Research attachment styles together.", es: "Investiguen los estilos de apego juntos." },
        { en: "Identify one attachment-driven behavior to change.", es: "Identifica un comportamiento impulsado por el apego para cambiar." },
        { en: "Reassure your partner based on their attachment needs.", es: "Tranquiliza a tu pareja basándote en sus necesidades de apego." }
      ],
      category: categoryNames.personality
    }
  ],
  repair: [
    {
      day: 0,
      title: { en: "The Power of Repair", es: "El Poder de la Reparación" },
      quote: { en: "The quality of your relationships determines the quality of your life.", es: "La calidad de tus relaciones determina la calidad de tu vida." },
      author: "Esther Perel",
      devotional: { 
        en: "No relationship is free of ruptures—moments of disconnection or hurt. What distinguishes thriving relationships isn't the absence of ruptures but the presence of repair. Repair is reconnecting after disconnection, healing what was hurt. Couples who repair quickly build resilience.",
        es: "Ninguna relación está libre de rupturas—momentos de desconexión o herida. Lo que distingue a las relaciones prósperas no es la ausencia de rupturas sino la presencia de reparación. Reparar es reconectarse después de la desconexión, sanar lo que fue herido. Las parejas que reparan rápidamente construyen resiliencia."
      },
      reflectionQuestions: [
        { en: "How quickly do you typically repair after conflict?", es: "¿Qué tan rápido reparan típicamente después de un conflicto?" },
        { en: "What makes repair difficult for you?", es: "¿Qué hace que la reparación sea difícil para ti?" },
        { en: "What does successful repair look like?", es: "¿Cómo se ve una reparación exitosa?" }
      ],
      practiceBox: [
        { en: "After your next conflict, initiate repair within 24 hours.", es: "Después de su próximo conflicto, inicia la reparación dentro de 24 horas." },
        { en: "Develop a repair ritual—a phrase or gesture.", es: "Desarrolla un ritual de reparación—una frase o gesto." },
        { en: "Practice accepting repair attempts even when hurt.", es: "Practica aceptar intentos de reparación incluso cuando estés herido/a." }
      ],
      category: categoryNames.repair
    }
  ],
  daily: [
    {
      day: 0,
      title: { en: "Small Acts, Big Love", es: "Pequeños Actos, Gran Amor" },
      quote: { en: "Love is a million little things.", es: "El amor es un millón de pequeñas cosas." },
      author: "Unknown",
      devotional: { 
        en: "Grand gestures get attention, but relationships thrive on small, consistent acts of love. A cup of coffee made without asking. A text just to say 'thinking of you.' These small deposits in the emotional bank account accumulate into profound security and affection over time.",
        es: "Los grandes gestos llaman la atención, pero las relaciones prosperan con pequeños actos de amor consistentes. Una taza de café hecha sin que te lo pidan. Un mensaje solo para decir 'pensando en ti.' Estos pequeños depósitos en la cuenta bancaria emocional se acumulan en profunda seguridad y afecto con el tiempo."
      },
      reflectionQuestions: [
        { en: "What small acts of love does your partner appreciate?", es: "¿Qué pequeños actos de amor aprecia tu pareja?" },
        { en: "What small gestures make you feel most loved?", es: "¿Qué pequeños gestos te hacen sentir más amado/a?" },
        { en: "How consistent are you with daily expressions of love?", es: "¿Qué tan consistente eres con expresiones diarias de amor?" }
      ],
      practiceBox: [
        { en: "Do one small act of love today without being asked.", es: "Haz un pequeño acto de amor hoy sin que te lo pidan." },
        { en: "Notice small things your partner does and thank them.", es: "Nota las pequeñas cosas que tu pareja hace y agradécele." },
        { en: "Create a daily love ritual.", es: "Crea un ritual de amor diario." }
      ],
      category: categoryNames.daily
    }
  ]
};

// Generate entry for a specific day
const generateEntry = (day: number): DevotionalEntry => {
  const category = day <= 60 ? 'emotional' : 
                   day <= 120 ? 'communication' : 
                   day <= 180 ? 'intimacy' : 
                   day <= 240 ? 'goals' : 
                   day <= 300 ? 'personality' : 
                   day <= 330 ? 'repair' : 'daily';
  
  const categoryTemplates = templates[category];
  const templateIndex = (day - 1) % categoryTemplates.length;
  const template = categoryTemplates[templateIndex];
  
  return {
    ...template,
    day
  };
};

// Get devotional for a specific day
export const getDevotional = (day: number): DevotionalEntry => {
  const existing = devotionalEntries.find(d => d.day === day);
  if (existing) return existing;
  return generateEntry(day);
};

export const getAllDevotionals = (): DevotionalEntry[] => {
  return Array.from({ length: 365 }, (_, i) => getDevotional(i + 1));
};
