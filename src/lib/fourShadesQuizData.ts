export interface TemperamentQuizQuestion {
  id: number;
  question: { en: string; es: string };
  options: {
    text: { en: string; es: string };
    temperament: 'sanguine' | 'choleric' | 'melancholic' | 'phlegmatic';
  }[];
}

export const temperamentQuiz: TemperamentQuizQuestion[] = [
  {
    id: 1,
    question: {
      en: "When faced with a new social situation, you typically:",
      es: "Cuando te enfrentas a una nueva situación social, típicamente:"
    },
    options: [
      { text: { en: "Jump right in and start making friends immediately", es: "Te lanzas de inmediato y empiezas a hacer amigos" }, temperament: 'sanguine' },
      { text: { en: "Take charge and organize the group", es: "Tomas el control y organizas al grupo" }, temperament: 'choleric' },
      { text: { en: "Observe carefully before engaging with anyone", es: "Observas cuidadosamente antes de interactuar con alguien" }, temperament: 'melancholic' },
      { text: { en: "Wait for others to approach you while staying calm", es: "Esperas a que otros se acerquen mientras te mantienes tranquilo" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 2,
    question: {
      en: "When making an important decision, you:",
      es: "Cuando tomas una decisión importante:"
    },
    options: [
      { text: { en: "Go with your gut feeling and enthusiasm", es: "Sigues tu instinto y entusiasmo" }, temperament: 'sanguine' },
      { text: { en: "Make quick, confident choices based on goals", es: "Tomas decisiones rápidas y seguras basadas en objetivos" }, temperament: 'choleric' },
      { text: { en: "Analyze all details thoroughly before deciding", es: "Analizas todos los detalles exhaustivamente antes de decidir" }, temperament: 'melancholic' },
      { text: { en: "Take your time and consider everyone's feelings", es: "Te tomas tu tiempo y consideras los sentimientos de todos" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 3,
    question: {
      en: "In a group project, you naturally:",
      es: "En un proyecto grupal, naturalmente:"
    },
    options: [
      { text: { en: "Motivate and energize the team with your positivity", es: "Motivas y energizas al equipo con tu positividad" }, temperament: 'sanguine' },
      { text: { en: "Lead the team and delegate tasks efficiently", es: "Lideras el equipo y delegas tareas eficientemente" }, temperament: 'choleric' },
      { text: { en: "Create detailed plans and ensure quality work", es: "Creas planes detallados y aseguras trabajo de calidad" }, temperament: 'melancholic' },
      { text: { en: "Support others and keep the peace between members", es: "Apoyas a otros y mantienes la paz entre los miembros" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 4,
    question: {
      en: "When someone offends you, your first reaction is to:",
      es: "Cuando alguien te ofende, tu primera reacción es:"
    },
    options: [
      { text: { en: "Brush it off and move on quickly", es: "Dejarlo pasar y seguir adelante rápidamente" }, temperament: 'sanguine' },
      { text: { en: "Confront them directly about it", es: "Confrontarlos directamente al respecto" }, temperament: 'choleric' },
      { text: { en: "Feel deeply hurt and analyze what went wrong", es: "Sentirte profundamente herido y analizar qué salió mal" }, temperament: 'melancholic' },
      { text: { en: "Stay calm and avoid conflict at all costs", es: "Mantenerte tranquilo y evitar el conflicto a toda costa" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 5,
    question: {
      en: "Your ideal weekend looks like:",
      es: "Tu fin de semana ideal se ve así:"
    },
    options: [
      { text: { en: "A party or social gathering with lots of people", es: "Una fiesta o reunión social con mucha gente" }, temperament: 'sanguine' },
      { text: { en: "Accomplishing goals and productive activities", es: "Lograr metas y actividades productivas" }, temperament: 'choleric' },
      { text: { en: "Quiet time for reading, art, or deep conversations", es: "Tiempo tranquilo para leer, arte o conversaciones profundas" }, temperament: 'melancholic' },
      { text: { en: "Relaxing at home without any pressure", es: "Relajarte en casa sin ninguna presión" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 6,
    question: {
      en: "When facing a challenge, you:",
      es: "Cuando enfrentas un desafío:"
    },
    options: [
      { text: { en: "Stay optimistic and find the fun in it", es: "Te mantienes optimista y encuentras lo divertido" }, temperament: 'sanguine' },
      { text: { en: "Attack it head-on with determination", es: "Lo atacas de frente con determinación" }, temperament: 'choleric' },
      { text: { en: "Plan carefully and anticipate potential problems", es: "Planificas cuidadosamente y anticipas problemas potenciales" }, temperament: 'melancholic' },
      { text: { en: "Stay calm and handle it steadily over time", es: "Te mantienes tranquilo y lo manejas constantemente con el tiempo" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 7,
    question: {
      en: "In conversations, you tend to:",
      es: "En las conversaciones, tiendes a:"
    },
    options: [
      { text: { en: "Talk a lot and tell entertaining stories", es: "Hablar mucho y contar historias entretenidas" }, temperament: 'sanguine' },
      { text: { en: "Get to the point and focus on solutions", es: "Ir al grano y enfocarte en soluciones" }, temperament: 'choleric' },
      { text: { en: "Listen deeply and ask thoughtful questions", es: "Escuchar profundamente y hacer preguntas reflexivas" }, temperament: 'melancholic' },
      { text: { en: "Listen more than you speak, keeping things harmonious", es: "Escuchar más de lo que hablas, manteniendo la armonía" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 8,
    question: {
      en: "Your friends would describe you as:",
      es: "Tus amigos te describirían como:"
    },
    options: [
      { text: { en: "Fun, spontaneous, and the life of the party", es: "Divertido, espontáneo y el alma de la fiesta" }, temperament: 'sanguine' },
      { text: { en: "Strong, confident, and a natural leader", es: "Fuerte, seguro y un líder natural" }, temperament: 'choleric' },
      { text: { en: "Thoughtful, loyal, and deeply caring", es: "Reflexivo, leal y profundamente cariñoso" }, temperament: 'melancholic' },
      { text: { en: "Calm, reliable, and easy to be around", es: "Tranquilo, confiable y fácil de tratar" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 9,
    question: {
      en: "When stressed, you:",
      es: "Cuando estás estresado:"
    },
    options: [
      { text: { en: "Distract yourself with fun activities or people", es: "Te distraes con actividades divertidas o personas" }, temperament: 'sanguine' },
      { text: { en: "Work harder and push through aggressively", es: "Trabajas más duro y empujas agresivamente" }, temperament: 'choleric' },
      { text: { en: "Withdraw and overthink the situation", es: "Te retiras y piensas demasiado en la situación" }, temperament: 'melancholic' },
      { text: { en: "Shut down emotionally and avoid the problem", es: "Te cierras emocionalmente y evitas el problema" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 10,
    question: {
      en: "In a romantic relationship, you prioritize:",
      es: "En una relación romántica, priorizas:"
    },
    options: [
      { text: { en: "Excitement, adventure, and constant connection", es: "Emoción, aventura y conexión constante" }, temperament: 'sanguine' },
      { text: { en: "Respect, loyalty, and shared goals", es: "Respeto, lealtad y metas compartidas" }, temperament: 'choleric' },
      { text: { en: "Deep emotional intimacy and understanding", es: "Intimidad emocional profunda y comprensión" }, temperament: 'melancholic' },
      { text: { en: "Peace, stability, and comfortable companionship", es: "Paz, estabilidad y compañía cómoda" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 11,
    question: {
      en: "Your approach to deadlines is:",
      es: "Tu enfoque hacia los plazos es:"
    },
    options: [
      { text: { en: "Last minute rush with bursts of energy", es: "Prisa de último minuto con ráfagas de energía" }, temperament: 'sanguine' },
      { text: { en: "Complete early to move on to the next challenge", es: "Completar temprano para pasar al siguiente desafío" }, temperament: 'choleric' },
      { text: { en: "Careful planning to ensure perfect results", es: "Planificación cuidadosa para asegurar resultados perfectos" }, temperament: 'melancholic' },
      { text: { en: "Steady progress without rushing or stressing", es: "Progreso constante sin apresurarse ni estresarse" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 12,
    question: {
      en: "When someone needs help, you:",
      es: "Cuando alguien necesita ayuda:"
    },
    options: [
      { text: { en: "Cheerfully volunteer and make it fun", es: "Te ofreces alegremente y lo haces divertido" }, temperament: 'sanguine' },
      { text: { en: "Take charge and solve their problem efficiently", es: "Tomas el control y resuelves su problema eficientemente" }, temperament: 'choleric' },
      { text: { en: "Offer deep emotional support and listen", es: "Ofreces apoyo emocional profundo y escuchas" }, temperament: 'melancholic' },
      { text: { en: "Help quietly in practical, supportive ways", es: "Ayudas tranquilamente de formas prácticas y de apoyo" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 13,
    question: {
      en: "Your biggest weakness might be:",
      es: "Tu mayor debilidad podría ser:"
    },
    options: [
      { text: { en: "Being easily distracted and lacking follow-through", es: "Ser fácilmente distraído y carecer de seguimiento" }, temperament: 'sanguine' },
      { text: { en: "Being too controlling or impatient with others", es: "Ser demasiado controlador o impaciente con otros" }, temperament: 'choleric' },
      { text: { en: "Being overly critical or pessimistic", es: "Ser demasiado crítico o pesimista" }, temperament: 'melancholic' },
      { text: { en: "Being too passive or resistant to change", es: "Ser demasiado pasivo o resistente al cambio" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 14,
    question: {
      en: "At a party, you're most likely to:",
      es: "En una fiesta, es más probable que:"
    },
    options: [
      { text: { en: "Work the room and talk to everyone", es: "Recorras el lugar y hables con todos" }, temperament: 'sanguine' },
      { text: { en: "Find influential people and network strategically", es: "Encuentres personas influyentes y hagas networking estratégicamente" }, temperament: 'choleric' },
      { text: { en: "Have a few deep conversations in a quiet corner", es: "Tengas algunas conversaciones profundas en un rincón tranquilo" }, temperament: 'melancholic' },
      { text: { en: "Find a comfortable spot and observe", es: "Encuentres un lugar cómodo y observes" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 15,
    question: {
      en: "Your communication style is:",
      es: "Tu estilo de comunicación es:"
    },
    options: [
      { text: { en: "Animated, expressive, and sometimes exaggerated", es: "Animado, expresivo y a veces exagerado" }, temperament: 'sanguine' },
      { text: { en: "Direct, confident, and to the point", es: "Directo, seguro y al grano" }, temperament: 'choleric' },
      { text: { en: "Thoughtful, detailed, and carefully worded", es: "Reflexivo, detallado y cuidadosamente expresado" }, temperament: 'melancholic' },
      { text: { en: "Gentle, diplomatic, and non-confrontational", es: "Gentil, diplomático y no confrontacional" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 16,
    question: {
      en: "When things don't go as planned, you:",
      es: "Cuando las cosas no salen como se planeó:"
    },
    options: [
      { text: { en: "Adapt quickly and find a new adventure", es: "Te adaptas rápidamente y encuentras una nueva aventura" }, temperament: 'sanguine' },
      { text: { en: "Get frustrated and push harder to fix it", es: "Te frustras y empujas más fuerte para arreglarlo" }, temperament: 'choleric' },
      { text: { en: "Feel disappointed and need time to process", es: "Te sientes decepcionado y necesitas tiempo para procesar" }, temperament: 'melancholic' },
      { text: { en: "Accept it calmly and go with the flow", es: "Lo aceptas con calma y sigues la corriente" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 17,
    question: {
      en: "Your ideal work environment is:",
      es: "Tu ambiente de trabajo ideal es:"
    },
    options: [
      { text: { en: "Social, dynamic, with lots of interaction", es: "Social, dinámico, con mucha interacción" }, temperament: 'sanguine' },
      { text: { en: "Challenging, competitive, with clear goals", es: "Desafiante, competitivo, con metas claras" }, temperament: 'choleric' },
      { text: { en: "Quiet, organized, with high standards", es: "Tranquilo, organizado, con altos estándares" }, temperament: 'melancholic' },
      { text: { en: "Peaceful, supportive, without pressure", es: "Pacífico, de apoyo, sin presión" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 18,
    question: {
      en: "When you disagree with someone, you:",
      es: "Cuando no estás de acuerdo con alguien:"
    },
    options: [
      { text: { en: "Keep it light and try to win them over with charm", es: "Lo mantienes ligero e intentas convencerlos con encanto" }, temperament: 'sanguine' },
      { text: { en: "State your position firmly and argue your point", es: "Expones tu posición firmemente y argumentas tu punto" }, temperament: 'choleric' },
      { text: { en: "Present logical arguments with supporting evidence", es: "Presentas argumentos lógicos con evidencia de apoyo" }, temperament: 'melancholic' },
      { text: { en: "Avoid the conflict and keep your opinion to yourself", es: "Evitas el conflicto y guardas tu opinión para ti" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 19,
    question: {
      en: "What motivates you most is:",
      es: "Lo que más te motiva es:"
    },
    options: [
      { text: { en: "Recognition, fun, and social approval", es: "Reconocimiento, diversión y aprobación social" }, temperament: 'sanguine' },
      { text: { en: "Achievement, control, and results", es: "Logros, control y resultados" }, temperament: 'choleric' },
      { text: { en: "Purpose, quality, and meaning", es: "Propósito, calidad y significado" }, temperament: 'melancholic' },
      { text: { en: "Security, harmony, and appreciation", es: "Seguridad, armonía y aprecio" }, temperament: 'phlegmatic' }
    ]
  },
  {
    id: 20,
    question: {
      en: "In preparing for marriage, you most value:",
      es: "Al prepararte para el matrimonio, más valoras:"
    },
    options: [
      { text: { en: "A partner who keeps life exciting and joyful", es: "Un compañero que mantenga la vida emocionante y alegre" }, temperament: 'sanguine' },
      { text: { en: "A partner who respects your leadership and goals", es: "Un compañero que respete tu liderazgo y metas" }, temperament: 'choleric' },
      { text: { en: "A partner who understands your depth and values", es: "Un compañero que entienda tu profundidad y valores" }, temperament: 'melancholic' },
      { text: { en: "A partner who provides stability and peace", es: "Un compañero que brinde estabilidad y paz" }, temperament: 'phlegmatic' }
    ]
  }
];

export interface TemperamentResult {
  temperament: 'sanguine' | 'choleric' | 'melancholic' | 'phlegmatic';
  score: number;
  rank: number;
}

export interface TemperamentProfile {
  dominant: string;
  secondary: string;
  tertiary: string;
  rare: string;
  scores: TemperamentResult[];
}

export const temperamentInfo = {
  sanguine: {
    color: 'Yellow',
    role: { en: 'The Enthusiast', es: 'El Entusiasta' },
    summary: {
      en: 'You bring joy, optimism, and energy to everything. Quick to forgive, easy to connect with, you are the life of the party.',
      es: 'Traes alegría, optimismo y energía a todo. Rápido para perdonar, fácil de conectar, eres el alma de la fiesta.'
    }
  },
  choleric: {
    color: 'Red',
    role: { en: 'The Commander', es: 'El Comandante' },
    summary: {
      en: 'You are bold, decisive, and passionate. A natural leader who thrives under pressure and demands results.',
      es: 'Eres audaz, decisivo y apasionado. Un líder natural que prospera bajo presión y exige resultados.'
    }
  },
  melancholic: {
    color: 'Blue',
    role: { en: 'The Thinker', es: 'El Pensador' },
    summary: {
      en: 'You are analytical, thoughtful, and deeply caring. Loyal to the core, you seek meaning in everything.',
      es: 'Eres analítico, reflexivo y profundamente cariñoso. Leal hasta la médula, buscas significado en todo.'
    }
  },
  phlegmatic: {
    color: 'Green',
    role: { en: 'The Peacemaker', es: 'El Pacificador' },
    summary: {
      en: 'You are calm, patient, and reliable. The steady anchor who brings peace, balance, and harmony to relationships.',
      es: 'Eres tranquilo, paciente y confiable. El ancla estable que trae paz, equilibrio y armonía a las relaciones.'
    }
  }
};

export function scoreTemperamentQuiz(answers: ('sanguine' | 'choleric' | 'melancholic' | 'phlegmatic')[]): TemperamentProfile {
  const scores = {
    sanguine: 0,
    choleric: 0,
    melancholic: 0,
    phlegmatic: 0
  };

  answers.forEach(answer => {
    scores[answer]++;
  });

  const results: TemperamentResult[] = Object.entries(scores)
    .map(([temperament, score]) => ({
      temperament: temperament as 'sanguine' | 'choleric' | 'melancholic' | 'phlegmatic',
      score,
      rank: 0
    }))
    .sort((a, b) => b.score - a.score);

  results.forEach((result, index) => {
    result.rank = index + 1;
  });

  return {
    dominant: results[0].temperament,
    secondary: results[1].temperament,
    tertiary: results[2].temperament,
    rare: results[3].temperament,
    scores: results
  };
}
