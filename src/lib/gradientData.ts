// Gradient definitions matching shop items
export const GRADIENTS = {
  'purple-coral': {
    id: 'purple-coral',
    name: 'Purple Coral Gradient',
    css: 'linear-gradient(180deg, hsl(277 88% 36%), hsl(16 100% 66%))',
    startColor: 'hsl(277 88% 36%)',
    endColor: 'hsl(16 100% 66%)',
  },
  'gold-pink': {
    id: 'gold-pink',
    name: 'Gold Pink Gradient',
    css: 'linear-gradient(180deg, hsl(51 100% 50%), hsl(330 100% 71%))',
    startColor: 'hsl(51 100% 50%)',
    endColor: 'hsl(330 100% 71%)',
  },
  'pink-gold': {
    id: 'pink-gold',
    name: 'Pink Gold Gradient',
    css: 'linear-gradient(180deg, hsl(330 100% 71%), hsl(51 100% 50%))',
    startColor: 'hsl(330 100% 71%)',
    endColor: 'hsl(51 100% 50%)',
  },
  'cyan-gold': {
    id: 'cyan-gold',
    name: 'Cyan Gold Gradient',
    css: 'linear-gradient(180deg, hsl(180 100% 50%), hsl(51 100% 50%))',
    startColor: 'hsl(180 100% 50%)',
    endColor: 'hsl(51 100% 50%)',
  },
  'teal-lime': {
    id: 'teal-lime',
    name: 'Teal Lime Gradient',
    css: 'linear-gradient(180deg, hsl(180 100% 25%), hsl(120 61% 50%))',
    startColor: 'hsl(180 100% 25%)',
    endColor: 'hsl(120 61% 50%)',
  },
  'purple-lime': {
    id: 'purple-lime',
    name: 'Purple Lime Gradient',
    css: 'linear-gradient(180deg, hsl(300 100% 25%), hsl(120 61% 50%))',
    startColor: 'hsl(300 100% 25%)',
    endColor: 'hsl(120 61% 50%)',
  },
  'purple-cyan': {
    id: 'purple-cyan',
    name: 'Purple Cyan Gradient',
    css: 'linear-gradient(180deg, hsl(300 100% 25%), hsl(180 100% 50%))',
    startColor: 'hsl(300 100% 25%)',
    endColor: 'hsl(180 100% 50%)',
  },
  'blue-cyan': {
    id: 'blue-cyan',
    name: 'Blue Cyan Gradient',
    css: 'linear-gradient(180deg, hsl(240 100% 50%), hsl(180 100% 50%))',
    startColor: 'hsl(240 100% 50%)',
    endColor: 'hsl(180 100% 50%)',
  },
  'default': {
    id: 'default',
    name: 'Default Purple',
    css: 'linear-gradient(180deg, hsl(280 60% 35%), hsl(280 60% 15%))',
    startColor: 'hsl(280 60% 35%)',
    endColor: 'hsl(280 60% 15%)',
  },
};

export type GradientId = keyof typeof GRADIENTS;
