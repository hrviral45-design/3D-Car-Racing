import * as THREE from 'three';
import { CarFinish, CarModelId } from './types';

export interface PlayerCarRig {
  carId: CarModelId;
  root: THREE.Group;
  bodyTiltGroup: THREE.Group;
  wheels: THREE.Group[];
  wheelHubs: THREE.Group[];
  frontSteerPivots: THREE.Group[];
  steeringWheel: THREE.Group;
  nitroFlames: THREE.Mesh[];
  paintMaterial: THREE.MeshPhysicalMaterial;
  stripeMaterial: THREE.MeshStandardMaterial;
  caliperMaterial: THREE.MeshStandardMaterial;
  taillightMaterial: THREE.MeshStandardMaterial;
  setFinish: (finish: CarFinish) => void;
  dispose: () => void;
}

export interface SharedAssets {
  shadowTexture: THREE.CanvasTexture;
  hazardTexture: THREE.CanvasTexture;
  grilleTexture: THREE.CanvasTexture;
  brakeDiscTexture: THREE.CanvasTexture;
}

type HeadlightStyle =
  | 'blade_dual'
  | 'slit_quad'
  | 'pod_endurance'
  | 'halo_oval'
  | 'y_fang'
  | 'triple_stack';

type TaillightStyle =
  | 'quad_round'
  | 'full_blade'
  | 'y_hex'
  | 'twin_bar'
  | 'quad_ring';

type GrilleStyle =
  | 'exotic_split'
  | 'muscle_deep'
  | 'gt3_endurance'
  | 'aero_minimal'
  | 'vertical_chrome'
  | 'horseshoe'
  | 'track_brace';

type HoodStyle =
  | 'louvered_v12'
  | 'blower_bulge'
  | 'extractor_vent'
  | 'clean_channel'
  | 'twin_nostril'
  | 'long_v12';

type RoofStyle =
  | 'coupe'
  | 'carbon_roof'
  | 'glass_canopy'
  | 'double_bubble'
  | 'roof_scoop'
  | 'fastback_slats';

type SideStyle =
  | 'naca_scoop'
  | 'wide_overfender'
  | 'blade_side'
  | 'fender_louvers'
  | 'chrome_vent'
  | 'teardrop_skirt';

type WingStyle =
  | 'low_aero'
  | 'ducktail_lip'
  | 'swan_gt3'
  | 'twin_winglet'
  | 'biplane_track'
  | 'split_bridge'
  | 'none_ducktail'
  | 'jdm_mid'
  | 'dual_drs';

type ExhaustStyle =
  | 'quad_side'
  | 'quad_angled'
  | 'twin_center'
  | 'hex_center'
  | 'rocket_high'
  | 'cannon_dual'
  | 'gold_trapezoid';

type RimStyle = 'twin5' | 'deep6' | 'mesh10' | 'turbofan' | 'turbine5';

export interface CarBodyDesignSpec {
  baseHalfW: number;
  frontLen: number;
  rearLen: number;
  noseTaperAmount: number;
  tailTaperAmount: number;
  waistPinch: number;
  frontFlare: number;
  rearFlare: number;
  hoodDrop: number;
  hoodDip: number;
  rearDeckBoost: number;
  roofHeight: number;
  roofWidth: number;
  roofZ: number;
  roofLen: number;
  cabinRake: number;
  paintMetalness: number;
  paintRoughness: number;
  clearcoatRoughness: number;
  trimHex: number;
  trimMetalness: number;
  trimRoughness: number;
  rimHex: number;
  rimStyle: RimStyle;
  headlightStyle: HeadlightStyle;
  taillightStyle: TaillightStyle;
  grilleStyle: GrilleStyle;
  hoodStyle: HoodStyle;
  roofStyle: RoofStyle;
  sideStyle: SideStyle;
  wingStyle: WingStyle;
  exhaustStyle: ExhaustStyle;
  hasHoodStripes: boolean;
  underglowHex?: number;
  drlHex?: number;
}

