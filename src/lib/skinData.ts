import goldenElegance from '@/assets/skins/golden-elegance.png';
import passionateHearts from '@/assets/skins/passionate-hearts.png';
import pinkBokeh from '@/assets/skins/pink-bokeh.png';
import burgundyRomance from '@/assets/skins/burgundy-romance.png';
import oceanHearts from '@/assets/skins/ocean-hearts.png';
import classicLove from '@/assets/skins/classic-love.png';
import diamondLattice from '@/assets/skins/diamond-lattice.png';

export const SKINS = {
  'default': {
    id: 'default',
    name: 'Default',
    image: null,
  },
  'golden-elegance': {
    id: 'golden-elegance',
    name: 'Golden Elegance',
    image: goldenElegance,
  },
  'passionate-hearts': {
    id: 'passionate-hearts',
    name: 'Passionate Hearts',
    image: passionateHearts,
  },
  'pink-bokeh': {
    id: 'pink-bokeh',
    name: 'Pink Heart Bokeh',
    image: pinkBokeh,
  },
  'burgundy-romance': {
    id: 'burgundy-romance',
    name: 'Burgundy Romance',
    image: burgundyRomance,
  },
  'ocean-hearts': {
    id: 'ocean-hearts',
    name: 'Ocean Hearts',
    image: oceanHearts,
  },
  'classic-love': {
    id: 'classic-love',
    name: 'Classic Love',
    image: classicLove,
  },
  'diamond-lattice': {
    id: 'diamond-lattice',
    name: 'Diamond Lattice',
    image: diamondLattice,
  },
} as const;

export type SkinId = keyof typeof SKINS;
