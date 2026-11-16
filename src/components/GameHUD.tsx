import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Pause,
  Volume2,
  VolumeX,
  Video,
  Coins,
} from 'lucide-react';
import { CameraMode, ControlInput, HudTelemetry } from '../game/types';

interface GameHUDProps {
  telemetry: HudTelemetry;
  cameraMode: CameraMode;
  muted: boolean;
  onInputChange: (patch: Partial<ControlInput>) => void;
  onCycleCamera: () => void;
  onToggleMute: () => void;
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  telemetry,
  cameraMode,
  muted,
  onInputChange,
  onCycleCamera,
  onToggleMute,
  onPause,
}) => {
  const [pressed, setPressed] = useState<ControlInput>({
    left: false,
    right: false,
    accelerate: false,
    brake: false,
    nitro: false,
  });

  const bindControl = (key: keyof ControlInput) => {
    const setActive = (val: boolean) => {
      setPressed((prev) => (prev[key] === val ? prev : { ...prev, [key]: val }));
      onInputChange({ [key]: val });
    };

    return {
      onPointerDown: (e: React.PointerEvent) => {
        e.preventDefault();
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
          // Ignore if unsupported
        }
        setActive(true);
      },
      onPointerUp: (e: React.PointerEvent) => {
        e.preventDefault();
        setActive(false);
      },
      onPointerCancel: () => setActive(false),
      onLostPointerCapture: () => setActive(false),
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    };
  };

  const speedPct = Math.min(1, telemetry.speedKmh / 360);
  const arcRadius = 30;
  const arcCircumference = Math.PI * arcRadius; // half-circle gauge
  const dashOffset = arcCircumference * (1 - speedPct);
  const nitroReady = telemetry.nitro >= 12 || telemetry.nitroActive;

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-3 sm:p-4">
      {/* Top HUD Bar (Compact, high contrast, zero pills) */}
      <div className="flex items-start justify-between gap-2">
        <div className="pointer-events-auto rounded-xl bg-[#090d16]/82 border border-white/15 px-3.5 py-2 flex flex-col gap-0.5">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-xl sm:text-2xl font-extrabold text-white tabular-nums leading-none">
              {telemetry.score.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-400 tabular-nums">
              <Coins className="w-3.5 h-3.5 shrink-0" />
              {telemetry.coins}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-300 tabular-nums">
            <span className="text-cyan-300 font-semibold">
              Level {telemetry.level}
            </span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="truncate max-w-[115px] sm:max-w-none">{telemetry.levelName}</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>{(telemetry.distanceMeters / 1000).toFixed(2)} km</span>
          </div>
        </div>

        {/* Top-Right Action Controls (44px+ hitboxes) */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onCycleCamera}
            aria-label={`Camera mode: ${cameraMode}`}
            title={`Camera: ${cameraMode}`}
            className="min-w-[44px] min-h-[44px] px-2.5 rounded-xl bg-[#090d16]/82 border border-white/15 text-slate-200 hover:bg-[#131b2e] active:scale-95 transition-transform flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Video className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline capitalize">{cameraMode}</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? 'Unmute audio' : 'Mute audio'}
            className="min-w-[44px] min-h-[44px] rounded-xl bg-[#090d16]/82 border border-white/15 text-white hover:bg-[#131b2e] active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            type="button"
            onClick={onPause}
            aria-label="Pause game"
            className="min-w-[44px] min-h-[44px] rounded-xl bg-[#090d16]/82 border border-white/15 text-white hover:bg-[#131b2e] active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Non-blocking Level-Up / Near-Miss Banner */}
      {telemetry.eventBanner && (
        <div className="pointer-events-none self-center -mt-4 rounded-xl bg-[#090d16]/88 border border-amber-400/40 px-4 py-1.5 text-center shadow-lg">
          <span className="font-display text-xs sm:text-sm font-bold tracking-wider text-amber-300">
            {telemetry.eventBanner}
          </span>
        </div>
      )}

      {/* Bottom Controls & Speedometer Zone (Natural Mobile Thumb Reach) */}
      <div className="flex items-end justify-between gap-2 pb-1">
        {/* Bottom-Left: Smooth Steering Touch Pads */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Steer Left"
            {...bindControl('left')}
            className={`w-16 h-16 sm:w-[74px] sm:h-[74px] rounded-2xl border flex items-center justify-center transition-transform touch-none select-none cursor-pointer ${
              pressed.left
                ? 'bg-cyan-500/85 border-cyan-300 text-slate-950 scale-95'
                : 'bg-[#090d16]/80 border-white/20 text-white active:scale-95'
            }`}
          >
            <ChevronLeft className="w-9 h-9 stroke-[2.6]" />
          </button>

          <button
            type="button"
            aria-label="Steer Right"
            {...bindControl('right')}
            className={`w-16 h-16 sm:w-[74px] sm:h-[74px] rounded-2xl border flex items-center justify-center transition-transform touch-none select-none cursor-pointer ${
              pressed.right
                ? 'bg-cyan-500/85 border-cyan-300 text-slate-950 scale-95'
                : 'bg-[#090d16]/80 border-white/20 text-white active:scale-95'
            }`}
          >
            <ChevronRight className="w-9 h-9 stroke-[2.6]" />
          </button>
        </div>

        {/* Bottom-Center: Compact Speedometer & Nitro Gauge */}
        <div className="pointer-events-none flex flex-col items-center rounded-2xl bg-[#090d16]/84 border border-white/15 px-3 py-2 min-w-[112px] sm:min-w-[144px]">
          <div className="relative flex flex-col items-center">
            <svg width="76" height="42" viewBox="0 0 76 42" className="overflow-visible">
              <path
                d="M 8 38 A 30 30 0 0 1 68 38"
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <path
                d="M 8 38 A 30 30 0 0 1 68 38"
                fill="none"
                stroke={telemetry.nitroActive ? '#06b6d4' : '#f59e0b'}
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeDasharray={arcCircumference}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <div className="-mt-6 flex flex-col items-center">
              <span className="font-display text-xl sm:text-2xl font-extrabold tabular-nums leading-none text-white">
                {telemetry.speedKmh}
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-slate-400">
                KM/H
              </span>
            </div>
          </div>

          {/* Nitro Charge Bar */}
          <div className="mt-1.5 w-full flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-[10px] font-semibold tabular-nums">
              <span className={telemetry.nitroActive ? 'text-cyan-300' : 'text-slate-300'}>
                NITRO
              </span>
              <span className="text-slate-300">{telemetry.nitro}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
              <div
                className={`h-full transition-[width] duration-75 ${
                  telemetry.nitroActive ? 'bg-cyan-400' : nitroReady ? 'bg-amber-400' : 'bg-slate-500'
                }`}
                style={{ width: `${telemetry.nitro}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom-Right: Nitro, Brake & Accelerator Pedals */}
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <button
            type="button"
            aria-label="Nitro Boost"
            {...bindControl('nitro')}
            className={`h-11 px-4 rounded-xl border font-display font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-1.5 transition-transform touch-none select-none cursor-pointer ${
              pressed.nitro || telemetry.nitroActive
                ? 'bg-cyan-500 border-cyan-200 text-slate-950 scale-95 shadow-lg shadow-cyan-500/40'
                : nitroReady
                ? 'bg-[#090d16]/85 border-cyan-400/60 text-cyan-300'
                : 'bg-[#090d16]/70 border-white/10 text-slate-500'
            }`}
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>NITRO</span>
          </button>

          <div className="flex items-end gap-2 sm:gap-2.5">
            <button
              type="button"
              aria-label="Brake"
              {...bindControl('brake')}
              className={`w-14 h-16 sm:w-16 sm:h-[74px] rounded-2xl border font-display font-bold text-xs tracking-wide flex flex-col items-center justify-center transition-transform touch-none select-none cursor-pointer ${
                pressed.brake
                  ? 'bg-red-600 border-red-300 text-white scale-95'
                  : 'bg-[#090d16]/82 border-red-500/45 text-red-300'
              }`}
            >
              <span>BRAKE</span>
            </button>

            <button
              type="button"
              aria-label="Accelerate"
              {...bindControl('accelerate')}
              className={`w-16 h-20 sm:w-[74px] sm:h-[88px] rounded-2xl border font-display font-bold text-xs sm:text-sm tracking-wide flex flex-col items-center justify-center transition-transform touch-none select-none cursor-pointer ${
                pressed.accelerate
                  ? 'bg-emerald-500 border-emerald-200 text-slate-950 scale-95'
                  : 'bg-[#090d16]/85 border-emerald-400/55 text-emerald-300'
              }`}
            >
              <span>GAS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
