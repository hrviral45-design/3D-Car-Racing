import React from 'react';
import { Power, RotateCcw } from 'lucide-react';

interface ExitConfirmModalProps {
  onCancel: () => void;
  onConfirmExit: () => void;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  onCancel,
  onConfirmExit,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#0c1220] border border-white/15 p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <Power className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-extrabold text-white">
              EXIT GAME
            </h2>
            <p className="text-xs text-slate-400">
              Your coins, cars, and settings are saved.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/12 text-white font-display font-bold text-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={onConfirmExit}
            className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-display font-bold text-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            EXIT
          </button>
        </div>
      </div>
    </div>
  );
};

interface ExitedStandbyProps {
  onRelaunch: () => void;
}

export const ExitedStandby: React.FC<ExitedStandbyProps> = ({ onRelaunch }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#060913]/92 p-6 text-center">
      <div className="max-w-sm w-full rounded-2xl bg-[#0c1220] border border-white/15 p-6 shadow-2xl">
        <h2 className="font-display text-2xl font-extrabold text-white">
          THANKS FOR RACING
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          SUPER 3D CAR RACING session ended. Your garage, coin bank, and high scores remain saved on this device.
        </p>
        <button
          type="button"
          onClick={onRelaunch}
          className="mt-6 w-full min-h-[48px] px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-display font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RETURN TO MAIN MENU</span>
        </button>
      </div>
    </div>
  );
};
