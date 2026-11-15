import { useCallback, useEffect, useRef, useState } from 'react';
import { CarGarage } from './components/CarGarage';
import { CarShop } from './components/CarShop';
import { ExitConfirmModal, ExitedStandby } from './components/ExitScreen';
import { GameHUD } from './components/GameHUD';
import { GameOverModal } from './components/GameOverModal';
import { MainMenu } from './components/MainMenu';
import { PauseModal } from './components/PauseModal';
import { SettingsModal } from './components/SettingsModal';
import { racingAudio } from './game/audio';
import { RacingEngine } from './game/RacingEngine';
import { DEFAULT_SETTINGS, loadSaveData, persistSaveData } from './game/storage';
import {
  CameraMode,
  CAR_CATALOG,
  CarFinish,
  CarModelId,
  ControlInput,
  GamePhase,
  GameSettings,
  HudTelemetry,
  resolveCarFinish,
  RunSummary,
  UpgradeLevels,
} from './game/types';

const INITIAL_TELEMETRY: HudTelemetry = {
  speedKmh: 0,
  maxSpeedKmh: 0,
  nitro: 100,
  nitroActive: false,
  score: 0,
  coins: 0,
  distanceMeters: 0,
  level: 1,
  levelName: 'Coastal Dawn',
  nearMissCombo: 0,
  eventBanner: null,
};

const CAMERA_MODES: CameraMode[] = ['chase', 'far', 'hood'];