export const CAR_DESIGN_SPECS: Record<CarModelId, CarBodyDesignSpec> = {
  red_supercar: {
    baseHalfW: 0.91,
    frontLen: 2.24,
    rearLen: 2.24,
    noseTaperAmount: 0.25,
    tailTaperAmount: 0.08,
    waistPinch: -0.055,
    frontFlare: 0.1,
    rearFlare: 0.125,
    hoodDrop: 0.27,
    hoodDip: -0.05,
    rearDeckBoost: 0.04,
    roofHeight: 1.14,
    roofWidth: 1.16,
    roofZ: 0.0,
    roofLen: 0.92,
    cabinRake: 0,
    paintMetalness: 0.78,
    paintRoughness: 0.12,
    clearcoatRoughness: 0.03,
    trimHex: 0x11151e,
    trimMetalness: 0.35,
    trimRoughness: 0.4,
    rimHex: 0xe2e8f0,
    rimStyle: 'twin5',
    headlightStyle: 'blade_dual',
    taillightStyle: 'quad_round',
    grilleStyle: 'exotic_split',
    hoodStyle: 'louvered_v12',
    roofStyle: 'coupe',
    sideStyle: 'naca_scoop',
    wingStyle: 'low_aero',
    exhaustStyle: 'quad_side',
    hasHoodStripes: false,
  },
  black_beast: {
    baseHalfW: 0.96,
    frontLen: 2.28,
    rearLen: 2.2,
    noseTaperAmount: 0.11,
    tailTaperAmount: 0.04,
    waistPinch: -0.025,
    frontFlare: 0.145,
    rearFlare: 0.16,
    hoodDrop: 0.19,
    hoodDip: 0.045,
    rearDeckBoost: 0.06,
    roofHeight: 1.19,
    roofWidth: 1.24,
    roofZ: 0.14,
    roofLen: 1.0,
    cabinRake: 0.08,
    paintMetalness: 0.55,
    paintRoughness: 0.28,
    clearcoatRoughness: 0.14,
    trimHex: 0x090b10,
    trimMetalness: 0.45,
    trimRoughness: 0.45,
    rimHex: 0xb45309,
    rimStyle: 'deep6',
    headlightStyle: 'slit_quad',
    taillightStyle: 'twin_bar',
    grilleStyle: 'muscle_deep',
    hoodStyle: 'blower_bulge',
    roofStyle: 'fastback_slats',
    sideStyle: 'wide_overfender',
    wingStyle: 'ducktail_lip',
    exhaustStyle: 'quad_angled',
    hasHoodStripes: true,
    drlHex: 0xffedd5,
  },
  blue_thunder: {
    baseHalfW: 0.92,
    frontLen: 2.26,
    rearLen: 2.22,
    noseTaperAmount: 0.22,
    tailTaperAmount: 0.07,
    waistPinch: -0.048,
    frontFlare: 0.115,
    rearFlare: 0.13,
    hoodDrop: 0.25,
    hoodDip: -0.04,
    rearDeckBoost: 0.03,
    roofHeight: 1.15,
    roofWidth: 1.16,
    roofZ: 0.02,
    roofLen: 0.94,
    cabinRake: 0,
    paintMetalness: 0.76,
    paintRoughness: 0.14,
    clearcoatRoughness: 0.04,
    trimHex: 0x0f172a,
    trimMetalness: 0.4,
    trimRoughness: 0.38,
    rimHex: 0xf1f5f9,
    rimStyle: 'mesh10',
    headlightStyle: 'pod_endurance',
    taillightStyle: 'twin_bar',
    grilleStyle: 'gt3_endurance',
    hoodStyle: 'extractor_vent',
    roofStyle: 'roof_scoop',
    sideStyle: 'fender_louvers',
    wingStyle: 'swan_gt3',
    exhaustStyle: 'quad_side',
    hasHoodStripes: true,
    drlHex: 0xbae6fd,
  },
  white_ghost: {
    baseHalfW: 0.93,
    frontLen: 2.26,
    rearLen: 2.52,
    noseTaperAmount: 0.29,
    tailTaperAmount: 0.17,
    waistPinch: -0.06,
    frontFlare: 0.095,
    rearFlare: 0.12,
    hoodDrop: 0.28,
    hoodDip: -0.04,
    rearDeckBoost: 0.02,
    roofHeight: 1.1,
    roofWidth: 1.06,
    roofZ: -0.02,
    roofLen: 1.04,
    cabinRake: -0.06,
    paintMetalness: 0.62,
    paintRoughness: 0.11,
    clearcoatRoughness: 0.025,
    trimHex: 0x1e293b,
    trimMetalness: 0.55,
    trimRoughness: 0.28,
    rimHex: 0xf8fafc,
    rimStyle: 'turbofan',
    headlightStyle: 'blade_dual',
    taillightStyle: 'full_blade',
    grilleStyle: 'aero_minimal',
    hoodStyle: 'clean_channel',
    roofStyle: 'glass_canopy',
    sideStyle: 'teardrop_skirt',
    wingStyle: 'twin_winglet',
    exhaustStyle: 'twin_center',
    hasHoodStripes: false,
    drlHex: 0xe0f2fe,
  },
  yellow_flash: {
    baseHalfW: 0.94,
    frontLen: 2.28,
    rearLen: 2.2,
    noseTaperAmount: 0.31,
    tailTaperAmount: 0.06,
    waistPinch: -0.062,
    frontFlare: 0.11,
    rearFlare: 0.14,
    hoodDrop: 0.31,
    hoodDip: -0.055,
    rearDeckBoost: 0.05,
    roofHeight: 1.11,
    roofWidth: 1.12,
    roofZ: -0.05,
    roofLen: 0.88,
    cabinRake: -0.04,
    paintMetalness: 0.72,
    paintRoughness: 0.13,
    clearcoatRoughness: 0.03,
    trimHex: 0x0d1017,
    trimMetalness: 0.4,
    trimRoughness: 0.36,
    rimHex: 0xfacc15,
    rimStyle: 'twin5',
    headlightStyle: 'y_fang',
    taillightStyle: 'y_hex',
    grilleStyle: 'exotic_split',
    hoodStyle: 'louvered_v12',
    roofStyle: 'carbon_roof',
    sideStyle: 'blade_side',
    wingStyle: 'low_aero',
    exhaustStyle: 'hex_center',
    hasHoodStripes: false,
  },
  green_monster: {
    baseHalfW: 0.97,
    frontLen: 2.22,
    rearLen: 2.22,
    noseTaperAmount: 0.2,
    tailTaperAmount: 0.06,
    waistPinch: -0.04,
    frontFlare: 0.15,
    rearFlare: 0.165,
    hoodDrop: 0.23,
    hoodDip: -0.035,
    rearDeckBoost: 0.04,
    roofHeight: 1.16,
    roofWidth: 1.18,
    roofZ: 0.04,
    roofLen: 0.92,
    cabinRake: 0.02,
    paintMetalness: 0.68,
    paintRoughness: 0.15,
    clearcoatRoughness: 0.035,
    trimHex: 0x141923,
    trimMetalness: 0.4,
    trimRoughness: 0.42,
    rimHex: 0x84cc16,
    rimStyle: 'turbine5',
    headlightStyle: 'slit_quad',
    taillightStyle: 'twin_bar',
    grilleStyle: 'track_brace',
    hoodStyle: 'extractor_vent',
    roofStyle: 'carbon_roof',
    sideStyle: 'wide_overfender',
    wingStyle: 'biplane_track',
    exhaustStyle: 'quad_angled',
    hasHoodStripes: true,
    underglowHex: 0x4ade80,
  },
  orange_rocket: {
    baseHalfW: 0.92,
    frontLen: 2.3,
    rearLen: 2.38,
    noseTaperAmount: 0.3,
    tailTaperAmount: 0.14,
    waistPinch: -0.068,
    frontFlare: 0.1,
    rearFlare: 0.135,
    hoodDrop: 0.29,
    hoodDip: -0.05,
    rearDeckBoost: 0.05,
    roofHeight: 1.1,
    roofWidth: 1.05,
    roofZ: -0.04,
    roofLen: 0.92,
    cabinRake: -0.05,
    paintMetalness: 0.82,
    paintRoughness: 0.12,
    clearcoatRoughness: 0.028,
    trimHex: 0x181c26,
    trimMetalness: 0.48,
    trimRoughness: 0.34,
    rimHex: 0xe5e7eb,
    rimStyle: 'turbine5',
    headlightStyle: 'blade_dual',
    taillightStyle: 'full_blade',
    grilleStyle: 'aero_minimal',
    hoodStyle: 'clean_channel',
    roofStyle: 'glass_canopy',
    sideStyle: 'naca_scoop',
    wingStyle: 'split_bridge',
    exhaustStyle: 'rocket_high',
    hasHoodStripes: false,
  },
  silver_bullet: {
    baseHalfW: 0.9,
    frontLen: 2.38,
    rearLen: 2.12,
    noseTaperAmount: 0.18,
    tailTaperAmount: 0.11,
    waistPinch: -0.035,
    frontFlare: 0.085,
    rearFlare: 0.115,
    hoodDrop: 0.18,
    hoodDip: 0.01,
    rearDeckBoost: 0.03,
    roofHeight: 1.17,
    roofWidth: 1.18,
    roofZ: 0.22,
    roofLen: 0.96,
    cabinRake: 0.12,
    paintMetalness: 0.94,
    paintRoughness: 0.08,
    clearcoatRoughness: 0.02,
    trimHex: 0xe2e8f0,
    trimMetalness: 0.95,
    trimRoughness: 0.09,
    rimHex: 0xf8fafc,
    rimStyle: 'mesh10',
    headlightStyle: 'halo_oval',
    taillightStyle: 'twin_bar',
    grilleStyle: 'vertical_chrome',
    hoodStyle: 'long_v12',
    roofStyle: 'coupe',
    sideStyle: 'chrome_vent',
    wingStyle: 'none_ducktail',
    exhaustStyle: 'quad_side',
    hasHoodStripes: false,
  },
  purple_shadow: {
    baseHalfW: 0.94,
    frontLen: 2.24,
    rearLen: 2.22,
    noseTaperAmount: 0.17,
    tailTaperAmount: 0.06,
    waistPinch: -0.038,
    frontFlare: 0.135,
    rearFlare: 0.15,
    hoodDrop: 0.21,
    hoodDip: -0.02,
    rearDeckBoost: 0.04,
    roofHeight: 1.16,
    roofWidth: 1.2,
    roofZ: 0.08,
    roofLen: 0.98,
    cabinRake: 0.06,
    paintMetalness: 0.84,
    paintRoughness: 0.15,
    clearcoatRoughness: 0.035,
    trimHex: 0x11131c,
    trimMetalness: 0.45,
    trimRoughness: 0.38,
    rimHex: 0xd97706,
    rimStyle: 'deep6',
    headlightStyle: 'slit_quad',
    taillightStyle: 'quad_ring',
    grilleStyle: 'muscle_deep',
    hoodStyle: 'twin_nostril',
    roofStyle: 'fastback_slats',
    sideStyle: 'wide_overfender',
    wingStyle: 'jdm_mid',
    exhaustStyle: 'cannon_dual',
    hasHoodStripes: false,
    underglowHex: 0xa855f7,
    drlHex: 0xf5d0fe,
  },
  golden_king: {
    baseHalfW: 0.95,
    frontLen: 2.28,
    rearLen: 2.28,
    noseTaperAmount: 0.22,
    tailTaperAmount: 0.1,
    waistPinch: -0.052,
    frontFlare: 0.125,
    rearFlare: 0.145,
    hoodDrop: 0.23,
    hoodDip: -0.03,
    rearDeckBoost: 0.06,
    roofHeight: 1.15,
    roofWidth: 1.16,
    roofZ: 0.04,
    roofLen: 0.94,
    cabinRake: 0.02,
    paintMetalness: 0.91,
    paintRoughness: 0.11,
    clearcoatRoughness: 0.025,
    trimHex: 0xfde047,
    trimMetalness: 0.92,
    trimRoughness: 0.14,
    rimHex: 0xfacc15,
    rimStyle: 'mesh10',
    headlightStyle: 'triple_stack',
    taillightStyle: 'full_blade',
    grilleStyle: 'horseshoe',
    hoodStyle: 'clean_channel',
    roofStyle: 'double_bubble',
    sideStyle: 'blade_side',
    wingStyle: 'low_aero',
    exhaustStyle: 'gold_trapezoid',
    hasHoodStripes: true,
    drlHex: 0xfef9c3,
  },
  valkyrie_gt: {
    baseHalfW: 0.93,
    frontLen: 2.28,
    rearLen: 2.44,
    noseTaperAmount: 0.28,
    tailTaperAmount: 0.14,
    waistPinch: -0.065,
    frontFlare: 0.115,
    rearFlare: 0.135,
    hoodDrop: 0.29,
    hoodDip: -0.055,
    rearDeckBoost: 0.04,
    roofHeight: 1.11,
    roofWidth: 1.06,
    roofZ: -0.04,
    roofLen: 0.96,
    cabinRake: -0.04,
    paintMetalness: 0.8,
    paintRoughness: 0.13,
    clearcoatRoughness: 0.03,
    trimHex: 0x0f141e,
    trimMetalness: 0.42,
    trimRoughness: 0.36,
    rimHex: 0xfef08a,
    rimStyle: 'turbofan',
    headlightStyle: 'pod_endurance',
    taillightStyle: 'quad_round',
    grilleStyle: 'aero_minimal',
    hoodStyle: 'extractor_vent',
    roofStyle: 'roof_scoop',
    sideStyle: 'teardrop_skirt',
    wingStyle: 'swan_gt3',
    exhaustStyle: 'twin_center',
    hasHoodStripes: true,
  },
  phantom_x: {
    baseHalfW: 0.97,
    frontLen: 2.28,
    rearLen: 2.3,
    noseTaperAmount: 0.26,
    tailTaperAmount: 0.08,
    waistPinch: -0.058,
    frontFlare: 0.14,
    rearFlare: 0.155,
    hoodDrop: 0.28,
    hoodDip: -0.05,
    rearDeckBoost: 0.05,
    roofHeight: 1.13,
    roofWidth: 1.12,
    roofZ: 0.0,
    roofLen: 0.92,
    cabinRake: 0,
    paintMetalness: 0.72,
    paintRoughness: 0.16,
    clearcoatRoughness: 0.04,
    trimHex: 0x0b0f17,
    trimMetalness: 0.45,
    trimRoughness: 0.35,
    rimHex: 0xfbbf24,
    rimStyle: 'turbine5',
    headlightStyle: 'y_fang',
    taillightStyle: 'y_hex',
    grilleStyle: 'gt3_endurance',
    hoodStyle: 'extractor_vent',
    roofStyle: 'roof_scoop',
    sideStyle: 'fender_louvers',
    wingStyle: 'dual_drs',
    exhaustStyle: 'quad_angled',
    hasHoodStripes: true,
    underglowHex: 0x38bdf8,
  },
};

function gaussian(x: number, center: number, width: number): number {
  const d = (x - center) / width;
  return Math.exp(-d * d);
}

/**
 * Generates a compound-curved lofted sports car body shell tailored to each
 * car's individual CarBodyDesignSpec proportions, overhangs, stance, and muscle.
 */
