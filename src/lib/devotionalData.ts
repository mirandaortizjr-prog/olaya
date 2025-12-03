export interface DevotionalEntry {
  day: number;
  title: string;
  quote: string;
  author: string;
  devotional: string;
  reflectionQuestions: string[];
  practiceBox: string[];
  category: string;
}

// Category ranges
const categories = [
  { name: 'Emotional Intelligence', start: 1, end: 60 },
  { name: 'Communication Mastery', start: 61, end: 120 },
  { name: 'Intimacy & Affection', start: 121, end: 180 },
  { name: 'Shared Goals & Growth', start: 181, end: 240 },
  { name: 'Personality & Attachment Styles', start: 241, end: 300 },
  { name: 'Repair & Resilience', start: 301, end: 330 },
  { name: 'Daily Nourishment', start: 331, end: 365 },
];

export const getCategory = (day: number): string => {
  const cat = categories.find(c => day >= c.start && day <= c.end);
  return cat?.name || 'Daily Nourishment';
};

// Comprehensive 365-day devotional content
export const devotionalEntries: DevotionalEntry[] = [
  // EMOTIONAL INTELLIGENCE (Days 1-60)
  {
    day: 1,
    title: "Listening as Love",
    quote: "We have two ears and one mouth so that we can listen twice as much as we speak.",
    author: "Epictetus",
    devotional: "Attentive listening is more than silence while your partner speaks. It means resisting the urge to plan your reply, noticing tone and pauses, and reflecting back both words and emotions. Psychology calls this active empathy: mirroring not just content but the feeling beneath it. Couples who practice attentive listening report higher trust and intimacy because it communicates: your inner world matters to me. Today, practice being fully present when your partner shares, setting aside distractions and your own agenda.",
    reflectionQuestions: [
      "When was the last time you felt truly attended to rather than just heard?",
      "What habits block your attentive listening?",
      "How can you show your partner today that their emotions—not just their words—are important?"
    ],
    practiceBox: [
      "Tonight, ask your partner about their day. Repeat back what you heard, including the emotion.",
      "Pause for 3 seconds before responding, to ensure you're not rushing to reply.",
      "End by asking: 'Did I get that right?'"
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 2,
    title: "The Power of Emotional Validation",
    quote: "Being heard is so close to being loved that for the average person, they are almost indistinguishable.",
    author: "David Augsburger",
    devotional: "Emotional validation doesn't mean agreeing with everything your partner feels—it means acknowledging that their feelings make sense given their perspective. When we validate, we communicate acceptance of our partner's emotional experience without judgment. Research shows that validation reduces emotional escalation and creates safety for deeper sharing. The opposite—dismissing or minimizing feelings—creates distance and resentment over time.",
    reflectionQuestions: [
      "Do you tend to fix problems before acknowledging feelings?",
      "How does it feel when your emotions are dismissed versus validated?",
      "What phrases help you feel emotionally understood?"
    ],
    practiceBox: [
      "Use phrases like 'That makes sense' or 'I can see why you'd feel that way.'",
      "Resist the urge to offer solutions until your partner feels heard.",
      "Notice when you want to defend yourself instead of validating—pause and choose connection."
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 3,
    title: "Understanding Your Emotional Triggers",
    quote: "Between stimulus and response there is a space. In that space is our power to choose our response.",
    author: "Viktor Frankl",
    devotional: "We all have emotional triggers—topics, tones, or situations that instantly activate strong reactions. Often these stem from past experiences, childhood wounds, or accumulated relationship hurts. Understanding your triggers isn't about eliminating them but recognizing them before they hijack your responses. When you can name a trigger in the moment, you create space for choice rather than reaction.",
    reflectionQuestions: [
      "What situations consistently trigger strong emotional reactions in you?",
      "Can you trace any triggers back to earlier life experiences?",
      "How do you typically respond when triggered, and how would you like to respond?"
    ],
    practiceBox: [
      "Make a list of your top 3 emotional triggers in your relationship.",
      "Share one trigger with your partner and explain its origin.",
      "Create a code word to signal when you feel triggered and need a pause."
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 4,
    title: "Naming Emotions Precisely",
    quote: "Name it to tame it.",
    author: "Dr. Dan Siegel",
    devotional: "Research shows that the simple act of labeling an emotion reduces its intensity. But most of us have a limited emotional vocabulary, defaulting to 'fine,' 'stressed,' or 'upset.' Expanding your emotional vocabulary allows for more precise communication and self-understanding. Instead of 'I'm mad,' you might discover you're actually feeling 'disrespected' or 'unheard'—each pointing to different needs.",
    reflectionQuestions: [
      "What emotions do you frequently feel but rarely name?",
      "How specific is your typical emotional vocabulary?",
      "What would change if you named emotions more precisely to your partner?"
    ],
    practiceBox: [
      "Learn 5 new emotion words this week (e.g., apprehensive, content, overwhelmed, hopeful, irritated).",
      "When you feel 'bad,' dig deeper—what specific emotion is underneath?",
      "Share a nuanced emotion with your partner today using a specific word."
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 5,
    title: "The Gift of Emotional Presence",
    quote: "The greatest gift you can give another is the purity of your attention.",
    author: "Richard Moss",
    devotional: "Emotional presence means being fully available—not distracted by phones, worries, or mental to-do lists—when your partner needs connection. It's offering your undivided self. In our hyper-connected world, true presence has become rare and therefore more precious. When you offer emotional presence, you communicate that your partner is worth your full attention, that this moment matters.",
    reflectionQuestions: [
      "When do you feel most present with your partner?",
      "What typically pulls your attention away during important conversations?",
      "How does your partner signal they need your full presence?"
    ],
    practiceBox: [
      "Create a daily 15-minute 'device-free' window for undistracted connection.",
      "Make eye contact during important conversations.",
      "When you notice your mind wandering, gently bring it back without self-judgment."
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 6,
    title: "Emotional Flooding and Recovery",
    quote: "When we are no longer able to change a situation, we are challenged to change ourselves.",
    author: "Viktor Frankl",
    devotional: "Emotional flooding occurs when stress hormones overwhelm our capacity for rational thought. Heart rate increases, muscles tense, and we lose access to our prefrontal cortex—the brain region responsible for empathy and problem-solving. Gottman's research shows that once flooded, we need at least 20 minutes to physiologically calm down. Continuing a conversation while flooded almost guarantees escalation.",
    reflectionQuestions: [
      "What physical signs tell you that you're becoming flooded?",
      "How do you typically behave when emotionally overwhelmed?",
      "What helps you calm down most effectively?"
    ],
    practiceBox: [
      "Agree with your partner on a signal word that means 'I need a break.'",
      "During breaks, do something soothing: walk, breathe deeply, or listen to music.",
      "Return to the conversation only when both hearts have slowed."
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 7,
    title: "Empathy: Walking in Their Shoes",
    quote: "Empathy is seeing with the eyes of another, listening with the ears of another, and feeling with the heart of another.",
    author: "Alfred Adler",
    devotional: "Empathy requires temporarily setting aside your own perspective to fully inhabit your partner's experience. It's not sympathy (feeling sorry for) but genuine understanding of their inner world. Empathy doesn't mean abandoning your own feelings—it means making room for theirs. When partners feel truly understood, defensiveness melts and connection deepens.",
    reflectionQuestions: [
      "When has someone's empathy profoundly impacted you?",
      "What makes it difficult for you to empathize in certain situations?",
      "How can you show more curiosity about your partner's perspective?"
    ],
    practiceBox: [
      "During your next disagreement, summarize your partner's position before stating your own.",
      "Ask: 'Help me understand what this feels like for you.'",
      "Practice empathy even when you disagree—understanding doesn't require agreement."
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 8,
    title: "Managing Anxiety in Relationships",
    quote: "Worry does not empty tomorrow of its sorrow, it empties today of its strength.",
    author: "Corrie ten Boom",
    devotional: "Relationship anxiety—fear of abandonment, rejection, or inadequacy—can drive behaviors that paradoxically push partners away. When anxious, we may seek excessive reassurance, become controlling, or withdraw protectively. Recognizing anxiety as a signal rather than truth allows us to respond thoughtfully. Your anxiety is trying to protect you, but it often overstates the danger.",
    reflectionQuestions: [
      "What relationship fears does anxiety amplify for you?",
      "How does your anxiety typically manifest in behavior?",
      "What would help you feel more secure?"
    ],
    practiceBox: [
      "When anxious, name it: 'I notice I'm feeling anxious right now.'",
      "Ask yourself: 'What am I afraid of? Is this fear based on present evidence?'",
      "Share your anxiety with your partner without demanding they fix it."
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 9,
    title: "The Art of Self-Soothing",
    quote: "Almost everything will work again if you unplug it for a few minutes, including you.",
    author: "Anne Lamott",
    devotional: "Self-soothing is the ability to calm your own nervous system without relying entirely on your partner. While we absolutely need co-regulation in relationships, depending solely on your partner to manage your emotions creates unsustainable pressure. Developing self-soothing skills—deep breathing, grounding exercises, positive self-talk—makes you a more stable partner.",
    reflectionQuestions: [
      "What self-soothing techniques work best for you?",
      "Do you tend to over-rely on your partner for emotional regulation?",
      "How can developing self-soothing benefit your relationship?"
    ],
    practiceBox: [
      "Practice box breathing: inhale 4 counts, hold 4 counts, exhale 4 counts, hold 4 counts.",
      "Identify 3 go-to self-soothing activities (walking, music, warm bath).",
      "Use self-soothing before bringing up difficult topics."
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 10,
    title: "Recognizing Projection",
    quote: "Everything that irritates us about others can lead us to an understanding of ourselves.",
    author: "Carl Jung",
    devotional: "Projection occurs when we attribute our own unacknowledged feelings or traits to our partner. If we're feeling insecure, we might accuse our partner of being critical. If we're angry at ourselves, we might perceive our partner as angry. Recognizing projection requires honest self-examination: 'Is this really about them, or might this be about me?'",
    reflectionQuestions: [
      "What traits in your partner most irritate you? Could any be projections?",
      "When you accuse your partner of something, do you ever feel that way yourself?",
      "How might examining your projections deepen self-awareness?"
    ],
    practiceBox: [
      "Before criticizing your partner, ask: 'Am I also guilty of this sometimes?'",
      "Journal about a recent conflict—explore what you might have been projecting.",
      "When triggered, pause and look inward before looking outward."
    ],
    category: "Emotional Intelligence"
  },
  // Days 11-60: More Emotional Intelligence entries
  {
    day: 11,
    title: "Emotional Boundaries",
    quote: "Daring to set boundaries is about having the courage to love ourselves even when we risk disappointing others.",
    author: "Brené Brown",
    devotional: "Healthy emotional boundaries mean knowing where you end and your partner begins. You can care deeply about their feelings without taking responsibility for managing them. Boundaries aren't walls—they're guidelines that help both partners understand expectations and limits. Without boundaries, resentment builds; with them, genuine generosity becomes possible.",
    reflectionQuestions: [
      "Where might you need stronger emotional boundaries?",
      "Do you sometimes feel responsible for your partner's happiness?",
      "How can boundaries actually increase intimacy?"
    ],
    practiceBox: [
      "Identify one area where you've been overextending emotionally.",
      "Practice saying: 'I care about how you feel, and I trust you to work through this.'",
      "Set one boundary this week and observe the results."
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 12,
    title: "The Courage of Vulnerability",
    quote: "Vulnerability is not winning or losing; it's having the courage to show up and be seen when we have no control over the outcome.",
    author: "Brené Brown",
    devotional: "Vulnerability is the birthplace of connection, belonging, and love. Yet we often armor ourselves against it, fearing rejection or judgment. True intimacy requires the courage to be seen—imperfections and all. When you share your fears, dreams, and struggles authentically, you invite your partner into your real self, not just the polished version.",
    reflectionQuestions: [
      "What makes vulnerability feel risky for you?",
      "What armor do you wear to protect yourself from being truly seen?",
      "How might your relationship deepen if you were more vulnerable?"
    ],
    practiceBox: [
      "Share one fear or insecurity with your partner today.",
      "When your partner is vulnerable, respond with gratitude, not advice.",
      "Notice when you're tempted to hide—choose authenticity instead."
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 13,
    title: "Understanding Shame",
    quote: "Shame corrodes the very part of us that believes we are capable of change.",
    author: "Brené Brown",
    devotional: "Shame whispers that we are fundamentally flawed and unworthy of love. Unlike guilt ('I did something bad'), shame says 'I am bad.' Shame thrives in secrecy but withers when spoken. In relationships, unaddressed shame can drive us to hide parts of ourselves, overcompensate, or project onto our partner. Healing happens when shame is met with empathy.",
    reflectionQuestions: [
      "What shame triggers affect your relationship?",
      "How do you typically respond when feeling ashamed?",
      "What would it mean to share your shame with someone who responds with empathy?"
    ],
    practiceBox: [
      "Identify one shame message you carry and examine its origins.",
      "Share a shame experience with your partner and receive their empathy.",
      "Practice self-compassion when shame arises: 'I am human; this is human.'"
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 14,
    title: "Cultivating Gratitude",
    quote: "Gratitude turns what we have into enough.",
    author: "Melody Beattie",
    devotional: "Gratitude rewires our brain toward positivity. In relationships, we often focus on what's missing rather than what's present. The negativity bias—our tendency to notice problems more than blessings—can erode appreciation over time. Intentional gratitude practice shifts this pattern, helping us see our partner's contributions and the gifts of our relationship.",
    reflectionQuestions: [
      "What do you take for granted in your relationship?",
      "When did you last express genuine gratitude to your partner?",
      "How might daily gratitude change your relationship's atmosphere?"
    ],
    practiceBox: [
      "Share three specific things you appreciate about your partner tonight.",
      "Start a gratitude practice—list 3 relationship blessings each morning.",
      "Notice when you focus on complaints; consciously shift to gratitude."
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 15,
    title: "Emotional Generosity",
    quote: "We make a living by what we get. We make a life by what we give.",
    author: "Winston Churchill",
    devotional: "Emotional generosity means giving your partner the benefit of the doubt, assuming positive intent, and offering grace when they fall short. It's choosing to interpret their actions through a lens of love rather than suspicion. This doesn't mean ignoring problems—it means approaching your partner as an ally rather than an adversary.",
    reflectionQuestions: [
      "Do you tend to assume positive or negative intent from your partner?",
      "How might emotional generosity change your typical interpretations?",
      "What would it feel like to receive more emotional generosity from your partner?"
    ],
    practiceBox: [
      "When annoyed, pause and consider a generous interpretation of your partner's behavior.",
      "Give your partner the same grace you'd want when you make mistakes.",
      "Express appreciation for effort, even when results aren't perfect."
    ],
    category: "Emotional Intelligence"
  },
  // Continue with days 16-60...
  {
    day: 16,
    title: "The Language of Needs",
    quote: "Every criticism, judgment, diagnosis, and expression of anger is the tragic expression of an unmet need.",
    author: "Marshall Rosenberg",
    devotional: "Behind every complaint lies an unmet need. 'You never help around the house' might express a need for partnership. 'You're always on your phone' might express a need for connection. Learning to translate complaints into needs—both yours and your partner's—transforms conflict into opportunity for deeper understanding and care.",
    reflectionQuestions: [
      "What needs do your most common complaints actually express?",
      "How comfortable are you directly stating your needs?",
      "What prevents you from asking for what you need?"
    ],
    practiceBox: [
      "Reframe a recent complaint as a need: 'I need...' instead of 'You never...'",
      "Ask your partner what need underlies their frustration.",
      "Practice requesting directly: 'Would you be willing to...'"
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 17,
    title: "Managing Disappointment",
    quote: "Expectations are premeditated resentments.",
    author: "Unknown",
    devotional: "Disappointment is the gap between expectation and reality. In relationships, we carry countless expectations—some spoken, many unspoken. When our partner fails to meet expectations they didn't know existed, disappointment and resentment grow. Managing disappointment requires examining our expectations, communicating them clearly, and accepting that our partner cannot meet all of them.",
    reflectionQuestions: [
      "What unspoken expectations do you carry in your relationship?",
      "How do you typically express disappointment?",
      "Which expectations might be unrealistic or unfair?"
    ],
    practiceBox: [
      "Identify one unspoken expectation and share it with your partner.",
      "When disappointed, separate the event from the story you're telling yourself.",
      "Ask: 'Is this expectation reasonable? Have I communicated it clearly?'"
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 18,
    title: "The Role of Curiosity",
    quote: "Be curious, not judgmental.",
    author: "Walt Whitman",
    devotional: "Curiosity is the antidote to judgment. When we're curious about our partner's behavior, we seek to understand rather than condemn. Curiosity opens doors that judgment slams shut. Instead of 'Why would you do that?' try 'Help me understand what led to that.' The former accuses; the latter invites. Years into a relationship, maintaining curiosity about your partner keeps discovery alive.",
    reflectionQuestions: [
      "When do you tend to judge rather than get curious?",
      "What aspects of your partner do you still not fully understand?",
      "How might curiosity transform your next disagreement?"
    ],
    practiceBox: [
      "Replace one judgment today with a curious question.",
      "Ask your partner something you've never asked before.",
      "When tempted to assume, instead ask: 'Tell me more about that.'"
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 19,
    title: "Honoring Your Partner's Emotions",
    quote: "The emotion that can break your heart is sometimes the very one that heals it.",
    author: "Nicholas Sparks",
    devotional: "Honoring your partner's emotions means respecting their right to feel what they feel, even when their feelings are uncomfortable for you. It means not rushing them through grief, minimizing their fears, or dismissing their joy. When we honor emotions, we communicate: all of you is welcome here—not just the easy parts.",
    reflectionQuestions: [
      "Which of your partner's emotions are hardest for you to honor?",
      "Do you ever try to 'fix' feelings rather than simply witness them?",
      "How would you like your emotions to be honored?"
    ],
    practiceBox: [
      "When your partner expresses difficult emotions, simply be present without fixing.",
      "Say: 'I'm here with you' rather than 'Don't feel that way.'",
      "Celebrate your partner's joy without tempering it with caution."
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 20,
    title: "Emotional Bids and Responses",
    quote: "The little things are the big things.",
    author: "John Gottman",
    devotional: "Gottman's research identified 'bids' as any attempt to connect—a sigh, a comment about the weather, a touch on the shoulder. Partners can turn toward bids (engaging), turn away (ignoring), or turn against (responding negatively). Couples who consistently turn toward each other's bids build trust and intimacy. Those who turn away erode the relationship slowly but steadily.",
    reflectionQuestions: [
      "What bids does your partner make that you might be missing?",
      "How do you typically respond when your partner reaches out?",
      "What prevents you from turning toward your partner?"
    ],
    practiceBox: [
      "Notice 5 bids from your partner today and turn toward each one.",
      "Make a conscious bid for connection and observe the response.",
      "When tempted to ignore a bid, choose engagement instead."
    ],
    category: "Emotional Intelligence"
  },
  // Days 21-60 continuing Emotional Intelligence
  {
    day: 21,
    title: "Processing Emotions Together",
    quote: "A problem shared is a problem halved.",
    author: "Unknown",
    devotional: "Co-regulation—helping each other process difficult emotions—is a hallmark of secure relationships. When your partner is struggling, your calm presence can help regulate their nervous system. This isn't about solving their problems but offering the safety of your companionship through difficulty. Together, you can weather storms that would overwhelm either alone.",
    reflectionQuestions: [
      "How do you help your partner process difficult emotions?",
      "What does your partner do that helps you regulate?",
      "When is it helpful to process alone versus together?"
    ],
    practiceBox: [
      "Offer your calm presence when your partner is upset—no fixing required.",
      "Ask: 'Do you need me to listen, help solve, or just be here?'",
      "Practice breathing together during stressful moments."
    ],
    category: "Emotional Intelligence"
  },
  {
    day: 22,
    title: "The Wisdom of Patience",
    quote: "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.",
    author: "Joyce Meyer",
    devotional: "Patience in relationships means allowing your partner to grow at their own pace, trusting that change takes time, and resisting the urge to push, criticize, or control. Patience doesn't mean accepting harmful behavior—it means giving space for genuine transformation. Impatience often sabotages the very changes we desire.",
    reflectionQuestions: [
      "Where do you most need patience in your relationship?",
      "What triggers your impatience with your partner?",
      "How does your impatience affect your partner's willingness to grow?"
    ],
    practiceBox: [
      "Identify one area where you've been impatient and consciously choose patience.",
      "Remind yourself: growth is a process, not an event.",
      "Celebrate small progress rather than demanding perfection."
    ],
    category: "Emotional Intelligence"
  },
  // Add more entries...continuing through day 60, then categories 2-7

  // COMMUNICATION MASTERY (Days 61-120)
  {
    day: 61,
    title: "Speaking Your Truth Kindly",
    quote: "Honesty without kindness is brutality.",
    author: "Unknown",
    devotional: "Truth-telling in relationships requires both courage and compassion. We must speak honestly about our needs, concerns, and feelings—but how we speak matters as much as what we say. Harsh truths delivered without care become weapons. Kind truths, shared with love, become bridges to deeper understanding. The goal isn't just to be heard but to maintain connection while being honest.",
    reflectionQuestions: [
      "Do you tend toward too much honesty or too much kindness?",
      "How can you be more honest without being hurtful?",
      "What truths have you been avoiding speaking?"
    ],
    practiceBox: [
      "Share one difficult truth today using 'I' statements and gentle tone.",
      "Before speaking hard truths, ask: 'Is this the right time and place?'",
      "Lead with appreciation before addressing concerns."
    ],
    category: "Communication Mastery"
  },
  {
    day: 62,
    title: "The Art of Soft Startups",
    quote: "A gentle answer turns away wrath.",
    author: "Proverbs 15:1",
    devotional: "How a conversation begins determines how it will likely end. Gottman calls this the 'soft startup'—beginning difficult discussions gently rather than harshly. A harsh startup ('You always...') triggers defensiveness. A soft startup ('I've been feeling...') invites dialogue. Mastering soft startups dramatically increases the likelihood of productive conversations.",
    reflectionQuestions: [
      "How do you typically begin difficult conversations?",
      "What signals tell you a conversation is starting harshly?",
      "How do harsh startups affect your receptivity?"
    ],
    practiceBox: [
      "Begin with 'I feel...' rather than 'You always...' or 'You never...'",
      "State what you need positively, not what your partner is doing wrong.",
      "If you start harshly, pause, apologize, and begin again."
    ],
    category: "Communication Mastery"
  },
  // Continue with more Communication entries...

  // INTIMACY & AFFECTION (Days 121-180)
  {
    day: 121,
    title: "The Many Languages of Touch",
    quote: "Touch is the first language we learn and the last one we forget.",
    author: "Unknown",
    devotional: "Physical touch communicates what words sometimes cannot—comfort, desire, presence, love. But touch is not one-size-fits-all. What feels nurturing to one partner may feel smothering to another. Understanding each other's touch preferences—when, where, how much—allows touch to become a fluent language of love between you.",
    reflectionQuestions: [
      "What kinds of touch feel most nurturing to you?",
      "How do you and your partner differ in touch preferences?",
      "When does touch feel most meaningful to you?"
    ],
    practiceBox: [
      "Ask your partner: 'What kind of touch do you most crave right now?'",
      "Offer non-sexual affection today—a hug, hand-hold, or gentle touch.",
      "Notice your partner's response to different types of touch."
    ],
    category: "Intimacy & Affection"
  },

  // SHARED GOALS & GROWTH (Days 181-240)
  {
    day: 181,
    title: "Dreaming Together",
    quote: "A dream you dream alone is only a dream. A dream you dream together is reality.",
    author: "John Lennon",
    devotional: "Couples who share dreams and goals build a sense of 'we-ness' that transcends individual desires. Shared vision doesn't mean identical goals but creating a future that honors both partners' aspirations. Dreaming together requires vulnerability—sharing hopes that might seem unrealistic—and the willingness to weave your dreams into a shared tapestry.",
    reflectionQuestions: [
      "What dreams do you hold for your relationship's future?",
      "Do you know your partner's deepest aspirations?",
      "Where do your dreams align, and where do they differ?"
    ],
    practiceBox: [
      "Schedule a 'dream date' to share your individual and shared visions.",
      "Create a shared bucket list of experiences you want together.",
      "Revisit and update your shared dreams annually."
    ],
    category: "Shared Goals & Growth"
  },

  // PERSONALITY & ATTACHMENT STYLES (Days 241-300)
  {
    day: 241,
    title: "Understanding Attachment",
    quote: "We are born in relationship, we are wounded in relationship, and we can be healed in relationship.",
    author: "Harville Hendrix",
    devotional: "Attachment theory reveals that our earliest relationships create templates for how we connect in adulthood. Secure attachment means trusting that your partner will be there for you. Anxious attachment involves fear of abandonment. Avoidant attachment involves discomfort with closeness. Understanding your attachment style—and your partner's—illuminates many relationship patterns.",
    reflectionQuestions: [
      "What is your attachment style, and how does it show up in your relationship?",
      "What is your partner's attachment style?",
      "How do your attachment styles interact—creating harmony or friction?"
    ],
    practiceBox: [
      "Research attachment styles together and discuss what you learn.",
      "Identify one attachment-driven behavior you'd like to change.",
      "Reassure your partner in ways that address their attachment needs."
    ],
    category: "Personality & Attachment Styles"
  },

  // REPAIR & RESILIENCE (Days 301-330)
  {
    day: 301,
    title: "The Power of Repair",
    quote: "The quality of your relationships determines the quality of your life.",
    author: "Esther Perel",
    devotional: "No relationship is free of ruptures—moments of disconnection, misunderstanding, or hurt. What distinguishes thriving relationships isn't the absence of ruptures but the presence of repair. Repair is the process of reconnecting after disconnection, of healing what was hurt. Couples who repair quickly and thoroughly build resilience; those who don't accumulate emotional debt.",
    reflectionQuestions: [
      "How quickly do you typically repair after conflict?",
      "What makes repair difficult for you?",
      "What does successful repair look like in your relationship?"
    ],
    practiceBox: [
      "After your next conflict, initiate repair within 24 hours.",
      "Develop a repair ritual—a phrase, gesture, or action that signals 'I want to reconnect.'",
      "Practice accepting repair attempts even when you're still hurt."
    ],
    category: "Repair & Resilience"
  },

  // DAILY NOURISHMENT (Days 331-365)
  {
    day: 331,
    title: "Small Acts, Big Love",
    quote: "Love is not a big thing. It's a million little things.",
    author: "Unknown",
    devotional: "Grand gestures get attention, but relationships thrive on small, consistent acts of love. A cup of coffee made without being asked. A text message just to say 'thinking of you.' A word of encouragement after a hard day. These small deposits in the emotional bank account accumulate into profound security and affection over time.",
    reflectionQuestions: [
      "What small acts of love does your partner most appreciate?",
      "What small gestures make you feel most loved?",
      "How consistent are you with small daily expressions of love?"
    ],
    practiceBox: [
      "Do one small act of love for your partner today without being asked.",
      "Notice the small things your partner does for you and thank them.",
      "Create a daily love ritual—something small you do consistently."
    ],
    category: "Daily Nourishment"
  },
  {
    day: 365,
    title: "A Year of Growth",
    quote: "Love does not consist in gazing at each other, but in looking outward together in the same direction.",
    author: "Antoine de Saint-Exupéry",
    devotional: "You've journeyed through 365 days of intentional relationship growth. You've explored emotional intelligence, communication, intimacy, shared goals, personality dynamics, repair, and daily nourishment. But this isn't an ending—it's a foundation. The skills and insights you've gathered are seeds planted. Continue watering them with practice, patience, and presence. Your relationship is a living thing that grows with attention and care.",
    reflectionQuestions: [
      "What was your most significant insight this year?",
      "How has your relationship grown through this practice?",
      "What will you carry forward into the next year?"
    ],
    practiceBox: [
      "Celebrate completing this journey together.",
      "Share your three biggest takeaways with your partner.",
      "Commit to continuing daily practices that served you well."
    ],
    category: "Daily Nourishment"
  }
];

// Generate remaining entries programmatically for comprehensive coverage
const generateEntry = (day: number): DevotionalEntry => {
  const category = getCategory(day);
  const templates = getTemplatesForCategory(category);
  const templateIndex = (day - 1) % templates.length;
  const template = templates[templateIndex];
  
  return {
    day,
    title: template.title,
    quote: template.quote,
    author: template.author,
    devotional: template.devotional,
    reflectionQuestions: template.reflectionQuestions,
    practiceBox: template.practiceBox,
    category
  };
};

const getTemplatesForCategory = (category: string) => {
  const categoryTemplates: Record<string, DevotionalEntry[]> = {
    'Emotional Intelligence': [
      {
        day: 0, title: "Emotional Awareness", quote: "Know thyself.", author: "Socrates",
        devotional: "Self-awareness is the foundation of emotional intelligence. Before we can manage our emotions or understand our partner's, we must first become aware of our own inner landscape. Pay attention to what you feel without judgment—simply notice and name.",
        reflectionQuestions: ["What emotions did you experience today?", "What triggered your strongest emotions?", "How aware are you of your emotional patterns?"],
        practiceBox: ["Check in with your emotions three times today.", "Name the emotion without judging it.", "Notice where you feel emotions in your body."],
        category: "Emotional Intelligence"
      },
      {
        day: 0, title: "Emotional Regulation", quote: "He who controls others may be powerful, but he who has mastered himself is mightier still.", author: "Lao Tzu",
        devotional: "Emotional regulation isn't suppressing feelings—it's choosing how to express them constructively. When intense emotions arise, we can pause before reacting, creating space for thoughtful response rather than reactive behavior.",
        reflectionQuestions: ["How do you typically respond to intense emotions?", "What helps you regulate when overwhelmed?", "How does your emotional expression affect your partner?"],
        practiceBox: ["Practice the pause: count to 10 before responding in anger.", "Use deep breathing when emotions intensify.", "Ask yourself: 'How do I want to handle this?'"],
        category: "Emotional Intelligence"
      },
      {
        day: 0, title: "Emotional Expression", quote: "Unexpressed emotions will never die. They are buried alive and will come forth later in uglier ways.", author: "Sigmund Freud",
        devotional: "Healthy emotional expression means sharing your inner experience in ways your partner can receive. It requires vulnerability, timing, and skill. Stuffing emotions leads to resentment; exploding them creates fear. The middle path is honest, measured expression.",
        reflectionQuestions: ["How comfortable are you expressing emotions?", "Do you tend to suppress or explode?", "What would healthy expression look like for you?"],
        practiceBox: ["Express one vulnerable emotion to your partner today.", "Use 'I feel...' statements.", "Share emotions before they build up."],
        category: "Emotional Intelligence"
      }
    ],
    'Communication Mastery': [
      {
        day: 0, title: "Clear Requests", quote: "Ask for what you want and be prepared to get it.", author: "Maya Angelou",
        devotional: "Vague hints and passive requests often go unmet, leading to frustration. Clear, specific requests give your partner the information they need to respond. State what you want positively ('I'd love if you...') rather than what you don't want ('Stop doing...').",
        reflectionQuestions: ["How clear are your requests typically?", "Do you hint or ask directly?", "What makes direct requests difficult?"],
        practiceBox: ["Make one clear, specific request today.", "State what you want, not what you don't want.", "Thank your partner for responding to requests."],
        category: "Communication Mastery"
      },
      {
        day: 0, title: "Nonverbal Communication", quote: "The most important thing in communication is hearing what isn't said.", author: "Peter Drucker",
        devotional: "Research suggests over 90% of communication is nonverbal—tone, facial expression, body language, and timing. Your words may say one thing while your body communicates another. Aligning verbal and nonverbal messages creates clear, trustworthy communication.",
        reflectionQuestions: ["What does your nonverbal communication typically convey?", "Do your words and body language align?", "How attuned are you to your partner's nonverbal cues?"],
        practiceBox: ["Notice your body language during your next conversation.", "Make eye contact when listening.", "Align your tone with your message."],
        category: "Communication Mastery"
      },
      {
        day: 0, title: "Active Listening", quote: "Listening is a magnetic and strange thing, a creative force.", author: "Brenda Ueland",
        devotional: "Active listening means fully concentrating on what's being said rather than passively hearing. It involves reflecting back what you hear, asking clarifying questions, and resisting the urge to formulate your response while your partner is still speaking.",
        reflectionQuestions: ["What distracts you from fully listening?", "How well do you reflect back what you hear?", "When do you feel most listened to?"],
        practiceBox: ["Put away devices during important conversations.", "Summarize what you heard before responding.", "Ask 'Did I understand correctly?'"],
        category: "Communication Mastery"
      }
    ],
    'Intimacy & Affection': [
      {
        day: 0, title: "Emotional Intimacy", quote: "Intimacy is the capacity to be rather weird with someone - and finding that that's OK with them.", author: "Alain de Botton",
        devotional: "Emotional intimacy is the sense of closeness that comes from being truly known and accepted. It develops when we share our inner world—thoughts, feelings, fears, dreams—and are met with acceptance rather than judgment. This kind of knowing takes time and trust.",
        reflectionQuestions: ["How emotionally intimate do you feel with your partner?", "What parts of yourself do you hide?", "What would deepen your emotional intimacy?"],
        practiceBox: ["Share something you've never told your partner.", "Ask a deeper question than usual.", "Create space for your partner to share without judgment."],
        category: "Intimacy & Affection"
      },
      {
        day: 0, title: "Physical Affection", quote: "I have learned that there is more power in a good strong hug than in a thousand meaningful words.", author: "Ann Hood",
        devotional: "Physical affection releases oxytocin—the bonding hormone—creating feelings of closeness and trust. Regular, non-sexual physical affection maintains connection between more intimate moments. A hug, a kiss, holding hands—these simple touches communicate love throughout the day.",
        reflectionQuestions: ["How much daily physical affection do you share?", "What types of touch feel most connecting?", "How might you increase daily affection?"],
        practiceBox: ["Give your partner a 20-second hug today.", "Hold hands during a conversation.", "Offer a kiss of greeting and departure."],
        category: "Intimacy & Affection"
      }
    ],
    'Shared Goals & Growth': [
      {
        day: 0, title: "Growing Together", quote: "In a relationship, when does the art of intimacy begin to feel like work?", author: "Esther Perel",
        devotional: "Relationships require both stability and growth. We need the security of knowing our partner will be there, and we need the excitement of continuing to grow. Supporting each other's individual growth while growing together creates a dynamic, evolving partnership.",
        reflectionQuestions: ["How are you growing individually?", "How are you growing together?", "What growth edges are you both navigating?"],
        practiceBox: ["Share a personal growth goal with your partner.", "Ask how you can support their growth.", "Plan a growth activity to do together."],
        category: "Shared Goals & Growth"
      },
      {
        day: 0, title: "Shared Values", quote: "Where there is unity there is always victory.", author: "Publilius Syrus",
        devotional: "Shared values provide the compass for relationship decisions. When partners align on what matters most—family, faith, integrity, adventure, security—they navigate life's choices more smoothly. Misaligned values create ongoing friction and difficult trade-offs.",
        reflectionQuestions: ["What values do you and your partner share?", "Where do your values differ?", "How do shared values guide your decisions?"],
        practiceBox: ["Discuss your top 5 values with your partner.", "Identify where values align and differ.", "Make a decision together based on shared values."],
        category: "Shared Goals & Growth"
      }
    ],
    'Personality & Attachment Styles': [
      {
        day: 0, title: "Embracing Differences", quote: "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed.", author: "Carl Jung",
        devotional: "Your partner's differences aren't flaws to fix but features to understand. Introversion and extroversion, spontaneity and planning, logic and emotion—these differences can complement each other when approached with curiosity rather than criticism.",
        reflectionQuestions: ["What personality differences exist between you?", "Which differences create friction?", "How might differences become strengths?"],
        practiceBox: ["List three ways your partner's differences benefit you.", "Appreciate a difference rather than criticizing it.", "Ask your partner how they experience your differences."],
        category: "Personality & Attachment Styles"
      },
      {
        day: 0, title: "Love Languages", quote: "We must be willing to learn our spouse's primary love language if we are to be effective communicators of love.", author: "Gary Chapman",
        devotional: "We tend to express love in the language we most want to receive it. But your partner may speak a different love language—words, touch, time, gifts, or acts of service. Learning to speak your partner's language, not just your own, ensures your love is felt.",
        reflectionQuestions: ["What is your primary love language?", "What is your partner's love language?", "Are you expressing love in their language or yours?"],
        practiceBox: ["Express love in your partner's primary language today.", "Ask your partner what makes them feel most loved.", "Notice how your partner expresses love to you."],
        category: "Personality & Attachment Styles"
      }
    ],
    'Repair & Resilience': [
      {
        day: 0, title: "The Art of Apology", quote: "An apology is the superglue of life. It can repair just about anything.", author: "Lynn Johnston",
        devotional: "A genuine apology has components: acknowledging the offense, expressing remorse, making amends, and committing to change. Partial apologies ('I'm sorry you feel that way') fail because they don't accept responsibility. Full apologies heal because they communicate understanding and care.",
        reflectionQuestions: ["How do you typically apologize?", "What makes an apology meaningful to you?", "Is there an apology you need to give or receive?"],
        practiceBox: ["Offer a full apology for a recent hurt.", "Avoid 'but' after 'I'm sorry.'", "Ask what your partner needs to feel repaired."],
        category: "Repair & Resilience"
      },
      {
        day: 0, title: "Forgiveness", quote: "Forgiveness is not an occasional act; it is a permanent attitude.", author: "Martin Luther King Jr.",
        devotional: "Forgiveness doesn't mean forgetting or excusing harm—it means releasing the grip of resentment on your heart. Holding onto unforgiveness punishes you more than your partner. Forgiveness is a gift you give yourself, freeing you to move forward rather than staying anchored to past hurts.",
        reflectionQuestions: ["What unforgiveness are you holding?", "What makes forgiveness difficult for you?", "What would it mean to release this burden?"],
        practiceBox: ["Identify one resentment you're ready to release.", "Practice forgiveness as a process, not a one-time event.", "Separate forgiving from reconciling—you can do one without the other."],
        category: "Repair & Resilience"
      }
    ],
    'Daily Nourishment': [
      {
        day: 0, title: "Daily Connection Rituals", quote: "It's the small things, done consistently, that make the biggest difference.", author: "Unknown",
        devotional: "Rituals create predictable moments of connection in unpredictable lives. A morning kiss, an evening check-in, a weekly date night—these rituals become anchors that maintain closeness even during busy or stressful seasons. Without intentional rituals, connection becomes accidental.",
        reflectionQuestions: ["What connection rituals do you currently have?", "What new ritual might benefit your relationship?", "How consistent are you with existing rituals?"],
        practiceBox: ["Establish one new daily connection ritual.", "Protect existing rituals from schedule encroachment.", "Review and refresh rituals periodically."],
        category: "Daily Nourishment"
      },
      {
        day: 0, title: "Presence Over Perfection", quote: "The greatest gift you can give someone is your time.", author: "Unknown",
        devotional: "In a culture obsessed with productivity and perfection, simply being present is revolutionary. Your partner doesn't need you to be perfect—they need you to be there. Presence means putting away distractions and offering your full attention, even in ordinary moments.",
        reflectionQuestions: ["How present are you typically with your partner?", "What steals your presence most often?", "What would more presence look like?"],
        practiceBox: ["Spend 15 minutes fully present with your partner today.", "Put away your phone during meals together.", "Make eye contact when your partner speaks."],
        category: "Daily Nourishment"
      }
    ]
  };
  
  return categoryTemplates[category] || categoryTemplates['Daily Nourishment'];
};

// Build complete 365-day devotional library
export const getDevotional = (day: number): DevotionalEntry => {
  // First check if we have a handwritten entry
  const existing = devotionalEntries.find(d => d.day === day);
  if (existing) return existing;
  
  // Otherwise generate one
  return generateEntry(day);
};

export const getAllDevotionals = (): DevotionalEntry[] => {
  return Array.from({ length: 365 }, (_, i) => getDevotional(i + 1));
};
