"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dispatch } from "@/game/engine/engine";

/* ============================================================
 * Тёмная боковая навигация.
 * Разделы: Overview, My Business, Map, Supplies, Finance,
 * Documents, Phone, People.
 * ============================================================ */

const NAV_ITEMS: { href: string; label: string; icon: string }[] = [
  { href: "/overview", label: "Overview", icon: "◧" },
  { href: "/overview/business", label: "My Business", icon: "☕" },
  { href: "/overview/map", label: "Map", icon: "🗺" },
  { href: "/overview/supplies", label: "Supplies", icon: "📦" },
  { href: "/overview/finance", label: "Finance", icon: "₽" },
  { href: "/overview/documents", label: "Documents", icon: "📄" },
  { href: "/overview/phone", label: "Phone", icon: "📱" },
  { href: "/overview/people", label: "People", icon: "👥" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-slate-900 text-slate-300">
      <div className="px-6 py-6">
        <div className="text-xl font-bold tracking-wide text-white">ДЕЛО</div>
        <div className="mt-1 text-xs text-slate-400">Симулятор предпринимателя</div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/overview"
              ? pathname === "/overview"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-indigo-600/90 text-white font-medium"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <button
          type="button"
          onClick={() => {
            if (confirm("Начать новую игру? Текущее сохранение будет удалено.")) {
              dispatch({ kind: "RESET_GAME" });
              window.location.href = "/";
            }
          }}
          className="w-full rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 transition-colors hover:border-slate-500 hover:text-white"
        >
          Новая игра
        </button>
      </div>
    </aside>
  );
}
