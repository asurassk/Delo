"use client";

import type { LocationInfo } from "@/types/game";
import { formatMoney } from "@/game/data/format";

const COLORS: Record<string, string> = {
  indigo: "bg-indigo-500",
  amber: "bg-amber-500",
};

export default function RatingBar({
  label,
  value,
  tone = "indigo",
}: {
  label: string;
  value: number;
  tone?: keyof typeof COLORS | string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-slate-500">{label}</span>

      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={`h-2 w-5 rounded-full transition-all duration-200 ${
                i <= value
                  ? COLORS[tone] ?? COLORS.indigo
                  : "bg-slate-200"
              }`}
              style={{
                animationDelay: `${0.05 * i}s`,
              }}
            />
          ))}
        </div>

        <span className="w-8 text-right text-sm font-semibold text-slate-700">
          {value}/5
        </span>
      </div>
    </div>
  );
}

export function LocationStats({ loc }: { loc: LocationInfo }) {
  return (
    <div className="space-y-2.5">
      <RatingBar label="Трафик" value={loc.traffic} />
      <RatingBar
        label="Конкуренция"
        value={loc.competition}
        tone="amber"
      />
      <RatingBar label="Логистика" value={loc.logistics} />

      <div className="flex items-center justify-between pt-1">
        <span className="text-sm text-slate-500">Аренда</span>
        <span className="text-sm font-semibold text-slate-800">
          {formatMoney(loc.rent)} / мес
        </span>
      </div>
    </div>
  );
}