function buildSculptedBodyGeometry(spec: CarBodyDesignSpec): THREE.BufferGeometry {
  const totalLen = spec.frontLen + spec.rearLen;
  const ringCount = 21;
  const zStations: number[] = [];
  for (let i = 0; i < ringCount; i++) {
    const frac = i / (ringCount - 1);
    zStations.push(-spec.frontLen + frac * totalLen);
  }

  const frontWheelZ = -1.36;
  const rearWheelZ = 1.34;
  const ringRings: THREE.Vector3[][] = [];

  for (let i = 0; i < zStations.length; i++) {
    const z = zStations[i];
    const t = (z + spec.frontLen) / totalLen;

    const frontStart = -spec.frontLen + 0.56;
    const noseTaper =
      z < frontStart
        ? 1 - Math.pow((frontStart - z) / 0.56, 1.65) * spec.noseTaperAmount
        : 1;

    const rearStart = spec.rearLen - 0.45;
    const tailTaper =
      z > rearStart
        ? 1 - Math.pow((z - rearStart) / 0.45, 1.5) * spec.tailTaperAmount
        : 1;

    const waistPinch = spec.waistPinch * gaussian(z, 0.05, 0.55);
    const frontFlare = spec.frontFlare * gaussian(z, frontWheelZ, 0.36);
    const rearFlare = spec.rearFlare * gaussian(z, rearWheelZ, 0.42);

    const frontWell = gaussian(z, frontWheelZ, 0.28);
    const rearWell = gaussian(z, rearWheelZ, 0.31);
    const wellRecess = Math.max(frontWell, rearWell) * 0.23;

    const upperHalfW =
      (spec.baseHalfW + waistPinch + frontFlare + rearFlare) *
      noseTaper *
      tailTaper;
    const lowerHalfW = Math.max(0.54, upperHalfW - 0.06 - wellRecess);

    const dropStart = -spec.frontLen + 0.78;
    const frontDrop =
      z < dropStart
        ? Math.pow((dropStart - z) / 0.78, 1.35) * spec.hoodDrop
        : 0;

    const bottomY =
      0.16 +
      (z < -spec.frontLen + 0.3 ? (-spec.frontLen + 0.3 - z) * 0.12 : 0) +
      (z > spec.rearLen - 0.5 ? (z - (spec.rearLen - 0.5)) * 0.18 : 0);

    const frontArchRise = 0.09 * gaussian(z, frontWheelZ, 0.42);
    const rearArchRise = 0.13 * gaussian(z, rearWheelZ, 0.48);
    const baseDeck = 0.56 + t * 0.18 - frontDrop + frontArchRise + rearArchRise;
    const shoulderY = baseDeck - 0.05;

    const hoodDip =
      z > -spec.frontLen + 0.25 && z < -0.7
        ? spec.hoodDip * gaussian(z, -1.32, 0.45)
        : 0;
    const rearDeckLift =
      z > 0.65 && z < spec.rearLen - 0.25
        ? spec.rearDeckBoost * gaussian(z, 1.25, 0.52)
        : 0;
    const centerY = baseDeck + 0.04 + hoodDip + rearDeckLift;

    const archTopY = bottomY + 0.14 + Math.max(frontWell, rearWell) * 0.36;

    const halfPts: [number, number][] = [
      [0, bottomY],
      [lowerHalfW * 0.78, bottomY + 0.02],
      [lowerHalfW, archTopY],
      [upperHalfW * 0.97, (archTopY + shoulderY) * 0.52],
      [upperHalfW, shoulderY],
      [upperHalfW * 0.91, baseDeck],
      [upperHalfW * 0.56, centerY - 0.01],
      [0, centerY],
    ];

    const ring: THREE.Vector3[] = [];
    for (let p = 0; p < halfPts.length; p++) {
      ring.push(new THREE.Vector3(halfPts[p][0], halfPts[p][1], z));
    }
    for (let p = halfPts.length - 2; p >= 1; p--) {
      ring.push(new THREE.Vector3(-halfPts[p][0], halfPts[p][1], z));
    }
    ringRings.push(ring);
  }

  const ptsPerRing = ringRings[0].length;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i < ringRings.length; i++) {
    const u = i / (ringRings.length - 1);
    for (let j = 0; j < ptsPerRing; j++) {
      const v = ringRings[i][j];
      positions.push(v.x, v.y, v.z);
      uvs.push(u, j / ptsPerRing);
    }
  }

  for (let i = 0; i < ringRings.length - 1; i++) {
    for (let j = 0; j < ptsPerRing; j++) {
      const nextJ = (j + 1) % ptsPerRing;
      const a = i * ptsPerRing + j;
      const b = (i + 1) * ptsPerRing + j;
      const c = (i + 1) * ptsPerRing + nextJ;
      const d = i * ptsPerRing + nextJ;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const frontCenterIdx = positions.length / 3;
  positions.push(0, 0.3, -spec.frontLen - 0.01);
  uvs.push(0, 0.5);
  for (let j = 0; j < ptsPerRing; j++) {
    const nextJ = (j + 1) % ptsPerRing;
    indices.push(frontCenterIdx, nextJ, j);
  }

  const rearStartIdx = (ringRings.length - 1) * ptsPerRing;
  const rearCenterIdx = positions.length / 3;
  positions.push(0, 0.52, spec.rearLen + 0.01);
  uvs.push(1, 0.5);
  for (let j = 0; j < ptsPerRing; j++) {
    const nextJ = (j + 1) % ptsPerRing;
    indices.push(rearCenterIdx, rearStartIdx + j, rearStartIdx + nextJ);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Builds distinct wheel assemblies per car archetype (Twin-5 Star, Deep-6 Muscle,
 * 10-Spoke Racing Mesh, Aero Turbofan, or 5-Blade Turbine) with rounded-shoulder tires,
 * cross-drilled brake discs, and stationary painted calipers.
 */
function createRealisticWheelAssembly(
  radius: number,
  width: number,
  rimStyle: RimStyle,
  caliperMat: THREE.Material,
  tireMat: THREE.Material,
  rimMat: THREE.Material,
  barrelMat: THREE.Material,
  brakeDiscMat: THREE.Material,
  sideSign: number
): { hub: THREE.Group; steerPivot: THREE.Group; spinGroup: THREE.Group } {
  const hub = new THREE.Group();
  const steerPivot = new THREE.Group();
  const spinGroup = new THREE.Group();
  hub.add(steerPivot);
  steerPivot.add(spinGroup);

  const hw = width * 0.5;
  const innerR = radius * 0.67;
  const shoulderR = radius * 0.94;
  const tireProfile = [
    new THREE.Vector2(innerR, -hw * 0.88),
    new THREE.Vector2(shoulderR, -hw),
    new THREE.Vector2(radius, -hw * 0.72),
    new THREE.Vector2(radius, hw * 0.72),
    new THREE.Vector2(shoulderR, hw),
    new THREE.Vector2(innerR, hw * 0.88),
  ];
  const tireGeo = new THREE.LatheGeometry(tireProfile, 24);
  tireGeo.rotateZ(Math.PI / 2);
  const tire = new THREE.Mesh(tireGeo, tireMat);
  tire.castShadow = true;
  spinGroup.add(tire);

  const barrelGeo = new THREE.CylinderGeometry(
    innerR * 0.99,
    innerR * 0.99,
    width * 0.88,
    22,
    1,
    true
  );
  barrelGeo.rotateZ(Math.PI / 2);
  spinGroup.add(new THREE.Mesh(barrelGeo, barrelMat));

  const lipGeo = new THREE.TorusGeometry(innerR * 0.98, 0.017, 8, 24);
  lipGeo.rotateY(Math.PI / 2);
  const lip = new THREE.Mesh(lipGeo, rimMat);
  lip.position.x = sideSign * (hw * 0.84);
  spinGroup.add(lip);

  const discGeo = new THREE.CylinderGeometry(radius * 0.58, radius * 0.58, 0.024, 20);
  discGeo.rotateZ(Math.PI / 2);
  const disc = new THREE.Mesh(discGeo, brakeDiscMat);
  disc.position.x = sideSign * 0.015;
  spinGroup.add(disc);

  if (rimStyle === 'turbofan') {
    // Sleek full-face aerodynamic turbofan cover with cooling turbine fins
    const fanCoverGeo = new THREE.CylinderGeometry(innerR * 0.94, innerR * 0.94, 0.026, 24);
    fanCoverGeo.rotateZ(Math.PI / 2);
    const fanCover = new THREE.Mesh(fanCoverGeo, barrelMat);
    fanCover.position.x = sideSign * (hw * 0.75);
    spinGroup.add(fanCover);

    const vaneGeo = new THREE.BoxGeometry(0.032, innerR * 0.86, 0.022);
    for (let i = 0; i < 8; i++) {
      const ang = (i * Math.PI * 2) / 8;
      const vane = new THREE.Mesh(vaneGeo, rimMat);
      vane.position.set(
        sideSign * (hw * 0.77),
        Math.cos(ang) * innerR * 0.48,
        Math.sin(ang) * innerR * 0.48
      );
      vane.rotation.x = -ang + 0.35;
      spinGroup.add(vane);
    }
  } else if (rimStyle === 'deep6') {
    // Thick muscular 6-spoke deep-dish rims
    const spokeGeo = new THREE.BoxGeometry(0.03, innerR * 0.9, 0.044);
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI * 2) / 6;
      const spoke = new THREE.Mesh(spokeGeo, rimMat);
      spoke.position.set(
        sideSign * (hw * 0.6),
        Math.cos(ang) * innerR * 0.48,
        Math.sin(ang) * innerR * 0.48
      );
      spoke.rotation.x = -ang;
      spoke.rotation.z = sideSign * -0.22;
      spinGroup.add(spoke);
    }
  } else if (rimStyle === 'mesh10') {
    // Fine 10-spoke racing mesh
    const spokeGeo = new THREE.BoxGeometry(0.02, innerR * 0.93, 0.02);
    for (let i = 0; i < 10; i++) {
      const ang = (i * Math.PI * 2) / 10;
      const spoke = new THREE.Mesh(spokeGeo, rimMat);
      spoke.position.set(
        sideSign * (hw * 0.74),
        Math.cos(ang) * innerR * 0.5,
        Math.sin(ang) * innerR * 0.5
      );
      spoke.rotation.x = -ang;
      spoke.rotation.z = sideSign * -0.12;
      spinGroup.add(spoke);
    }
  } else if (rimStyle === 'turbine5') {
    // Directional swept 5-blade aero turbine spokes
    const bladeGeo = new THREE.BoxGeometry(0.024, innerR * 0.9, 0.052);
    for (let i = 0; i < 5; i++) {
      const ang = (i * Math.PI * 2) / 5;
      const blade = new THREE.Mesh(bladeGeo, rimMat);
      blade.position.set(
        sideSign * (hw * 0.73),
        Math.cos(ang) * innerR * 0.49,
        Math.sin(ang) * innerR * 0.49
      );
      blade.rotation.x = -ang + sideSign * 0.34;
      blade.rotation.z = sideSign * -0.15;
      spinGroup.add(blade);
    }
  } else {
    // Twin-5-spoke forged star rims
    const spokeLen = innerR * 0.92;
    const spokeGeo = new THREE.BoxGeometry(0.022, spokeLen, 0.025);
    for (let i = 0; i < 5; i++) {
      const baseAngle = (i * Math.PI * 2) / 5;
      for (const splay of [-0.15, 0.15]) {
        const spoke = new THREE.Mesh(spokeGeo, rimMat);
        const ang = baseAngle + splay;
        const midR = innerR * 0.5;
        spoke.position.set(
          sideSign * (hw * 0.72),
          Math.cos(ang) * midR,
          Math.sin(ang) * midR
        );
        spoke.rotation.x = -ang;
        spoke.rotation.z = sideSign * -0.14;
        spinGroup.add(spoke);
      }
    }
  }

  const centerHubGeo = new THREE.CylinderGeometry(radius * 0.16, radius * 0.19, 0.05, 14);
  centerHubGeo.rotateZ(Math.PI / 2);
  const centerHub = new THREE.Mesh(centerHubGeo, barrelMat);
  centerHub.position.x = sideSign * (hw * 0.65);
  spinGroup.add(centerHub);

  const lockNutGeo = new THREE.CylinderGeometry(radius * 0.09, radius * 0.09, 0.06, 6);
  lockNutGeo.rotateZ(Math.PI / 2);
  const lockNut = new THREE.Mesh(lockNutGeo, caliperMat);
  lockNut.position.x = sideSign * (hw * 0.68);
  spinGroup.add(lockNut);

  const caliperGroup = new THREE.Group();
  caliperGroup.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(0.075, radius * 0.42, radius * 0.24),
      caliperMat
    )
  );
  caliperGroup.position.set(sideSign * 0.025, radius * 0.18, -radius * 0.34);
  caliperGroup.rotation.x = 0.45;
  steerPivot.add(caliperGroup);

  return { hub, steerPivot, spinGroup };
}

