export type GamePhase =
  | 'menu'
  | 'garage'
  | 'shop'
  | 'settings'
  | 'exited'
  | 'playing'
  | 'paused'
  | 'crashing'
  | 'gameover';

export type CameraMode = 'chase' | 'far' | 'hood';

export type GraphicsQuality = 'low' | 'medium' | 'high';

export type CarModelId =
  | 'red_supercar'
  | 'black_beast'
  | 'blue_thunder'
  | 'white_ghost'
  | 'yellow_flash'
  | 'green_monster'
  | 'orange_rocket'
  | 'silver_bullet'
  | 'purple_shadow'
  | 'golden_king'
  | 'valkyrie_gt'
  | 'phantom_x';

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  graphicsQuality: GraphicsQuality;
  controlSensitivity: number; // 0.5 to 1.8
  vibrationEnabled: boolean;
}

export interface UpgradeLevels {
  engine: number; // 0..3
  handling: number; // 0..3
  nitro: number; // 0..3
}

export interface CarStats {
  speed: number; // 1..100 display bar
  accel: number; // 1..100 display bar
  handling: number; // 1..100 display bar
  nitro: number; // 1..100 display bar
}

export interface CarFinish {
  id: string;
  name: string;
  primaryHex: number;
  cssSwatch: string;
  caliperHex: number;
  stripeHex: number;
}

export interface CarCatalogItem {
  id: CarModelId;
  name: string;
  classLabel: string;
  tagline: string;
  price: number;
  unlockedByDefault: boolean;
  topSpeedKmh: number;
  zeroToHundredSec: number;
  stats: CarStats;
  speedBonus: number; // m/s bonus
  accelBonus: number; // damping bonus
  handlingBonus: number; // lateral m/s bonus
  nitroBonus: number; // recharge/capacity multiplier
  defaultFinish: CarFinish;
}

