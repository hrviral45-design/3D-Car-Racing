import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Lock,
  Play,
  RotateCcw,
  RotateCw,
  ShoppingBag,
} from 'lucide-react';
import {
  CAR_CATALOG,
  CAR_FINISHES,
  CarFinish,
  CarModelId,
  resolveCarFinish,
  UpgradeLevels,
} from '../game/types';

interface CarGarageProps {
  ownedCars: CarModelId[];
  selectedCarId: CarModelId;
  previewCarId: CarModelId;
  selectedFinishId: string;
  upgrades: UpgradeLevels;
  onPreviewCar: (carId: CarModelId) => void;
  onSelectCar: (carId: CarModelId) => void;
  onSelectFinishId: (finishId: string) => void;
  onToggleAutoRotate: (enabled: boolean) => void;
  onResetCamera: () => void;
  onGoToShop: () => void;
  onStartRace: () => void;
  onBack: () => void;
}

export const CarGarage: React.FC<CarGarageProps> = ({
  ownedCars,
  selectedCarId,
  previewCarId,
  selectedFinishId,
  upgrades,
  onPreviewCar,
  onSelectCar,
  onSelectFinishId,
  onToggleAutoRotate,
  onResetCamera,
  onGoToShop,
  onStartRace,
  onBack,
}) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const previewIndex = Math.max(
    0,
    CAR_CATALOG.findIndex((c) => c.id === previewCarId)
  );
  const previewCar = CAR_CATALOG[previewIndex] ?? CAR_CATALOG[0];
  const equippedCar =
    CAR_CATALOG.find((c) => c.id === selectedCarId) ?? CAR_CATALOG[0];

  const isOwned = ownedCars.includes(previewCar.id);
  const isSelected = previewCar.id === selectedCarId;
  const activeFinish: CarFinish = resolveCarFinish(previewCar, selectedFinishId);

  const handlePrev = () => {
    const nextIdx = (previewIndex - 1 + CAR_CATALOG.length) % CAR_CATALOG.length;
    onPreviewCar(CAR_CATALOG[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (previewIndex + 1) % CAR_CATALOG.length;
    onPreviewCar(CAR_CATALOG[nextIdx].id);
  };

  // Keyboard Left/Right browsing in Garage
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const nextIdx = (previewIndex - 1 + CAR_CATALOG.length) % CAR_CATALOG.length;
        onPreviewCar(CAR_CATALOG[nextIdx].id);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = (previewIndex + 1) % CAR_CATALOG.length;
        onPreviewCar(CAR_CATALOG[nextIdx].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [previewIndex, onPreviewCar]);

  // Keep active car chip scrolled smoothly into view
  useEffect(() => {
    const container = stripRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>(
      `[data-car-id="${previewCar.id}"]`
    );
    activeBtn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [previewCar.id]);

  const effectiveTopSpeedKmh = previewCar.topSpeedKmh + upgrades.engine * 9;
  const effectiveAccelSec = Math.max(
    1.8,
    Number((previewCar.zeroToHundredSec - upgrades.engine * 0.12).toFixed(1))
  );

  const statRows = [
    {
      label: 'Top Speed',
      readout: `${effectiveTopSpeedKmh} km/h`,
      value: Math.min(100, previewCar.stats.speed + upgrades.engine * 4),
      barClass: 'bg-red-500',
    },
    {
      label: 'Acceleration',
      readout: `${effectiveAccelSec}s`,
      value: Math.min(100, previewCar.stats.accel + upgrades.engine * 4),
      barClass: 'bg-amber-400',
    },
    {
      label: 'Handling',
      readout: `${Math.min(100, previewCar.stats.handling + upgrades.handling * 4)}`,
      value: Math.min(100, previewCar.stats.handling + upgrades.handling * 4),
      barClass: 'bg-cyan-400',
    },
    {
      label: 'Nitro',
      readout: `${Math.min(100, previewCar.stats.nitro + upgrades.nitro * 4)}`,
      value: Math.min(100, previewCar.stats.nitro + upgrades.nitro * 4),
      barClass: 'bg-emerald-400',
    },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-3 sm:p-5">
      {/* Top Bar */}
      <header className="pointer-events-auto flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl bg-[#090d16]/92 border border-white/15 hover:border-white/35 text-white font-display font-bold text-xs sm:text-sm flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>BACK</span>
        </button>

        <div className="text-center hidden sm:block">
          <div className="text-xs font-medium text-slate-300">
            Drag anywhere on vehicle to rotate 360°
          </div>
          <div className="text-[11px] text-slate-400">
            Active Race Car:{' '}
            <span className="text-white font-semibold">{equippedCar.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const next = !autoRotate;
              setAutoRotate(next);
              onToggleAutoRotate(next);
            }}
            aria-label={autoRotate ? 'Pause 360 auto-rotation' : 'Resume 360 auto-rotation'}
            className={`min-h-[44px] px-3 rounded-xl border text-xs font-display font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
              autoRotate
                ? 'bg-[#090d16]/92 border-cyan-400/50 text-cyan-300'
                : 'bg-[#090d16]/92 border-white/15 text-slate-300'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">360°</span>
          </button>

          <button
            type="button"
            onClick={onResetCamera}
            aria-label="Reset camera angle"
            title="Reset angle"
            className="min-h-[44px] min-w-[44px] rounded-xl bg-[#090d16]/92 border border-white/15 hover:border-white/35 text-slate-200 flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Subtle 360 Drag Cue + Side Navigation Arrows on Tablet/Desktop */}
      <div className="relative flex-1 flex items-center justify-between px-1 pointer-events-none">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous car"
          className="pointer-events-auto hidden md:flex w-12 h-12 rounded-full bg-[#090d16]/85 border border-white/15 hover:border-white/40 text-white items-center justify-center active:scale-95 transition-all cursor-pointer shadow-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="sm:hidden self-start mt-1 mx-auto text-[11px] font-medium text-slate-300/90">
          Swipe vehicle to rotate 360° · Active: {equippedCar.name}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next car"
          className="pointer-events-auto hidden md:flex w-12 h-12 rounded-full bg-[#090d16]/85 border border-white/15 hover:border-white/40 text-white items-center justify-center active:scale-95 transition-all cursor-pointer shadow-xl"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Garage Showcase Dock */}
      <section className="pointer-events-auto mx-auto w-full max-w-5xl rounded-2xl bg-[#090d16]/94 border border-white/15 p-3.5 sm:p-4 shadow-2xl">
        {/* Row 1: Previous / Car Title & Selected Indicator / Next */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
          <button
            type="button"
            onClick={handlePrev}
            className="min-h-[44px] px-3 sm:px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 hover:border-white/35 text-white font-display font-bold text-xs sm:text-sm flex items-center gap-1.5 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span>PREVIOUS</span>
          </button>

          <div className="min-w-0 flex-1 text-center px-1">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <h2 className="font-display text-lg sm:text-2xl font-extrabold text-white tracking-tight truncate">
                {previewCar.name}
              </h2>
              {isSelected ? (
                <span className="inline-flex items-center gap-1 text-xs font-display font-bold text-emerald-400">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  SELECTED
                </span>
              ) : !isOwned ? (
                <span className="inline-flex items-center gap-1 text-xs font-display font-bold text-amber-400">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  SHOP LOCKED
                </span>
              ) : null}
            </div>
            <div className="mt-0.5 flex items-center justify-center gap-2 text-[11px] sm:text-xs text-slate-400 tabular-nums">
              <span>{previewCar.classLabel}</span>
              <span aria-hidden="true">·</span>
              <span>
                {String(previewIndex + 1).padStart(2, '0')} /{' '}
                {String(CAR_CATALOG.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="min-h-[44px] px-3 sm:px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 hover:border-white/35 text-white font-display font-bold text-xs sm:text-sm flex items-center gap-1.5 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>NEXT</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Row 2: Expandable Horizontal Car Lineup Strip */}
        <div
          ref={stripRef}
          className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1.5"
          aria-label="Garage car lineup"
        >
          {CAR_CATALOG.map((car, idx) => {
            const carOwned = ownedCars.includes(car.id);
            const carSelected = car.id === selectedCarId;
            const carPreviewing = car.id === previewCar.id;
            return (
              <button
                key={car.id}
                type="button"
                data-car-id={car.id}
                onClick={() => onPreviewCar(car.id)}
                className={`min-h-[40px] px-2.5 py-1.5 rounded-lg border flex items-center gap-2 shrink-0 transition-all active:scale-95 cursor-pointer ${
                  carPreviewing
                    ? 'bg-slate-800 border-white text-white'
                    : carSelected
                    ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-900/80 border-white/10 hover:border-white/30 text-slate-300'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-sm shrink-0 border border-white/25"
                  style={{ backgroundColor: car.defaultFinish.cssSwatch }}
                />
                <span className="font-display font-bold text-[11px] sm:text-xs whitespace-nowrap">
                  {idx + 1}. {car.name}
                </span>
                {carSelected ? (
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : !carOwned ? (
                  <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Row 3: Specs, Paint Swatches & Primary Select/Race Actions */}
        <div className="mt-2.5 grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center pt-2.5 border-t border-white/10">
          {/* Performance Stats */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-x-4 gap-y-2">
            {statRows.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline text-[11px] sm:text-xs tabular-nums">
                  <span className="text-slate-300">{stat.label}</span>
                  <span className="font-display font-bold text-white">{stat.readout}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full ${stat.barClass} transition-all duration-300`}
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Paint Swatches (Signature Factory + Custom Colors) */}
          <div className="lg:col-span-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Paint Finish</span>
              <span className="text-white font-semibold">
                {selectedFinishId === 'signature'
                  ? `Factory · ${previewCar.defaultFinish.name}`
                  : activeFinish.name}
              </span>
            </div>
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="radiogroup"
              aria-label="Car paint finish"
            >
              <button
                type="button"
                role="radio"
                aria-checked={selectedFinishId === 'signature'}
                aria-label={`Factory ${previewCar.defaultFinish.name}`}
                onClick={() => onSelectFinishId('signature')}
                className={`min-h-[38px] px-2.5 rounded-lg border text-[11px] font-display font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                  selectedFinishId === 'signature'
                    ? 'border-white bg-white/15 text-white'
                    : 'border-white/15 bg-white/5 text-slate-300 hover:border-white/40'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-sm border border-white/30"
                  style={{ backgroundColor: previewCar.defaultFinish.cssSwatch }}
                />
                <span>Factory</span>
              </button>

              {CAR_FINISHES.map((finish) => {
                const active = finish.id === selectedFinishId;
                return (
                  <button
                    key={finish.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={finish.name}
                    onClick={() => onSelectFinishId(finish.id)}
                    className={`min-w-[38px] min-h-[38px] rounded-lg flex items-center justify-center border transition-transform active:scale-95 cursor-pointer ${
                      active
                        ? 'border-white bg-white/15 scale-105'
                        : 'border-white/15 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: finish.cssSwatch }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Car / Selected + Start Race + Shop */}
          <div className="lg:col-span-3 flex flex-wrap sm:flex-nowrap lg:flex-col gap-2">
            {isOwned ? (
              <button
                type="button"
                onClick={() => onSelectCar(previewCar.id)}
                disabled={isSelected}
                className={`flex-1 min-h-[46px] px-4 py-2 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-500/20 border border-emerald-400/60 text-emerald-300 cursor-default'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 active:scale-[0.98] cursor-pointer shadow-lg shadow-cyan-500/20'
                }`}
              >
                <Check className="w-4 h-4 shrink-0" />
                <span>{isSelected ? 'SELECTED' : 'SELECT CAR'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onGoToShop}
                className="flex-1 min-h-[46px] px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>UNLOCK · {previewCar.price}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onStartRace}
              className="flex-1 min-h-[46px] px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all whitespace-nowrap cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span>START RACE</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