function createCockpitInterior(
  accentMat: THREE.Material,
  carbonMat: THREE.Material,
  zShift: number
): { interiorGroup: THREE.Group; steeringWheel: THREE.Group } {
  const interiorGroup = new THREE.Group();
  interiorGroup.position.z = zShift;

  const alcantaraMat = new THREE.MeshStandardMaterial({
    color: 0x161922,
    roughness: 0.9,
    metalness: 0.04,
  });

  const leatherMat = new THREE.MeshStandardMaterial({
    color: 0x1e222e,
    roughness: 0.65,
    metalness: 0.1,
  });

  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    emissive: 0x38bdf8,
    emissiveIntensity: 1.4,
    roughness: 0.2,
  });

  const tub = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.08, 1.55), alcantaraMat);
  tub.position.set(0, 0.3, -0.05);
  interiorGroup.add(tub);

  const firewall = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.52, 0.08), carbonMat);
  firewall.position.set(0, 0.56, 0.62);
  interiorGroup.add(firewall);

  const tunnel = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 1.35), carbonMat);
  tunnel.position.set(0, 0.4, -0.08);
  interiorGroup.add(tunnel);

  for (const sx of [-0.36, 0.36]) {
    const seat = new THREE.Group();
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.48), alcantaraMat);
    cushion.position.set(0, 0.36, 0.12);
    seat.add(cushion);

    const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.52, 0.1), alcantaraMat);
    backrest.position.set(0, 0.63, 0.36);
    backrest.rotation.x = 0.24;
    seat.add(backrest);

    const bolsterGeo = new THREE.BoxGeometry(0.07, 0.42, 0.14);
    for (const bx of [-0.2, 0.2]) {
      const bolster = new THREE.Mesh(bolsterGeo, leatherMat);
      bolster.position.set(bx, 0.58, 0.32);
      bolster.rotation.x = 0.24;
      seat.add(bolster);
    }

    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.1), leatherMat);
    headrest.position.set(0, 0.94, 0.43);
    headrest.rotation.x = 0.18;
    seat.add(headrest);

    const shoulderTrim = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.11), accentMat);
    shoulderTrim.position.set(0, 0.84, 0.41);
    seat.add(shoulderTrim);

    seat.position.x = sx;
    interiorGroup.add(seat);
  }

  const dash = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.22, 0.46), leatherMat);
  dash.position.set(0, 0.64, -0.62);
  interiorGroup.add(dash);

  const gaugeScreen = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.09, 0.02), screenMat);
  gaugeScreen.position.set(-0.36, 0.72, -0.42);
  gaugeScreen.rotation.x = -0.18;
  interiorGroup.add(gaugeScreen);

  const centerNav = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.11, 0.02), screenMat);
  centerNav.position.set(0, 0.68, -0.4);
  centerNav.rotation.x = -0.25;
  interiorGroup.add(centerNav);

  const steeringColumn = new THREE.Group();
  steeringColumn.position.set(-0.36, 0.68, -0.34);
  steeringColumn.rotation.x = -0.32;
  interiorGroup.add(steeringColumn);

  const steeringWheel = new THREE.Group();
  steeringColumn.add(steeringWheel);

  steeringWheel.add(
    new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.019, 8, 22), alcantaraMat)
  );

  const topStripe = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.042, 0.044), accentMat);
  topStripe.position.set(0, 0.145, 0);
  steeringWheel.add(topStripe);

  steeringWheel.add(new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.028, 0.015), carbonMat));
  const spokeV = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.13, 0.015), carbonMat);
  spokeV.position.y = -0.065;
  steeringWheel.add(spokeV);

  return { interiorGroup, steeringWheel };
}

