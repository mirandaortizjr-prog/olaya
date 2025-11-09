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

export function getSharedPrompts(shared: string[], t: (key: string) => string): string[] {
  // For now, return hardcoded prompts - can add to translations later
  const lang = t('shop') === 'Tienda' ? 'es' : 'en';
  
  if (lang === 'es') {
    return shared.map(l => 
      `Ambos comparten el lenguaje ${l}. Prueben rituales que honren esta conexión.`
    );
  }
  return shared.map(l => 
    `You both share ${l} as a language. Try rituals that honor this connection.`
  );
}

export function getContrastPrompts(contrast: string[], t: (key: string) => string): string[] {
  const lang = t('shop') === 'Tienda' ? 'es' : 'en';
  
  if (lang === 'es') {
    return contrast.length > 0 
      ? [`Explora el lenguaje ${contrast[0]} de tu pareja para profundizar la comprensión.`]
      : [];
  }
  return contrast.length > 0
    ? [`Explore your partner's ${contrast[0]} language to deepen understanding.`]
    : [];
}
