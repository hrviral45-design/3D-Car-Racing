import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onMainMenu,
}) => {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/65 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#0c1220] border border-white/15 p-6 shadow-2xl">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-white text-center">
          RACE PAUSED
        </h2>
        <p className="mt-1 text-xs text-slate-400 text-center">
          Take a breather or adjust your audio and camera
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onResume}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-display font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESUME RACE</span>
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/15 active:scale-[0.98] text-white font-display font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART</span>
          </button>
          <button
            type="button"
            onClick={onMainMenu}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 active:scale-[0.98] text-slate-200 font-display font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
