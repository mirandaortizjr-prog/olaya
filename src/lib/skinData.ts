import goldenElegance from '@/assets/skins/golden-elegance.png';
import passionateHearts from '@/assets/skins/passionate-hearts.png';
import pinkBokeh from '@/assets/skins/pink-bokeh.png';
import burgundyRomance from '@/assets/skins/burgundy-romance.png';
import oceanHearts from '@/assets/skins/ocean-hearts.png';
import classicLove from '@/assets/skins/classic-love.png';
import diamondLattice from '@/assets/skins/diamond-lattice.png';
import goldenMarble from '@/assets/skins/golden-marble.png';
import whiteRadiance from '@/assets/skins/white-radiance.png';
import roseGoldShimmer from '@/assets/skins/rose-gold-shimmer.png';
import pinkFlowers from '@/assets/skins/pink-flowers.png';
import celestialWatercolor from '@/assets/skins/celestial-watercolor.png';
import pinkFloralGarden from '@/assets/skins/pink-floral-garden.png';
import pinkGoldWatercolor from '@/assets/skins/pink-gold-watercolor.png';
import baseballs from '@/assets/skins/baseballs.png';
import soccerGoal from '@/assets/skins/soccer-goal.png';
import baseballCloseup from '@/assets/skins/baseball-closeup.png';
import baseballVintage from '@/assets/skins/baseball-vintage.png';
import footballField from '@/assets/skins/football-field.png';
import basketballFire from '@/assets/skins/basketball-fire.png';
import footballTexture from '@/assets/skins/football-texture.png';

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
  'golden-marble': {
    id: 'golden-marble',
    name: 'Golden Marble',
    image: goldenMarble,
  },
  'white-radiance': {
    id: 'white-radiance',
    name: 'White Radiance',
    image: whiteRadiance,
  },
  'rose-gold-shimmer': {
    id: 'rose-gold-shimmer',
    name: 'Rose Gold Shimmer',
    image: roseGoldShimmer,
  },
  'pink-flowers': {
    id: 'pink-flowers',
    name: 'Pink Flowers',
    image: pinkFlowers,
  },
  'celestial-watercolor': {
    id: 'celestial-watercolor',
    name: 'Celestial Watercolor',
    image: celestialWatercolor,
  },
  'pink-floral-garden': {
    id: 'pink-floral-garden',
    name: 'Pink Floral Garden',
    image: pinkFloralGarden,
  },
  'pink-gold-watercolor': {
    id: 'pink-gold-watercolor',
    name: 'Pink Gold Watercolor',
    image: pinkGoldWatercolor,
  },
  'baseballs': {
    id: 'baseballs',
    name: 'Baseballs',
    image: baseballs,
  },
  'soccer-goal': {
    id: 'soccer-goal',
    name: 'Soccer Goal',
    image: soccerGoal,
  },
  'baseball-closeup': {
    id: 'baseball-closeup',
    name: 'Baseball Closeup',
    image: baseballCloseup,
  },
  'baseball-vintage': {
    id: 'baseball-vintage',
    name: 'Baseball Vintage',
    image: baseballVintage,
  },
  'football-field': {
    id: 'football-field',
    name: 'Football Field',
    image: footballField,
  },
  'basketball-fire': {
    id: 'basketball-fire',
    name: 'Basketball Fire',
    image: basketballFire,
  },
  'football-texture': {
    id: 'football-texture',
    name: 'Football Texture',
    image: footballTexture,
  },
} as const;

export type SkinId = keyof typeof SKINS;
