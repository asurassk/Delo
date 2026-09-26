"use client";

import { useRouter } from "next/navigation";
import StartFlow from "@/components/game/StartFlow";
import Overview from "@/components/game/Overview";
import { useGameStore } from "@/game/state/store";

/* ============================================================
 * /overview — главный экран игры.
 * Если игра не начата или название бизнеса пустое — показываем
 * StartFlow; после ввода названия переходим на Overview.
 * UI не меняет GameState напрямую — только через Game Engine.
 * ============================================================ */

export default function OverviewPage() {
  const router = useRouter();
  const started = useGameStore((s) => s.started);
  const businessName = useGameStore((s) => s.business.name);

  if (!started || !businessName) {
    return <StartFlow onFinished={() => router.push("/overview")} />;
  }

  return <Overview />;
}