export const CAR_CATALOG: CarCatalogItem[] = [
  {
    id: 'red_supercar',
    name: 'Red Supercar',
    classLabel: 'V12 Exotic Coupe',
    tagline: 'Razor-sharp Italian wedge with louvered glass V12 bay and star forged wheels.',
    price: 0,
    unlockedByDefault: true,
    topSpeedKmh: 336,
    zeroToHundredSec: 2.9,
    stats: { speed: 82, accel: 80, handling: 84, nitro: 78 },
    speedBonus: 2.5,
    accelBonus: 0.25,
    handlingBonus: 0.9,
    nitroBonus: 1.06,
    defaultFinish: {
      id: 'sig_red_supercar',
      name: 'Rosso Corsa',
      primaryHex: 0xdc1428,
      cssSwatch: '#dc1428',
      caliperHex: 0xfacc15,
      stripeHex: 0xf8fafc,
    },
  },
  {
    id: 'black_beast',
    name: 'Black Beast',
    classLabel: 'Widebody Twin-Turbo',
    tagline: 'Box-flared muscle monster with supercharger hood bulge and deep bronze wheels.',
    price: 0,
    unlockedByDefault: true,
    topSpeedKmh: 344,
    zeroToHundredSec: 2.7,
    stats: { speed: 86, accel: 88, handling: 76, nitro: 84 },
    speedBonus: 4.0,
    accelBonus: 0.55,
    handlingBonus: 0.5,
    nitroBonus: 1.12,
    defaultFinish: {
      id: 'sig_black_beast',
      name: 'Obsidian Matte',
      primaryHex: 0x121620,
      cssSwatch: '#1e2433',
      caliperHex: 0xef4444,
      stripeHex: 0xdc2626,
    },
  },
  {
    id: 'blue_thunder',
    name: 'Blue Thunder',
    classLabel: 'GT3 Endurance Spec',
    tagline: 'Track-bred aero machine with front dive canards, roof intake, and high GT wing.',
    price: 0,
    unlockedByDefault: true,
    topSpeedKmh: 340,
    zeroToHundredSec: 2.8,
    stats: { speed: 84, accel: 83, handling: 92, nitro: 82 },
    speedBonus: 3.4,
    accelBonus: 0.4,
    handlingBonus: 1.9,
    nitroBonus: 1.1,
    defaultFinish: {
      id: 'sig_blue_thunder',
      name: 'Cobalt Storm',
      primaryHex: 0x0284c7,
      cssSwatch: '#0284c7',
      caliperHex: 0x38bdf8,
      stripeHex: 0xf8fafc,
    },
  },
  {
    id: 'white_ghost',
    name: 'White Ghost',
    classLabel: 'Longtail Hyper-GT',
    tagline: 'Extended speedtail rear deck, full glass canopy, dorsal fin, and aero turbofans.',
    price: 0,
    unlockedByDefault: true,
    topSpeedKmh: 358,
    zeroToHundredSec: 2.6,
    stats: { speed: 91, accel: 86, handling: 85, nitro: 88 },
    speedBonus: 6.5,
    accelBonus: 0.5,
    handlingBonus: 1.3,
    nitroBonus: 1.18,
    defaultFinish: {
      id: 'sig_white_ghost',
      name: 'Glacier Pearl',
      primaryHex: 0xeff4fa,
      cssSwatch: '#eff4fa',
      caliperHex: 0x06b6d4,
      stripeHex: 0x0f172a,
    },
  },
  {
    id: 'yellow_flash',
    name: 'Yellow Flash',
    classLabel: 'V10 Angular Wedge',
    tagline: 'Crisp faceted hyper-wedge with Y-blade LEDs, vented rear deck, and hex exhaust.',
    price: 0,
    unlockedByDefault: true,
    topSpeedKmh: 348,
    zeroToHundredSec: 2.5,
    stats: { speed: 87, accel: 91, handling: 88, nitro: 85 },
    speedBonus: 4.8,
    accelBonus: 0.75,
    handlingBonus: 1.5,
    nitroBonus: 1.15,
    defaultFinish: {
      id: 'sig_yellow_flash',
      name: 'Volt Giallo',
      primaryHex: 0xfacc15,
      cssSwatch: '#facc15',
      caliperHex: 0x111827,
      stripeHex: 0x111827,
    },
  },
  {
    id: 'green_monster',
    name: 'Green Monster',
    classLabel: 'Time-Attack Apex',
    tagline: 'Chassis-mounted bi-plane GT wing, strut-braced splitter, and wide fenders.',
    price: 0,
    unlockedByDefault: true,
    topSpeedKmh: 342,
    zeroToHundredSec: 2.7,
    stats: { speed: 85, accel: 85, handling: 95, nitro: 86 },
    speedBonus: 3.8,
    accelBonus: 0.45,
    handlingBonus: 2.25,
    nitroBonus: 1.16,
    defaultFinish: {
      id: 'sig_green_monster',
      name: 'Venom Emerald',
      primaryHex: 0x16a34a,
      cssSwatch: '#16a34a',
      caliperHex: 0xa3e635,
      stripeHex: 0x84cc16,
    },
  },
  {
    id: 'orange_rocket',
    name: 'Orange Rocket',
    classLabel: 'Top-Speed Streamliner',
    tagline: 'Slippery teardrop silhouette with shoulder snorkels and high center rocket exhausts.',
    price: 0,
    unlockedByDefault: true,
    topSpeedKmh: 368,
    zeroToHundredSec: 2.5,
    stats: { speed: 95, accel: 89, handling: 83, nitro: 94 },
    speedBonus: 8.5,
    accelBonus: 0.65,
    handlingBonus: 1.1,
    nitroBonus: 1.28,
    defaultFinish: {
      id: 'sig_orange_rocket',
      name: 'Papaya Blaze',
      primaryHex: 0xf97316,
      cssSwatch: '#f97316',
      caliperHex: 0xfbbf24,
      stripeHex: 0x18181b,
    },
  },
  {
    id: 'silver_bullet',
    name: 'Silver Bullet',
    classLabel: 'Grand Touring V12',
    tagline: 'Cab-backward liquid-chrome GT with vertical-slat grille and active ducktail.',
    price: 0,
    unlockedByDefault: true,
    topSpeedKmh: 352,
    zeroToHundredSec: 2.8,
    stats: { speed: 89, accel: 84, handling: 89, nitro: 84 },
    speedBonus: 5.5,
    accelBonus: 0.42,
    handlingBonus: 1.65,
    nitroBonus: 1.14,
    defaultFinish: {
      id: 'sig_silver_bullet',
      name: 'Liquid Mercury',
      primaryHex: 0xd4dbe6,
      cssSwatch: '#d4dbe6',
      caliperHex: 0xdc2626,
      stripeHex: 0x334155,
    },
  },
  {
    id: 'purple_shadow',
    name: 'Purple Shadow',
    classLabel: 'Midnight Street Tuner',
    tagline: 'Fastback widebody coupe with vented hood, quad-ring tails, and neon underglow.',
    price: 0,
    unlockedByDefault: true,
    topSpeedKmh: 346,
    zeroToHundredSec: 2.6,
    stats: { speed: 86, accel: 90, handling: 91, nitro: 90 },
    speedBonus: 4.5,
    accelBonus: 0.72,
    handlingBonus: 1.85,
    nitroBonus: 1.24,
    defaultFinish: {
      id: 'sig_purple_shadow',
      name: 'Midnight Amethyst',
      primaryHex: 0x7c3aed,
      cssSwatch: '#7c3aed',
      caliperHex: 0xf43f5e,
      stripeHex: 0xc084fc,
    },
  },
  {
    id: 'golden_king',
    name: 'Golden King',
    classLabel: 'Royal Flagship Hypercar',
    tagline: 'Double-bubble roof hyper-coupe with crown-forged wheels and bespoke 24K trim.',
    price: 0,
    unlockedByDefault: true,
    topSpeedKmh: 374,
    zeroToHundredSec: 2.4,
    stats: { speed: 96, accel: 94, handling: 92, nitro: 95 },
    speedBonus: 9.5,
    accelBonus: 0.95,
    handlingBonus: 2.0,
    nitroBonus: 1.32,
    defaultFinish: {
      id: 'sig_golden_king',
      name: 'Royal 24K Gold',
      primaryHex: 0xeab308,
      cssSwatch: '#eab308',
      caliperHex: 0x10b981,
      stripeHex: 0x0f172a,
    },
  },
  {
    id: 'valkyrie_gt',
    name: 'Crimson Valkyrie',
    classLabel: 'Le Mans Prototype',
    tagline: 'Endurance prototype with dorsal shark fin, roof snorkel, and low-drag tail.',
    price: 900,
    unlockedByDefault: false,
    topSpeedKmh: 382,
    zeroToHundredSec: 2.3,
    stats: { speed: 98, accel: 95, handling: 94, nitro: 96 },
    speedBonus: 11.2,
    accelBonus: 1.05,
    handlingBonus: 2.2,
    nitroBonus: 1.36,
    defaultFinish: {
      id: 'sig_valkyrie_gt',
      name: 'Crimson Carbon',
      primaryHex: 0x991b1b,
      cssSwatch: '#991b1b',
      caliperHex: 0xfef08a,
      stripeHex: 0xf8fafc,
    },
  },
  {
    id: 'phantom_x',
    name: 'Phantom X Carbon',
    classLabel: 'Ultimate Apex Spec',
    tagline: 'Twin-turbo exposed-carbon track weapon with dual DRS wing and quad center pipes.',
    price: 1800,
    unlockedByDefault: false,
    topSpeedKmh: 394,
    zeroToHundredSec: 2.1,
    stats: { speed: 100, accel: 98, handling: 97, nitro: 99 },
    speedBonus: 13.5,
    accelBonus: 1.2,
    handlingBonus: 2.6,
    nitroBonus: 1.42,
    defaultFinish: {
      id: 'sig_phantom_x',
      name: 'Stealth Carbon',
      primaryHex: 0x1e293b,
      cssSwatch: '#334155',
      caliperHex: 0x38bdf8,
      stripeHex: 0xef4444,
    },
  },
];

