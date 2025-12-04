interface BilingualText {
  en: string;
  es: string;
}

export interface TemperamentChapter {
  id: number;
  temperament: 'sanguine' | 'choleric' | 'melancholic' | 'phlegmatic';
  color: string;
  role: BilingualText;
  title: BilingualText;
  scriptureAnchor: BilingualText;
  exposition: BilingualText;
  realityCheck: BilingualText;
  practicalImplications: BilingualText;
  closingCharge: BilingualText;
  reflectionQuestions: BilingualText[];
  practiceBox: BilingualText[];
}

export const temperamentChapters: TemperamentChapter[] = [
  {
    id: 1,
    temperament: 'sanguine',
    color: 'Yellow',
    role: { en: 'The Enthusiast', es: 'El Entusiasta' },
    title: { en: 'Sanguine: The Enthusiast', es: 'Sanguíneo: El Entusiasta' },
    scriptureAnchor: {
      en: '"A cheerful heart is good medicine, but a crushed spirit dries up the bones." — Proverbs 17:22\n\n"Rejoice always, pray continually, give thanks in all circumstances." — 1 Thessalonians 5:16-18',
      es: '"El corazón alegre es buena medicina, pero el espíritu abatido seca los huesos." — Proverbios 17:22\n\n"Estad siempre gozosos, orad sin cesar, dad gracias en todo." — 1 Tesalonicenses 5:16-18'
    },
    exposition: {
      en: `The Sanguine temperament is the sunrise of human personality—warm, bright, and full of promise. Those blessed with this disposition carry within them an inexhaustible wellspring of joy that seems to bubble up regardless of circumstances. They are the ones who walk into a room and somehow make it feel warmer, more alive, more hopeful. Scripture celebrates this gift of cheerfulness as "good medicine," recognizing that the capacity for joy is not merely a personality quirk but a divine gift with healing power.

At their core, Sanguines are driven by connection. They are not merely social; they are fundamentally relational beings who experience life most fully when sharing it with others. Their conversations are rarely about information exchange—they are about building bridges, creating moments, weaving the invisible threads that bind human hearts together. When a Sanguine asks "How are you?", they genuinely want to know, and their interest has a way of making others feel seen and valued.

The biblical mandate to "rejoice always" finds its most natural expression in the Sanguine heart. Where others might see this command as a spiritual discipline requiring effort, Sanguines often experience it as their native language. They remind us that joy is not dependent on perfect circumstances but is a choice—and for them, it's often an easy choice to make. Their optimism is not naivety; it is a form of faith that insists on seeing possibilities where others see only problems.

Yet this gift carries profound responsibility. The Sanguine's natural buoyancy can become a spiritual superpower when channeled purposefully—or it can become mere entertainment, a pleasant distraction from the deeper work of covenant love. The question every Sanguine preparing for marriage must ask is not "Am I fun to be around?" but "Is my joy rooted in something eternal, or does it evaporate when the party ends?"

In marriage preparation, the Sanguine brings invaluable gifts: the ability to lighten heavy moments, to find humor in hardship, to remind a partner that life is meant to be enjoyed. They are often quick to forgive—not because offenses don't hurt them, but because holding grudges feels like carrying unnecessary weight. Their spontaneity keeps relationships fresh, their warmth creates safety, and their enthusiasm can turn ordinary moments into celebrations.

However, the Sanguine's greatest strength—their orientation toward joy and connection—can become their greatest liability if not tempered by discipline. The capacity for deep, sustained commitment requires more than enthusiasm; it requires the willingness to stay present when feelings fade, to engage deeply when distraction beckons, and to choose faithfulness even when it stops being fun.

The Sanguine must learn that covenant love is not a series of exciting moments strung together but a continuous choice to show up fully, even in the boring, difficult, unglamorous seasons of life. Their natural aversion to conflict can lead them to paper over problems rather than address them, leaving wounds to fester beneath their cheerful exterior. True intimacy requires the courage to be present in uncomfortable conversations, to sit with pain rather than deflect it with humor.

Scripture's call to "give thanks in all circumstances" offers the Sanguine a pathway to spiritual maturity. Their joy, when rooted in gratitude rather than circumstance, becomes unshakeable. When they learn to thank God not just for pleasant experiences but for the refining fire of difficulty, their natural optimism is transformed into something far more powerful: hope that anchors the soul.`,
      es: `El temperamento Sanguíneo es el amanecer de la personalidad humana—cálido, brillante y lleno de promesa. Aquellos bendecidos con esta disposición llevan dentro de sí un manantial inagotable de alegría que parece brotar independientemente de las circunstancias. Son los que entran en una habitación y de alguna manera la hacen sentir más cálida, más viva, más esperanzadora. Las Escrituras celebran este don de la alegría como "buena medicina," reconociendo que la capacidad para la alegría no es meramente una peculiaridad de la personalidad sino un don divino con poder sanador.

En su núcleo, los Sanguíneos son impulsados por la conexión. No son meramente sociales; son seres fundamentalmente relacionales que experimentan la vida más plenamente cuando la comparten con otros. Sus conversaciones raramente tratan sobre intercambio de información—tratan sobre construir puentes, crear momentos, tejer los hilos invisibles que unen los corazones humanos. Cuando un Sanguíneo pregunta "¿Cómo estás?", genuinamente quiere saber, y su interés tiene una forma de hacer que otros se sientan vistos y valorados.

El mandato bíblico de "regocijaos siempre" encuentra su expresión más natural en el corazón Sanguíneo. Donde otros podrían ver este mandamiento como una disciplina espiritual que requiere esfuerzo, los Sanguíneos a menudo lo experimentan como su lenguaje nativo. Nos recuerdan que la alegría no depende de circunstancias perfectas sino que es una elección—y para ellos, a menudo es una elección fácil de hacer. Su optimismo no es ingenuidad; es una forma de fe que insiste en ver posibilidades donde otros solo ven problemas.

Sin embargo, este don conlleva una responsabilidad profunda. La flotabilidad natural del Sanguíneo puede convertirse en un superpoder espiritual cuando se canaliza con propósito—o puede convertirse en mero entretenimiento, una distracción agradable del trabajo más profundo del amor de pacto. La pregunta que todo Sanguíneo preparándose para el matrimonio debe hacerse no es "¿Soy divertido de tener cerca?" sino "¿Está mi alegría arraigada en algo eterno, o se evapora cuando termina la fiesta?"

En la preparación para el matrimonio, el Sanguíneo trae dones invaluables: la capacidad de aligerar momentos pesados, de encontrar humor en las dificultades, de recordarle a su pareja que la vida está destinada a ser disfrutada. A menudo son rápidos para perdonar—no porque las ofensas no les duelan, sino porque guardar rencores se siente como cargar peso innecesario. Su espontaneidad mantiene las relaciones frescas, su calidez crea seguridad, y su entusiasmo puede convertir momentos ordinarios en celebraciones.

Sin embargo, la mayor fortaleza del Sanguíneo—su orientación hacia la alegría y la conexión—puede convertirse en su mayor responsabilidad si no se templa con disciplina. La capacidad para un compromiso profundo y sostenido requiere más que entusiasmo; requiere la disposición de estar presente cuando los sentimientos se desvanecen, de comprometerse profundamente cuando la distracción llama, y de elegir la fidelidad incluso cuando deja de ser divertido.

El Sanguíneo debe aprender que el amor de pacto no es una serie de momentos emocionantes unidos sino una elección continua de presentarse completamente, incluso en las temporadas aburridas, difíciles y sin glamour de la vida. Su aversión natural al conflicto puede llevarlos a cubrir los problemas en lugar de abordarlos, dejando que las heridas se infecten bajo su exterior alegre. La verdadera intimidad requiere el coraje de estar presente en conversaciones incómodas, de sentarse con el dolor en lugar de desviarlo con humor.

El llamado de las Escrituras a "dar gracias en todas las circunstancias" ofrece al Sanguíneo un camino hacia la madurez espiritual. Su alegría, cuando está arraigada en la gratitud en lugar de las circunstancias, se vuelve inquebrantable. Cuando aprenden a agradecer a Dios no solo por las experiencias placenteras sino por el fuego refinador de la dificultad, su optimismo natural se transforma en algo mucho más poderoso: esperanza que ancla el alma.`
    },
    realityCheck: {
      en: `Let us speak plainly: the Sanguine's greatest temptation in marriage is superficiality. The same gift that allows them to float through life's difficulties can prevent them from ever diving deep enough to truly know—and be known by—another person.

Our culture celebrates the Sanguine traits: be fun, be positive, be the one everyone wants at the party. But marriage is not a party. It is a crucible. And the Sanguine who has built their identity on being liked will find themselves profoundly tested when their spouse sees their worst self and doesn't immediately offer applause.

The hard truth is this: your charm will not sustain your marriage. Your ability to make people laugh will not carry you through the nights when your spouse is weeping and needs you to simply sit in the darkness with them. Your optimism, however genuine, can feel like dismissal to a partner who needs their pain acknowledged before they can move toward hope.

Sanguines often struggle with follow-through. They are starters, not finishers. They generate ideas and energy but can leave a trail of half-completed projects and unfulfilled promises. In dating, this pattern might be charming—the spontaneous adventure that never quite materialized, the grand gesture that got interrupted. In marriage, this pattern erodes trust. Your spouse needs to know that when you say you will do something, you will do it—not just when you feel like it, but always.

The Sanguine's relationship with truth can also be complicated. Not that they are intentionally dishonest, but their desire to maintain positive connections can lead them to tell people what they want to hear rather than what they need to hear. They may exaggerate to make stories more entertaining, minimize problems to avoid conflict, or promise more than they can deliver because saying no feels too negative. In marriage, this tendency toward relational smoothing must give way to rigorous honesty—even when the truth is uncomfortable.

Perhaps most challenging is the Sanguine's struggle with depth. They often have many friends but few truly intimate relationships. They can talk for hours without ever revealing their true fears, doubts, or struggles. They may not even know their own depths because they've spent so much energy maintaining their sunny exterior. But marriage demands vulnerability. It requires you to be fully known—shadows and all—and to know another person at that same depth.

The question is not whether you are capable of fun; it is whether you are capable of faithfulness when fun fails you.`,
      es: `Hablemos claramente: la mayor tentación del Sanguíneo en el matrimonio es la superficialidad. El mismo don que les permite flotar a través de las dificultades de la vida puede impedirles sumergirse lo suficientemente profundo para verdaderamente conocer—y ser conocido por—otra persona.

Nuestra cultura celebra los rasgos Sanguíneos: sé divertido, sé positivo, sé el que todos quieren en la fiesta. Pero el matrimonio no es una fiesta. Es un crisol. Y el Sanguíneo que ha construido su identidad en ser agradable se encontrará profundamente probado cuando su cónyuge vea su peor yo y no ofrezca aplausos inmediatos.

La dura verdad es esta: tu encanto no sostendrá tu matrimonio. Tu capacidad para hacer reír a la gente no te llevará a través de las noches cuando tu cónyuge esté llorando y necesite que simplemente te sientes en la oscuridad con ellos. Tu optimismo, por más genuino que sea, puede sentirse como desprecio para una pareja que necesita que su dolor sea reconocido antes de poder moverse hacia la esperanza.

Los Sanguíneos a menudo luchan con el seguimiento. Son iniciadores, no terminadores. Generan ideas y energía pero pueden dejar un rastro de proyectos a medio terminar y promesas incumplidas. En el noviazgo, este patrón podría ser encantador—la aventura espontánea que nunca se materializó del todo, el gran gesto que se interrumpió. En el matrimonio, este patrón erosiona la confianza. Tu cónyuge necesita saber que cuando dices que harás algo, lo harás—no solo cuando tengas ganas, sino siempre.

La relación del Sanguíneo con la verdad también puede ser complicada. No es que sean intencionalmente deshonestos, pero su deseo de mantener conexiones positivas puede llevarlos a decirle a la gente lo que quieren escuchar en lugar de lo que necesitan escuchar. Pueden exagerar para hacer las historias más entretenidas, minimizar problemas para evitar conflictos, o prometer más de lo que pueden cumplir porque decir no se siente demasiado negativo. En el matrimonio, esta tendencia hacia el suavizado relacional debe dar paso a una honestidad rigurosa—incluso cuando la verdad es incómoda.

Quizás lo más desafiante es la lucha del Sanguíneo con la profundidad. A menudo tienen muchos amigos pero pocas relaciones verdaderamente íntimas. Pueden hablar por horas sin revelar nunca sus verdaderos miedos, dudas o luchas. Puede que ni siquiera conozcan sus propias profundidades porque han gastado tanta energía manteniendo su exterior soleado. Pero el matrimonio demanda vulnerabilidad. Requiere que seas completamente conocido—sombras y todo—y que conozcas a otra persona a esa misma profundidad.

La pregunta no es si eres capaz de divertirte; es si eres capaz de ser fiel cuando la diversión te falla.`
    },
    practicalImplications: {
      en: `For the Sanguine preparing for marriage, practical growth means developing the discipline to match your enthusiasm. Here are concrete areas requiring attention:

**Cultivate Depth in Conversation**: Practice moving beyond surface-level interactions. When your partner shares something significant, resist the urge to lighten the moment or pivot to a more comfortable topic. Ask follow-up questions. Sit in silence if needed. Your presence in the depth matters more than your ability to fix or brighten the situation.

**Build Systems for Follow-Through**: Recognize that your memory for commitments may not match your enthusiasm for making them. Use calendars, reminders, and check-ins with your partner to ensure that your "yes" means yes. Start small—keeping tiny promises builds the muscle for keeping large ones.

**Develop Conflict Tolerance**: You will need to have hard conversations in marriage. Practice now. When something bothers you, say so—kindly but directly. When your partner raises an issue, stay engaged rather than deflecting with humor or changing the subject. The ability to work through conflict without fleeing is essential to covenant.

**Practice Consistent Presence**: Your partner will need you to show up not just for the exciting moments but for the mundane ones. Practice sitting still, being present without entertainment, finding joy in quiet togetherness. This capacity for peaceful presence will be invaluable in the long years of marriage.

**Guard Against Emotional Infidelity**: Your natural warmth and connection-seeking can create inappropriate intimacy with others if unchecked. Begin now to establish boundaries around your relational energy. Your deepest emotional connection should be reserved for your spouse.

**Develop Self-Awareness**: Spend time in reflection and prayer asking God to show you who you truly are beneath the cheerful exterior. What fears drive you? What wounds have you covered with laughter? Knowing yourself deeply is prerequisite to being known by another.

**Learn to Receive Joy from God**: Your joy should ultimately flow from your relationship with Christ, not from external stimulation or social approval. Practice finding joy in solitude, in Scripture, in quiet prayer. This rooting will sustain you when human relationships disappoint.`,
      es: `Para el Sanguíneo preparándose para el matrimonio, el crecimiento práctico significa desarrollar la disciplina para igualar tu entusiasmo. Aquí hay áreas concretas que requieren atención:

**Cultiva Profundidad en la Conversación**: Practica ir más allá de las interacciones superficiales. Cuando tu pareja comparta algo significativo, resiste el impulso de aligerar el momento o pivotar a un tema más cómodo. Haz preguntas de seguimiento. Siéntate en silencio si es necesario. Tu presencia en la profundidad importa más que tu capacidad de arreglar o alegrar la situación.

**Construye Sistemas para el Seguimiento**: Reconoce que tu memoria para los compromisos puede no coincidir con tu entusiasmo por hacerlos. Usa calendarios, recordatorios y verificaciones con tu pareja para asegurar que tu "sí" signifique sí. Comienza pequeño—mantener pequeñas promesas construye el músculo para mantener las grandes.

**Desarrolla Tolerancia al Conflicto**: Necesitarás tener conversaciones difíciles en el matrimonio. Practica ahora. Cuando algo te moleste, dilo—amablemente pero directamente. Cuando tu pareja plantee un problema, mantente comprometido en lugar de desviar con humor o cambiar de tema. La capacidad de trabajar a través del conflicto sin huir es esencial para el pacto.

**Practica la Presencia Consistente**: Tu pareja te necesitará no solo para los momentos emocionantes sino para los mundanos. Practica sentarte quieto, estar presente sin entretenimiento, encontrar alegría en la tranquila compañía. Esta capacidad de presencia pacífica será invaluable en los largos años de matrimonio.

**Guárdate Contra la Infidelidad Emocional**: Tu calidez natural y búsqueda de conexión pueden crear intimidad inapropiada con otros si no se controla. Comienza ahora a establecer límites alrededor de tu energía relacional. Tu conexión emocional más profunda debe reservarse para tu cónyuge.

**Desarrolla Autoconciencia**: Pasa tiempo en reflexión y oración pidiendo a Dios que te muestre quién eres verdaderamente debajo del exterior alegre. ¿Qué miedos te impulsan? ¿Qué heridas has cubierto con risas? Conocerte profundamente es prerequisito para ser conocido por otro.

**Aprende a Recibir Gozo de Dios**: Tu alegría debe fluir ultimadamente de tu relación con Cristo, no de estimulación externa o aprobación social. Practica encontrar gozo en la soledad, en las Escrituras, en la oración silenciosa. Este arraigo te sostendrá cuando las relaciones humanas decepcionen.`
    },
    closingCharge: {
      en: `Dear Sanguine soul, you carry a gift that this world desperately needs. Your joy is not frivolous; it is a reflection of the God who created laughter and declared His creation good. Your warmth is not superficial; it is an echo of divine love that draws people toward the Light.

But you stand now at a threshold. The covenant you are preparing to enter is not another adventure to be started and possibly abandoned when something more interesting comes along. It is a sacred vow—a promise that will demand everything of you, including the parts of yourself you'd rather not acknowledge.

God is calling you to bring your whole self to marriage: not just the cheerful performer but the struggling human beneath. He is calling you to a joy that survives the dark nights, an optimism rooted in resurrection rather than denial, a love that persists when feelings fade.

You have the capacity for profound covenant faithfulness. Within your desire to connect lies the seed of the deepest intimacy. Within your enthusiasm lies the energy for lifelong devotion. Within your gift for forgiveness lies the grace that sustains marriages through their hardest seasons.

But you must choose. You must choose depth over distraction, presence over performance, truth over comfortable lies. You must allow God to take your natural joy and refine it into something unshakeable—a hope that anchors, a love that remains, a faithfulness that endures.

The party will end, dear one. The honeymoon will fade. The excitement will give way to ordinary Tuesday afternoons. And in those moments, your covenant will call you to a different kind of joy—the deep, quiet joy of knowing and being known, of choosing and being chosen, of staying when leaving would be easier.

This is your invitation: not to diminish your light but to root it in something eternal. Bring your sunshine, but let it flow from the Son. Bring your laughter, but let it spring from a well that never runs dry. Be fully yourself—and be fully His.

Rise to the covenant, Enthusiast. Your marriage awaits your best self.`,
      es: `Querida alma Sanguínea, llevas un don que este mundo necesita desesperadamente. Tu alegría no es frívola; es un reflejo del Dios que creó la risa y declaró su creación buena. Tu calidez no es superficial; es un eco del amor divino que atrae a las personas hacia la Luz.

Pero ahora estás en un umbral. El pacto que te preparas para entrar no es otra aventura para ser iniciada y posiblemente abandonada cuando algo más interesante aparezca. Es un voto sagrado—una promesa que demandará todo de ti, incluyendo las partes de ti mismo que preferirías no reconocer.

Dios te está llamando a traer todo tu ser al matrimonio: no solo el animador alegre sino el ser humano luchando debajo. Te está llamando a una alegría que sobrevive las noches oscuras, un optimismo arraigado en la resurrección en lugar de la negación, un amor que persiste cuando los sentimientos se desvanecen.

Tienes la capacidad para una profunda fidelidad de pacto. Dentro de tu deseo de conectar yace la semilla de la intimidad más profunda. Dentro de tu entusiasmo yace la energía para la devoción de toda la vida. Dentro de tu don para el perdón yace la gracia que sostiene los matrimonios a través de sus temporadas más difíciles.

Pero debes elegir. Debes elegir profundidad sobre distracción, presencia sobre actuación, verdad sobre mentiras cómodas. Debes permitir que Dios tome tu alegría natural y la refine en algo inquebrantable—una esperanza que ancla, un amor que permanece, una fidelidad que perdura.

La fiesta terminará, querido. La luna de miel se desvanecerá. La emoción dará paso a las ordinarias tardes de martes. Y en esos momentos, tu pacto te llamará a un tipo diferente de alegría—el gozo profundo y tranquilo de conocer y ser conocido, de elegir y ser elegido, de quedarse cuando irse sería más fácil.

Esta es tu invitación: no disminuir tu luz sino arraigarla en algo eterno. Trae tu sol, pero deja que fluya del Hijo. Trae tu risa, pero deja que brote de un pozo que nunca se seca. Sé completamente tú mismo—y sé completamente suyo.

Elévate al pacto, Entusiasta. Tu matrimonio espera tu mejor yo.`
    },
    reflectionQuestions: [
      { en: "When was the last time you allowed someone to see you when you weren't being cheerful? What did that vulnerability feel like?", es: "¿Cuándo fue la última vez que permitiste que alguien te viera cuando no estabas siendo alegre? ¿Cómo se sintió esa vulnerabilidad?" },
      { en: "Think of a promise you made but didn't keep. What prevented you from following through? What would it take to change that pattern?", es: "Piensa en una promesa que hiciste pero no cumpliste. ¿Qué te impidió cumplirla? ¿Qué se necesitaría para cambiar ese patrón?" },
      { en: "How do you typically respond when your partner wants to discuss something difficult? Do you stay engaged or find ways to lighten/avoid the conversation?", es: "¿Cómo respondes típicamente cuando tu pareja quiere discutir algo difícil? ¿Te mantienes comprometido o encuentras formas de aligerar/evitar la conversación?" },
      { en: "What fears lie beneath your cheerful exterior? What would happen if your partner saw those fears?", es: "¿Qué miedos yacen debajo de tu exterior alegre? ¿Qué pasaría si tu pareja viera esos miedos?" },
      { en: "Is your joy rooted in circumstances and social approval, or in something deeper? How do you know?", es: "¿Está tu alegría arraigada en circunstancias y aprobación social, o en algo más profundo? ¿Cómo lo sabes?" },
      { en: "How would your closest relationships change if you committed to rigorous honesty, even when the truth is uncomfortable?", es: "¿Cómo cambiarían tus relaciones más cercanas si te comprometieras a una honestidad rigurosa, incluso cuando la verdad es incómoda?" },
      { en: "What does faithful presence in boring, ordinary moments look like for you? How can you grow in this area?", es: "¿Cómo se ve la presencia fiel en momentos aburridos y ordinarios para ti? ¿Cómo puedes crecer en esta área?" }
    ],
    practiceBox: [
      { en: "This week, have one conversation with your partner where you resist the urge to lighten the mood. Stay in the depth, even if it's uncomfortable.", es: "Esta semana, ten una conversación con tu pareja donde resistas el impulso de aligerar el ambiente. Quédate en la profundidad, aunque sea incómodo." },
      { en: "Make three small promises this week and keep all of them. Notice what it takes to follow through.", es: "Haz tres pequeñas promesas esta semana y cumple todas. Nota lo que se necesita para cumplir." },
      { en: "Spend 15 minutes in silence and solitude daily, practicing finding joy in God's presence alone.", es: "Pasa 15 minutos en silencio y soledad diariamente, practicando encontrar gozo solo en la presencia de Dios." },
      { en: "Write down one fear or struggle you've never shared with your partner, then prayerfully consider sharing it this week.", es: "Escribe un miedo o lucha que nunca hayas compartido con tu pareja, luego considera en oración compartirlo esta semana." }
    ]
  },
  {
    id: 2,
    temperament: 'choleric',
    color: 'Red',
    role: { en: 'The Commander', es: 'El Comandante' },
    title: { en: 'Choleric: The Commander', es: 'Colérico: El Comandante' },
    scriptureAnchor: {
      en: '"Whatever you do, work at it with all your heart, as working for the Lord." — Colossians 3:23\n\n"Husbands, love your wives, just as Christ loved the church and gave himself up for her." — Ephesians 5:25',
      es: '"Y todo lo que hagáis, hacedlo de corazón, como para el Señor." — Colosenses 3:23\n\n"Maridos, amad a vuestras mujeres, así como Cristo amó a la iglesia y se entregó a sí mismo por ella." — Efesios 5:25'
    },
    exposition: {
      en: `The Choleric temperament blazes with the fire of purpose. These are the souls who seem born to lead, to accomplish, to drive toward goals with relentless determination. Where others see obstacles, Cholerics see challenges to be conquered. Where others hesitate, they act. Their energy is kinetic, their vision clear, their will formidable. Scripture's call to work with all your heart resonates deeply with the Choleric nature—they cannot imagine giving anything less than everything.

At their best, Cholerics are the driving forces who move mountains, build empires, and make things happen that others only dream about. They possess a rare gift: the ability to see what needs to be done and the willpower to do it. In a world full of talkers, they are doers. In a sea of indecision, they are anchors of certainty. Their confidence is not mere bravado but the natural expression of souls who have learned to trust their own judgment and abilities.

The biblical model of leadership finds powerful expression in the Choleric temperament. When Christ called disciples to follow, when Paul drove missionary movements across continents, when Nehemiah rebuilt walls against all opposition—these were not the actions of passive observers but of determined leaders who knew their purpose and pursued it relentlessly. The Choleric carries this same capacity for holy ambition.

Yet the Scripture couples the command to work wholeheartedly with the reminder that our ultimate audience is the Lord Himself. This is crucial for the Choleric, whose drive can easily become self-serving, whose leadership can devolve into control, whose strength can become a weapon rather than a tool for service. The same verse that validates their intensity also redirects it—not toward personal glory but toward divine purpose.

In relationships, the Choleric brings tremendous assets. They are decisive when decisions need to be made, strong when strength is required, confident when others waver. They often provide stability and direction, creating a sense of security for their partners. Their loyalty, once given, is fierce. Their commitment to goals means they will work harder than most to build a successful marriage because failure is simply not an option they can accept.

The marriage preparation journey requires Cholerics to confront a profound truth: covenant love is not about winning. The leadership model Scripture presents for marriage—particularly for husbands—is not that of a commander demanding obedience but of Christ giving Himself up for the church. This is sacrificial leadership, servant leadership, leadership measured not by how many follow but by how much is given.

For the Choleric, this inversion is revolutionary. Their natural instinct is to lead from strength, to direct from authority, to achieve through force of will. But Christ leads through surrender. He conquers through sacrifice. He wins by giving everything away. The Choleric preparing for marriage must grapple with this paradox: true leadership in marriage looks like laying down your life, not demanding allegiance.

This does not mean abandoning strength—Christ was not weak. It means redirecting strength toward service. The same energy that drives the Choleric to achieve must be channeled toward cherishing. The same determination that conquers obstacles must be applied to understanding their partner's heart. The same confidence that leads must learn to submit to another's needs.`,
      es: `El temperamento Colérico arde con el fuego del propósito. Estas son las almas que parecen nacidas para liderar, lograr, impulsar hacia las metas con determinación implacable. Donde otros ven obstáculos, los Coléricos ven desafíos para conquistar. Donde otros vacilan, ellos actúan. Su energía es cinética, su visión clara, su voluntad formidable. El llamado de las Escrituras a trabajar con todo el corazón resuena profundamente con la naturaleza Colérica—no pueden imaginar dar menos que todo.

En su mejor momento, los Coléricos son las fuerzas impulsoras que mueven montañas, construyen imperios y hacen realidad cosas que otros solo sueñan. Poseen un don raro: la capacidad de ver lo que necesita hacerse y la fuerza de voluntad para hacerlo. En un mundo lleno de habladores, son hacedores. En un mar de indecisión, son anclas de certeza. Su confianza no es mera bravuconería sino la expresión natural de almas que han aprendido a confiar en su propio juicio y habilidades.

El modelo bíblico de liderazgo encuentra expresión poderosa en el temperamento Colérico. Cuando Cristo llamó a los discípulos a seguirlo, cuando Pablo impulsó movimientos misioneros a través de continentes, cuando Nehemías reconstruyó muros contra toda oposición—estas no fueron acciones de observadores pasivos sino de líderes determinados que conocían su propósito y lo persiguieron implacablemente. El Colérico lleva esta misma capacidad de santa ambición.

Sin embargo, las Escrituras acompañan el mandamiento de trabajar con todo el corazón con el recordatorio de que nuestra audiencia última es el Señor mismo. Esto es crucial para el Colérico, cuyo impulso puede fácilmente volverse egoísta, cuyo liderazgo puede degenerar en control, cuya fuerza puede convertirse en un arma en lugar de una herramienta de servicio. El mismo versículo que valida su intensidad también la redirige—no hacia la gloria personal sino hacia el propósito divino.

En las relaciones, el Colérico trae tremendos activos. Son decisivos cuando las decisiones necesitan tomarse, fuertes cuando se requiere fuerza, seguros cuando otros vacilan. A menudo proporcionan estabilidad y dirección, creando una sensación de seguridad para sus parejas. Su lealtad, una vez dada, es feroz. Su compromiso con las metas significa que trabajarán más duro que la mayoría para construir un matrimonio exitoso porque el fracaso simplemente no es una opción que puedan aceptar.

El viaje de preparación para el matrimonio requiere que los Coléricos confronten una verdad profunda: el amor de pacto no se trata de ganar. El modelo de liderazgo que las Escrituras presentan para el matrimonio—particularmente para los esposos—no es el de un comandante exigiendo obediencia sino el de Cristo entregándose a sí mismo por la iglesia. Este es liderazgo sacrificial, liderazgo de siervo, liderazgo medido no por cuántos siguen sino por cuánto se da.

Para el Colérico, esta inversión es revolucionaria. Su instinto natural es liderar desde la fuerza, dirigir desde la autoridad, lograr a través de la fuerza de voluntad. Pero Cristo lidera a través de la rendición. Conquista a través del sacrificio. Gana dándolo todo. El Colérico preparándose para el matrimonio debe lidiar con esta paradoja: el verdadero liderazgo en el matrimonio parece entregar tu vida, no exigir lealtad.

Esto no significa abandonar la fuerza—Cristo no era débil. Significa redirigir la fuerza hacia el servicio. La misma energía que impulsa al Colérico a lograr debe canalizarse hacia apreciar. La misma determinación que conquista obstáculos debe aplicarse a entender el corazón de su pareja. La misma confianza que lidera debe aprender a someterse a las necesidades de otro.`
    },
    realityCheck: {
      en: `The Choleric's shadow side can be devastating in marriage. Let us name it clearly: your strength can become a weapon. Your decisiveness can become domination. Your drive can become dismissal of everything and everyone who stands in your way—including your spouse.

You are used to being right. Often, you are right. Your ability to assess situations quickly and act decisively serves you well in many contexts. But marriage is not a battlefield to be won, and your spouse is not an obstacle to be overcome. When you approach your relationship with the same tactics you use to conquer challenges, you may win arguments but lose intimacy.

The Choleric's impatience is particularly dangerous in relationships. You want results now. You want problems solved efficiently. You have little tolerance for process, for emotional complexity, for the slow, circuitous route that relationships often require. But your spouse is not a problem to be solved—they are a person to be known. And knowing another human being cannot be rushed or optimized.

Your anger is another liability. Cholerics feel their frustration intensely and often express it forcefully. In your mind, you are simply being direct. To your partner, your anger may feel like an assault. Your words, sharp as knives, can wound in ways you don't intend. And once spoken, words cannot be retrieved. The Choleric must learn that being right does not justify being cruel.

Control is perhaps your deepest temptation. You want things done your way because you genuinely believe your way is best. Often, it is—in matters of efficiency, strategy, and results. But marriage requires something you may find deeply uncomfortable: surrender. You cannot control your spouse. You cannot optimize your way to intimacy. You must learn to release your grip and trust another person—and ultimately trust God—with outcomes you cannot guarantee.

Your relationship with vulnerability is complicated. Cholerics often interpret emotional expression as weakness, both in themselves and others. You may have learned early to suppress your own pain, fear, and doubt in favor of projecting strength. But this armor that protects you in battle prevents connection in intimacy. Your spouse needs to see your weakness. Your marriage requires your tears.

Finally, your ambition, while admirable, can make your marriage an afterthought. You are driven to achieve, and achievement requires time, energy, and focus. Your spouse may find themselves competing with your goals for your attention—and losing. The Choleric must decide: Will your marriage be another goal to conquer and then maintain on autopilot, or will it be your primary calling, worthy of your best energy?`,
      es: `El lado oscuro del Colérico puede ser devastador en el matrimonio. Nombremoslo claramente: tu fuerza puede convertirse en un arma. Tu capacidad de decisión puede convertirse en dominación. Tu impulso puede convertirse en desprecio por todo y todos los que se interpongan en tu camino—incluyendo tu cónyuge.

Estás acostumbrado a tener razón. A menudo, tienes razón. Tu capacidad de evaluar situaciones rápidamente y actuar decisivamente te sirve bien en muchos contextos. Pero el matrimonio no es un campo de batalla para ganar, y tu cónyuge no es un obstáculo para superar. Cuando abordas tu relación con las mismas tácticas que usas para conquistar desafíos, puedes ganar discusiones pero perder intimidad.

La impaciencia del Colérico es particularmente peligrosa en las relaciones. Quieres resultados ahora. Quieres problemas resueltos eficientemente. Tienes poca tolerancia para el proceso, para la complejidad emocional, para la ruta lenta y sinuosa que las relaciones a menudo requieren. Pero tu cónyuge no es un problema para resolver—es una persona para conocer. Y conocer a otro ser humano no puede apresurarse ni optimizarse.

Tu ira es otra responsabilidad. Los Coléricos sienten su frustración intensamente y a menudo la expresan con fuerza. En tu mente, simplemente estás siendo directo. Para tu pareja, tu ira puede sentirse como un asalto. Tus palabras, afiladas como cuchillos, pueden herir de maneras que no pretendes. Y una vez dichas, las palabras no pueden recuperarse. El Colérico debe aprender que tener razón no justifica ser cruel.

El control es quizás tu tentación más profunda. Quieres las cosas hechas a tu manera porque genuinamente crees que tu manera es la mejor. A menudo, lo es—en asuntos de eficiencia, estrategia y resultados. Pero el matrimonio requiere algo que puedes encontrar profundamente incómodo: rendición. No puedes controlar a tu cónyuge. No puedes optimizar tu camino hacia la intimidad. Debes aprender a soltar tu agarre y confiar en otra persona—y ultimadamente confiar en Dios—con resultados que no puedes garantizar.

Tu relación con la vulnerabilidad es complicada. Los Coléricos a menudo interpretan la expresión emocional como debilidad, tanto en ellos mismos como en otros. Puede que hayas aprendido temprano a suprimir tu propio dolor, miedo y duda en favor de proyectar fuerza. Pero esta armadura que te protege en batalla previene la conexión en la intimidad. Tu cónyuge necesita ver tu debilidad. Tu matrimonio requiere tus lágrimas.

Finalmente, tu ambición, aunque admirable, puede hacer de tu matrimonio una ocurrencia tardía. Estás impulsado a lograr, y el logro requiere tiempo, energía y enfoque. Tu cónyuge puede encontrarse compitiendo con tus metas por tu atención—y perdiendo. El Colérico debe decidir: ¿Será tu matrimonio otra meta para conquistar y luego mantener en piloto automático, o será tu llamado principal, digno de tu mejor energía?`
    },
    practicalImplications: {
      en: `For the Choleric preparing for marriage, practical growth means learning to channel your strength toward service. Here are concrete areas requiring attention:

**Practice Active Listening Without Problem-Solving**: When your partner shares a struggle, resist the immediate urge to fix it. Ask instead: "Do you want me to help solve this or just listen?" Often, your presence matters more than your solutions. Learn to sit with problems without conquering them.

**Develop Emotional Vocabulary**: Cholerics often default to anger when experiencing other emotions—sadness, fear, disappointment, hurt. Begin naming your emotions more precisely. Practice expressing vulnerability to your partner: "I feel scared" or "That hurt me" rather than covering these feelings with anger or action.

**Create Space for Your Partner's Pace**: Not everyone processes as quickly as you do, and that doesn't make them wrong. Practice patience when your partner needs time to think, feel, or decide. Your efficiency is a gift, but so is their thoughtfulness.

**Establish Anger Management Protocols**: Before marriage, identify your anger triggers and develop healthy responses. Consider what it will take for you to pause before responding, to leave the room if needed, to never say things in anger that you'll regret. Your words have power—learn to wield them carefully.

**Schedule Relationship Priority Time**: Your goals will always expand to fill available time. Proactively schedule dedicated time with your partner that is not about tasks, projects, or decisions. Learn to simply be together without agenda.

**Practice Asking Rather Than Telling**: Notice how often you make statements versus ask questions. Practice genuine curiosity about your partner's thoughts, feelings, and perspectives. Their input is not an obstacle to your efficiency—it is the point of partnership.

**Develop Servant Leadership**: Study Christ's model of leadership in Scripture. How does He lead through service? How does He demonstrate strength through gentleness? Practice leading your relationship by asking "What do you need?" rather than "Here's what we're doing."

**Learn to Lose**: Find situations where you can practice not getting your way. Let your partner choose the restaurant, the movie, the weekend plans—and fully embrace their choice without resentment or commentary. Your marriage will require countless small surrenders; start practicing now.`,
      es: `Para el Colérico preparándose para el matrimonio, el crecimiento práctico significa aprender a canalizar tu fuerza hacia el servicio. Aquí hay áreas concretas que requieren atención:

**Practica la Escucha Activa Sin Resolver Problemas**: Cuando tu pareja comparte una lucha, resiste el impulso inmediato de arreglarla. Pregunta en cambio: "¿Quieres que te ayude a resolver esto o solo que escuche?" A menudo, tu presencia importa más que tus soluciones. Aprende a sentarte con los problemas sin conquistarlos.

**Desarrolla Vocabulario Emocional**: Los Coléricos a menudo recurren a la ira cuando experimentan otras emociones—tristeza, miedo, decepción, dolor. Comienza a nombrar tus emociones más precisamente. Practica expresar vulnerabilidad a tu pareja: "Me siento asustado" o "Eso me dolió" en lugar de cubrir estos sentimientos con ira o acción.

**Crea Espacio para el Ritmo de Tu Pareja**: No todos procesan tan rápidamente como tú, y eso no los hace equivocados. Practica paciencia cuando tu pareja necesite tiempo para pensar, sentir o decidir. Tu eficiencia es un don, pero también lo es su reflexión.

**Establece Protocolos de Manejo de la Ira**: Antes del matrimonio, identifica tus detonantes de ira y desarrolla respuestas saludables. Considera qué se necesitará para que hagas una pausa antes de responder, para salir de la habitación si es necesario, para nunca decir cosas en la ira que lamentarás. Tus palabras tienen poder—aprende a usarlas cuidadosamente.

**Programa Tiempo de Prioridad para la Relación**: Tus metas siempre se expandirán para llenar el tiempo disponible. Programa proactivamente tiempo dedicado con tu pareja que no sea sobre tareas, proyectos o decisiones. Aprende a simplemente estar juntos sin agenda.

**Practica Preguntar en Lugar de Decir**: Nota cuán a menudo haces declaraciones versus preguntas. Practica curiosidad genuina sobre los pensamientos, sentimientos y perspectivas de tu pareja. Su aporte no es un obstáculo para tu eficiencia—es el punto de la asociación.

**Desarrolla Liderazgo de Siervo**: Estudia el modelo de liderazgo de Cristo en las Escrituras. ¿Cómo lidera a través del servicio? ¿Cómo demuestra fuerza a través de la gentileza? Practica liderar tu relación preguntando "¿Qué necesitas?" en lugar de "Esto es lo que vamos a hacer."

**Aprende a Perder**: Encuentra situaciones donde puedas practicar no salirte con la tuya. Deja que tu pareja elija el restaurante, la película, los planes del fin de semana—y abraza completamente su elección sin resentimiento o comentarios. Tu matrimonio requerirá incontables pequeñas rendiciones; comienza a practicar ahora.`
    },
    closingCharge: {
      en: `Dear Commander, you were made for great things. Your drive, your vision, your determination—these are not accidents of personality but divine appointments. God placed within you the capacity to move mountains, and mountains will indeed move at your command.

But the greatest conquest that awaits you is not external. It is the conquest of your own will in service of love.

Christ, the ultimate Commander, led the greatest campaign in history—not through force but through surrender. Not through domination but through sacrifice. Not through demanding followers but through laying down His life. This is the leadership you are called to embody in marriage: strength made perfect in service, authority expressed through love, victory achieved through giving everything away.

Your spouse does not need another boss. They need a partner who will fight for them rather than against them. They need someone who will harness all that fierce energy not to conquer them but to champion them. They need your strength deployed in their defense, your determination focused on their flourishing, your loyalty pledged to their good above your own.

This will require something of you that may feel like death: the death of your need to be right, to be in control, to win. But Scripture promises that in dying to self, we find true life. The Commander who surrenders to love does not become weak—they become truly strong, strong enough to bear another's burdens, strong enough to stay when staying is hard, strong enough to ask forgiveness and truly mean it.

You have achieved much. You will achieve more. But let your marriage be your masterpiece—not a trophy to be won but a garden to be tended, a person to be cherished, a covenant to be honored with every fiber of your formidable will.

Lead by loving. Command by serving. Win by giving yourself away.

This is your noble calling, Commander. Rise to meet it.`,
      es: `Querido Comandante, fuiste hecho para grandes cosas. Tu impulso, tu visión, tu determinación—estos no son accidentes de personalidad sino citas divinas. Dios colocó dentro de ti la capacidad de mover montañas, y las montañas de hecho se moverán a tu orden.

Pero la mayor conquista que te espera no es externa. Es la conquista de tu propia voluntad en servicio del amor.

Cristo, el Comandante supremo, lideró la mayor campaña de la historia—no a través de la fuerza sino a través de la rendición. No a través de la dominación sino a través del sacrificio. No a través de exigir seguidores sino a través de entregar Su vida. Este es el liderazgo que estás llamado a encarnar en el matrimonio: fuerza perfeccionada en el servicio, autoridad expresada a través del amor, victoria lograda al darlo todo.

Tu cónyuge no necesita otro jefe. Necesitan un compañero que luche por ellos en lugar de contra ellos. Necesitan a alguien que canalice toda esa energía feroz no para conquistarlos sino para defenderlos. Necesitan tu fuerza desplegada en su defensa, tu determinación enfocada en su florecimiento, tu lealtad prometida a su bien por encima del tuyo.

Esto requerirá algo de ti que puede sentirse como muerte: la muerte de tu necesidad de tener razón, de estar en control, de ganar. Pero las Escrituras prometen que al morir a nosotros mismos, encontramos la verdadera vida. El Comandante que se rinde al amor no se vuelve débil—se vuelve verdaderamente fuerte, lo suficientemente fuerte para cargar las cargas de otro, lo suficientemente fuerte para quedarse cuando quedarse es difícil, lo suficientemente fuerte para pedir perdón y realmente querer decirlo.

Has logrado mucho. Lograrás más. Pero deja que tu matrimonio sea tu obra maestra—no un trofeo para ganar sino un jardín para cultivar, una persona para apreciar, un pacto para honrar con cada fibra de tu formidable voluntad.

Lidera amando. Comanda sirviendo. Gana entregándote.

Este es tu noble llamado, Comandante. Elévate para cumplirlo.`
    },
    reflectionQuestions: [
      { en: "When was the last time you lost an argument with your partner and genuinely accepted their perspective? How did it feel?", es: "¿Cuándo fue la última vez que perdiste una discusión con tu pareja y genuinamente aceptaste su perspectiva? ¿Cómo se sintió?" },
      { en: "How do you typically express anger? How does your partner experience your anger? Have you asked them?", es: "¿Cómo expresas típicamente la ira? ¿Cómo experimenta tu pareja tu ira? ¿Les has preguntado?" },
      { en: "What would it look like for you to lead your relationship through service rather than direction?", es: "¿Cómo se vería para ti liderar tu relación a través del servicio en lugar de la dirección?" },
      { en: "When did you last cry in front of your partner? What prevents you from showing vulnerability?", es: "¿Cuándo lloraste por última vez frente a tu pareja? ¿Qué te impide mostrar vulnerabilidad?" },
      { en: "How much of your identity is tied to achievement and control? What would remain if those were stripped away?", es: "¿Cuánto de tu identidad está atada al logro y el control? ¿Qué quedaría si esos fueran eliminados?" },
      { en: "Does your partner feel like your teammate or your project? How would they answer this question?", es: "¿Tu pareja se siente como tu compañero de equipo o tu proyecto? ¿Cómo responderían ellos esta pregunta?" },
      { en: "What fears lie beneath your need for control? What would happen if you surrendered those fears to God?", es: "¿Qué miedos yacen debajo de tu necesidad de control? ¿Qué pasaría si rindieras esos miedos a Dios?" }
    ],
    practiceBox: [
      { en: "This week, let your partner make three decisions without offering your opinion or preference. Fully support their choices.", es: "Esta semana, deja que tu pareja tome tres decisiones sin ofrecer tu opinión o preferencia. Apoya completamente sus elecciones." },
      { en: "Practice the 24-hour rule: when frustrated or angry, wait 24 hours before addressing the issue. Notice what changes with time.", es: "Practica la regla de las 24 horas: cuando estés frustrado o enojado, espera 24 horas antes de abordar el tema. Nota qué cambia con el tiempo." },
      { en: "Share one fear or insecurity with your partner this week. Allow them to comfort you without fixing.", es: "Comparte un miedo o inseguridad con tu pareja esta semana. Permíteles consolarte sin arreglar." },
      { en: "Ask your partner daily: 'What do you need from me today?' and follow through without adding your own agenda.", es: "Pregunta a tu pareja diariamente: '¿Qué necesitas de mí hoy?' y cumple sin agregar tu propia agenda." }
    ]
  },
  {
    id: 3,
    temperament: 'melancholic',
    color: 'Blue',
    role: { en: 'The Thinker', es: 'El Pensador' },
    title: { en: 'Melancholic: The Thinker', es: 'Melancólico: El Pensador' },
    scriptureAnchor: {
      en: '"Search me, God, and know my heart; test me and know my anxious thoughts." — Psalm 139:23\n\n"Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable—if anything is excellent or praiseworthy—think about such things." — Philippians 4:8',
      es: '"Examíname, oh Dios, y conoce mi corazón; pruébame y conoce mis pensamientos ansiosos." — Salmo 139:23\n\n"Por lo demás, hermanos, todo lo que es verdadero, todo lo honesto, todo lo justo, todo lo puro, todo lo amable, todo lo que es de buen nombre; si hay virtud alguna, si algo digno de alabanza, en esto pensad." — Filipenses 4:8'
    },
    exposition: {
      en: `The Melancholic temperament dwells in the deep places of human experience. These are the souls who cannot help but search beneath surfaces, who find shallow living intolerable, who seek meaning and purpose in everything they encounter. Their inner world is rich, complex, and often turbulent—a landscape of profound feeling, careful analysis, and relentless pursuit of understanding. Scripture's invitation to be searched and known by God resonates with the Melancholic's deepest longing: to be truly understood.

At their core, Melancholics are seekers of truth and beauty. They are drawn to excellence, to perfection, to the ideal. Where others see a sunset, the Melancholic sees a revelation. Where others hear music, they hear the voice of the divine. Their sensitivity to beauty is matched by their sensitivity to suffering—both their own and the world's. They carry a weight that others often cannot see, a deep awareness of brokenness and a longing for restoration.

This temperament produces artists, philosophers, poets, and prophets. The biblical writers who penned the Psalms—those raw, honest prayers of anguish and ecstasy—were surely Melancholics. Their willingness to sit with suffering, to articulate pain, to grapple with doubt while clinging to faith—this is the Melancholic gift to humanity. They give words to experiences others feel but cannot express.

In relationships, the Melancholic brings rare gifts. They are capable of profound intimacy because they crave profound intimacy. Their loyalty, once established, runs soul-deep. They do not give their hearts easily, but when they do, they give completely. Their attention to detail means they notice things others miss—the slight change in their partner's tone, the unspoken need, the hidden hurt. They remember anniversaries not because they're supposed to but because dates carry meaning.

Yet the very depth that makes Melancholics capable of such intimacy can also become a prison. Their analytical minds, always searching and evaluating, can turn critical—of themselves and others. Their high standards, while producing excellence, can produce paralysis when perfection proves impossible. Their sensitivity to pain makes them vulnerable to depression, anxiety, and a pessimism that sees every silver lining as harboring another cloud.

Scripture offers the Melancholic both validation and redirection. The call to think on whatever is true, noble, right, pure, lovely, and admirable is not a command to ignore reality but to choose what reality will dominate their thoughts. The Melancholic's mind will think deeply about something—the question is whether they will discipline that depth toward hope or allow it to spiral toward despair.

Marriage preparation for the Melancholic involves learning to balance their penetrating insight with grace. They must learn that their partner will never be perfect—and that this imperfection is not a betrayal but an invitation to love more deeply. They must learn that their own imperfection does not disqualify them from being loved. And they must learn that the ideal relationship they envision in their minds will never fully materialize—and that the real, flawed, beautiful relationship they build can be even better.`,
      es: `El temperamento Melancólico habita en los lugares profundos de la experiencia humana. Estas son las almas que no pueden evitar buscar debajo de las superficies, que encuentran intolerable la vida superficial, que buscan significado y propósito en todo lo que encuentran. Su mundo interior es rico, complejo y a menudo turbulento—un paisaje de sentimientos profundos, análisis cuidadoso y búsqueda implacable de comprensión. La invitación de las Escrituras a ser examinados y conocidos por Dios resuena con el anhelo más profundo del Melancólico: ser verdaderamente comprendido.

En su núcleo, los Melancólicos son buscadores de verdad y belleza. Son atraídos a la excelencia, a la perfección, al ideal. Donde otros ven una puesta de sol, el Melancólico ve una revelación. Donde otros escuchan música, ellos escuchan la voz de lo divino. Su sensibilidad a la belleza es igualada por su sensibilidad al sufrimiento—tanto el propio como el del mundo. Llevan un peso que otros a menudo no pueden ver, una conciencia profunda del quebrantamiento y un anhelo de restauración.

Este temperamento produce artistas, filósofos, poetas y profetas. Los escritores bíblicos que escribieron los Salmos—esas oraciones crudas y honestas de angustia y éxtasis—seguramente eran Melancólicos. Su disposición a sentarse con el sufrimiento, a articular el dolor, a luchar con la duda mientras se aferran a la fe—este es el don Melancólico a la humanidad. Dan palabras a experiencias que otros sienten pero no pueden expresar.

En las relaciones, el Melancólico trae dones raros. Son capaces de intimidad profunda porque anhelan intimidad profunda. Su lealtad, una vez establecida, corre hasta el fondo del alma. No dan sus corazones fácilmente, pero cuando lo hacen, se dan completamente. Su atención al detalle significa que notan cosas que otros pierden—el ligero cambio en el tono de su pareja, la necesidad no expresada, el dolor oculto. Recuerdan los aniversarios no porque deban sino porque las fechas tienen significado.

Sin embargo, la misma profundidad que hace a los Melancólicos capaces de tal intimidad también puede convertirse en una prisión. Sus mentes analíticas, siempre buscando y evaluando, pueden volverse críticas—de sí mismos y de otros. Sus altos estándares, mientras producen excelencia, pueden producir parálisis cuando la perfección resulta imposible. Su sensibilidad al dolor los hace vulnerables a la depresión, la ansiedad y un pesimismo que ve cada lado positivo como albergando otra nube.

Las Escrituras ofrecen al Melancólico tanto validación como redirección. El llamado a pensar en todo lo que es verdadero, noble, justo, puro, amable y admirable no es un mandato de ignorar la realidad sino de elegir qué realidad dominará sus pensamientos. La mente del Melancólico pensará profundamente en algo—la pregunta es si disciplinará esa profundidad hacia la esperanza o permitirá que espiralee hacia la desesperación.

La preparación para el matrimonio para el Melancólico implica aprender a equilibrar su perspicacia penetrante con gracia. Deben aprender que su pareja nunca será perfecta—y que esta imperfección no es una traición sino una invitación a amar más profundamente. Deben aprender que su propia imperfección no los descalifica de ser amados. Y deben aprender que la relación ideal que visualizan en sus mentes nunca se materializará completamente—y que la relación real, imperfecta y hermosa que construyan puede ser aún mejor.`
    },
    realityCheck: {
      en: `The Melancholic's greatest enemy is often their own mind. Let us speak directly to this shadow: your capacity for deep thought can become a weapon you turn against yourself, your relationship, and your hope.

Your critical eye, so useful for detecting flaws and pursuing excellence, can destroy intimacy when turned constantly on your partner. You notice their failures, their inconsistencies, the ways they fall short of your ideal. And while your observations may be accurate, accuracy is not the same as love. Your partner needs to feel cherished, not evaluated. They need to be your beloved, not your project.

Equally destructive is the criticism you turn inward. Melancholics often hold themselves to impossible standards, then punish themselves relentlessly for falling short. This self-flagellation may feel like virtue—like high standards and appropriate humility—but it is actually a form of pride. You are insisting that you should be better than any human can be, then condemning yourself for being human. This pattern will exhaust you, isolate you, and ultimately damage your marriage.

Your pessimism, dressed up as realism, can become a self-fulfilling prophecy. When you expect disappointment, you often create it. When you assume the worst about your partner's motives, you may drive them toward the very behaviors you fear. Hope is not naivety—it is a choice, and it is a choice the Melancholic must learn to make deliberately, against the current of their natural inclination.

The Melancholic's withdrawal pattern poses another significant challenge. When hurt, overwhelmed, or disappointed, your instinct is to retreat into your inner world and process alone. While solitude can be healing, habitual withdrawal from your partner creates distance that erodes intimacy. Your spouse cannot read your mind. If you retreat without explanation, they are left to imagine the worst—and often they imagine that they are the problem, that your love is fading, that the relationship is failing.

Your need for perfection can make decision-making agonizing. Analysis paralysis is a real danger when you want to make the "right" choice and can see all the ways each option might fail. But in relationships, failure to decide is itself a decision—often a damaging one. Sometimes good enough is good enough, and waiting for perfect guarantees missing good.

Finally, your emotional intensity, while capable of beautiful depth, can overwhelm both you and your partner. Not every feeling needs to be explored to its roots. Not every disappointment signals deep incompatibility. Sometimes a problem is just a problem, not a symptom of something larger. Learning to respond proportionally to circumstances, rather than processing everything at maximum depth, will serve your marriage well.`,
      es: `El mayor enemigo del Melancólico a menudo es su propia mente. Hablemos directamente a esta sombra: tu capacidad de pensamiento profundo puede convertirse en un arma que vuelves contra ti mismo, tu relación y tu esperanza.

Tu ojo crítico, tan útil para detectar defectos y perseguir la excelencia, puede destruir la intimidad cuando se vuelve constantemente hacia tu pareja. Notas sus fracasos, sus inconsistencias, las formas en que no alcanzan tu ideal. Y aunque tus observaciones pueden ser precisas, la precisión no es lo mismo que el amor. Tu pareja necesita sentirse apreciada, no evaluada. Necesitan ser tu amado, no tu proyecto.

Igualmente destructiva es la crítica que vuelves hacia adentro. Los Melancólicos a menudo se mantienen a estándares imposibles, luego se castigan implacablemente por quedarse cortos. Esta autoflagelación puede sentirse como virtud—como altos estándares y humildad apropiada—pero en realidad es una forma de orgullo. Estás insistiendo en que deberías ser mejor de lo que cualquier humano puede ser, luego condenándote por ser humano. Este patrón te agotará, te aislará y ultimadamente dañará tu matrimonio.

Tu pesimismo, disfrazado de realismo, puede convertirse en una profecía autocumplida. Cuando esperas decepción, a menudo la creas. Cuando asumes lo peor sobre los motivos de tu pareja, puedes impulsarlos hacia los mismos comportamientos que temes. La esperanza no es ingenuidad—es una elección, y es una elección que el Melancólico debe aprender a hacer deliberadamente, contra la corriente de su inclinación natural.

El patrón de retirada del Melancólico plantea otro desafío significativo. Cuando estás herido, abrumado o decepcionado, tu instinto es retirarte a tu mundo interior y procesar solo. Aunque la soledad puede ser sanadora, la retirada habitual de tu pareja crea distancia que erosiona la intimidad. Tu cónyuge no puede leer tu mente. Si te retiras sin explicación, quedan imaginando lo peor—y a menudo imaginan que ellos son el problema, que tu amor se está desvaneciendo, que la relación está fallando.

Tu necesidad de perfección puede hacer que la toma de decisiones sea agonizante. La parálisis del análisis es un peligro real cuando quieres tomar la decisión "correcta" y puedes ver todas las formas en que cada opción podría fallar. Pero en las relaciones, el fracaso de decidir es en sí mismo una decisión—a menudo dañina. A veces lo suficientemente bueno es suficientemente bueno, y esperar lo perfecto garantiza perder lo bueno.

Finalmente, tu intensidad emocional, aunque capaz de una hermosa profundidad, puede abrumarte tanto a ti como a tu pareja. No todos los sentimientos necesitan ser explorados hasta sus raíces. No toda decepción señala una profunda incompatibilidad. A veces un problema es solo un problema, no un síntoma de algo más grande. Aprender a responder proporcionalmente a las circunstancias, en lugar de procesar todo a máxima profundidad, servirá bien a tu matrimonio.`
    },
    practicalImplications: {
      en: `For the Melancholic preparing for marriage, practical growth means learning to balance depth with grace. Here are concrete areas requiring attention:

**Practice Gratitude Intentionally**: Your mind naturally gravitates toward what's wrong. Counteract this by keeping a daily gratitude journal specifically about your partner and your relationship. Notice and record what is good, true, and lovely—not to deny problems but to balance your perspective.

**Establish Communication Before Withdrawal**: Make an agreement with your partner that before you retreat to process, you will briefly communicate that you need space and approximately when you'll be ready to reconnect. This simple practice prevents your partner from interpreting withdrawal as rejection.

**Set Decision Deadlines**: When facing decisions, give yourself a clear deadline. Gather information, consider options, then decide—even if the choice isn't perfect. Practice accepting "good enough" decisions without endless second-guessing.

**Share Your Inner World**: Your rich inner life is a gift, but only if you share it. Practice articulating your thoughts and feelings to your partner, even (especially) when they feel too complex or too vulnerable to express. Your depth can become intimacy when shared.

**Develop Proportional Response**: Not everything requires a deep dive. Practice asking: "Does this situation warrant my full analytical treatment, or is this a minor issue I can let go?" Save your depth for what truly matters.

**Cultivate Self-Compassion**: Begin treating yourself with the same grace you'd extend to a beloved friend. When you fail, practice speaking to yourself kindly rather than critically. Your mental health—and your marriage—depends on breaking the self-condemnation cycle.

**Schedule Joy**: Melancholics can become so focused on meaning and improvement that they forget to simply enjoy life. Intentionally plan activities that bring you joy, and practice being present in pleasant moments rather than analyzing them.

**Seek Professional Support**: If depression, anxiety, or obsessive thinking patterns significantly impact your functioning, consider counseling or therapy. These are not signs of weakness but wisdom—recognizing when you need help and pursuing it.`,
      es: `Para el Melancólico preparándose para el matrimonio, el crecimiento práctico significa aprender a equilibrar la profundidad con la gracia. Aquí hay áreas concretas que requieren atención:

**Practica la Gratitud Intencionalmente**: Tu mente naturalmente gravita hacia lo que está mal. Contrarresta esto manteniendo un diario de gratitud diario específicamente sobre tu pareja y tu relación. Nota y registra lo que es bueno, verdadero y amable—no para negar problemas sino para equilibrar tu perspectiva.

**Establece Comunicación Antes de Retirarte**: Haz un acuerdo con tu pareja de que antes de retirarte para procesar, comunicarás brevemente que necesitas espacio y aproximadamente cuándo estarás listo para reconectar. Esta práctica simple previene que tu pareja interprete la retirada como rechazo.

**Establece Plazos para Decisiones**: Cuando enfrentes decisiones, date un plazo claro. Recopila información, considera opciones, luego decide—incluso si la elección no es perfecta. Practica aceptar decisiones "suficientemente buenas" sin interminables segundas opiniones.

**Comparte Tu Mundo Interior**: Tu rica vida interior es un don, pero solo si la compartes. Practica articular tus pensamientos y sentimientos a tu pareja, incluso (especialmente) cuando se sientan demasiado complejos o demasiado vulnerables para expresar. Tu profundidad puede convertirse en intimidad cuando se comparte.

**Desarrolla Respuesta Proporcional**: No todo requiere una inmersión profunda. Practica preguntar: "¿Esta situación justifica mi tratamiento analítico completo, o es un problema menor que puedo dejar ir?" Guarda tu profundidad para lo que verdaderamente importa.

**Cultiva la Autocompasión**: Comienza a tratarte con la misma gracia que extenderías a un amigo querido. Cuando falles, practica hablarte amablemente en lugar de críticamente. Tu salud mental—y tu matrimonio—depende de romper el ciclo de autocondenación.

**Programa la Alegría**: Los Melancólicos pueden enfocarse tanto en el significado y la mejora que olvidan simplemente disfrutar la vida. Planifica intencionalmente actividades que te traigan alegría, y practica estar presente en momentos placenteros en lugar de analizarlos.

**Busca Apoyo Profesional**: Si la depresión, la ansiedad o los patrones de pensamiento obsesivo impactan significativamente tu funcionamiento, considera consejería o terapia. Estos no son signos de debilidad sino de sabiduría—reconocer cuando necesitas ayuda y buscarla.`
    },
    closingCharge: {
      en: `Dear Thinker, you carry a rare and precious gift. Your depth, your sensitivity, your relentless pursuit of meaning—these are not burdens to bear but treasures to steward. In a world content with surfaces, you dive deep. In a culture of distraction, you seek understanding. In an age of superficiality, you insist that things matter.

But your gift needs grace to flourish. Without grace, your depth becomes a pit. Without grace, your sensitivity becomes a wound that never heals. Without grace, your standards become a prison for yourself and everyone you love.

The God who searches hearts and knows anxious thoughts does not stand in judgment of your complexity. He meets you in the depths. He is not repelled by your darkness but walks through it with you. He does not demand that you be simpler, happier, or less than you are. He knows you fully—and loves you completely.

This is the truth you must carry into marriage: you will never achieve the perfect relationship your mind can envision. And that is not failure—it is freedom. The real, flawed, struggling, beautiful relationship you build with another imperfect person can be filled with more joy than your idealized version ever could, because it will be real. It will be grace-given. It will be yours.

Your spouse will disappoint you. They will fail to understand your depths. They will sometimes wound you with their limitations. And you will do the same to them. This is not evidence that your love is deficient—it is evidence that you are human, walking together toward wholeness that will only be complete in eternity.

Choose hope, dear Thinker. Not naive hope that ignores reality, but stubborn hope that insists love is worth the risk. Choose grace—for your partner and for yourself. Choose to dwell on what is true, noble, right, pure, lovely, and admirable, even when your mind wants to catalog every failure.

Your sensitivity is a gift. Your depth is needed. Your capacity for profound love is exactly what covenant requires. But let that capacity be tempered with mercy, aimed at growth rather than perfection, and anchored in a God who knows your anxious thoughts and loves you still.

Rise to the covenant, Thinker. Your depths are wanted. Your whole self is welcome.`,
      es: `Querido Pensador, llevas un don raro y precioso. Tu profundidad, tu sensibilidad, tu búsqueda implacable de significado—estos no son cargas para soportar sino tesoros para administrar. En un mundo satisfecho con las superficies, tú te sumerges profundo. En una cultura de distracción, tú buscas entendimiento. En una era de superficialidad, tú insistes en que las cosas importan.

Pero tu don necesita gracia para florecer. Sin gracia, tu profundidad se convierte en un pozo. Sin gracia, tu sensibilidad se convierte en una herida que nunca sana. Sin gracia, tus estándares se convierten en una prisión para ti mismo y todos los que amas.

El Dios que escudriña los corazones y conoce los pensamientos ansiosos no se para en juicio de tu complejidad. Él te encuentra en las profundidades. No es repelido por tu oscuridad sino que camina a través de ella contigo. No exige que seas más simple, más feliz, o menos de lo que eres. Te conoce completamente—y te ama completamente.

Esta es la verdad que debes llevar al matrimonio: nunca lograrás la relación perfecta que tu mente puede visualizar. Y eso no es fracaso—es libertad. La relación real, imperfecta, luchadora, hermosa que construyas con otra persona imperfecta puede estar llena de más alegría de lo que tu versión idealizada jamás podría, porque será real. Será dada por gracia. Será tuya.

Tu cónyuge te decepcionará. Fallarán en entender tus profundidades. A veces te herirán con sus limitaciones. Y tú harás lo mismo con ellos. Esto no es evidencia de que tu amor es deficiente—es evidencia de que eres humano, caminando juntos hacia la plenitud que solo será completa en la eternidad.

Elige la esperanza, querido Pensador. No esperanza ingenua que ignora la realidad, sino esperanza obstinada que insiste en que el amor vale el riesgo. Elige la gracia—para tu pareja y para ti mismo. Elige habitar en lo que es verdadero, noble, justo, puro, amable y admirable, incluso cuando tu mente quiere catalogar cada fracaso.

Tu sensibilidad es un don. Tu profundidad es necesaria. Tu capacidad de amor profundo es exactamente lo que el pacto requiere. Pero deja que esa capacidad sea templada con misericordia, dirigida al crecimiento en lugar de la perfección, y anclada en un Dios que conoce tus pensamientos ansiosos y te ama aún así.

Elévate al pacto, Pensador. Tus profundidades son deseadas. Todo tu ser es bienvenido.`
    },
    reflectionQuestions: [
      { en: "How does your critical eye affect your partner? Have you asked them how it feels to be evaluated by you?", es: "¿Cómo afecta tu ojo crítico a tu pareja? ¿Les has preguntado cómo se siente ser evaluado por ti?" },
      { en: "What impossible standards do you hold yourself to? How do you respond when you fall short?", es: "¿Qué estándares imposibles te impones? ¿Cómo respondes cuando te quedas corto?" },
      { en: "When you withdraw to process, how does your partner experience your absence? What do they imagine?", es: "Cuando te retiras para procesar, ¿cómo experimenta tu pareja tu ausencia? ¿Qué imaginan?" },
      { en: "Can you identify times when your pessimism created the very outcomes you feared?", es: "¿Puedes identificar momentos en que tu pesimismo creó los mismos resultados que temías?" },
      { en: "What would it mean to accept a 'good enough' relationship rather than pursuing a perfect one?", es: "¿Qué significaría aceptar una relación 'suficientemente buena' en lugar de perseguir una perfecta?" },
      { en: "How might your partner's imperfections be invitations to deeper love rather than disappointments to endure?", es: "¿Cómo podrían las imperfecciones de tu pareja ser invitaciones a un amor más profundo en lugar de decepciones para soportar?" },
      { en: "What beautiful, true, and admirable things about your relationship do you tend to overlook while focusing on problems?", es: "¿Qué cosas hermosas, verdaderas y admirables de tu relación tiendes a pasar por alto mientras te enfocas en los problemas?" }
    ],
    practiceBox: [
      { en: "Write down three things you appreciate about your partner every day this week. Share one with them daily.", es: "Escribe tres cosas que aprecias de tu pareja cada día esta semana. Comparte una con ellos diariamente." },
      { en: "When you need to withdraw, practice saying: 'I need some time to process. I'll be ready to talk in [timeframe]. This isn't about you—I just need space.'", es: "Cuando necesites retirarte, practica decir: 'Necesito tiempo para procesar. Estaré listo para hablar en [tiempo]. Esto no es sobre ti—solo necesito espacio.'" },
      { en: "Make one decision this week without extensive analysis. Notice how it feels to choose without certainty.", es: "Toma una decisión esta semana sin análisis extenso. Nota cómo se siente elegir sin certeza." },
      { en: "When you catch yourself in self-criticism, pause and speak to yourself as you would to a beloved friend.", es: "Cuando te atrapes en autocrítica, pausa y háblate como lo harías con un amigo querido." }
    ]
  },
  {
    id: 4,
    temperament: 'phlegmatic',
    color: 'Green',
    role: { en: 'The Peacemaker', es: 'El Pacificador' },
    title: { en: 'Phlegmatic: The Peacemaker', es: 'Flemático: El Pacificador' },
    scriptureAnchor: {
      en: '"Blessed are the peacemakers, for they will be called children of God." — Matthew 5:9\n\n"Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves." — Philippians 2:3',
      es: '"Bienaventurados los pacificadores, porque ellos serán llamados hijos de Dios." — Mateo 5:9\n\n"No hagáis nada por contienda o por vanagloria; antes bien con humildad, estimando cada uno a los demás como superiores a él mismo." — Filipenses 2:3'
    },
    exposition: {
      en: `The Phlegmatic temperament moves through the world like a still, deep river—calm, steady, and far more powerful than its placid surface suggests. These are the souls who bring peace wherever they go, whose presence has a settling effect on chaos, whose patience seems inexhaustible. In a world of noise and hurry, the Phlegmatic offers something increasingly rare: the gift of calm. Scripture's blessing on peacemakers speaks directly to this temperament—they are doing God's work simply by being who they are.

At their core, Phlegmatics are stability itself. They are the friends who never waver, the partners you can count on, the presence that remains when everyone else has fled. Their consistency is not boring—it is a form of faithfulness, a daily declaration that some things do not change even when everything else does. In relationships prone to drama and volatility, the Phlegmatic serves as an anchor, a reminder that love can be quiet and still be strong.

The biblical call to humility finds natural expression in the Phlegmatic heart. They are genuinely content to serve behind the scenes, to support rather than lead, to elevate others without seeking recognition for themselves. This is not weakness masquerading as virtue—it is genuine other-centeredness, a rare and beautiful quality that mirrors Christ's own servant heart.

In relationships, the Phlegmatic brings invaluable gifts. They are excellent listeners who make others feel heard and valued. Their patience allows them to give second chances generously, to bear with others' weaknesses without resentment, to stay calm when their partner is falling apart. Their stability creates a safe harbor where their partner can be vulnerable without fear. Their gentle spirit soothes wounds rather than inflaming them.

The Phlegmatic's approach to conflict—which is essentially to avoid it—can be a gift in relationships prone to escalation. They de-escalate naturally, bringing down emotional temperatures through their calm presence. They rarely say things in anger that they'll regret because they rarely allow themselves to reach that point. Their measured responses give others space to calm down as well.

Yet this temperament carries shadows that must be acknowledged. The same peace-seeking nature that makes Phlegmatics wonderful companions can become a form of conflict-avoidance that allows problems to fester. Their patience can become passivity. Their calm can become emotional unavailability. Their humility can mask an inability to advocate for themselves and their needs.

Scripture's call to value others above ourselves assumes that we also value ourselves appropriately. The Phlegmatic must learn that their needs matter too, that voicing preferences is not selfish, that healthy relationships require both partners to show up fully—not just one partner constantly deferring to the other.

Marriage will require the Phlegmatic to find their voice. Not the loud, demanding voice of other temperaments, but their own voice—a voice that speaks truth gently, expresses needs clearly, and stands firm when standing is required. The peacemaker's role is not to keep peace at any cost but to make peace—an active, engaged process that sometimes requires confrontation in service of reconciliation.`,
      es: `El temperamento Flemático se mueve por el mundo como un río profundo y tranquilo—calmado, estable y mucho más poderoso de lo que sugiere su superficie plácida. Estas son las almas que traen paz a donde quiera que van, cuya presencia tiene un efecto calmante sobre el caos, cuya paciencia parece inagotable. En un mundo de ruido y prisa, el Flemático ofrece algo cada vez más raro: el don de la calma. La bendición de las Escrituras sobre los pacificadores habla directamente a este temperamento—están haciendo la obra de Dios simplemente siendo quienes son.

En su núcleo, los Flemáticos son la estabilidad misma. Son los amigos que nunca vacilan, las parejas con las que puedes contar, la presencia que permanece cuando todos los demás han huido. Su consistencia no es aburrida—es una forma de fidelidad, una declaración diaria de que algunas cosas no cambian incluso cuando todo lo demás cambia. En relaciones propensas al drama y la volatilidad, el Flemático sirve como un ancla, un recordatorio de que el amor puede ser tranquilo y aún así ser fuerte.

El llamado bíblico a la humildad encuentra expresión natural en el corazón Flemático. Están genuinamente contentos de servir tras bastidores, de apoyar en lugar de liderar, de elevar a otros sin buscar reconocimiento para sí mismos. Esto no es debilidad disfrazada de virtud—es genuina orientación hacia el otro, una cualidad rara y hermosa que refleja el propio corazón de siervo de Cristo.

En las relaciones, el Flemático trae dones invaluables. Son excelentes oyentes que hacen que otros se sientan escuchados y valorados. Su paciencia les permite dar segundas oportunidades generosamente, soportar las debilidades de otros sin resentimiento, mantenerse calmados cuando su pareja se está derrumbando. Su estabilidad crea un puerto seguro donde su pareja puede ser vulnerable sin miedo. Su espíritu gentil calma las heridas en lugar de inflamarlas.

El enfoque del Flemático hacia el conflicto—que es esencialmente evitarlo—puede ser un don en relaciones propensas a la escalada. Desescalan naturalmente, bajando las temperaturas emocionales a través de su presencia calmada. Raramente dicen cosas en la ira que lamentarán porque raramente se permiten llegar a ese punto. Sus respuestas medidas dan a otros espacio para calmarse también.

Sin embargo, este temperamento lleva sombras que deben reconocerse. La misma naturaleza buscadora de paz que hace a los Flemáticos compañeros maravillosos puede convertirse en una forma de evitación de conflictos que permite que los problemas se pudran. Su paciencia puede convertirse en pasividad. Su calma puede convertirse en indisponibilidad emocional. Su humildad puede enmascarar una incapacidad de abogar por sí mismos y sus necesidades.

El llamado de las Escrituras a valorar a otros por encima de nosotros mismos asume que también nos valoramos apropiadamente. El Flemático debe aprender que sus necesidades también importan, que expresar preferencias no es egoísta, que las relaciones saludables requieren que ambos compañeros se presenten completamente—no solo un compañero cediendo constantemente ante el otro.

El matrimonio requerirá que el Flemático encuentre su voz. No la voz fuerte y exigente de otros temperamentos, sino su propia voz—una voz que habla la verdad gentilmente, expresa necesidades claramente, y se mantiene firme cuando se requiere firmeza. El rol del pacificador no es mantener la paz a cualquier costo sino hacer la paz—un proceso activo y comprometido que a veces requiere confrontación en servicio de la reconciliación.`
    },
    realityCheck: {
      en: `The Phlegmatic's greatest danger is disappearing. In your commitment to keeping peace and serving others, you can lose yourself so completely that you become invisible—even to yourself.

Let us speak plainly: your aversion to conflict is not always virtuous. Sometimes it is fear wearing the mask of peace. Sometimes it is avoidance disguised as patience. Sometimes it is selfishness dressed up as selflessness—because it is easier for you to swallow your needs than to do the hard work of expressing them.

Your partner cannot love someone they do not know. And if you never voice your preferences, your frustrations, your needs, your dreams—then your partner is loving an incomplete picture of you. They are making decisions for both of you without all the information. They may believe they know you when they only know the agreeable surface you show them.

The truth is, your "easygoing" nature can become a form of deception. When you say "I don't care" but you do care, you are not being peaceable—you are lying. When you agree to things you don't want because refusing feels too hard, you are building resentment brick by brick. When you absorb mistreatment without comment because you want to avoid conflict, you are not being patient—you are teaching your partner that mistreatment is acceptable.

Your passivity can be incredibly frustrating to partners who need you to show up, to have opinions, to engage actively in building your shared life. They may feel like they are in relationship with a ghost—a pleasant, agreeable ghost who never pushes back, never initiates, never brings their full self to the partnership. Your calm, which you imagine as a gift, may feel to them like emotional absence.

The Phlegmatic must confront an uncomfortable truth: peace at the expense of truth is not peace at all. It is a truce built on suppression, and truces eventually break. The conflicts you avoid do not disappear—they compound. The needs you swallow do not dissolve—they fester. The opinions you keep to yourself do not become less important—they become invisible even to you.

There is also the matter of your resistance to change. You are comfortable in your routines, your patterns, your familiar ways of doing things. But marriage requires constant adaptation—two people growing and changing together, adjusting to new circumstances, making room for each other's evolution. Your comfort with stasis can become a prison for both of you if you refuse to grow, adapt, and stretch beyond what feels safe.

Your marriage needs your voice, your preferences, your full engagement. Peace is not the absence of conflict—it is the presence of justice, truth, and reconciliation. And that kind of peace requires you to show up.`,
      es: `El mayor peligro del Flemático es desaparecer. En tu compromiso de mantener la paz y servir a otros, puedes perderte tan completamente que te vuelves invisible—incluso para ti mismo.

Hablemos claramente: tu aversión al conflicto no siempre es virtuosa. A veces es miedo usando la máscara de la paz. A veces es evitación disfrazada de paciencia. A veces es egoísmo disfrazado de desinterés—porque es más fácil para ti tragarte tus necesidades que hacer el trabajo duro de expresarlas.

Tu pareja no puede amar a alguien que no conoce. Y si nunca expresas tus preferencias, tus frustraciones, tus necesidades, tus sueños—entonces tu pareja está amando una imagen incompleta de ti. Están tomando decisiones por ambos sin toda la información. Pueden creer que te conocen cuando solo conocen la superficie agradable que les muestras.

La verdad es que tu naturaleza "tranquila" puede convertirse en una forma de engaño. Cuando dices "No me importa" pero sí te importa, no estás siendo pacífico—estás mintiendo. Cuando aceptas cosas que no quieres porque rechazar se siente muy difícil, estás construyendo resentimiento ladrillo a ladrillo. Cuando absorbes maltrato sin comentario porque quieres evitar el conflicto, no estás siendo paciente—estás enseñándole a tu pareja que el maltrato es aceptable.

Tu pasividad puede ser increíblemente frustrante para parejas que necesitan que te presentes, que tengas opiniones, que participes activamente en construir su vida compartida. Pueden sentir que están en una relación con un fantasma—un fantasma agradable y complaciente que nunca empuja, nunca inicia, nunca trae todo su ser a la asociación. Tu calma, que imaginas como un don, puede sentirse para ellos como ausencia emocional.

El Flemático debe confrontar una verdad incómoda: la paz a expensas de la verdad no es paz en absoluto. Es una tregua construida sobre la supresión, y las treguas eventualmente se rompen. Los conflictos que evitas no desaparecen—se acumulan. Las necesidades que tragas no se disuelven—se pudren. Las opiniones que guardas para ti mismo no se vuelven menos importantes—se vuelven invisibles incluso para ti.

También está el asunto de tu resistencia al cambio. Estás cómodo en tus rutinas, tus patrones, tus formas familiares de hacer las cosas. Pero el matrimonio requiere adaptación constante—dos personas creciendo y cambiando juntas, ajustándose a nuevas circunstancias, haciendo espacio para la evolución del otro. Tu comodidad con la estasis puede convertirse en una prisión para ambos si te niegas a crecer, adaptarte y estirarte más allá de lo que se siente seguro.

Tu matrimonio necesita tu voz, tus preferencias, tu compromiso completo. La paz no es la ausencia de conflicto—es la presencia de justicia, verdad y reconciliación. Y ese tipo de paz requiere que te presentes.`
    },
    practicalImplications: {
      en: `For the Phlegmatic preparing for marriage, practical growth means learning to engage actively while maintaining your gift of calm. Here are concrete areas requiring attention:

**Practice Having Opinions**: Start small. When asked where to eat, choose a place—don't say "I don't care." When asked your preference, express it, even if it's not strong. Your partner needs to know who you are, and that requires you to show them.

**Voice Needs Before They Become Resentments**: Learn to identify what you need and communicate it early. Don't wait until frustration builds; practice saying "I need..." or "It would mean a lot to me if..." before the need becomes urgent. Your needs are valid and deserve expression.

**Engage in Necessary Conflict**: Not all conflict is bad. Healthy relationships require the ability to address problems directly. Practice initiating difficult conversations when issues arise, rather than hoping they'll resolve themselves. The goal is not to fight but to resolve—and resolution requires engagement.

**Build Initiative Muscles**: Practice being the one who initiates—activities, conversations, plans, intimacy. Your partner should not always have to be the one driving the relationship forward. Set reminders if needed, but actively contribute to the direction of your relationship.

**Stretch Beyond Comfort Zones**: Identify areas where you've become stuck in comfortable patterns. Challenge yourself to try new things, adapt to changes, embrace growth. Your marriage will require flexibility; start practicing now.

**Develop Emotional Expression**: Your calm exterior can mask deep feelings that your partner needs to see. Practice identifying and expressing emotions, both positive and negative. Your partner deserves to know when they've hurt you, delighted you, or made you proud.

**Set Boundaries When Needed**: Being easy-going is not the same as being a doormat. Practice saying no when you need to, pushing back when you disagree, and standing firm on things that matter to you. Your boundaries protect you and the relationship.

**Show Up Fully**: In conversations, in decisions, in challenges—be fully present. Resist the urge to check out, go with the flow, or simply defer. Your partner needs a partner, not a passenger.`,
      es: `Para el Flemático preparándose para el matrimonio, el crecimiento práctico significa aprender a participar activamente mientras mantienes tu don de calma. Aquí hay áreas concretas que requieren atención:

**Practica Tener Opiniones**: Comienza pequeño. Cuando te pregunten dónde comer, elige un lugar—no digas "No me importa." Cuando te pregunten tu preferencia, exprésala, incluso si no es fuerte. Tu pareja necesita saber quién eres, y eso requiere que les muestres.

**Expresa Necesidades Antes de Que Se Conviertan en Resentimientos**: Aprende a identificar lo que necesitas y comunícalo temprano. No esperes hasta que la frustración se acumule; practica decir "Necesito..." o "Significaría mucho para mí si..." antes de que la necesidad se vuelva urgente. Tus necesidades son válidas y merecen expresión.

**Participa en el Conflicto Necesario**: No todo conflicto es malo. Las relaciones saludables requieren la capacidad de abordar problemas directamente. Practica iniciar conversaciones difíciles cuando surjan problemas, en lugar de esperar que se resuelvan solos. La meta no es pelear sino resolver—y la resolución requiere participación.

**Construye Músculos de Iniciativa**: Practica ser el que inicia—actividades, conversaciones, planes, intimidad. Tu pareja no siempre debería ser quien impulse la relación hacia adelante. Establece recordatorios si es necesario, pero contribuye activamente a la dirección de tu relación.

**Estírate Más Allá de las Zonas de Confort**: Identifica áreas donde te has estancado en patrones cómodos. Desafíate a probar cosas nuevas, adaptarte a cambios, abrazar el crecimiento. Tu matrimonio requerirá flexibilidad; comienza a practicar ahora.

**Desarrolla Expresión Emocional**: Tu exterior calmado puede enmascarar sentimientos profundos que tu pareja necesita ver. Practica identificar y expresar emociones, tanto positivas como negativas. Tu pareja merece saber cuando la han herido, deleitado, u orgullecido.

**Establece Límites Cuando Sea Necesario**: Ser tranquilo no es lo mismo que ser un tapete. Practica decir no cuando lo necesites, empujar cuando no estés de acuerdo, y mantenerte firme en cosas que te importan. Tus límites te protegen a ti y a la relación.

**Preséntate Completamente**: En conversaciones, en decisiones, en desafíos—estate completamente presente. Resiste el impulso de desconectarte, seguir la corriente, o simplemente ceder. Tu pareja necesita un compañero, no un pasajero.`
    },
    closingCharge: {
      en: `Dear Peacemaker, you carry one of God's most precious gifts: the ministry of presence. In a world that prizes loudness and self-promotion, you embody the gentle strength of still waters. You remind us that peace is possible, that calm is powerful, that there is profound beauty in faithfulness that simply shows up, day after day.

But you stand now at a threshold that will ask more of you than you have ever given. Marriage is not a place to hide, to defer, to disappear. It is a crucible where two people become one—and that requires both of you to be fully present. Your partner is not marrying your agreeable surface; they are covenanting with your whole self. And that self must be willing to emerge.

The blessing Christ speaks over peacemakers is not for those who avoid conflict but for those who make peace—actively, courageously, with their whole selves engaged. Peace-making sometimes requires confrontation. It sometimes requires advocating for justice, even when that advocacy is uncomfortable. It sometimes requires saying hard things because truth is the only foundation on which true peace can stand.

You have within you reserves of strength you have never been required to tap. Your calm is not weakness—it is power under control. Your patience is not passivity—it is endurance that outlasts storms. Your humility is not self-erasure—it is the genuine freedom of someone who doesn't need the spotlight. These qualities, rightly deployed, will make you an extraordinary spouse.

But they must be deployed. Your marriage needs you to engage, to initiate, to speak, to stand. It needs your opinions, your preferences, your needs voiced and advocated. It needs you to be visible, knowable, fully present. Your partner deserves a full partner, not half of one.

The river that appears so calm on the surface carries tremendous power in its depths. Let that power emerge. Find your voice. Express your needs. Stand firm when standing is required. Show up not as a pleasant, agreeable ghost but as the full, beautiful, complex person you are.

The world has enough noise. What it desperately needs—what your marriage will need—is your particular kind of peace: active, engaged, fully present peace that brings calm without losing itself.

Rise to the covenant, Peacemaker. Your steady heart is exactly what love requires.`,
      es: `Querido Pacificador, llevas uno de los dones más preciosos de Dios: el ministerio de la presencia. En un mundo que premia la estridencia y la autopromoción, tú encarnas la fuerza gentil de las aguas tranquilas. Nos recuerdas que la paz es posible, que la calma es poderosa, que hay una belleza profunda en la fidelidad que simplemente se presenta, día tras día.

Pero ahora estás en un umbral que pedirá más de ti de lo que jamás has dado. El matrimonio no es un lugar para esconderse, para ceder, para desaparecer. Es un crisol donde dos personas se convierten en una—y eso requiere que ambos estén completamente presentes. Tu pareja no se está casando con tu superficie agradable; están haciendo pacto con todo tu ser. Y ese ser debe estar dispuesto a emerger.

La bendición que Cristo habla sobre los pacificadores no es para aquellos que evitan el conflicto sino para aquellos que hacen la paz—activamente, valientemente, con todo su ser comprometido. Hacer la paz a veces requiere confrontación. A veces requiere abogar por la justicia, incluso cuando esa defensa es incómoda. A veces requiere decir cosas difíciles porque la verdad es el único fundamento sobre el cual la verdadera paz puede sostenerse.

Tienes dentro de ti reservas de fuerza que nunca se te ha requerido aprovechar. Tu calma no es debilidad—es poder bajo control. Tu paciencia no es pasividad—es resistencia que sobrevive a las tormentas. Tu humildad no es autoborrado—es la libertad genuina de alguien que no necesita el centro de atención. Estas cualidades, correctamente desplegadas, te harán un cónyuge extraordinario.

Pero deben ser desplegadas. Tu matrimonio te necesita para participar, para iniciar, para hablar, para mantenerte firme. Necesita tus opiniones, tus preferencias, tus necesidades expresadas y defendidas. Te necesita visible, conocible, completamente presente. Tu pareja merece un compañero completo, no medio.

El río que parece tan calmado en la superficie lleva un tremendo poder en sus profundidades. Deja que ese poder emerja. Encuentra tu voz. Expresa tus necesidades. Mantente firme cuando se requiera firmeza. Preséntate no como un fantasma agradable y complaciente sino como la persona completa, hermosa y compleja que eres.

El mundo tiene suficiente ruido. Lo que necesita desesperadamente—lo que tu matrimonio necesitará—es tu tipo particular de paz: paz activa, comprometida, completamente presente que trae calma sin perderse a sí misma.

Elévate al pacto, Pacificador. Tu corazón estable es exactamente lo que el amor requiere.`
    },
    reflectionQuestions: [
      { en: "When was the last time you voiced a strong opinion or preference to your partner? What holds you back from doing this more often?", es: "¿Cuándo fue la última vez que expresaste una opinión o preferencia fuerte a tu pareja? ¿Qué te detiene de hacer esto más a menudo?" },
      { en: "Are there needs you've been swallowing rather than expressing? What would happen if you voiced them?", es: "¿Hay necesidades que has estado tragando en lugar de expresar? ¿Qué pasaría si las expresaras?" },
      { en: "How might your 'easygoing' nature actually be frustrating or confusing to your partner?", es: "¿Cómo podría tu naturaleza 'tranquila' estar realmente frustrando o confundiendo a tu pareja?" },
      { en: "What conflicts have you avoided that need to be addressed? What is the cost of continuing to avoid them?", es: "¿Qué conflictos has evitado que necesitan ser abordados? ¿Cuál es el costo de continuar evitándolos?" },
      { en: "In what areas of your relationship do you need to show more initiative? What would that look like?", es: "¿En qué áreas de tu relación necesitas mostrar más iniciativa? ¿Cómo se vería eso?" },
      { en: "How do you distinguish between genuine peace-making and simply avoiding discomfort?", es: "¿Cómo distingues entre hacer la paz genuinamente y simplemente evitar la incomodidad?" },
      { en: "What would it mean for you to be fully present—emotionally, mentally, and actively—in your relationship?", es: "¿Qué significaría para ti estar completamente presente—emocional, mental y activamente—en tu relación?" }
    ],
    practiceBox: [
      { en: "Every day this week, voice one preference or opinion without being asked. Notice how it feels to initiate.", es: "Cada día esta semana, expresa una preferencia u opinión sin que te pregunten. Nota cómo se siente iniciar." },
      { en: "Identify one need you've been reluctant to express, and share it with your partner this week.", es: "Identifica una necesidad que has sido reacio a expresar, y compártela con tu pareja esta semana." },
      { en: "Initiate a difficult conversation you've been avoiding. Prepare what you want to say, then say it.", es: "Inicia una conversación difícil que has estado evitando. Prepara lo que quieres decir, luego dilo." },
      { en: "Plan and execute one date or activity from start to finish, making all the decisions yourself.", es: "Planifica y ejecuta una cita o actividad de principio a fin, tomando todas las decisiones tú mismo." }
    ]
  }
];