export function createPlayerSportsCar(
  carId: CarModelId,
  initialFinish: CarFinish,
  assets: SharedAssets
): PlayerCarRig {
  const spec = CAR_DESIGN_SPECS[carId] ?? CAR_DESIGN_SPECS.red_supercar;
  const root = new THREE.Group();
  const bodyTiltGroup = new THREE.Group();
  root.add(bodyTiltGroup);

  const paintMaterial = new THREE.MeshPhysicalMaterial({
    color: initialFinish.primaryHex,
    metalness: spec.paintMetalness,
    roughness: spec.paintRoughness,
    clearcoat: 1.0,
    clearcoatRoughness: spec.clearcoatRoughness,
    ior: 1.52,
    reflectivity: 1.0,
    envMapIntensity: 1.8,
  });

  const stripeMaterial = new THREE.MeshStandardMaterial({
    color: initialFinish.stripeHex,
    metalness: 0.45,
    roughness: 0.22,
  });

  const trimMaterial = new THREE.MeshStandardMaterial({
    color: spec.trimHex,
    metalness: spec.trimMetalness,
    roughness: spec.trimRoughness,
  });

  const carbonMaterial = new THREE.MeshStandardMaterial({
    color: 0x11151e,
    metalness: 0.35,
    roughness: 0.42,
  });

  const grilleMaterial = new THREE.MeshStandardMaterial({
    map: assets.grilleTexture,
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.45,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0b1320,
    metalness: 0.08,
    roughness: 0.03,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    transparent: true,
    opacity: 0.36,
    depthWrite: false,
    envMapIntensity: 1.95,
  });

  const headlightCoverMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.05,
    roughness: 0.02,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
  });

  const tireMaterial = new THREE.MeshStandardMaterial({
    color: 0x14171c,
    roughness: 0.86,
    metalness: 0.05,
  });

  const rimMaterial = new THREE.MeshStandardMaterial({
    color: spec.rimHex,
    metalness: 0.9,
    roughness: 0.16,
  });

  const barrelMaterial = new THREE.MeshStandardMaterial({
    color: 0x1c222d,
    metalness: 0.72,
    roughness: 0.32,
  });

  const brakeDiscMaterial = new THREE.MeshStandardMaterial({
    map: assets.brakeDiscTexture,
    metalness: 0.88,
    roughness: 0.26,
  });

  const caliperMaterial = new THREE.MeshStandardMaterial({
    color: initialFinish.caliperHex,
    metalness: 0.65,
    roughness: 0.22,
  });

  const drlMaterial = new THREE.MeshStandardMaterial({
    color: spec.drlHex ?? 0xffffff,
    emissive: spec.drlHex ?? 0xf0f9ff,
    emissiveIntensity: 2.8,
    roughness: 0.08,
  });

  const taillightMaterial = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 1.75,
    roughness: 0.18,
  });

  const exhaustMaterial = new THREE.MeshStandardMaterial({
    color: carId === 'golden_king' ? 0xfbbf24 : 0xd1d5db,
    metalness: 0.96,
    roughness: 0.12,
  });

  // 1. Sculpted Lofted Body Shell tailored per Car Spec
  const chassisMesh = new THREE.Mesh(buildSculptedBodyGeometry(spec), paintMaterial);
  chassisMesh.castShadow = true;
  chassisMesh.receiveShadow = true;
  bodyTiltGroup.add(chassisMesh);

  // Wheel-well inner liners
  const wellLinerGeo = new THREE.CylinderGeometry(0.43, 0.43, 0.34, 16, 1, false, 0, Math.PI);
  wellLinerGeo.rotateZ(Math.PI / 2);
  for (const [wx, wz] of [
    [-0.78, -1.36],
    [0.78, -1.36],
    [-0.8, 1.34],
    [0.8, 1.34],
  ]) {
    const liner = new THREE.Mesh(wellLinerGeo, carbonMaterial);
    liner.position.set(wx, 0.34, wz);
    bodyTiltGroup.add(liner);
  }

  // 2. Visible Cockpit Interior (offset per cabin rake)
  const { interiorGroup, steeringWheel } = createCockpitInterior(
    caliperMaterial,
    carbonMaterial,
    spec.cabinRake
  );
  bodyTiltGroup.add(interiorGroup);

  // 3. Car-Specific Greenhouse: Roof, Pillars & Flush Transparent Glass
  const roofW = spec.roofWidth;
  const roofY = spec.roofHeight;
  const roofZ = spec.roofZ;

  if (spec.roofStyle === 'glass_canopy') {
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(roofW, 0.06, spec.roofLen + 0.14),
      glassMaterial
    );
    canopy.position.set(0, roofY, roofZ + 0.05);
    canopy.renderOrder = 5;
    bodyTiltGroup.add(canopy);

    const spine = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.05, spec.roofLen + 0.35),
      paintMaterial
    );
    spine.position.set(0, roofY + 0.02, roofZ + 0.12);
    bodyTiltGroup.add(spine);
  } else if (spec.roofStyle === 'double_bubble') {
    for (const bx of [-roofW * 0.25, roofW * 0.25]) {
      const bubble = new THREE.Mesh(
        new THREE.BoxGeometry(roofW * 0.46, 0.08, spec.roofLen),
        paintMaterial
      );
      bubble.position.set(bx, roofY + 0.015, roofZ);
      bubble.castShadow = true;
      bodyTiltGroup.add(bubble);
    }
    const centerBridge = new THREE.Mesh(
      new THREE.BoxGeometry(roofW * 0.22, 0.045, spec.roofLen),
      trimMaterial
    );
    centerBridge.position.set(0, roofY - 0.005, roofZ);
    bodyTiltGroup.add(centerBridge);
  } else {
    const roofMat = spec.roofStyle === 'carbon_roof' ? carbonMaterial : paintMaterial;
    const roofPanel = new THREE.Mesh(
      new THREE.BoxGeometry(roofW, 0.06, spec.roofLen),
      roofMat
    );
    roofPanel.position.set(0, roofY, roofZ);
    roofPanel.castShadow = true;
    bodyTiltGroup.add(roofPanel);
  }

  if (spec.roofStyle === 'roof_scoop') {
    const scoop = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.62), carbonMaterial);
    scoop.position.set(0, roofY + 0.075, roofZ + 0.02);
    bodyTiltGroup.add(scoop);

    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, 0.06), grilleMaterial);
    mouth.position.set(0, roofY + 0.085, roofZ - 0.29);
    bodyTiltGroup.add(mouth);
  }

  // Dorsal Shark Fin for longtail / prototype silhouettes
  if (carId === 'white_ghost' || carId === 'valkyrie_gt') {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.24, 1.05), paintMaterial);
    fin.position.set(0, roofY - 0.12, roofZ + 1.08);
    fin.rotation.x = -0.14;
    fin.castShadow = true;
    bodyTiltGroup.add(fin);
  }

  // Pillars & Transparent Cabin Windows
  const aPillarGeo = new THREE.BoxGeometry(0.065, 0.055, 0.88);
  for (const s of [-1, 1]) {
    const aPillar = new THREE.Mesh(aPillarGeo, trimMaterial);
    aPillar.position.set(s * (roofW * 0.5 + 0.04), roofY - 0.2, roofZ - 0.68);
    aPillar.rotation.x = 0.52;
    aPillar.rotation.y = s * -0.14;
    aPillar.rotation.z = s * 0.22;
    bodyTiltGroup.add(aPillar);

    const cPillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.06, 1.08),
      paintMaterial
    );
    cPillar.position.set(s * (roofW * 0.52 + 0.04), roofY - 0.18, roofZ + 0.84);
    cPillar.rotation.x = -0.34;
    cPillar.rotation.y = s * 0.1;
    cPillar.rotation.z = s * -0.18;
    cPillar.castShadow = true;
    bodyTiltGroup.add(cPillar);

    const bPillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.42, 0.09),
      trimMaterial
    );
    bPillar.position.set(s * (roofW * 0.54 + 0.06), roofY - 0.22, roofZ + 0.3);
    bPillar.rotation.z = s * 0.24;
    bodyTiltGroup.add(bPillar);
  }

  const windshield = new THREE.Mesh(
    new THREE.PlaneGeometry(roofW + 0.08, 0.86),
    glassMaterial
  );
  windshield.position.set(0, roofY - 0.2, roofZ - 0.7);
  windshield.rotation.x = -1.04;
  windshield.renderOrder = 5;
  bodyTiltGroup.add(windshield);

  const rearGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(roofW - 0.04, 0.96),
    glassMaterial
  );
  rearGlass.position.set(0, roofY - 0.19, roofZ + 0.82);
  rearGlass.rotation.x = -1.24;
  rearGlass.rotation.y = Math.PI;
  rearGlass.renderOrder = 5;
  bodyTiltGroup.add(rearGlass);

  if (spec.roofStyle === 'fastback_slats') {
    for (let l = 0; l < 4; l++) {
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(roofW - 0.12, 0.03, 0.12),
        carbonMaterial
      );
      slat.position.set(0, roofY - 0.06 - l * 0.065, roofZ + 0.58 + l * 0.2);
      slat.rotation.x = 0.26;
      bodyTiltGroup.add(slat);
    }
  }

  const sideWinGeo = new THREE.PlaneGeometry(1.14, 0.35);
  for (const s of [-1, 1]) {
    const sideWin = new THREE.Mesh(sideWinGeo, glassMaterial);
    sideWin.position.set(s * (roofW * 0.5 + 0.1), roofY - 0.22, roofZ - 0.04);
    sideWin.rotation.y = s * (Math.PI / 2);
    sideWin.rotation.x = s * -0.28;
    sideWin.renderOrder = 5;
    bodyTiltGroup.add(sideWin);
  }

  const intMirror = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.045, 0.04),
    carbonMaterial
  );
  intMirror.position.set(0, roofY - 0.08, roofZ - 0.36);
  bodyTiltGroup.add(intMirror);

  // 4. Car-Specific Front Grille, Splitter, Brake Intakes & Aero Canards
  const frontZ = -spec.frontLen;
  const frontGrille = new THREE.Mesh(
    new THREE.BoxGeometry(1.06, 0.22, 0.08),
    grilleMaterial
  );
  frontGrille.position.set(0, 0.29, frontZ + 0.05);
  bodyTiltGroup.add(frontGrille);

  const grilleBezel = new THREE.Mesh(
    new THREE.BoxGeometry(1.12, 0.25, 0.04),
    trimMaterial
  );
  grilleBezel.position.set(0, 0.29, frontZ + 0.07);
  bodyTiltGroup.add(grilleBezel);

  if (spec.grilleStyle === 'vertical_chrome') {
    for (let sx = -0.44; sx <= 0.44; sx += 0.11) {
      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(0.025, 0.2, 0.06),
        trimMaterial
      );
      slat.position.set(sx, 0.29, frontZ + 0.02);
      bodyTiltGroup.add(slat);
    }
  } else if (spec.grilleStyle === 'horseshoe') {
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.032, 8, 18, Math.PI * 1.15),
      trimMaterial
    );
    arch.position.set(0, 0.28, frontZ + 0.02);
    arch.rotation.z = -Math.PI * 0.075;
    bodyTiltGroup.add(arch);
  } else if (spec.grilleStyle === 'exotic_split') {
    const centerStrut = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.24, 0.09),
      paintMaterial
    );
    centerStrut.position.set(0, 0.29, frontZ + 0.03);
    bodyTiltGroup.add(centerStrut);
  } else if (spec.grilleStyle === 'gt3_endurance') {
    for (const sx of [-0.3, 0.3]) {
      const fogLed = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.06, 12),
        drlMaterial
      );
      fogLed.rotation.x = Math.PI / 2;
      fogLed.position.set(sx, 0.3, frontZ + 0.02);
      bodyTiltGroup.add(fogLed);
    }
    for (const sx of [-0.95, 0.95]) {
      const canard = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.028, 0.28),
        carbonMaterial
      );
      canard.position.set(sx, 0.34, frontZ + 0.32);
      canard.rotation.z = sx * -0.18;
      bodyTiltGroup.add(canard);
    }
  } else if (spec.grilleStyle === 'track_brace') {
    // Extended protruding splitter + metallic tie-rods + tow ring
    for (const sx of [-0.42, 0.42]) {
      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8),
        exhaustMaterial
      );
      rod.position.set(sx, 0.25, frontZ - 0.04);
      rod.rotation.x = 0.25;
      bodyTiltGroup.add(rod);
    }
    const towRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.055, 0.014, 8, 16),
      caliperMaterial
    );
    towRing.rotation.x = Math.PI / 2;
    towRing.position.set(0.32, 0.21, frontZ - 0.14);
    bodyTiltGroup.add(towRing);
  }

  for (const sx of [-0.69, 0.69]) {
    const intake = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.15, 0.08), grilleMaterial);
    intake.position.set(sx, 0.29, frontZ + 0.12);
    intake.rotation.y = sx * -0.22;
    bodyTiltGroup.add(intake);
  }

  const splitterDepth = spec.grilleStyle === 'track_brace' ? 0.56 : 0.42;
  const splitter = new THREE.Mesh(
    new THREE.BoxGeometry(spec.baseHalfW * 2.04, 0.045, splitterDepth),
    carbonMaterial
  );
  splitter.position.set(0, 0.17, frontZ + 0.12);
  splitter.castShadow = true;
  bodyTiltGroup.add(splitter);

  for (const sx of [-(spec.baseHalfW + 0.02), spec.baseHalfW + 0.02]) {
    const fence = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.11, 0.34), carbonMaterial);
    fence.position.set(sx, 0.22, frontZ + 0.16);
    bodyTiltGroup.add(fence);
  }

  // Carbon Side Skirts (+ optional subtle neon ground accent strip)
  const skirtGeo = new THREE.BoxGeometry(0.11, 0.06, 1.9);
  for (const sx of [-(spec.baseHalfW + 0.01), spec.baseHalfW + 0.01]) {
    const skirt = new THREE.Mesh(skirtGeo, carbonMaterial);
    skirt.position.set(sx, 0.175, -0.02);
    bodyTiltGroup.add(skirt);

    if (spec.underglowHex !== undefined) {
      const neonMat = new THREE.MeshBasicMaterial({ color: spec.underglowHex });
      const glowBar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.022, 1.65), neonMat);
      glowBar.position.set(sx * 0.96, 0.14, -0.02);
      bodyTiltGroup.add(glowBar);
    }
  }

  // 5. Car-Specific Headlights
  for (const s of [-1, 1]) {
    const hlGroup = new THREE.Group();
    hlGroup.position.set(s * 0.65, 0.46, frontZ + 0.2);
    hlGroup.rotation.y = s * -0.26;
    hlGroup.rotation.x = 0.18;

    hlGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.11, 0.14), carbonMaterial));

    if (spec.headlightStyle === 'slit_quad') {
      for (const px of [-0.09, 0.01, 0.1]) {
        const slit = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.028, 0.04), drlMaterial);
        slit.position.set(px, 0.005, -0.06);
        hlGroup.add(slit);
      }
    } else if (spec.headlightStyle === 'halo_oval') {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 8, 18), drlMaterial);
      ring.position.set(0, 0.005, -0.055);
      hlGroup.add(ring);
    } else if (spec.headlightStyle === 'y_fang') {
      const barA = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.03), drlMaterial);
      barA.position.set(0, -0.015, -0.065);
      hlGroup.add(barA);
      const fang = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.03), drlMaterial);
      fang.position.set(s * -0.06, 0.022, -0.065);
      fang.rotation.z = s * 0.55;
      hlGroup.add(fang);
    } else if (spec.headlightStyle === 'triple_stack') {
      for (let t = -1; t <= 1; t++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.016, 0.03), drlMaterial);
        blade.position.set(0, t * 0.026, -0.065);
        hlGroup.add(blade);
      }
    } else {
      for (const px of [-0.07, 0.07]) {
        const lens = new THREE.Mesh(new THREE.SphereGeometry(0.038, 10, 8), drlMaterial);
        lens.position.set(px, 0.005, -0.045);
        hlGroup.add(lens);
      }
      const drlBlade = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.018, 0.03), drlMaterial);
      drlBlade.position.set(0, -0.035, -0.065);
      hlGroup.add(drlBlade);
    }

    const cover = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.12, 0.02), headlightCoverMat);
    cover.position.z = -0.075;
    cover.renderOrder = 6;
    hlGroup.add(cover);

    bodyTiltGroup.add(hlGroup);
  }

  // 6. Hood & Engine-Deck Sculpts + Side Intake Architecture
  if (spec.hoodStyle === 'blower_bulge') {
    const bulge = new THREE.Mesh(
      new THREE.BoxGeometry(0.56, 0.11, 1.05),
      carbonMaterial
    );
    bulge.position.set(0, 0.65, -1.26);
    bulge.rotation.x = 0.16;
    bodyTiltGroup.add(bulge);
  } else if (spec.hoodStyle === 'extractor_vent') {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.04, 0.52), grilleMaterial);
    vent.position.set(0, 0.57, -1.4);
    vent.rotation.x = 0.25;
    bodyTiltGroup.add(vent);
  } else if (spec.hoodStyle === 'twin_nostril') {
    for (const sx of [-0.26, 0.26]) {
      const vent = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.44), grilleMaterial);
      vent.position.set(sx, 0.59, -1.34);
      vent.rotation.x = 0.2;
      bodyTiltGroup.add(vent);
    }
  } else if (spec.hoodStyle === 'louvered_v12') {
    const engineWindow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.74, 0.85),
      glassMaterial
    );
    engineWindow.rotation.x = -Math.PI / 2 + 0.1;
    engineWindow.position.set(0, 0.81, 1.32);
    engineWindow.renderOrder = 5;
    bodyTiltGroup.add(engineWindow);

    const manifold = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.08, 0.62),
      caliperMaterial
    );
    manifold.position.set(0, 0.74, 1.32);
    bodyTiltGroup.add(manifold);
  } else if (spec.hoodStyle === 'long_v12') {
    const hoodTrim = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 1.15), trimMaterial);
    hoodTrim.position.set(0, 0.68, -1.28);
    hoodTrim.rotation.x = 0.14;
    bodyTiltGroup.add(hoodTrim);
  }

  // Side Architecture (NACA Scoops / Wide Overfenders / Vertical Blades / Fender Louvers)
  for (const s of [-1, 1]) {
    if (spec.sideStyle === 'naca_scoop') {
      const scoop = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.54), carbonMaterial);
      scoop.position.set(s * (spec.baseHalfW + 0.02), 0.52, 0.62);
      scoop.rotation.y = s * 0.14;
      bodyTiltGroup.add(scoop);
    } else if (spec.sideStyle === 'wide_overfender') {
      for (const wz of [-1.36, 1.34]) {
        const arch = new THREE.Mesh(
          new THREE.TorusGeometry(0.41, 0.055, 8, 16, Math.PI),
          paintMaterial
        );
        arch.rotation.y = Math.PI / 2;
        arch.position.set(s * (spec.baseHalfW + 0.08), 0.36, wz);
        bodyTiltGroup.add(arch);
      }
    } else if (spec.sideStyle === 'blade_side') {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.38, 0.66), carbonMaterial);
      blade.position.set(s * (spec.baseHalfW + 0.04), 0.52, 0.56);
      blade.rotation.y = s * -0.18;
      bodyTiltGroup.add(blade);
    } else if (spec.sideStyle === 'fender_louvers') {
      const louver = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.34), grilleMaterial);
      louver.position.set(s * (spec.baseHalfW - 0.12), 0.68, -1.36);
      bodyTiltGroup.add(louver);
    } else if (spec.sideStyle === 'chrome_vent') {
      const ventStrake = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.045, 0.48),
        trimMaterial
      );
      ventStrake.position.set(s * (spec.baseHalfW + 0.01), 0.54, -0.78);
      bodyTiltGroup.add(ventStrake);
    }
  }

  // Optional Hood Racing Stripes
  if (spec.hasHoodStripes) {
    const stripeGeo = new THREE.BoxGeometry(0.16, 0.012, 1.3);
    for (const sx of [-0.14, 0.14]) {
      const stripe = new THREE.Mesh(stripeGeo, stripeMaterial);
      stripe.position.set(sx, 0.62, -1.42);
      stripe.rotation.x = 0.22;
      bodyTiltGroup.add(stripe);
    }
  }

  // 7. Side Mirrors
  for (const s of [-1, 1]) {
    const mirrorGroup = new THREE.Group();
    mirrorGroup.position.set(s * 0.87, 0.77, roofZ - 0.42);

    const stalk = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.035, 0.07), trimMaterial);
    stalk.position.set(s * 0.06, 0.02, 0);
    stalk.rotation.z = s * 0.25;
    mirrorGroup.add(stalk);

    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(0.17, 0.085, 0.13),
      carId === 'silver_bullet' ? trimMaterial : paintMaterial
    );
    cap.position.set(s * 0.14, 0.05, 0.02);
    cap.rotation.y = s * -0.15;
    cap.castShadow = true;
    mirrorGroup.add(cap);

    const glassFace = new THREE.Mesh(
      new THREE.PlaneGeometry(0.14, 0.065),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.96, roughness: 0.05 })
    );
    glassFace.position.set(s * 0.14, 0.05, 0.086);
    glassFace.rotation.y = s * -0.15;
    mirrorGroup.add(glassFace);

    bodyTiltGroup.add(mirrorGroup);
  }

  // 8. Rear Taillights, Diffuser, Exhausts & Spoilers
  const rearZ = spec.rearLen;
  const rearMeshPanel = new THREE.Mesh(
    new THREE.BoxGeometry(1.56, 0.16, 0.06),
    grilleMaterial
  );
  rearMeshPanel.position.set(0, 0.56, rearZ - 0.03);
  bodyTiltGroup.add(rearMeshPanel);

  const tailHousing = new THREE.Mesh(
    new THREE.BoxGeometry(1.66, 0.12, 0.07),
    carbonMaterial
  );
  tailHousing.position.set(0, 0.68, rearZ - 0.04);
  bodyTiltGroup.add(tailHousing);

  if (spec.taillightStyle === 'quad_round' || spec.taillightStyle === 'quad_ring') {
    for (const tx of [-0.66, -0.46, 0.46, 0.66]) {
      const lamp = new THREE.Mesh(
        new THREE.TorusGeometry(0.052, 0.018, 8, 18),
        taillightMaterial
      );
      lamp.position.set(tx, 0.68, rearZ);
      bodyTiltGroup.add(lamp);
    }
  } else if (spec.taillightStyle === 'y_hex') {
    for (const s of [-1, 1]) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, 0.028, 0.03),
        taillightMaterial
      );
      bar.position.set(s * 0.56, 0.69, rearZ);
      bodyTiltGroup.add(bar);
      const yArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.028, 0.03),
        taillightMaterial
      );
      yArm.position.set(s * 0.36, 0.66, rearZ);
      yArm.rotation.z = s * -0.52;
      bodyTiltGroup.add(yArm);
    }
  } else if (spec.taillightStyle === 'twin_bar') {
    for (const s of [-1, 1]) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.52, 0.038, 0.03),
        taillightMaterial
      );
      bar.position.set(s * 0.54, 0.68, rearZ);
      bodyTiltGroup.add(bar);
    }
  } else {
    const fullBar = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.03, 0.03),
      taillightMaterial
    );
    fullBar.position.set(0, 0.695, rearZ);
    bodyTiltGroup.add(fullBar);
    for (const s of [-1, 1]) {
      const lower = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.028, 0.03),
        taillightMaterial
      );
      lower.position.set(s * 0.58, 0.645, rearZ);
      bodyTiltGroup.add(lower);
    }
  }

  const diffuser = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.18, 0.24), carbonMaterial);
  diffuser.position.set(0, 0.26, rearZ - 0.07);
  bodyTiltGroup.add(diffuser);

  const finGeo = new THREE.BoxGeometry(0.03, 0.19, 0.28);
  for (const fx of [-0.52, -0.2, 0.2, 0.52]) {
    const fin = new THREE.Mesh(finGeo, carbonMaterial);
    fin.position.set(fx, 0.25, rearZ - 0.07);
    bodyTiltGroup.add(fin);
  }

  const f1RainLight = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.11, 0.04),
    taillightMaterial
  );
  f1RainLight.position.set(0, 0.26, rearZ + 0.05);
  bodyTiltGroup.add(f1RainLight);

  // Car-Specific Exhausts & Twin Nitro Flame Cones
  const exhaustGeo = new THREE.CylinderGeometry(0.055, 0.062, 0.22, 14);
  exhaustGeo.rotateX(Math.PI / 2);
  let flameOffsets = [-0.39, 0.39];

  if (spec.exhaustStyle === 'hex_center') {
    const hexTip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.2, 6),
      exhaustMaterial
    );
    hexTip.rotation.x = Math.PI / 2;
    hexTip.position.set(0, 0.38, rearZ - 0.01);
    bodyTiltGroup.add(hexTip);
    flameOffsets = [-0.08, 0.08];
  } else if (spec.exhaustStyle === 'rocket_high') {
    for (const ox of [-0.18, 0.18]) {
      const tip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.095, 0.26, 16),
        exhaustMaterial
      );
      tip.rotation.x = Math.PI / 2;
      tip.position.set(ox, 0.54, rearZ - 0.02);
      bodyTiltGroup.add(tip);
    }
    flameOffsets = [-0.18, 0.18];
  } else if (spec.exhaustStyle === 'twin_center' || spec.exhaustStyle === 'gold_trapezoid') {
    for (const ox of [-0.14, 0.14]) {
      const tip = new THREE.Mesh(exhaustGeo, exhaustMaterial);
      tip.position.set(ox, 0.32, rearZ - 0.01);
      bodyTiltGroup.add(tip);
    }
    flameOffsets = [-0.14, 0.14];
  } else if (spec.exhaustStyle === 'cannon_dual') {
    for (const ox of [-0.52, 0.52]) {
      const cannon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.09, 0.26, 14),
        exhaustMaterial
      );
      cannon.rotation.x = Math.PI / 2;
      cannon.rotation.y = ox > 0 ? 0.18 : -0.18;
      cannon.position.set(ox, 0.28, rearZ - 0.01);
      bodyTiltGroup.add(cannon);
    }
    flameOffsets = [-0.52, 0.52];
  } else {
    for (const ox of [-0.48, -0.34, 0.34, 0.48]) {
      const tip = new THREE.Mesh(exhaustGeo, exhaustMaterial);
      tip.position.set(ox, 0.28, rearZ - 0.01);
      bodyTiltGroup.add(tip);
    }
  }

  const flameGeo = new THREE.ConeGeometry(0.1, 0.95, 12);
  flameGeo.rotateX(Math.PI / 2);
  flameGeo.translate(0, 0, 0.48);
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const nitroFlames: THREE.Mesh[] = [];
  for (const ox of flameOffsets) {
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(
      ox,
      spec.exhaustStyle === 'rocket_high' ? 0.54 : 0.28,
      rearZ + 0.03
    );
    flame.visible = false;
    bodyTiltGroup.add(flame);
    nitroFlames.push(flame);
  }

  // Car-Specific Rear Spoiler / GT Wing Architecture
  const wingZ = rearZ - 0.22;
  if (spec.wingStyle === 'none_ducktail' || spec.wingStyle === 'ducktail_lip') {
    const h = spec.wingStyle === 'ducktail_lip' ? 0.14 : 0.08;
    const lip = new THREE.Mesh(new THREE.BoxGeometry(1.66, h, 0.22), paintMaterial);
    lip.position.set(0, 0.78 + h * 0.4, wingZ + 0.08);
    lip.rotation.x = -0.35;
    lip.castShadow = true;
    bodyTiltGroup.add(lip);
  } else if (spec.wingStyle === 'twin_winglet') {
    for (const s of [-1, 1]) {
      const wlet = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, 0.04, 0.24),
        paintMaterial
      );
      wlet.position.set(s * 0.62, 0.85, wingZ + 0.06);
      wlet.rotation.z = s * 0.14;
      wlet.castShadow = true;
      bodyTiltGroup.add(wlet);
    }
  } else if (spec.wingStyle === 'split_bridge') {
    for (const s of [-1, 1]) {
      const deck = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.05, 0.3), carbonMaterial);
      deck.position.set(s * 0.48, 0.98, wingZ);
      deck.rotation.z = s * -0.06;
      deck.castShadow = true;
      bodyTiltGroup.add(deck);
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.24, 0.14), paintMaterial);
      strut.position.set(s * 0.42, 0.86, wingZ);
      bodyTiltGroup.add(strut);
    }
  } else if (spec.wingStyle === 'biplane_track' || spec.wingStyle === 'dual_drs') {
    const mainBlade = new THREE.Mesh(new THREE.BoxGeometry(2.04, 0.045, 0.34), carbonMaterial);
    mainBlade.position.set(0, 1.2, wingZ);
    mainBlade.rotation.x = 0.12;
    mainBlade.castShadow = true;
    bodyTiltGroup.add(mainBlade);

    const upperFlap = new THREE.Mesh(new THREE.BoxGeometry(1.96, 0.032, 0.2), stripeMaterial);
    upperFlap.position.set(0, 1.29, wingZ + 0.08);
    upperFlap.rotation.x = 0.22;
    bodyTiltGroup.add(upperFlap);

    for (const sx of [-1.02, 1.02]) {
      const endplate = new THREE.Mesh(
        new THREE.BoxGeometry(0.038, 0.26, 0.44),
        paintMaterial
      );
      endplate.position.set(sx, 1.22, wingZ + 0.02);
      bodyTiltGroup.add(endplate);
    }
    for (const sx of [-0.48, 0.48]) {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.46, 0.14), carbonMaterial);
      strut.position.set(sx, 0.96, wingZ - 0.04);
      strut.rotation.x = -0.15;
      bodyTiltGroup.add(strut);
    }
  } else {
    const wingY =
      spec.wingStyle === 'swan_gt3' ? 1.18 : spec.wingStyle === 'jdm_mid' ? 1.06 : 1.04;
    const wingWidth = spec.wingStyle === 'swan_gt3' ? 1.98 : 1.88;
    const wing = new THREE.Mesh(
      new THREE.BoxGeometry(wingWidth, 0.045, 0.3),
      carbonMaterial
    );
    wing.position.set(0, wingY, wingZ);
    wing.rotation.x = 0.1;
    wing.castShadow = true;
    bodyTiltGroup.add(wing);

    for (const sx of [-(wingWidth * 0.5 + 0.015), wingWidth * 0.5 + 0.015]) {
      const endplate = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 0.18, 0.36),
        paintMaterial
      );
      endplate.position.set(sx, wingY - 0.01, wingZ);
      bodyTiltGroup.add(endplate);
    }
    for (const sx of [-0.46, 0.46]) {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.34, 0.12), carbonMaterial);
      strut.position.set(sx, wingY - 0.17, wingZ - 0.04);
      strut.rotation.x = -0.18;
      bodyTiltGroup.add(strut);
    }
  }

  // 9. 4 Distinct Wheels, Forged Rims & Cross-Drilled Brake Discs
  const wheelRadius = 0.35;
  const wheelWidth = 0.28;
  const wheels: THREE.Group[] = [];
  const wheelHubs: THREE.Group[] = [];
  const frontSteerPivots: THREE.Group[] = [];
  const trackX = spec.baseHalfW - 0.045;

  const wheelCoords: { x: number; z: number; front: boolean; side: number }[] = [
    { x: -trackX, z: -1.36, front: true, side: -1 },
    { x: trackX, z: -1.36, front: true, side: 1 },
    { x: -(trackX + 0.025), z: 1.34, front: false, side: -1 },
    { x: trackX + 0.025, z: 1.34, front: false, side: 1 },
  ];

  for (const wc of wheelCoords) {
    const rimKind: RimStyle =
      spec.rimStyle === 'turbofan' && wc.front ? 'mesh10' : spec.rimStyle;
    const { hub, steerPivot, spinGroup } = createRealisticWheelAssembly(
      wheelRadius,
      wheelWidth,
      rimKind,
      caliperMaterial,
      tireMaterial,
      rimMaterial,
      barrelMaterial,
      brakeDiscMaterial,
      wc.side
    );
    hub.position.set(wc.x, wheelRadius, wc.z);
    root.add(hub);
    wheelHubs.push(hub);
    wheels.push(spinGroup);
    if (wc.front) {
      frontSteerPivots.push(steerPivot);
    }
  }

  // 10. Grounded Radial Contact Shadow
  const shadowGeo = new THREE.PlaneGeometry(2.85, 5.35);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: assets.shadowTexture,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.position.y = 0.015;
  root.add(contactShadow);

  return {
    carId,
    root,
    bodyTiltGroup,
    wheels,
    wheelHubs,
    frontSteerPivots,
    steeringWheel,
    nitroFlames,
    paintMaterial,
    stripeMaterial,
    caliperMaterial,
    taillightMaterial,
    setFinish: (finish: CarFinish) => {
      paintMaterial.color.setHex(finish.primaryHex);
      stripeMaterial.color.setHex(finish.stripeHex);
      caliperMaterial.color.setHex(finish.caliperHex);
    },
    dispose: () => {
      const disposedMats = new Set<THREE.Material>();
      root.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const m of mats) {
            if (m && !disposedMats.has(m)) {
              disposedMats.add(m);
              m.dispose();
            }
          }
        }
      });
    },
  };
}

