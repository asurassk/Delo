"use client";

import Card from "@/components/ui/Card";
import { useGameStore } from "@/game/state/store";
import { formatMoney, statusLabel } from "@/game/data/format";

/* My Business — рабочая страница, читает данные из GameState.
 * UI только читает store; изменения — исключительно через Game Engine. */
export default function BusinessPage() {
  const business = useGameStore((s) => s.business);
  const finance = useGameStore((s) => s.finance);
  const location = useGameStore((s) => s.location);
  const employeesCount = useGameStore(
    (s) => s.employees.filter((e) => e.hired).length
  );
  const documents = useGameStore((s) => s.documents);

  const approvedDocs = documents.filter((d) => d.status === "approved").length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">My Business</h1>

      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Кофейня
            </div>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {business.name || "Мой бизнес"}
            </h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
            {statusLabel(business.status)}
          </span>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-slate-500">Баланс</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {formatMoney(finance.money)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">День</dt>
            <dd className="mt-1 font-semibold text-slate-900">{finance.day}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Сотрудники</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {employeesCount}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Документы</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {approvedDocs} / {documents.length}
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-slate-700">Помещение</h3>
        <p className="mt-2 text-sm text-slate-500">
          {location.selectedPremisesId
            ? `Адрес: ${location.address} · аренда ${formatMoney(location.rent)}/мес`
            : "Помещение ещё не выбрано. Выберите помещение в разделе Map."}
        </p>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-slate-700">Статус открытия</h3>
        <p className="mt-2 text-sm text-slate-500">
          {business.opened
            ? "Бизнес открыт и принимает гостей."
            : "Бизнес ещё не открыт. Дождитесь готовности документов и помещения."}
        </p>
      </Card>
    </div>
  );
}
