"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGameStore } from "@/game/state/store";

/* ============================================================
 * IntroRedirect — TASK 02.
 * После создания названия, пока помещение не выбрано, игра
 * отправляет игрока в первую сюжетную сцену «Первая точка»
 * (раздел Map). Когда помещение выбрано — игрок возвращается
 * на Overview; прямые ссылки на другие разделы работают всегда.
 * ============================================================ */

export default function IntroRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useGameStore((s) => s.hydrated);
  const started = useGameStore((s) => s.started);
  const businessName = useGameStore((s) => s.business.name);
  const premisesSelected = useGameStore((s) => !!s.location.selectedPremisesId);

  useEffect(() => {
    if (!hydrated || !started || !businessName) return;
    if (pathname === "/overview" && !premisesSelected) {
      router.replace("/overview/map");
    } else if (pathname === "/overview/map" && premisesSelected) {
      router.replace("/overview");
    }
  }, [hydrated, started, businessName, premisesSelected, pathname, router]);

  return <>{children}</>;
}
