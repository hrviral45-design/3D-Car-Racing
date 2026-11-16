import React from 'react';
import { RotateCcw, Home, Trophy } from 'lucide-react';
import { RunSummary } from '../game/types';

interface GameOverModalProps {
  summary: RunSummary;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  summary,
  onRestart,
  onMainMenu,
}) => {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/65 p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#0c1220] border border-white/15 p-6 shadow-2xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-red-500">
              CRASHED!
            </h2>
            {summary.isNewBest && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Trophy className="w-4 h-4" />
                New Best Score
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300">
            Reached Level {summary.level} · {summary.levelName}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 border-y border-white/10 divide-x divide-white/10">
          <div className="py-4 pr-4">
            <div className="text-xs font-medium text-slate-400">Final Score</div>
            <div className="mt-1 font-display text-2xl font-extrabold text-white tabular-nums">
              {summary.score.toLocaleString()}
            </div>
          </div>
          <div className="py-4 pl-4">
            <div className="text-xs font-medium text-slate-400">Best Score</div>
            <div className="mt-1 font-display text-2xl font-extrabold text-amber-400 tabular-nums">
              {summary.bestScore.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-b border-white/10 divide-x divide-white/10 text-center">
          <div className="py-3 px-2">
            <div className="text-[11px] text-slate-400">Distance</div>
            <div className="mt-0.5 font-display text-base font-bold text-white tabular-nums">
              {(summary.distanceMeters / 1000).toFixed(2)} km
            </div>
          </div>
          <div className="py-3 px-2">
            <div className="text-[11px] text-slate-400">Coins (+Earned)</div>
            <div className="mt-0.5 font-display text-base font-bold text-amber-300 tabular-nums">
              +{summary.coins} ({summary.totalCoins.toLocaleString()})
            </div>
          </div>
          <div className="py-3 px-2">
            <div className="text-[11px] text-slate-400">Top Speed</div>
            <div className="mt-0.5 font-display text-base font-bold text-cyan-300 tabular-nums">
              {summary.maxSpeedKmh} km/h
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-display font-bold text-base flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART</span>
          </button>
          <button
            type="button"
            onClick={onMainMenu}
            className="flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 active:scale-[0.98] text-white font-display font-bold text-base flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
