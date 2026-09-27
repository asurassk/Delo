"use client";

import type { LocationInfo } from "@/types/game";
import { formatMoney } from "@/game/data/format";
import { LocationStats } from "@/components/ui/RatingBar";

interface BuildingProps {
  loc: LocationInfo;
  x: number;
  y: number;
  selected: boolean;
  disabled?: boolean;
  onOpen: (id: string) => void;
}

function buildingIcon(id: string): string {
  switch (id) {
    case "gallery_mall":
      return "🏬";
    case "park_bc":
      return "🌳";
    case "university":
      return "🎓";
    case "central":
      return "🏙️";
    case "residential":
      return "🏠";
    default:
      return "📍";
  }
}

function Building({
  loc,
  x,
  y,
  selected,
  disabled,
  onOpen,
}: BuildingProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onOpen(loc.id)}
      className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label={loc.name}
    >
      {selected && (
        <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-indigo-400/30" />
      )}

      <span
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl shadow-md transition-all duration-200 ${
          selected
            ? "border-indigo-500 bg-indigo-600 shadow-indigo-200"
            : disabled
              ? "cursor-default border-slate-200 bg-white opacity-70"
              : "cursor-pointer border-slate-200 bg-white group-hover:scale-105 group-hover:border-indigo-400 group-hover:shadow-lg"
        }`}
      >
        {buildingIcon(loc.id)}
      </span>

      <span
        className={`mt-1 block whitespace-nowrap rounded-md px-1.5 py-0.5 text-center text-[11px] font-semibold shadow-sm ${
          selected
            ? "bg-indigo-600 text-white"
            : "bg-white/95 text-slate-700"
        }`}
      >
        {loc.name}
      </span>

      <span className="mt-0.5 block whitespace-nowrap text-center text-[10px] font-medium text-slate-500">
        {formatMoney(loc.rent)}/мес
      </span>
    </button>
  );
}

export default function MapView({
  locations,
  selectedId,
  disabled,
  onOpenLocation,
}: {
  locations: LocationInfo[];
  selectedId: string | null;
  disabled?: boolean;
  onOpenLocation: (id: string) => void;
}) {
  const POSITIONS: Record<string, { x: number; y: number }> = {
    gallery_mall: { x: 20, y: 24 },
    park_bc: { x: 76, y: 20 },
    university: { x: 16, y: 72 },
    central: { x: 50, y: 48 },
    residential: { x: 82, y: 74 },
  };

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <svg
        viewBox="0 0 1000 625"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <rect width="1000" height="625" fill="#eef2f7" />

        <g fill="#e2e8f0">
          <rect x="40" y="40" width="230" height="150" rx="14" />
          <rect x="330" y="40" width="200" height="120" rx="14" />
          <rect x="620" y="40" width="340" height="140" rx="14" />
          <rect x="40" y="330" width="220" height="250" rx="14" />
          <rect x="330" y="360" width="240" height="220" rx="14" />
          <rect x="640" y="360" width="320" height="220" rx="14" />
        </g>

        <g fill="#d7ecd9">
          <circle cx="300" cy="250" r="46" />
          <circle cx="700" cy="300" r="38" />
          <ellipse cx="560" cy="120" rx="52" ry="34" />
        </g>

        <path
          d="M -20 560 C 200 500, 350 620, 560 540 S 900 470, 1030 520 L 1030 640 L -20 640 Z"
          fill="#dbeafe"
        />
        <path
          d="M -20 560 C 200 500, 350 620, 560 540 S 900 470, 1030 520"
          fill="none"
          stroke="#bfdbfe"
          strokeWidth="10"
        />

        <g stroke="#ffffff" strokeWidth="18" strokeLinecap="round">
          <line x1="0" y1="230" x2="1000" y2="210" />
          <line x1="0" y1="335" x2="1000" y2="345" />
          <line x1="300" y1="0" x2="310" y2="625" />
          <line x1="600" y1="0" x2="615" y2="625" />
        </g>

        <g
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeDasharray="14 12"
        >
          <line x1="0" y1="230" x2="1000" y2="210" />
          <line x1="0" y1="335" x2="1000" y2="345" />
          <line x1="300" y1="0" x2="310" y2="625" />
          <line x1="600" y1="0" x2="615" y2="625" />
        </g>
      </svg>

      {locations.map((loc) => (
        <Building
          key={loc.id}
          loc={loc}
          x={POSITIONS[loc.id]?.x ?? 50}
          y={POSITIONS[loc.id]?.y ?? 50}
          selected={selectedId === loc.id}
          disabled={disabled}
          onOpen={onOpenLocation}
        />
      ))}

      <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-2 text-xs text-slate-500 shadow-sm">
        Условный город · нажмите на здание, чтобы изучить помещение
      </div>
    </div>
  );
}

export function LocationList({
  locations,
  selectedId,
  disabled,
  onOpenLocation,
}: {
  locations: LocationInfo[];
  selectedId: string | null;
  disabled?: boolean;
  onOpenLocation: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {locations.map((loc) => {
        const isSelected = selectedId === loc.id;

        return (
          <button
            key={loc.id}
            type="button"
            disabled={disabled}
            onClick={() => onOpenLocation(loc.id)}
            className={`rounded-xl border bg-white p-4 text-left shadow-sm transition-all duration-200 ${
              isSelected
                ? "border-indigo-500 ring-2 ring-indigo-100"
                : "border-slate-200 hover:-translate-y-0.5 hover:border-indigo-300"
            } disabled:cursor-default disabled:opacity-70`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">
                {loc.name}
              </span>

              {isSelected && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                  Выбрано
                </span>
              )}
            </div>

            <div className="mt-3">
              <LocationStats loc={loc} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
