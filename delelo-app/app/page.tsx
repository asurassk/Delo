"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import StartFlow from "@/components/game/StartFlow";
import { useGameStore } from "@/game/state/store";

/* Корневой маршрут — стартовый экран игры.
 * Если игра уже начата и название введено — переходим в Overview. */
export default function StartPage() {
  const router = useRouter();
  const started = useGameStore((s) => s.started);
  const businessName = useGameStore((s) => s.business.name);

  useEffect(() => {
    if (started && businessName) router.replace("/overview");
  }, [started, businessName, router]);

  return <StartFlow onFinished={() => router.push("/overview")} />;
}