export const CAR_FINISHES: CarFinish[] = [
  {
    id: 'rosso',
    name: 'Rosso Corsa',
    primaryHex: 0xef233c,
    cssSwatch: '#ef233c',
    caliperHex: 0xf59e0b,
    stripeHex: 0xffffff,
  },
  {
    id: 'cyan',
    name: 'Volt Cyan',
    primaryHex: 0x06b6d4,
    cssSwatch: '#06b6d4',
    caliperHex: 0xf97316,
    stripeHex: 0x0f172a,
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    primaryHex: 0xf59e0b,
    cssSwatch: '#f59e0b',
    caliperHex: 0xef4444,
    stripeHex: 0x111827,
  },
  {
    id: 'obsidian',
    name: 'Obsidian GT',
    primaryHex: 0x1e293b,
    cssSwatch: '#334155',
    caliperHex: 0x06b6d4,
    stripeHex: 0xef4444,
  },
  {
    id: 'emerald',
    name: 'Emerald Viper',
    primaryHex: 0x10b981,
    cssSwatch: '#10b981',
    caliperHex: 0xfbbf24,
    stripeHex: 0x090d16,
  },
  {
    id: 'pearl',
    name: 'Pearl Titanium',
    primaryHex: 0xe2e8f0,
    cssSwatch: '#e2e8f0',
    caliperHex: 0xef4444,
    stripeHex: 0x1e293b,
  },
  {
    id: 'amethyst',
    name: 'Royal Violet',
    primaryHex: 0x7c3aed,
    cssSwatch: '#7c3aed',
    caliperHex: 0xf43f5e,
    stripeHex: 0xfef08a,
  },
];

export function resolveCarFinish(car: CarCatalogItem, finishId: string): CarFinish {
  if (finishId === 'signature') {
    return car.defaultFinish;
  }
  return CAR_FINISHES.find((f) => f.id === finishId) ?? car.defaultFinish;
}

export interface ControlInput {
  left: boolean;
  right: boolean;
  accelerate: boolean;
  brake: boolean;
  nitro: boolean;
}

export interface HudTelemetry {
  speedKmh: number;
  maxSpeedKmh: number;
  nitro: number; // 0 to 100
  nitroActive: boolean;
  score: number;
  coins: number;
  distanceMeters: number;
  level: number;
  levelName: string;
  nearMissCombo: number;
  eventBanner: string | null;
}

export interface RunSummary {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  coins: number;
  totalCoins: number;
  distanceMeters: number;
  maxSpeedKmh: number;
  level: number;
  levelName: string;
}

export interface LevelConfig {
  level: number;
  name: string;
  startDistance: number;
  skyTop: number;
  skyHorizon: number;
  fogColor: number;
  fogDensity: number;
  sunColor: number;
  sunIntensity: number;
  hemiSky: number;
  hemiGround: number;
  hemiIntensity: number;
  terrainTint: number;
  lampGlow: number;
  trafficBaseSpeed: number; // m/s
  trafficMaxSpeed: number; // m/s
  playerCruiseSpeed: number; // m/s
  playerMaxSpeed: number; // m/s
  spawnIntervalSec: number;
  barrierChance: number;
}
