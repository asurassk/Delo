"use client";

import { motion } from "framer-motion";
import type { LocationInfo } from "@/types/game";
import { formatMoney } from "@/game/data/format";
import RatingBar from "@/components/ui/RatingBar";

/* ============================================================
 * LocationCardModal — подробная карточка помещения.
 * Показывает характеристики, депозит и ЧЕСТНУЮ арифметику:
 *   «Всего сейчас» → «После депозита».
 * Месячная аренда — обязательство, повторно не списывается.
 * Кнопка «Выбрать помещение» отправляет SELECT_LOCATION в Engine.
 * ============================================================ */

export default function LocationCardModal({
  location,
  balance,
  disabled,
  onClose,
  onSelect,
}: {
  location: LocationInfo;
  balance: number;
  /** Помещение уже выбрано ранее — повторный выбор недоступен. */
  disabled?: boolean;
  onClose: () => void;
  onSelect: (locationId: string) => void;
}) {
  const afterDeposit = balance - location.deposit;
  const notEnough = afterDeposit < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* подложка */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* карточка */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{location.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{location.audience}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Аренда</span>
            <span className="text-sm font-semibold text-slate-800">
              {formatMoney(location.rent)} / мес
            </span>
          </div>
          <RatingBar label="Трафик" value={location.traffic} />
          <RatingBar label="Конкуренция" value={location.competition} tone="amber" />
          <RatingBar label="Логистика" value={location.logistics} />
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Площадь</span>
            <span className="text-sm font-semibold text-slate-800">
              {location.areaSqm} м²
            </span>
          </div>
        </div>

        {/* Финансовая сводка */}
        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Депозит (одна месячная аренда)</span>
            <span className="font-semibold text-slate-800">
              {formatMoney(location.deposit)}
            </span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-slate-500">Всего сейчас</span>
            <span className="font-semibold text-slate-800">{formatMoney(balance)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-slate-200 pt-2">
            <span className="text-slate-500">После депозита</span>
            <span
              className={`font-bold ${
                notEnough ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {formatMoney(afterDeposit)}
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Аренда {formatMoney(location.rent)} / мес — регулярное обязательство,
            при выборе списывается только депозит.
          </p>
        </div>

        <button
          type="button"
          disabled={disabled || notEnough}
          onClick={() => onSelect(location.id)}
          className="mt-5 w-full rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {disabled
            ? "Помещение уже выбрано"
            : notEnough
              ? "Недостаточно средств"
              : "Выбрать помещение"}
        </button>
      </motion.div>
    </div>
  );
}
