"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGameStore } from "@/game/state/store";

export default function IntroRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const hydrated = useGameStore((s) => s.hydrated);
  const started = useGameStore((s) => s.started);
  const businessName = useGameStore((s) => s.business.name);
  const premisesSelected = useGameStore(
    (s) => !!s.location.selectedPremisesId
  );

  useEffect(() => {
    if (!hydrated || !started || !businessName) return;

    // Если помещение уже выбрано, карта больше не является
    // стартовой сценой — возвращаем игрока в Overview.
    if (pathname === "/overview/map" && premisesSelected) {
      router.replace("/overview");
    }
  }, [
    hydrated,
    started,
    businessName,
    premisesSelected,
    pathname,
    router,
  ]);

  return <>{children}</>;
}