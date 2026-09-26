"use client";

import Card from "@/components/ui/Card";
import { useGameStore } from "@/game/state/store";
import { formatMoney, statusLabel } from "@/game/data/format";
import { STARTER_TASKS } from "@/game/data/scenes";

/* ============================================================
 * Overview — главный экран игры.
 * Показывает: название бизнеса, баланс, день, статус,
 * текущие задачи, последние уведомления и краткую сводку.
 * Только читает состояние; изменения — через Game Engine.
 * ============================================================ */

export default function Overview() {
  const business = useGameStore((s) => s.business);
  const finance = useGameStore((s) => s.finance);
  const flags = useGameStore((s) => s.flags);
  const notifications = useGameStore((s) => s.notifications);
  const reputation = useGameStore((s) => s.reputation);
  const risk = useGameStore((s) => s.risk);
  const employees = useGameStore((s) => s.employees);
  const suppliers = useGameStore((s) => s.suppliers);

  const displayName = business.name || "Мой бизнес";

  return (
    <div className="space-y-6">
      {/* Шапка */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Кофейня · {statusLabel(business.status)}
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700">
          {statusLabel(business.status)}
        </span>
      </div>

      {/* Ключевые показатели */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card title="Баланс">
          <div className="text-2xl font-bold text-slate-900">
            {formatMoney(finance.money)}
          </div>
        </Card>
        <Card title="День">
          <div className="text-2xl font-bold text-slate-900">{finance.day}</div>
        </Card>
        <Card title="Статус">
          <div className="text-2xl font-bold text-slate-900">
            {statusLabel(business.status)}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Текущие задачи */}
        <Card title="Текущие задачи" className="lg:col-span-1">
          <ul className="space-y-2">
            {STARTER_TASKS.map((task) => {
              const done = task.doneFlag ? flags[task.doneFlag] : false;
              return (
                <li key={task.id} className="flex items-start gap-2 text-sm">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                      done
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-300 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span className={done ? "text-slate-400 line-through" : "text-slate-700"}>
                    {task.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Уведомления */}
        <Card title="Последние уведомления" className="lg:col-span-1">
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-400">Пока пусто.</p>
          ) : (
            <ul className="space-y-3">
              {notifications.slice(0, 6).map((n) => (
                <li key={n.id} className="text-sm text-slate-700">
                  <span className="mr-2 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                    День {n.day}
                  </span>
                  {n.text}
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* О бизнесе */}
        <Card title="О бизнесе" className="lg:col-span-1">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Тип</dt>
              <dd className="font-medium text-slate-800">Кофейня</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Репутация</dt>
              <dd className="font-medium text-slate-800">{reputation} / 100</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Уровень риска</dt>
              <dd className="font-medium text-slate-800">{risk} / 100</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Сотрудники</dt>
              <dd className="font-medium text-slate-800">{employees.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Поставщики</dt>
              <dd className="font-medium text-slate-800">{suppliers.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Помещение</dt>
              <dd className="font-medium text-slate-800">Не выбрано</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
