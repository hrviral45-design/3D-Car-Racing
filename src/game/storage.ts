import {
  CAR_CATALOG,
  CAR_FINISHES,
  CarModelId,
  GameSettings,
  UpgradeLevels,
} from './types';

const KEYS = {
  bestScore: 'super_3d_car_racing_best_score',
  coinBank: 'super_3d_car_racing_coin_bank',
  ownedCars: 'super_3d_car_racing_owned_cars',
  selectedCar: 'super_3d_car_racing_selected_car',
  selectedFinish: 'super_3d_car_racing_selected_finish',
  upgrades: 'super_3d_car_racing_upgrades',
  settings: 'super_3d_car_racing_settings',
};

const DEFAULT_OWNED_CARS: CarModelId[] = CAR_CATALOG.filter(
  (c) => c.unlockedByDefault
).map((c) => c.id);

const LEGACY_CAR_MAP: Record<string, CarModelId> = {
  apex_gt: 'red_supercar',
  vipera: 'yellow_flash',
  hyperion: 'white_ghost',
  phantom_x: 'phantom_x',
};

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  graphicsQuality: 'high',
  controlSensitivity: 1.0,
  vibrationEnabled: true,
};

export interface PlayerSaveData {
  bestScore: number;
  coinBank: number;
  ownedCars: CarModelId[];
  selectedCarId: CarModelId;
  selectedFinishId: string;
  upgrades: UpgradeLevels;
  settings: GameSettings;
}

export function loadSaveData(): PlayerSaveData {
  try {
    const bestScore = parseInt(localStorage.getItem(KEYS.bestScore) || '0', 10) || 0;

    const rawCoins = localStorage.getItem(KEYS.coinBank);
    const coinBank = rawCoins !== null ? Math.max(0, parseInt(rawCoins, 10) || 0) : 500;

    let ownedCars: CarModelId[] = [...DEFAULT_OWNED_CARS];
    const rawOwned = localStorage.getItem(KEYS.ownedCars);
    if (rawOwned) {
      const parsed = JSON.parse(rawOwned);
      if (Array.isArray(parsed)) {
        for (const entry of parsed) {
          const mapped = LEGACY_CAR_MAP[entry] ?? entry;
          if (
            CAR_CATALOG.some((c) => c.id === mapped) &&
            !ownedCars.includes(mapped as CarModelId)
          ) {
            ownedCars.push(mapped as CarModelId);
          }
        }
      }
    }

    const rawCar = localStorage.getItem(KEYS.selectedCar);
    const mappedCar = rawCar ? (LEGACY_CAR_MAP[rawCar] ?? rawCar) : null;
    const selectedCarId =
      mappedCar && ownedCars.includes(mappedCar as CarModelId)
        ? (mappedCar as CarModelId)
        : 'red_supercar';

    const rawFinish = localStorage.getItem(KEYS.selectedFinish);
    const selectedFinishId =
      rawFinish === 'signature' ||
      (rawFinish && CAR_FINISHES.some((f) => f.id === rawFinish))
        ? rawFinish
        : 'signature';

    let upgrades: UpgradeLevels = { engine: 0, handling: 0, nitro: 0 };
    const rawUpgrades = localStorage.getItem(KEYS.upgrades);
    if (rawUpgrades) {
      const parsed = JSON.parse(rawUpgrades);
      upgrades = {
        engine: Math.min(3, Math.max(0, Number(parsed.engine) || 0)),
        handling: Math.min(3, Math.max(0, Number(parsed.handling) || 0)),
        nitro: Math.min(3, Math.max(0, Number(parsed.nitro) || 0)),
      };
    }

    let settings: GameSettings = { ...DEFAULT_SETTINGS };
    const rawSettings = localStorage.getItem(KEYS.settings);
    if (rawSettings) {
      const parsed = JSON.parse(rawSettings);
      settings = {
        soundEnabled: parsed.soundEnabled !== false,
        musicEnabled: parsed.musicEnabled !== false,
        graphicsQuality:
          parsed.graphicsQuality === 'low' ||
          parsed.graphicsQuality === 'medium' ||
          parsed.graphicsQuality === 'high'
            ? parsed.graphicsQuality
            : 'high',
        controlSensitivity: Math.min(
          1.8,
          Math.max(0.5, Number(parsed.controlSensitivity) || 1.0)
        ),
        vibrationEnabled: parsed.vibrationEnabled !== false,
      };
    }

    return {
      bestScore,
      coinBank,
      ownedCars,
      selectedCarId,
      selectedFinishId,
      upgrades,
      settings,
    };
  } catch {
    return {
      bestScore: 0,
      coinBank: 500,
      ownedCars: [...DEFAULT_OWNED_CARS],
      selectedCarId: 'red_supercar',
      selectedFinishId: 'signature',
      upgrades: { engine: 0, handling: 0, nitro: 0 },
      settings: { ...DEFAULT_SETTINGS },
    };
  }
}

export function persistSaveData(data: Partial<PlayerSaveData>): void {
  try {
    if (data.bestScore !== undefined) {
      localStorage.setItem(KEYS.bestScore, String(data.bestScore));
    }
    if (data.coinBank !== undefined) {
      localStorage.setItem(KEYS.coinBank, String(data.coinBank));
    }
    if (data.ownedCars !== undefined) {
      localStorage.setItem(KEYS.ownedCars, JSON.stringify(data.ownedCars));
    }
    if (data.selectedCarId !== undefined) {
      localStorage.setItem(KEYS.selectedCar, data.selectedCarId);
    }
    if (data.selectedFinishId !== undefined) {
      localStorage.setItem(KEYS.selectedFinish, data.selectedFinishId);
    }
    if (data.upgrades !== undefined) {
      localStorage.setItem(KEYS.upgrades, JSON.stringify(data.upgrades));
    }
    if (data.settings !== undefined) {
      localStorage.setItem(KEYS.settings, JSON.stringify(data.settings));
    }
  } catch {
    // Ignore storage quota / private mode errors
  }
}
