export type LustLanguage = 'Romantic' | 'Sensual' | 'Playful' | 'Dominant';
export type SexLanguage = 'Fun' | 'Desire' | 'Pleasure' | 'Patience' | 'Celebration';

export interface QuizResult {
  primary: string;
  secondary: string[];
  raw: number[];
}

export interface Ritual {
  title: string;
  description: string;
  emotionalTone: 'soft' | 'cheeky' | 'direct' | 'slow' | 'intense' | 'inviting' | 'warm' | 'spontaneous' | 'neutral' | 'affirming';
}

export interface PartnerComparison {
  shared: string[];
  contrast: string[];
  compatibilityScore: number;
}

export interface IntimacyProfile {
  userId: string;
  lustLanguage: QuizResult | null;
  sexLanguage: QuizResult | null;
  completedAt: Date;
  entryCount: number;
}
