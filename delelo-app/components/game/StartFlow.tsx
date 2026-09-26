"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/game/state/store";
import { dispatch } from "@/game/engine/engine";

/* ============================================================
 * Стартовый flow:
 * 1) Приветственный экран с кнопкой «Начать»
 * 2) Экран «Как назовём бизнес?» с полем ввода и «Продолжить»
 * Название сохраняется через Game Engine (SET_BUSINESS_NAME).
 * После этого UI показывает Overview (родитель проверяет started + name).
 * ============================================================ */

export default function StartFlow({ onFinished }: { onFinished?: () => void }) {
  const router = useRouter();
  const started = useGameStore((s) => s.started);
  const businessName = useGameStore((s) => s.business.name);
  const [name, setName] = useState("");

  /* Шаг 1 — приветствие */
  if (!started) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Интерактивный симулятор
          </div>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-slate-900">
            ДЕЛО
          </h1>
          <p className="mt-5 text-slate-600">
            Создайте бизнес с нуля: помещение, документы, поставщики, сотрудники
            и деньги. Первый бизнес в MVP — небольшая кофейня.
          </p>
          <button
            type="button"
            onClick={() => dispatch({ kind: "START_GAME" })}
            className="mt-8 w-full rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Начать
          </button>
        </div>
      </div>
    );
  }

  /* Шаг 2 — название бизнеса */
  if (!businessName) {
    const submit = () => {
      const trimmed = name.trim();
      if (!trimmed) return;
      dispatch({ kind: "SET_BUSINESS_NAME", payload: { name: trimmed } });
      /* Название сохранено через Engine — переходим в Overview */
      if (onFinished) {
        onFinished();
      } else {
        router.push("/overview");
      }
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Как назовём бизнес?</h2>
          <p className="mt-2 text-sm text-slate-500">
            Название будет отображаться в игре. Позже его можно будет сменить.
          </p>
          <input
            autoFocus
            type="text"
            value={name}
            maxLength={40}
            placeholder="Например: «Кофе точка»"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="mt-6 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="button"
            disabled={!name.trim()}
            onClick={submit}
            className="mt-4 w-full rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Продолжить
          </button>
        </div>
      </div>
    );
  }

  return null;
}
