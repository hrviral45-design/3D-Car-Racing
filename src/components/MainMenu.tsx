import React from 'react';
import {
  Play,
  CarFront,
  ShoppingBag,
  Settings,
  Power,
  Trophy,
  Coins,
  Volume2,
  VolumeX,
  Music,
} from 'lucide-react';
import { CarCatalogItem, CarFinish, GameSettings } from '../game/types';

interface MainMenuProps {
  selectedCar: CarCatalogItem;
  selectedFinish: CarFinish;
  bestScore: number;
  coinBank: number;
  settings: GameSettings;
  onStartRace: () => void;
  onOpenGarage: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  onRequestExit: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  selectedCar,
  selectedFinish,
  bestScore,
  coinBank,
  settings,
  onStartRace,
  onOpenGarage,
  onOpenShop,
  onOpenSettings,
  onRequestExit,
  onToggleSound,
  onToggleMusic,
}) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Bar: Brand Title, Best Score, Coin Bank & Quick Audio Toggles */}
      <header className="pointer-events-auto flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            SUPER 3D CAR RACING
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-300">
            <span className="text-white font-semibold">{selectedCar.name}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>{selectedFinish.name}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="inline-flex items-center gap-1 text-amber-400 tabular-nums">
              <Trophy className="w-3.5 h-3.5 shrink-0" />
              Best {bestScore.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="min-h-[44px] px-3 rounded-xl bg-[#090d16]/88 border border-white/15 flex items-center gap-1.5 text-sm font-bold text-amber-400 tabular-nums">
            <Coins className="w-4 h-4 shrink-0" />
            <span>{coinBank.toLocaleString()}</span>
          </div>

          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={settings.musicEnabled ? 'Mute music' : 'Enable music'}
            title={settings.musicEnabled ? 'Music ON' : 'Music OFF'}
            className={`min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${
              settings.musicEnabled
                ? 'bg-[#090d16]/88 border-cyan-400/40 text-cyan-300'
                : 'bg-[#090d16]/88 border-white/15 text-slate-500'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            aria-label={settings.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            title={settings.soundEnabled ? 'Sound ON' : 'Sound OFF'}
            className={`min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${
              settings.soundEnabled
                ? 'bg-[#090d16]/88 border-white/20 text-white'
                : 'bg-[#090d16]/88 border-white/15 text-slate-500'
            }`}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Menu Action Dock: Bottom grid on mobile, sleek left column on desktop so 3D car stays center stage */}
      <nav
        aria-label="Main menu"
        className="pointer-events-auto w-full sm:w-72 rounded-2xl bg-[#090d16]/90 border border-white/15 p-3.5 sm:p-4 shadow-2xl"
      >
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onStartRace}
            className="w-full min-h-[52px] px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-display font-bold text-base sm:text-lg tracking-wide flex items-center justify-between shadow-lg shadow-red-600/30 transition-all duration-150 cursor-pointer"
          >
            <span className="flex items-center gap-2.5 whitespace-nowrap">
              <Play className="w-5 h-5 fill-current shrink-0" />
              <span>START RACE</span>
            </span>
            <span className="text-xs font-semibold text-red-100">GO</span>
          </button>

          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
            <button
              type="button"
              onClick={onOpenGarage}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-white/12 hover:border-cyan-400/50 active:scale-[0.98] text-white font-display font-bold text-sm tracking-wide flex items-center justify-between transition-all duration-150 cursor-pointer"
            >
              <span className="flex items-center gap-2.5 whitespace-nowrap">
                <CarFront className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>CAR GARAGE</span>
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenShop}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-white/12 hover:border-amber-400/50 active:scale-[0.98] text-white font-display font-bold text-sm tracking-wide flex items-center justify-between transition-all duration-150 cursor-pointer"
            >
              <span className="flex items-center gap-2.5 whitespace-nowrap">
                <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
                <span>CAR SHOP</span>
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 border border-white/12 hover:border-white/30 active:scale-[0.98] text-white font-display font-bold text-sm tracking-wide flex items-center justify-between transition-all duration-150 cursor-pointer"
            >
              <span className="flex items-center gap-2.5 whitespace-nowrap">
                <Settings className="w-4 h-4 text-slate-300 shrink-0" />
                <span>SETTINGS</span>
              </span>
            </button>

            <button
              type="button"
              onClick={onRequestExit}
              className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-transparent hover:bg-red-950/50 border border-white/12 hover:border-red-500/45 active:scale-[0.98] text-slate-300 hover:text-red-300 font-display font-bold text-sm tracking-wide flex items-center justify-between transition-all duration-150 cursor-pointer"
            >
              <span className="flex items-center gap-2.5 whitespace-nowrap">
                <Power className="w-4 h-4 shrink-0" />
                <span>EXIT GAME</span>
              </span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};