export function createShowroomStage(): THREE.Group {
  const stage = new THREE.Group();

  const studioFloorGeo = new THREE.CircleGeometry(65, 48);
  studioFloorGeo.rotateX(-Math.PI / 2);
  const studioFloorMat = new THREE.MeshStandardMaterial({
    color: 0x080c15,
    roughness: 0.28,
    metalness: 0.62,
  });
  const floor = new THREE.Mesh(studioFloorGeo, studioFloorMat);
  floor.position.y = -0.05;
  floor.receiveShadow = true;
  stage.add(floor);

  const podiumGeo = new THREE.CylinderGeometry(3.45, 3.65, 0.14, 48);
  const podiumMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.18,
    metalness: 0.82,
  });
  const podium = new THREE.Mesh(podiumGeo, podiumMat);
  podium.position.y = -0.075;
  podium.receiveShadow = true;
  stage.add(podium);

  const ringGeo = new THREE.RingGeometry(3.38, 3.5, 64);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xef4444,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = 0.002;
  stage.add(ring);

  const outerRingGeo = new THREE.RingGeometry(4.6, 4.65, 64);
  outerRingGeo.rotateX(-Math.PI / 2);
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
  });
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRing.position.y = -0.04;
  stage.add(outerRing);

  return stage;
}

