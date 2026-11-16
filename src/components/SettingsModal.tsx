import React from 'react';
import { Volume2, Music, Smartphone, Sliders, RotateCcw, ArrowLeft } from 'lucide-react';
import { GameSettings, GraphicsQuality } from '../game/types';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (patch: Partial<GameSettings>) => void;
  onResetDefaults: () => void;
  onBack: () => void;
}

const QUALITY_OPTIONS: { value: GraphicsQuality; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetDefaults,
  onBack,
}) => {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#0c1220] border border-white/15 p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white tracking-tight">
              SETTINGS
            </h2>
            <p className="text-xs text-slate-400">
              Audio, graphics, steering &amp; haptic controls
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/12 text-white font-display font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>
        </div>

        <div className="mt-4 flex flex-col divide-y divide-white/10">
          {/* 1. Sound ON/OFF */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white">Sound Effects</div>
                <div className="text-xs text-slate-400">Engine, coins, nitro &amp; crash SFX</div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEnabled}
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`min-w-[78px] min-h-[44px] px-4 rounded-xl font-display font-bold text-xs tracking-wider border transition-all active:scale-95 cursor-pointer ${
                settings.soundEnabled
                  ? 'bg-emerald-500 border-emerald-300 text-slate-950'
                  : 'bg-slate-900 border-white/15 text-slate-400'
              }`}
            >
              {settings.soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* 2. Music ON/OFF */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white">Background Music</div>
                <div className="text-xs text-slate-400">Electronic synthwave soundtrack</div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.musicEnabled}
              onClick={() => onUpdateSettings({ musicEnabled: !settings.musicEnabled })}
              className={`min-w-[78px] min-h-[44px] px-4 rounded-xl font-display font-bold text-xs tracking-wider border transition-all active:scale-95 cursor-pointer ${
                settings.musicEnabled
                  ? 'bg-emerald-500 border-emerald-300 text-slate-950'
                  : 'bg-slate-900 border-white/15 text-slate-400'
              }`}
            >
              {settings.musicEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* 3. Graphics Quality: Low, Medium, High */}
          <div className="py-3.5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Graphics Quality</span>
              <span className="text-xs text-slate-400 capitalize">{settings.graphicsQuality}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/10">
              {QUALITY_OPTIONS.map((opt) => {
                const active = settings.graphicsQuality === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onUpdateSettings({ graphicsQuality: opt.value })}
                    className={`min-h-[40px] rounded-lg font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                      active
                        ? 'bg-red-600 text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Control Sensitivity */}
          <div className="py-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold text-white">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Control Sensitivity
              </span>
              <span className="font-display font-bold text-sm text-cyan-300 tabular-nums">
                {settings.controlSensitivity.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={1.8}
              step={0.1}
              value={settings.controlSensitivity}
              aria-label="Control Sensitivity"
              onChange={(e) =>
                onUpdateSettings({ controlSensitivity: parseFloat(e.target.value) })
              }
              className="w-full h-2 accent-red-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Smooth (0.5x)</span>
              <span>Balanced (1.0x)</span>
              <span>Sharp (1.8x)</span>
            </div>
          </div>

          {/* 5. Vibration ON/OFF */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white">Vibration</div>
                <div className="text-xs text-slate-400">Haptic feedback on mobile devices</div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.vibrationEnabled}
              onClick={() =>
                onUpdateSettings({ vibrationEnabled: !settings.vibrationEnabled })
              }
              className={`min-w-[78px] min-h-[44px] px-4 rounded-xl font-display font-bold text-xs tracking-wider border transition-all active:scale-95 cursor-pointer ${
                settings.vibrationEnabled
                  ? 'bg-emerald-500 border-emerald-300 text-slate-950'
                  : 'bg-slate-900 border-white/15 text-slate-400'
              }`}
            >
              {settings.vibrationEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onResetDefaults}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/12 text-slate-300 font-display font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="min-h-[46px] px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-display font-bold text-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
