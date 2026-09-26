"use client";

import { useEffect } from "react";
import { useGameStore } from "@/game/state/store";

/* Гидратация сохранения из localStorage при первом рендере на клиенте */
export default function HydrationGate({ children }: { children: React.ReactNode }) {
  const hydrated = useGameStore((s) => s.hydrated);
  const hydrateFromStorage = useGameStore((s) => s.hydrateFromStorage);

  useEffect(() => {
    if (!hydrated) hydrateFromStorage();
  }, [hydrated, hydrateFromStorage]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-400">
        Загрузка…
      </div>
    );
  }

  return <>{children}</>;
}
