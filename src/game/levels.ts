import { LevelConfig } from './types';

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    name: 'Coastal Dawn',
    startDistance: 0,
    skyTop: 0x1d4ed8,
    skyHorizon: 0xfde68a,
    fogColor: 0xdbeafe,
    fogDensity: 0.0052,
    sunColor: 0xfff3d1,
    sunIntensity: 2.3,
    hemiSky: 0x7dd3fc,
    hemiGround: 0x475569,
    hemiIntensity: 0.95,
    terrainTint: 0x3b7a57,
    lampGlow: 0.15,
    trafficBaseSpeed: 18,
    trafficMaxSpeed: 26,
    playerCruiseSpeed: 32,
    playerMaxSpeed: 64, // ~230 km/h
    spawnIntervalSec: 1.15,
    barrierChance: 0.12,
  },
  {
    level: 2,
    name: 'Sunlit Canyon',
    startDistance: 750,
    skyTop: 0x0284c7,
    skyHorizon: 0xfed7aa,
    fogColor: 0xfef3c7,
    fogDensity: 0.0056,
    sunColor: 0xffedd5,
    sunIntensity: 2.5,
    hemiSky: 0x38bdf8,
    hemiGround: 0x92400e,
    hemiIntensity: 0.9,
    terrainTint: 0xa16207,
    lampGlow: 0.2,
    trafficBaseSpeed: 21,
    trafficMaxSpeed: 31,
    playerCruiseSpeed: 36,
    playerMaxSpeed: 72, // ~260 km/h
    spawnIntervalSec: 0.95,
    barrierChance: 0.2,
  },
  {
    level: 3,
    name: 'Sunset Boulevard',
    startDistance: 1700,
    skyTop: 0x311042,
    skyHorizon: 0xf97316,
    fogColor: 0xfb923c,
    fogDensity: 0.0062,
    sunColor: 0xffa756,
    sunIntensity: 2.1,
    hemiSky: 0xc084fc,
    hemiGround: 0x3f2e3e,
    hemiIntensity: 0.85,
    terrainTint: 0x4a3b32,
    lampGlow: 0.9,
    trafficBaseSpeed: 24,
    trafficMaxSpeed: 36,
    playerCruiseSpeed: 40,
    playerMaxSpeed: 80, // ~288 km/h
    spawnIntervalSec: 0.78,
    barrierChance: 0.24,
  },
  {
    level: 4,
    name: 'Midnight Express',
    startDistance: 2900,
    skyTop: 0x050816,
    skyHorizon: 0x1e3a8a,
    fogColor: 0x0f172a,
    fogDensity: 0.007,
    sunColor: 0x93c5fd,
    sunIntensity: 1.5,
    hemiSky: 0x3b82f6,
    hemiGround: 0x0f172a,
    hemiIntensity: 0.7,
    terrainTint: 0x1e293b,
    lampGlow: 1.8,
    trafficBaseSpeed: 27,
    trafficMaxSpeed: 40,
    playerCruiseSpeed: 44,
    playerMaxSpeed: 88, // ~317 km/h
    spawnIntervalSec: 0.66,
    barrierChance: 0.28,
  },
  {
    level: 5,
    name: 'Neon Overdrive',
    startDistance: 4300,
    skyTop: 0x09051a,
    skyHorizon: 0x0891b2,
    fogColor: 0x0c192c,
    fogDensity: 0.0072,
    sunColor: 0x67e8f9,
    sunIntensity: 1.65,
    hemiSky: 0x06b6d4,
    hemiGround: 0x1e1b4b,
    hemiIntensity: 0.8,
    terrainTint: 0x132a3e,
    lampGlow: 2.2,
    trafficBaseSpeed: 30,
    trafficMaxSpeed: 45,
    playerCruiseSpeed: 48,
    playerMaxSpeed: 96, // ~345 km/h
    spawnIntervalSec: 0.56,
    barrierChance: 0.32,
  },
];

export function getLevelForDistance(distanceMeters: number): LevelConfig {
  let current = LEVELS[0];
  for (let i = 0; i < LEVELS.length; i++) {
    if (distanceMeters >= LEVELS[i].startDistance) {
      current = LEVELS[i];
    }
  }
  if (distanceMeters < 6000) {
    return current;
  }
  // Endless overdrive scaling past Level 5
  const extraTiers = Math.floor((distanceMeters - 4300) / 1600);
  const base = LEVELS[LEVELS.length - 1];
  return {
    ...base,
    level: 5 + extraTiers,
    name: `Overdrive Tier ${extraTiers + 1}`,
    playerMaxSpeed: Math.min(115, base.playerMaxSpeed + extraTiers * 4),
    trafficMaxSpeed: Math.min(54, base.trafficMaxSpeed + extraTiers * 2),
    spawnIntervalSec: Math.max(0.42, base.spawnIntervalSec - extraTiers * 0.03),
  };
}
