import { PartnerComparison } from './types';

export function compareLanguages(
  userALanguages: string[], 
  userBLanguages: string[]
): PartnerComparison {
  const shared = userALanguages.filter(lang => userBLanguages.includes(lang));
  const contrast = userALanguages.filter(lang => !userBLanguages.includes(lang));

  return {
    shared,
    contrast,
    compatibilityScore: shared.length / (userALanguages.length + userBLanguages.length - shared.length),
  };
}

export function getSharedPrompts(shared: string[], language: 'en' | 'es'): string[] {
  if (language === 'es') {
    return shared.map(lang => 
      `Ambos comparten el lenguaje ${lang}. Prueben rituales que honren esta conexión.`
    );
  }
  return shared.map(lang => 
    `You both share ${lang} as a language. Try rituals that honor this connection.`
  );
}

export function getContrastPrompts(contrast: string[], language: 'en' | 'es'): string[] {
  if (language === 'es') {
    return contrast.length > 0 
      ? [`Explora el lenguaje ${contrast[0]} de tu pareja para profundizar la comprensión.`]
      : [];
  }
  return contrast.length > 0
    ? [`Explore your partner's ${contrast[0]} language to deepen understanding.`]
    : [];
}