export type TrafficArchetype = 'sedan' | 'truck' | 'coupe';

const TRAFFIC_COLORS = [0x3b82f6, 0x10b981, 0xf43f5e, 0xeab308, 0x8b5cf6, 0xf8fafc, 0x64748b];

const sharedTrafficWheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.24, 16);
sharedTrafficWheelGeo.rotateZ(Math.PI / 2);
const sharedTrafficTireMat = new THREE.MeshStandardMaterial({
  color: 0x18181b,
  roughness: 0.85,
  metalness: 0.05,
});
const sharedTrafficRimGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.26, 12);
sharedTrafficRimGeo.rotateZ(Math.PI / 2);
const sharedTrafficRimMat = new THREE.MeshStandardMaterial({
  color: 0xd1d5db,
  metalness: 0.85,
  roughness: 0.25,
});
const sharedTrafficGlassMat = new THREE.MeshStandardMaterial({
  color: 0x0f172a,
  roughness: 0.12,
  metalness: 0.4,
});
const sharedTrafficTailMat = new THREE.MeshStandardMaterial({
  color: 0xff2a2a,
  emissive: 0xdc2626,
  emissiveIntensity: 1.6,
});
const sharedTrafficHeadMat = new THREE.MeshStandardMaterial({
  color: 0xfef9c3,
  emissive: 0xfef08a,
  emissiveIntensity: 1.5,
});

