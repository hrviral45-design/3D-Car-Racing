import React, { useState } from 'react';
import { ArrowLeft, Check, Coins, Gauge, Flame, Compass, Sparkles } from 'lucide-react';
import {
  CAR_CATALOG,
  CarModelId,
  UpgradeLevels,
} from '../game/types';

interface CarShopProps {
  coinBank: number;
  ownedCars: CarModelId[];
  selectedCarId: CarModelId;
  previewCarId: CarModelId;
  upgrades: UpgradeLevels;
  onPreviewCar: (carId: CarModelId) => void;
  onBuyCar: (carId: CarModelId, price: number) => void;
  onEquipCar: (carId: CarModelId) => void;
  onBuyUpgrade: (key: keyof UpgradeLevels, cost: number) => void;
  onBack: () => void;
}

const UPGRADE_COSTS = [250, 500, 850];

export const CarShop: React.FC<CarShopProps> = ({
  coinBank,
  ownedCars,
  selectedCarId,
  previewCarId,
  upgrades,
  onPreviewCar,
  onBuyCar,
  onEquipCar,
  onBuyUpgrade,
  onBack,
}) => {
  const [tab, setTab] = useState<'cars' | 'upgrades'>('cars');
  const [notice, setNotice] = useState<string | null>(null);

  const previewCar =
    CAR_CATALOG.find((c) => c.id === previewCarId) ?? CAR_CATALOG[0];
  const isOwned = ownedCars.includes(previewCar.id);
  const isEquipped = selectedCarId === previewCar.id;
  const canAffordCar = coinBank >= previewCar.price;

  const handleBuyClick = () => {
    if (isOwned) {
      onEquipCar(previewCar.id);
      setNotice(`${previewCar.name} equipped for racing`);
      return;
    }
    if (!canAffordCar) {
      const needed = previewCar.price - coinBank;
      setNotice(`Need ${needed.toLocaleString()} more coins — collect coins on the highway!`);
      return;
    }
    onBuyCar(previewCar.id, previewCar.price);
    setNotice(`Purchased & equipped ${previewCar.name}!`);
  };

  const upgradeItems: {
    key: keyof UpgradeLevels;
    title: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'engine',
      title: 'Twin-Turbo Engine',
      desc: 'Boosts top speed & acceleration across every level.',
      icon: <Gauge className="w-4 h-4 text-red-400" />,
    },
    {
      key: 'handling',
      title: 'Sport Suspension',
      desc: 'Sharper lane-change agility and stability at high speed.',
      icon: <Compass className="w-4 h-4 text-cyan-400" />,
    },
    {
      key: 'nitro',
      title: 'Nitrous Core',
      desc: 'Longer Nitro burn duration & faster automatic recharge.',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
    },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4 sm:p-6">
      {/* Header */}
      <header className="pointer-events-auto flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#090d16]/90 border border-white/15 hover:border-white/35 text-white font-display font-bold text-sm flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="min-h-[44px] px-3.5 rounded-xl bg-[#090d16]/90 border border-amber-400/35 flex items-center gap-2 font-display font-bold text-sm text-amber-400 tabular-nums">
            <Coins className="w-4 h-4 shrink-0" />
            <span>{coinBank.toLocaleString()}</span>
          </div>
          <h2 className="hidden sm:block font-display text-2xl font-extrabold text-white tracking-tight">
            CAR SHOP
          </h2>
        </div>
      </header>

      {/* Shop Dock */}
      <section className="pointer-events-auto mx-auto w-full max-w-4xl rounded-2xl bg-[#090d16]/92 border border-white/15 p-4 sm:p-5 shadow-2xl">
        {/* Tabs + Feedback Notice */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setTab('cars');
                setNotice(null);
              }}
              className={`min-h-[38px] px-4 py-1.5 rounded-lg font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                tab === 'cars'
                  ? 'bg-red-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              3D Supercars
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('upgrades');
                setNotice(null);
              }}
              className={`min-h-[38px] px-4 py-1.5 rounded-lg font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                tab === 'upgrades'
                  ? 'bg-red-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Performance Upgrades
            </button>
          </div>

          {notice && (
            <div className="text-xs font-medium text-amber-300">{notice}</div>
          )}
        </div>

        {tab === 'cars' ? (
          <div className="mt-3.5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[168px] sm:max-h-[200px] overflow-y-auto pr-1">
              {CAR_CATALOG.map((car) => {
                const owned = ownedCars.includes(car.id);
                const selected = previewCarId === car.id;
                return (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => {
                      onPreviewCar(car.id);
                      setNotice(null);
                    }}
                    className={`min-h-[68px] p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                      selected
                        ? 'bg-slate-800 border-amber-400 text-white'
                        : 'bg-slate-900/85 border-white/12 hover:border-white/35 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0 border border-white/25"
                        style={{ backgroundColor: car.defaultFinish.cssSwatch }}
                      />
                      <span className="font-display font-bold text-xs leading-tight truncate">
                        {car.name}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-semibold tabular-nums">
                      {owned ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Owned
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Coins className="w-3 h-3" />
                          {car.price}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-between gap-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-3 lg:pt-0 lg:pl-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-base text-white">
                    {previewCar.name}
                  </span>
                  <span className="text-xs text-cyan-300 font-medium">
                    {previewCar.classLabel}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">{previewCar.tagline}</p>
              </div>

              <button
                type="button"
                onClick={handleBuyClick}
                disabled={isEquipped}
                className={`min-h-[48px] px-5 py-2.5 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                  isEquipped
                    ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 cursor-default'
                    : isOwned
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 active:scale-[0.98] cursor-pointer'
                    : canAffordCar
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-[0.98] cursor-pointer'
                    : 'bg-slate-800 border border-white/15 text-slate-300 hover:bg-slate-700 cursor-pointer'
                }`}
              >
                {isEquipped ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>EQUIPPED</span>
                  </>
                ) : isOwned ? (
                  <span>EQUIP CAR</span>
                ) : (
                  <>
                    <Coins className="w-4 h-4" />
                    <span>BUY · {previewCar.price.toLocaleString()} COINS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3.5 grid grid-cols-1 md:grid-cols-3 gap-3">
            {upgradeItems.map((item) => {
              const level = upgrades[item.key];
              const maxed = level >= 3;
              const cost = maxed ? 0 : UPGRADE_COSTS[level];
              const canAfford = coinBank >= cost;

              return (
                <div
                  key={item.key}
                  className="rounded-xl bg-slate-900/90 border border-white/12 p-3.5 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 font-display font-bold text-sm text-white">
                        {item.icon}
                        {item.title}
                      </span>
                      <span className="text-xs font-semibold text-slate-300 tabular-nums">
                        Lv {level}/3
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{item.desc}</p>

                    <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                      {[0, 1, 2].map((step) => (
                        <div
                          key={step}
                          className={`h-1.5 rounded-full ${
                            step < level ? 'bg-amber-400' : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={maxed}
                    onClick={() => {
                      if (maxed) return;
                      if (!canAfford) {
                        setNotice(`Need ${cost - coinBank} more coins for ${item.title}`);
                        return;
                      }
                      onBuyUpgrade(item.key, cost);
                      setNotice(`${item.title} upgraded to Level ${level + 1}!`);
                    }}
                    className={`min-h-[44px] px-4 py-2 rounded-xl font-display font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      maxed
                        ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 cursor-default'
                        : canAfford
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-[0.98] cursor-pointer'
                        : 'bg-slate-800 border border-white/12 text-slate-400 cursor-pointer'
                    }`}
                  >
                    {maxed ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>MAX LEVEL</span>
                      </>
                    ) : (
                      <>
                        <Coins className="w-3.5 h-3.5" />
                        <span>UPGRADE · {cost}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
