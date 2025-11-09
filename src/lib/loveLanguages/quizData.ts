// Love Language Quiz Questions - 20 questions to determine ranking of all 5 languages

export interface LoveLanguageQuestion {
  id: number;
  question: {
    en: string;
    es: string;
  };
  options: Array<{
    text: { en: string; es: string };
    language: 'words' | 'quality_time' | 'gifts' | 'acts' | 'touch';
  }>;
}

export const loveLanguageQuiz: LoveLanguageQuestion[] = [
  {
    id: 1,
    question: {
      en: "What makes you feel most appreciated?",
      es: "¿Qué te hace sentir más apreciado/a?"
    },
    options: [
      { text: { en: "When my partner tells me they love me", es: "Cuando mi pareja me dice que me ama" }, language: 'words' },
      { text: { en: "When my partner spends quality time with me", es: "Cuando mi pareja pasa tiempo de calidad conmigo" }, language: 'quality_time' },
      { text: { en: "When my partner brings me a thoughtful gift", es: "Cuando mi pareja me trae un regalo thoughtful" }, language: 'gifts' },
      { text: { en: "When my partner helps me with tasks", es: "Cuando mi pareja me ayuda con las tareas" }, language: 'acts' },
      { text: { en: "When my partner hugs or kisses me", es: "Cuando mi pareja me abraza o besa" }, language: 'touch' }
    ]
  },
  {
    id: 2,
    question: {
      en: "What hurts you most?",
      es: "¿Qué te duele más?"
    },
    options: [
      { text: { en: "When my partner criticizes me", es: "Cuando mi pareja me critica" }, language: 'words' },
      { text: { en: "When my partner is too busy for me", es: "Cuando mi pareja está demasiado ocupado/a para mí" }, language: 'quality_time' },
      { text: { en: "When my partner forgets special occasions", es: "Cuando mi pareja olvida ocasiones especiales" }, language: 'gifts' },
      { text: { en: "When my partner doesn't help around the house", es: "Cuando mi pareja no ayuda en la casa" }, language: 'acts' },
      { text: { en: "When my partner is physically distant", es: "Cuando mi pareja está físicamente distante" }, language: 'touch' }
    ]
  },
  {
    id: 3,
    question: {
      en: "How do you prefer to show love?",
      es: "¿Cómo prefieres mostrar amor?"
    },
    options: [
      { text: { en: "By expressing my feelings verbally", es: "Expresando mis sentimientos verbalmente" }, language: 'words' },
      { text: { en: "By giving my undivided attention", es: "Dando mi atención completa" }, language: 'quality_time' },
      { text: { en: "By giving meaningful presents", es: "Dando regalos significativos" }, language: 'gifts' },
      { text: { en: "By doing things to make life easier", es: "Haciendo cosas para facilitar la vida" }, language: 'acts' },
      { text: { en: "Through physical affection", es: "A través del afecto físico" }, language: 'touch' }
    ]
  },
  {
    id: 4,
    question: {
      en: "What do you request most often?",
      es: "¿Qué solicitas con más frecuencia?"
    },
    options: [
      { text: { en: "Compliments and encouragement", es: "Cumplidos y aliento" }, language: 'words' },
      { text: { en: "More time together", es: "Más tiempo juntos" }, language: 'quality_time' },
      { text: { en: "Thoughtful surprises", es: "Sorpresas thoughtful" }, language: 'gifts' },
      { text: { en: "Help with responsibilities", es: "Ayuda con responsabilidades" }, language: 'acts' },
      { text: { en: "More hugs and cuddles", es: "Más abrazos y caricias" }, language: 'touch' }
    ]
  },
  {
    id: 5,
    question: {
      en: "What makes you feel connected?",
      es: "¿Qué te hace sentir conectado/a?"
    },
    options: [
      { text: { en: "Deep conversations", es: "Conversaciones profundas" }, language: 'words' },
      { text: { en: "Doing activities together", es: "Hacer actividades juntos" }, language: 'quality_time' },
      { text: { en: "Receiving tokens of affection", es: "Recibir tokens de afecto" }, language: 'gifts' },
      { text: { en: "My partner anticipating my needs", es: "Mi pareja anticipando mis necesidades" }, language: 'acts' },
      { text: { en: "Physical closeness", es: "Cercanía física" }, language: 'touch' }
    ]
  },
  {
    id: 6,
    question: {
      en: "What would be the perfect date?",
      es: "¿Cuál sería la cita perfecta?"
    },
    options: [
      { text: { en: "Talking for hours about dreams and feelings", es: "Hablar durante horas sobre sueños y sentimientos" }, language: 'words' },
      { text: { en: "Doing something fun together without distractions", es: "Hacer algo divertido juntos sin distracciones" }, language: 'quality_time' },
      { text: { en: "Being surprised with a meaningful gift", es: "Ser sorprendido/a con un regalo significativo" }, language: 'gifts' },
      { text: { en: "My partner planning everything for me", es: "Mi pareja planeando todo por mí" }, language: 'acts' },
      { text: { en: "Lots of physical affection throughout", es: "Mucho afecto físico durante todo" }, language: 'touch' }
    ]
  },
  {
    id: 7,
    question: {
      en: "What's your ideal way to celebrate an achievement?",
      es: "¿Cuál es tu forma ideal de celebrar un logro?"
    },
    options: [
      { text: { en: "Hearing how proud my partner is of me", es: "Escuchar lo orgulloso/a que está mi pareja de mí" }, language: 'words' },
      { text: { en: "Celebrating together doing something special", es: "Celebrar juntos haciendo algo especial" }, language: 'quality_time' },
      { text: { en: "Receiving a congratulatory gift", es: "Recibir un regalo de felicitación" }, language: 'gifts' },
      { text: { en: "My partner taking care of my chores for the day", es: "Mi pareja encargándose de mis tareas del día" }, language: 'acts' },
      { text: { en: "A warm embrace and kiss", es: "Un abrazo cálido y un beso" }, language: 'touch' }
    ]
  },
  {
    id: 8,
    question: {
      en: "When you're stressed, what helps most?",
      es: "Cuando estás estresado/a, ¿qué ayuda más?"
    },
    options: [
      { text: { en: "Words of reassurance and support", es: "Palabras de tranquilidad y apoyo" }, language: 'words' },
      { text: { en: "My partner sitting with me and listening", es: "Mi pareja sentándose conmigo y escuchando" }, language: 'quality_time' },
      { text: { en: "A small gift to cheer me up", es: "Un pequeño regalo para animarme" }, language: 'gifts' },
      { text: { en: "My partner handling tasks for me", es: "Mi pareja manejando tareas por mí" }, language: 'acts' },
      { text: { en: "A comforting hug or massage", es: "Un abrazo reconfortante o masaje" }, language: 'touch' }
    ]
  },
  {
    id: 9,
    question: {
      en: "What makes you feel most secure in the relationship?",
      es: "¿Qué te hace sentir más seguro/a en la relación?"
    },
    options: [
      { text: { en: "Regular 'I love you' messages", es: "Mensajes regulares de 'te amo'" }, language: 'words' },
      { text: { en: "Consistent quality time together", es: "Tiempo de calidad constante juntos" }, language: 'quality_time' },
      { text: { en: "Thoughtful gifts showing they think of me", es: "Regalos thoughtful mostrando que piensan en mí" }, language: 'gifts' },
      { text: { en: "My partner helping without being asked", es: "Mi pareja ayudando sin que se lo pidan" }, language: 'acts' },
      { text: { en: "Regular physical affection", es: "Afecto físico regular" }, language: 'touch' }
    ]
  },
  {
    id: 10,
    question: {
      en: "What's the best way to apologize to you?",
      es: "¿Cuál es la mejor manera de disculparse contigo?"
    },
    options: [
      { text: { en: "Sincere words and explanation", es: "Palabras sinceras y explicación" }, language: 'words' },
      { text: { en: "Spending time talking through it", es: "Pasar tiempo hablando sobre ello" }, language: 'quality_time' },
      { text: { en: "A peace offering or gift", es: "Una ofrenda de paz o regalo" }, language: 'gifts' },
      { text: { en: "Making it up through helpful actions", es: "Compensarlo mediante acciones útiles" }, language: 'acts' },
      { text: { en: "A warm hug and physical comfort", es: "Un abrazo cálido y consuelo físico" }, language: 'touch' }
    ]
  },
  {
    id: 11,
    question: {
      en: "What do you appreciate most on a regular day?",
      es: "¿Qué aprecias más en un día normal?"
    },
    options: [
      { text: { en: "Kind words and compliments", es: "Palabras amables y cumplidos" }, language: 'words' },
      { text: { en: "Eating meals together without phones", es: "Comer juntos sin teléfonos" }, language: 'quality_time' },
      { text: { en: "Little surprises left for me", es: "Pequeñas sorpresas dejadas para mí" }, language: 'gifts' },
      { text: { en: "Coming home to a clean space", es: "Llegar a casa a un espacio limpio" }, language: 'acts' },
      { text: { en: "A kiss goodbye and hello", es: "Un beso de despedida y hola" }, language: 'touch' }
    ]
  },
  {
    id: 12,
    question: {
      en: "How do you prefer to be comforted?",
      es: "¿Cómo prefieres ser consolado/a?"
    },
    options: [
      { text: { en: "Through encouraging words", es: "A través de palabras alentadoras" }, language: 'words' },
      { text: { en: "With someone's full presence and attention", es: "Con la presencia completa y atención de alguien" }, language: 'quality_time' },
      { text: { en: "With a comfort item or gift", es: "Con un artículo de consuelo o regalo" }, language: 'gifts' },
      { text: { en: "By someone taking care of things for me", es: "Que alguien se encargue de las cosas por mí" }, language: 'acts' },
      { text: { en: "Through physical comfort and closeness", es: "A través del consuelo físico y cercanía" }, language: 'touch' }
    ]
  },
  {
    id: 13,
    question: {
      en: "What would make you feel most loved on your birthday?",
      es: "¿Qué te haría sentir más amado/a en tu cumpleaños?"
    },
    options: [
      { text: { en: "A heartfelt letter or card", es: "Una carta o tarjeta sincera" }, language: 'words' },
      { text: { en: "A full day spent together", es: "Un día completo pasado juntos" }, language: 'quality_time' },
      { text: { en: "A thoughtful, personalized gift", es: "Un regalo thoughtful y personalizado" }, language: 'gifts' },
      { text: { en: "My partner organizing everything", es: "Mi pareja organizando todo" }, language: 'acts' },
      { text: { en: "Extra affection throughout the day", es: "Afecto extra durante todo el día" }, language: 'touch' }
    ]
  },
  {
    id: 14,
    question: {
      en: "What makes you feel most appreciated after a long day?",
      es: "¿Qué te hace sentir más apreciado/a después de un largo día?"
    },
    options: [
      { text: { en: "Hearing 'you did great today'", es: "Escuchar 'lo hiciste genial hoy'" }, language: 'words' },
      { text: { en: "Unwinding together", es: "Relajarse juntos" }, language: 'quality_time' },
      { text: { en: "A small treat waiting for me", es: "Un pequeño regalo esperándome" }, language: 'gifts' },
      { text: { en: "Dinner already prepared", es: "Cena ya preparada" }, language: 'acts' },
      { text: { en: "A long hug or back rub", es: "Un abrazo largo o masaje de espalda" }, language: 'touch' }
    ]
  },
  {
    id: 15,
    question: {
      en: "What's your favorite way to spend a lazy weekend?",
      es: "¿Cuál es tu forma favorita de pasar un fin de semana tranquilo?"
    },
    options: [
      { text: { en: "Sharing stories and dreams", es: "Compartiendo historias y sueños" }, language: 'words' },
      { text: { en: "Doing hobbies together", es: "Haciendo pasatiempos juntos" }, language: 'quality_time' },
      { text: { en: "Shopping for each other", es: "Comprando cosas el uno para el otro" }, language: 'gifts' },
      { text: { en: "Tackling home projects as a team", es: "Abordando proyectos del hogar en equipo" }, language: 'acts' },
      { text: { en: "Cuddling and being close", es: "Acurrucarse y estar cerca" }, language: 'touch' }
    ]
  },
  {
    id: 16,
    question: {
      en: "What bothers you most in an argument?",
      es: "¿Qué te molesta más en una discusión?"
    },
    options: [
      { text: { en: "Harsh or hurtful words", es: "Palabras duras o hirientes" }, language: 'words' },
      { text: { en: "Being ignored or avoided", es: "Ser ignorado/a o evitado/a" }, language: 'quality_time' },
      { text: { en: "Not receiving an apology gesture", es: "No recibir un gesto de disculpa" }, language: 'gifts' },
      { text: { en: "Lack of effort to fix things", es: "Falta de esfuerzo para arreglar las cosas" }, language: 'acts' },
      { text: { en: "Physical distance and no affection", es: "Distancia física y sin afecto" }, language: 'touch' }
    ]
  },
  {
    id: 17,
    question: {
      en: "How do you know your partner loves you?",
      es: "¿Cómo sabes que tu pareja te ama?"
    },
    options: [
      { text: { en: "They tell me frequently", es: "Me lo dicen frecuentemente" }, language: 'words' },
      { text: { en: "They prioritize time with me", es: "Priorizan el tiempo conmigo" }, language: 'quality_time' },
      { text: { en: "They remember what I like and gift accordingly", es: "Recuerdan lo que me gusta y regalan en consecuencia" }, language: 'gifts' },
      { text: { en: "They do things to make my life easier", es: "Hacen cosas para facilitar mi vida" }, language: 'acts' },
      { text: { en: "They're physically affectionate", es: "Son físicamente cariñosos/as" }, language: 'touch' }
    ]
  },
  {
    id: 18,
    question: {
      en: "What's the most meaningful thing your partner can do?",
      es: "¿Qué es lo más significativo que puede hacer tu pareja?"
    },
    options: [
      { text: { en: "Write me a love note", es: "Escribirme una nota de amor" }, language: 'words' },
      { text: { en: "Plan a surprise day together", es: "Planear un día sorpresa juntos" }, language: 'quality_time' },
      { text: { en: "Give something they know I've wanted", es: "Dar algo que saben que he querido" }, language: 'gifts' },
      { text: { en: "Take care of something I've been dreading", es: "Encargarse de algo que he estado temiendo" }, language: 'acts' },
      { text: { en: "Hold me when I need it most", es: "Abrazarme cuando más lo necesito" }, language: 'touch' }
    ]
  },
  {
    id: 19,
    question: {
      en: "What makes you feel like a priority?",
      es: "¿Qué te hace sentir como una prioridad?"
    },
    options: [
      { text: { en: "Being told I'm important", es: "Que me digan que soy importante" }, language: 'words' },
      { text: { en: "My partner making time despite being busy", es: "Mi pareja haciendo tiempo a pesar de estar ocupado/a" }, language: 'quality_time' },
      { text: { en: "Receiving thoughtful gifts 'just because'", es: "Recibir regalos thoughtful 'solo porque sí'" }, language: 'gifts' },
      { text: { en: "My partner going out of their way to help", es: "Mi pareja haciendo un esfuerzo extra para ayudar" }, language: 'acts' },
      { text: { en: "Regular physical affection", es: "Afecto físico regular" }, language: 'touch' }
    ]
  },
  {
    id: 20,
    question: {
      en: "What would you miss most if it stopped?",
      es: "¿Qué extrañarías más si se detuviera?"
    },
    options: [
      { text: { en: "The sweet things they say", es: "Las cosas dulces que dicen" }, language: 'words' },
      { text: { en: "Our regular together time", es: "Nuestro tiempo regular juntos" }, language: 'quality_time' },
      { text: { en: "The little surprises and gifts", es: "Las pequeñas sorpresas y regalos" }, language: 'gifts' },
      { text: { en: "All the helpful things they do", es: "Todas las cosas útiles que hacen" }, language: 'acts' },
      { text: { en: "The physical intimacy and touch", es: "La intimidad física y el tacto" }, language: 'touch' }
    ]
  }
];