export function createTrafficVehicle(
  archetype: TrafficArchetype,
  assets: SharedAssets
): {
  group: THREE.Group;
  wheels: THREE.Mesh[];
  halfWidth: number;
  halfLength: number;
} {
  const group = new THREE.Group();
  const wheels: THREE.Mesh[] = [];
  const color = TRAFFIC_COLORS[Math.floor(Math.random() * TRAFFIC_COLORS.length)];
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.45,
    roughness: 0.32,
    clearcoat: 0.65,
    clearcoatRoughness: 0.15,
  });

  let halfWidth = 0.98;
  let halfLength = 2.15;

  if (archetype === 'sedan') {
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.65, 4.2), bodyMat);
    base.position.y = 0.62;
    base.castShadow = true;
    group.add(base);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.56, 2.2), sharedTrafficGlassMat);
    cabin.position.set(0, 1.18, 0.12);
    cabin.castShadow = true;
    group.add(cabin);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.08, 1.85), bodyMat);
    roof.position.set(0, 1.48, 0.14);
    group.add(roof);

    const tail = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.14, 0.08), sharedTrafficTailMat);
    tail.position.set(0, 0.72, 2.11);
    group.add(tail);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.14, 0.08), sharedTrafficHeadMat);
    head.position.set(0, 0.65, -2.11);
    group.add(head);

    const wCoords: [number, number][] = [
      [-0.92, -1.25],
      [0.92, -1.25],
      [-0.92, 1.25],
      [0.92, 1.25],
    ];
    for (const [wx, wz] of wCoords) {
      const w = new THREE.Mesh(sharedTrafficWheelGeo, sharedTrafficTireMat);
      w.position.set(wx, 0.34, wz);
      const r = new THREE.Mesh(sharedTrafficRimGeo, sharedTrafficRimMat);
      w.add(r);
      group.add(w);
      wheels.push(w);
    }
  } else if (archetype === 'coupe') {
    halfWidth = 0.96;
    halfLength = 2.1;
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.56, 4.1), bodyMat);
    base.position.y = 0.54;
    base.castShadow = true;
    group.add(base);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.44, 1.85), sharedTrafficGlassMat);
    cabin.position.set(0, 1.0, 0.15);
    group.add(cabin);

    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.06, 0.25), sharedTrafficGlassMat);
    spoiler.position.set(0, 0.98, 1.88);
    group.add(spoiler);

    const tail = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.12, 0.08), sharedTrafficTailMat);
    tail.position.set(0, 0.62, 2.06);
    group.add(tail);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.12, 0.08), sharedTrafficHeadMat);
    head.position.set(0, 0.58, -2.06);
    group.add(head);

    const wCoords: [number, number][] = [
      [-0.9, -1.22],
      [0.9, -1.22],
      [-0.9, 1.22],
      [0.9, 1.22],
    ];
    for (const [wx, wz] of wCoords) {
      const w = new THREE.Mesh(sharedTrafficWheelGeo, sharedTrafficTireMat);
      w.position.set(wx, 0.34, wz);
      w.add(new THREE.Mesh(sharedTrafficRimGeo, sharedTrafficRimMat));
      group.add(w);
      wheels.push(w);
    }
  } else {
    halfWidth = 1.12;
    halfLength = 2.85;
    const cargoMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.45,
      metalness: 0.15,
    });
    const cargo = new THREE.Mesh(new THREE.BoxGeometry(2.16, 1.85, 3.8), cargoMat);
    cargo.position.set(0, 1.45, 0.82);
    cargo.castShadow = true;
    group.add(cargo);

    const cab = new THREE.Mesh(new THREE.BoxGeometry(2.04, 1.35, 1.6), bodyMat);
    cab.position.set(0, 1.15, -1.92);
    cab.castShadow = true;
    group.add(cab);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.58, 0.1), sharedTrafficGlassMat);
    windshield.position.set(0, 1.42, -2.7);
    group.add(windshield);

    const tail = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.18, 0.08), sharedTrafficTailMat);
    tail.position.set(0, 0.65, 2.74);
    group.add(tail);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.18, 0.08), sharedTrafficHeadMat);
    head.position.set(0, 0.68, -2.73);
    group.add(head);

    const wCoords: [number, number][] = [
      [-1.02, -1.85],
      [1.02, -1.85],
      [-1.02, 1.55],
      [1.02, 1.55],
    ];
    for (const [wx, wz] of wCoords) {
      const w = new THREE.Mesh(sharedTrafficWheelGeo, sharedTrafficTireMat);
      w.position.set(wx, 0.36, wz);
      w.scale.setScalar(1.1);
      w.add(new THREE.Mesh(sharedTrafficRimGeo, sharedTrafficRimMat));
      group.add(w);
      wheels.push(w);
    }
  }

  const shadowGeo = new THREE.PlaneGeometry(halfWidth * 2.5, halfLength * 2.35);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadow = new THREE.Mesh(
    shadowGeo,
    new THREE.MeshBasicMaterial({
      map: assets.shadowTexture,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
    })
  );
  shadow.position.y = 0.02;
  group.add(shadow);

  return { group, wheels, halfWidth, halfLength };
}

export function createRoadBarrier(assets: SharedAssets): {
  group: THREE.Group;
  halfWidth: number;
  halfLength: number;
} {
  const group = new THREE.Group();

  const concreteMat = new THREE.MeshStandardMaterial({
    map: assets.hazardTexture,
    roughness: 0.65,
    metalness: 0.1,
  });
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.8,
  });
  const coneMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.4,
  });
  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 2.0,
  });

  const block = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.92, 0.65), concreteMat);
  block.position.y = 0.46;
  block.castShadow = true;
  group.add(block);

  const foot = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.16, 0.85), baseMat);
  foot.position.y = 0.08;
  group.add(foot);

  const coneGeo = new THREE.ConeGeometry(0.18, 0.58, 12);
  const beaconGeo = new THREE.SphereGeometry(0.1, 10, 10);
  for (const sx of [-1.05, 1.05]) {
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.set(sx, 0.29, 0.62);
    cone.castShadow = true;
    group.add(cone);

    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(sx * 0.72, 1.0, 0);
    group.add(beacon);
  }

  return { group, halfWidth: 1.15, halfLength: 0.55 };
}

const sharedCoinRingGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.12, 24);
sharedCoinRingGeo.rotateX(Math.PI / 2);
const sharedCoinCoreGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.15, 12);
sharedCoinCoreGeo.rotateX(Math.PI / 2);
const sharedCoinGoldMat = new THREE.MeshStandardMaterial({
  color: 0xfbbf24,
  metalness: 0.92,
  roughness: 0.18,
  emissive: 0xd97706,
  emissiveIntensity: 0.25,
});
const sharedCoinInnerMat = new THREE.MeshStandardMaterial({
  color: 0xfef08a,
  metalness: 0.85,
  roughness: 0.15,
  emissive: 0xf59e0b,
  emissiveIntensity: 0.35,
});

export function createCoinMesh(): THREE.Group {
  const group = new THREE.Group();
  const outer = new THREE.Mesh(sharedCoinRingGeo, sharedCoinGoldMat);
  outer.castShadow = true;
  group.add(outer);

  const inner = new THREE.Mesh(sharedCoinCoreGeo, sharedCoinInnerMat);
  group.add(inner);

  return group;
}

const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
const leafMatA = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.75 });
const leafMatB = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.75 });
const rockMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.92 });
const gantrySteelMat = new THREE.MeshStandardMaterial({
  color: 0x94a3b8,
  metalness: 0.8,
  roughness: 0.3,
});

export function createRoadsideTree(scale = 1): THREE.Group {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 2.4, 8), trunkMat);
  trunk.position.y = 1.2;
  trunk.castShadow = true;
  tree.add(trunk);

  const crown1 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.4, 8), leafMatA);
  crown1.position.y = 2.9;
  crown1.castShadow = true;
  tree.add(crown1);

  const crown2 = new THREE.Mesh(new THREE.ConeGeometry(1.15, 2.0, 8), leafMatB);
  crown2.position.y = 4.1;
  crown2.castShadow = true;
  tree.add(crown2);

  tree.scale.setScalar(scale);
  return tree;
}

export function createRockCluster(scale = 1): THREE.Group {
  const cluster = new THREE.Group();
  const main = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1, 0), rockMat);
  main.position.y = 0.75;
  main.scale.set(1.2, 0.85, 1.0);
  main.castShadow = true;
  cluster.add(main);

  const side = new THREE.Mesh(new THREE.DodecahedronGeometry(0.68, 0), rockMat);
  side.position.set(0.9, 0.45, 0.35);
  cluster.add(side);

  cluster.scale.setScalar(scale);
  return cluster;
}

export function createHighwayGantry(lampMat: THREE.MeshStandardMaterial): THREE.Group {
  const gantry = new THREE.Group();
  const roadHalfSpan = 7.7;
  const height = 7.2;

  const postGeo = new THREE.CylinderGeometry(0.18, 0.22, height, 10);
  const leftPost = new THREE.Mesh(postGeo, gantrySteelMat);
  leftPost.position.set(-roadHalfSpan, height / 2, 0);
  leftPost.castShadow = true;
  gantry.add(leftPost);

  const rightPost = new THREE.Mesh(postGeo, gantrySteelMat);
  rightPost.position.set(roadHalfSpan, height / 2, 0);
  rightPost.castShadow = true;
  gantry.add(rightPost);

  const beam = new THREE.Mesh(new THREE.BoxGeometry(roadHalfSpan * 2 + 0.5, 0.35, 0.35), gantrySteelMat);
  beam.position.set(0, height - 0.15, 0);
  gantry.add(beam);

  const signMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.45 });
  const sign = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.35, 0.12), signMat);
  sign.position.set(0, height - 0.85, 0.2);
  gantry.add(sign);

  const lampGeo = new THREE.BoxGeometry(0.9, 0.12, 0.32);
  for (const lx of [-4.6, 4.6]) {
    const lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.position.set(lx, height - 0.38, 0);
    gantry.add(lamp);
  }

  return gantry;
}
