"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import MapView, { LocationList } from "@/components/game/MapView";
import LocationCardModal from "@/components/game/LocationCardModal";
import { LOCATIONS, getLocationById } from "@/game/data/locations";
import { useGameStore } from "@/game/state/store";
import { dispatch } from "@/game/engine/engine";
import { formatMoney } from "@/game/data/format";
import type { LocationInfo } from "@/types/game";

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
    dispatch({ kind: "SELECT_LOCATION", payload: { locationId } });
    setOpenLoc(null);
    setStep("selected");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {step === "intro" && (
        <div className="animate-[fadeIn_250ms_ease-out]">
          <Card>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
              Новая ситуация
            </div>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Первая точка
            </h1>

            <p className="mt-4 leading-relaxed text-slate-600">
              Название есть. Теперь нужно найти место, где бизнес сможет
              работать.
            </p>

            <p className="mt-3 leading-relaxed text-slate-600">
              Помещение — одно из первых решений, которое определит твою
              экономику. Высокий трафик может привести больше клиентов, но
              аренда будет дороже. Дешевая аренда снизит расходы, но клиентов
              может быть меньше.
            </p>

            <button
              type="button"
              onClick={() => setStep("map")}
              className="mt-8 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Посмотреть варианты
            </button>
          </Card>
        </div>
      )}

      {step === "map" && (
        <div className="animate-[fadeIn_250ms_ease-out] space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Карта города
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Выбери помещение. У каждого варианта свои компромиссы: трафик,
                конкуренция, логистика и размер аренды.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
              <span className="text-slate-500">Баланс: </span>
              <span className="font-bold text-slate-900">
                {formatMoney(money)}
              </span>
            </div>
          </div>

          <MapView
            locations={LOCATIONS}
            selectedId={selectedId}
            onOpenLocation={(id) =>
              setOpenLoc(getLocationById(id) ?? null)
            }
          />

          <LocationList
            locations={LOCATIONS}
            selectedId={selectedId}
            onOpenLocation={(id) =>
              setOpenLoc(getLocationById(id) ?? null)
            }
          />
        </div>
      )}

      {step === "selected" && (
        <div className="animate-[fadeIn_250ms_ease-out]">
          <Card>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Решение принято
            </div>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Помещение выбрано
            </h1>

            <p className="mt-4 leading-relaxed text-slate-600">
              Теперь у тебя есть первая настоящая статья расходов — аренда.
              Но прежде чем открывать двери, нужно разобраться с документами и
              формой бизнеса.
            </p>

            <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-sm text-slate-500">Выбрано</dt>
                <dd className="mt-1 text-lg font-bold text-slate-900">
                  {locationName}
                </dd>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-sm text-slate-500">Аренда</dt>
                <dd className="mt-1 text-lg font-bold text-amber-600">
                  {formatMoney(monthlyRent)} / месяц
                </dd>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-sm text-slate-500">
                  Депозит оплачен
                </dt>
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
        </div>
      )}

      {openLoc && (
        <LocationCardModal
          location={openLoc}
          balance={money}
          disabled={!!selectedId}
          onClose={() => setOpenLoc(null)}
          onSelect={choose}
        />
      )}
    </div>
  );
}