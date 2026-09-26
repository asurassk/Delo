"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Card from "@/components/ui/Card";
import MapView, { LocationList } from "@/components/game/MapView";
import LocationCardModal from "@/components/game/LocationCardModal";
import { LOCATIONS, getLocationById } from "@/game/data/locations";
import { useGameStore } from "@/game/state/store";
import { dispatch } from "@/game/engine/engine";
import { formatMoney } from "@/game/data/format";
import type { LocationInfo } from "@/types/game";

/* ============================================================
 * LocationScene — TASK 02: первая играемая сцена «Первая точка».
 *
 * Flow:
 *   intro («Первая точка») → карта → карточка локации →
 *   SELECT_LOCATION (через Engine) → пост-сцена с итогами →
 *   «Продолжить» → Overview.
 *
 * UI не меняет GameState напрямую: только dispatch(action).
 * Шаг хранится локально (это UI-навигация, не игровое состояние);
 * игровые флаги ставит Engine.
 * ============================================================ */

type Step = "intro" | "map" | "selected";

export default function LocationScene() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [openLoc, setOpenLoc] = useState<LocationInfo | null>(null);

  const money = useGameStore((s) => s.finance.money);
  const selectedId = useGameStore((s) => s.location.selectedPremisesId);
  const monthlyRent = useGameStore((s) => s.business.monthlyRent);
  const depositPaid = useGameStore((s) => s.business.securityDepositPaid);
  const locationName = useGameStore((s) => s.location.name);

  const choose = (locationId: string) => {
    /* Единственная мутация состояния — через Game Engine. */
    dispatch({ kind: "SELECT_LOCATION", payload: { locationId } });
    setOpenLoc(null);
    setStep("selected");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <AnimatePresence mode="wait">
        {/* ---------- Шаг 1: вводная ситуация ---------- */}
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
                Новая ситуация
              </div>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Первая точка</h1>
              <p className="mt-4 leading-relaxed text-slate-600">
                Название есть. Теперь нужно найти место, где бизнес сможет работать.
              </p>
              <p className="mt-3 leading-relaxed text-slate-600">
                Помещение — одно из первых решений, которое определит твою экономику.
                Высокий трафик может привести больше клиентов, но аренда будет дороже.
                Дешёвая аренда снизит расходы, но клиентов может быть меньше.
              </p>
              <button
                type="button"
                onClick={() => setStep("map")}
                className="mt-8 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Посмотреть варианты
              </button>
            </Card>
          </motion.div>
        )}

        {/* ---------- Шаг 2: карта города ---------- */}
        {step === "map" && (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Карта города</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Выбери помещение. У каждого варианта свои компромиссы: трафик,
                  конкуренция, логистика и размер аренды.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
                <span className="text-slate-500">Баланс: </span>
                <span className="font-bold text-slate-900">{formatMoney(money)}</span>
              </div>
            </div>

            <MapView
              locations={LOCATIONS}
              selectedId={selectedId}
              onOpenLocation={(id) => setOpenLoc(getLocationById(id) ?? null)}
            />

            <LocationList
              locations={LOCATIONS}
              selectedId={selectedId}
              onOpenLocation={(id) => setOpenLoc(getLocationById(id) ?? null)}
            />
          </motion.div>
        )}

        {/* ---------- Шаг 3: помещение выбрано ---------- */}
        {step === "selected" && (
          <motion.div
            key="selected"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
                Решение принято
              </div>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Помещение выбрано</h1>
              <p className="mt-4 leading-relaxed text-slate-600">
                Теперь у тебя есть первая настоящая статья расходов — аренда.
                Но прежде чем открывать двери, нужно разобраться с документами
                и формой бизнеса.
              </p>

              <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <dt className="text-sm text-slate-500">Выбрано</dt>
                  <dd className="mt-1 text-lg font-bold text-slate-900">{locationName}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <dt className="text-sm text-slate-500">Аренда</dt>
                  <dd className="mt-1 text-lg font-bold text-amber-600">
                    {formatMoney(monthlyRent)} / месяц
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <dt className="text-sm text-slate-500">Депозит оплачен</dt>
                  <dd className="mt-1 text-lg font-bold text-slate-900">
                    {formatMoney(depositPaid)}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <dt className="text-sm text-slate-500">Баланс</dt>
                  <dd className="mt-1 text-lg font-bold text-emerald-600">
                    {formatMoney(money)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => router.push("/overview")}
                className="mt-8 w-full rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-indigo-700 sm:w-auto sm:px-10"
              >
                Продолжить
              </button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальная карточка локации */}
      <AnimatePresence>
        {openLoc && (
          <LocationCardModal
            location={openLoc}
            balance={money}
            disabled={!!selectedId}
            onClose={() => setOpenLoc(null)}
            onSelect={choose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