export default function App() {
  const initialSaveRef = useRef(loadSaveData());
  const initialSave = initialSaveRef.current;

  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<RacingEngine | null>(null);
  const phaseRef = useRef<GamePhase>('menu');

  const [phase, setPhase] = useState<GamePhase>('menu');
  const [ownedCars, setOwnedCars] = useState<CarModelId[]>(initialSave.ownedCars);
  const [selectedCarId, setSelectedCarId] = useState<CarModelId>(initialSave.selectedCarId);
  const [previewCarId, setPreviewCarId] = useState<CarModelId>(initialSave.selectedCarId);
  const [selectedFinishId, setSelectedFinishId] = useState<string>(initialSave.selectedFinishId);
  const [upgrades, setUpgrades] = useState<UpgradeLevels>(initialSave.upgrades);
  const [settings, setSettings] = useState<GameSettings>(initialSave.settings);
  const [bestScore, setBestScore] = useState<number>(initialSave.bestScore);
  const [coinBank, setCoinBank] = useState<number>(initialSave.coinBank);

  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>('chase');
  const [telemetry, setTelemetry] = useState<HudTelemetry>(INITIAL_TELEMETRY);
  const [summary, setSummary] = useState<RunSummary | null>(null);
  const [contextLost, setContextLost] = useState<boolean>(false);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Unlock Web Audio cleanly on first user interaction
  useEffect(() => {
    const unlockOnce = () => {
      racingAudio.unlock();
      racingAudio.setSoundEnabled(initialSaveRef.current.settings.soundEnabled);
      racingAudio.setMusicEnabled(initialSaveRef.current.settings.musicEnabled);
      racingAudio.setVibrationEnabled(initialSaveRef.current.settings.vibrationEnabled);
    };
    window.addEventListener('pointerdown', unlockOnce, { once: true });
    window.addEventListener('keydown', unlockOnce, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockOnce);
      window.removeEventListener('keydown', unlockOnce);
    };
  }, []);

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;
    const save = initialSaveRef.current;
    const initCar = CAR_CATALOG.find((c) => c.id === save.selectedCarId) ?? CAR_CATALOG[0];
    const initFinish = resolveCarFinish(initCar, save.selectedFinishId);

    const engine = new RacingEngine(
      mount,
      {
        onPhaseChange: (nextPhase) => {
          phaseRef.current = nextPhase;
          setPhase(nextPhase);
        },
        onTelemetry: (data) => {
          setTelemetry(data);
        },
        onGameOver: (runSummary) => {
          setSummary(runSummary);
          setBestScore(runSummary.bestScore);
          setCoinBank(runSummary.totalCoins);
          persistSaveData({
            bestScore: runSummary.bestScore,
            coinBank: runSummary.totalCoins,
          });
        },
        onContextLost: (lost) => {
          setContextLost(lost);
        },
      },
      {
        carId: save.selectedCarId,
        finish: initFinish,
        upgrades: save.upgrades,
        settings: save.settings,
        bestScore: save.bestScore,
        coinBank: save.coinBank,
      }
    );

    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // Keyboard controls for racing & pause
  useEffect(() => {
    const mapKey = (code: string): keyof ControlInput | null => {
      switch (code) {
        case 'ArrowLeft':
        case 'KeyA':
          return 'left';
        case 'ArrowRight':
        case 'KeyD':
          return 'right';
        case 'ArrowUp':
        case 'KeyW':
          return 'accelerate';
        case 'ArrowDown':
        case 'KeyS':
          return 'brake';
        case 'Space':
        case 'ShiftLeft':
        case 'ShiftRight':
          return 'nitro';
        default:
          return null;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (phaseRef.current === 'playing') {
          engineRef.current?.pauseRace();
        } else if (phaseRef.current === 'paused') {
          engineRef.current?.resumeRace();
        }
        return;
      }

      if (e.code === 'KeyC' && phaseRef.current === 'playing') {
        setCameraMode((prev) => {
          const next = CAMERA_MODES[(CAMERA_MODES.indexOf(prev) + 1) % CAMERA_MODES.length];
          engineRef.current?.setCameraMode(next);
          return next;
        });
        return;
      }

      const mapped = mapKey(e.code);
      if (mapped) {
        if (e.code === 'Space' || e.code.startsWith('Arrow')) {
          e.preventDefault();
        }
        engineRef.current?.setInput({ [mapped]: true });
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const mapped = mapKey(e.code);
      if (mapped) {
        engineRef.current?.setInput({ [mapped]: false });
      }
    };

    const resetInputs = () => {
      engineRef.current?.setInput({
        left: false,
        right: false,
        accelerate: false,
        brake: false,
        nitro: false,
      });
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', resetInputs);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', resetInputs);
    };
  }, []);

  const getEffectiveFinish = useCallback((carId: CarModelId, finishId: string): CarFinish => {
    const spec = CAR_CATALOG.find((c) => c.id === carId) ?? CAR_CATALOG[0];
    return resolveCarFinish(spec, finishId);
  }, []);

  const syncCarToEngine = useCallback(
    (carId: CarModelId, finish: CarFinish, nextUpgrades: UpgradeLevels) => {
      engineRef.current?.setCarConfig(carId, finish, nextUpgrades);
    },
    []
  );

  const handleUpdateSettings = useCallback((patch: Partial<GameSettings>) => {
    racingAudio.unlock();
    racingAudio.playUiClick();
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      persistSaveData({ settings: next });
      engineRef.current?.applySettings(next);
      return next;
    });
  }, []);

  const handleResetSettings = useCallback(() => {
    racingAudio.playUiClick();
    const next = { ...DEFAULT_SETTINGS };
    setSettings(next);
    persistSaveData({ settings: next });
    engineRef.current?.applySettings(next);
  }, []);

  const handleStartRace = useCallback(() => {
    racingAudio.unlock();
    racingAudio.playUiClick();
    racingAudio.vibrate(25);
    setSummary(null);
    const finish = getEffectiveFinish(selectedCarId, selectedFinishId);
    syncCarToEngine(selectedCarId, finish, upgrades);
    engineRef.current?.startRace();
  }, [selectedCarId, selectedFinishId, upgrades, getEffectiveFinish, syncCarToEngine]);

  const handleOpenGarage = useCallback(() => {
    racingAudio.unlock();
    racingAudio.playUiClick();
    setPreviewCarId(selectedCarId);
    const finish = getEffectiveFinish(selectedCarId, selectedFinishId);
    syncCarToEngine(selectedCarId, finish, upgrades);
    engineRef.current?.setShowroomAutoRotate(true);
    engineRef.current?.setShowroomMode('garage');
  }, [selectedCarId, selectedFinishId, upgrades, getEffectiveFinish, syncCarToEngine]);

  const handleOpenShop = useCallback(() => {
    racingAudio.unlock();
    racingAudio.playUiClick();
    setPreviewCarId(selectedCarId);
    const finish = getEffectiveFinish(selectedCarId, selectedFinishId);
    syncCarToEngine(selectedCarId, finish, upgrades);
    engineRef.current?.setShowroomMode('shop');
  }, [selectedCarId, selectedFinishId, upgrades, getEffectiveFinish, syncCarToEngine]);

  const handleOpenSettings = useCallback(() => {
    racingAudio.unlock();
    racingAudio.playUiClick();
    engineRef.current?.setShowroomMode('settings');
  }, []);

  const handleBackToMenu = useCallback(() => {
    racingAudio.playUiClick();
    setPreviewCarId(selectedCarId);
    const finish = getEffectiveFinish(selectedCarId, selectedFinishId);
    syncCarToEngine(selectedCarId, finish, upgrades);
    engineRef.current?.setShowroomAutoRotate(true);
    engineRef.current?.setShowroomMode('menu');
  }, [selectedCarId, selectedFinishId, upgrades, getEffectiveFinish, syncCarToEngine]);

  const handlePreviewGarageCar = useCallback(
    (carId: CarModelId) => {
      racingAudio.playUiClick();
      setPreviewCarId(carId);
      const finish = getEffectiveFinish(carId, selectedFinishId);
      syncCarToEngine(carId, finish, upgrades);
    },
    [selectedFinishId, upgrades, getEffectiveFinish, syncCarToEngine]
  );

  const handleSelectCar = useCallback(
    (carId: CarModelId) => {
      racingAudio.playUiClick();
      setSelectedCarId(carId);
      setPreviewCarId(carId);
      persistSaveData({ selectedCarId: carId });
      const finish = getEffectiveFinish(carId, selectedFinishId);
      syncCarToEngine(carId, finish, upgrades);
    },
    [selectedFinishId, upgrades, getEffectiveFinish, syncCarToEngine]
  );

  const handleSelectFinishId = useCallback(
    (finishId: string) => {
      racingAudio.playUiClick();
      setSelectedFinishId(finishId);
      persistSaveData({ selectedFinishId: finishId });
      const visibleCarId = phaseRef.current === 'garage' ? previewCarId : selectedCarId;
      const finish = getEffectiveFinish(visibleCarId, finishId);
      syncCarToEngine(visibleCarId, finish, upgrades);
    },
    [previewCarId, selectedCarId, upgrades, getEffectiveFinish, syncCarToEngine]
  );

  const handleToggleAutoRotate = useCallback((enabled: boolean) => {
    racingAudio.playUiClick();
    engineRef.current?.setShowroomAutoRotate(enabled);
  }, []);

  const handleResetGarageCamera = useCallback(() => {
    racingAudio.playUiClick();
    engineRef.current?.resetShowroomCamera();
  }, []);

  const handlePreviewShopCar = useCallback(
    (carId: CarModelId) => {
      racingAudio.playUiClick();
      setPreviewCarId(carId);
      const finish = getEffectiveFinish(carId, selectedFinishId);
      syncCarToEngine(carId, finish, upgrades);
    },
    [selectedFinishId, upgrades, getEffectiveFinish, syncCarToEngine]
  );

  const handleBuyCar = useCallback(
    (carId: CarModelId, price: number) => {
      if (coinBank < price || ownedCars.includes(carId)) return;
      racingAudio.playPurchase();
      racingAudio.vibrate([25, 30, 45]);
      const nextCoins = coinBank - price;
      const nextOwned = [...ownedCars, carId];
      setCoinBank(nextCoins);
      setOwnedCars(nextOwned);
      setSelectedCarId(carId);
      setPreviewCarId(carId);
      persistSaveData({
        coinBank: nextCoins,
        ownedCars: nextOwned,
        selectedCarId: carId,
      });
      engineRef.current?.setBestScore(bestScore, nextCoins);
      const finish = getEffectiveFinish(carId, selectedFinishId);
      syncCarToEngine(carId, finish, upgrades);
    },
    [coinBank, ownedCars, bestScore, selectedFinishId, upgrades, getEffectiveFinish, syncCarToEngine]
  );

  const handleBuyUpgrade = useCallback(
    (key: keyof UpgradeLevels, cost: number) => {
      if (coinBank < cost || upgrades[key] >= 3) return;
      racingAudio.playPurchase();
      racingAudio.vibrate([20, 25, 40]);
      const nextCoins = coinBank - cost;
      const nextUpgrades = { ...upgrades, [key]: upgrades[key] + 1 };
      setCoinBank(nextCoins);
      setUpgrades(nextUpgrades);
      persistSaveData({
        coinBank: nextCoins,
        upgrades: nextUpgrades,
      });
      engineRef.current?.setBestScore(bestScore, nextCoins);
      const finish = getEffectiveFinish(selectedCarId, selectedFinishId);
      syncCarToEngine(selectedCarId, finish, nextUpgrades);
    },
    [coinBank, upgrades, bestScore, selectedCarId, selectedFinishId, getEffectiveFinish, syncCarToEngine]
  );

  const handleRequestExit = useCallback(() => {
    racingAudio.unlock();
    racingAudio.playUiClick();
    setShowExitConfirm(true);
  }, []);

  const handleConfirmExit = useCallback(() => {
    racingAudio.playUiClick();
    racingAudio.setMusicEnabled(false);
    setShowExitConfirm(false);
    engineRef.current?.setShowroomMode('exited');
    try {
      window.close();
    } catch {
      // Browser tab may block window.close; ExitedStandby renders cleanly
    }
  }, []);

  const handleRelaunchFromExit = useCallback(() => {
    racingAudio.unlock();
    racingAudio.playUiClick();
    racingAudio.setMusicEnabled(settings.musicEnabled);
    engineRef.current?.setShowroomMode('menu');
  }, [settings.musicEnabled]);

  const handleInputChange = useCallback((patch: Partial<ControlInput>) => {
    engineRef.current?.setInput(patch);
  }, []);

  const handleCycleCamera = useCallback(() => {
    racingAudio.playUiClick();
    setCameraMode((prev) => {
      const next = CAMERA_MODES[(CAMERA_MODES.indexOf(prev) + 1) % CAMERA_MODES.length];
      engineRef.current?.setCameraMode(next);
      return next;
    });
  }, []);

  const handlePause = useCallback(() => {
    racingAudio.playUiClick();
    engineRef.current?.pauseRace();
  }, []);

  const handleResume = useCallback(() => {
    racingAudio.playUiClick();
    engineRef.current?.resumeRace();
  }, []);

  const handleMainMenuFromRace = useCallback(() => {
    racingAudio.playUiClick();
    setSummary(null);
    const finish = getEffectiveFinish(selectedCarId, selectedFinishId);
    syncCarToEngine(selectedCarId, finish, upgrades);
    engineRef.current?.returnToMenu();
  }, [selectedCarId, selectedFinishId, upgrades, getEffectiveFinish, syncCarToEngine]);

  const activeCarSpec =
    CAR_CATALOG.find((c) => c.id === selectedCarId) ?? CAR_CATALOG[0];
  const activeFinish = resolveCarFinish(activeCarSpec, selectedFinishId);

  return (
    <main className="relative w-full h-full overflow-hidden bg-[#060913]">
      {/* Dedicated isolated WebGL canvas container */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full"
        aria-label="3D Highway Racing Viewport"
      />

      {contextLost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060913]/95 p-6 text-center">
          <div className="max-w-sm rounded-2xl bg-[#0c1220] border border-white/15 p-6">
            <h2 className="font-display text-xl font-bold text-white">
              Graphics Context Interrupted
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Restoring 3D rendering pipeline. Tap reload if the viewport stays paused.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 min-h-[44px] px-5 py-2.5 rounded-xl bg-red-600 text-white font-display font-bold text-sm cursor-pointer"
            >
              Reload Game
            </button>
          </div>
        </div>
      )}

      {phase === 'menu' && (
        <MainMenu
          selectedCar={activeCarSpec}
          selectedFinish={activeFinish}
          bestScore={bestScore}
          coinBank={coinBank}
          settings={settings}
          onStartRace={handleStartRace}
          onOpenGarage={handleOpenGarage}
          onOpenShop={handleOpenShop}
          onOpenSettings={handleOpenSettings}
          onRequestExit={handleRequestExit}
          onToggleSound={() =>
            handleUpdateSettings({ soundEnabled: !settings.soundEnabled })
          }
          onToggleMusic={() =>
            handleUpdateSettings({ musicEnabled: !settings.musicEnabled })
          }
        />
      )}

      {phase === 'garage' && (
        <CarGarage
          ownedCars={ownedCars}
          selectedCarId={selectedCarId}
          previewCarId={previewCarId}
          selectedFinishId={selectedFinishId}
          upgrades={upgrades}
          onPreviewCar={handlePreviewGarageCar}
          onSelectCar={handleSelectCar}
          onSelectFinishId={handleSelectFinishId}
          onToggleAutoRotate={handleToggleAutoRotate}
          onResetCamera={handleResetGarageCamera}
          onGoToShop={handleOpenShop}
          onStartRace={handleStartRace}
          onBack={handleBackToMenu}
        />
      )}

      {phase === 'shop' && (
        <CarShop
          coinBank={coinBank}
          ownedCars={ownedCars}
          selectedCarId={selectedCarId}
          previewCarId={previewCarId}
          upgrades={upgrades}
          onPreviewCar={handlePreviewShopCar}
          onBuyCar={handleBuyCar}
          onEquipCar={handleSelectCar}
          onBuyUpgrade={handleBuyUpgrade}
          onBack={handleBackToMenu}
        />
      )}

      {phase === 'settings' && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetDefaults={handleResetSettings}
          onBack={handleBackToMenu}
        />
      )}

      {showExitConfirm && (
        <ExitConfirmModal
          onCancel={() => {
            racingAudio.playUiClick();
            setShowExitConfirm(false);
          }}
          onConfirmExit={handleConfirmExit}
        />
      )}

      {phase === 'exited' && (
        <ExitedStandby onRelaunch={handleRelaunchFromExit} />
      )}

      {(phase === 'playing' || phase === 'crashing') && (
        <GameHUD
          telemetry={telemetry}
          cameraMode={cameraMode}
          muted={!settings.soundEnabled}
          onInputChange={handleInputChange}
          onCycleCamera={handleCycleCamera}
          onToggleMute={() =>
            handleUpdateSettings({ soundEnabled: !settings.soundEnabled })
          }
          onPause={handlePause}
        />
      )}

      {phase === 'paused' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleStartRace}
          onMainMenu={handleMainMenuFromRace}
        />
      )}

      {phase === 'gameover' && summary && (
        <GameOverModal
          summary={summary}
          onRestart={handleStartRace}
          onMainMenu={handleMainMenuFromRace}
        />
      )}
    </main>
  );
}
