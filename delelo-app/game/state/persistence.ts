import type { GameStateData } from "@/types/game";

/* ============================================================
 * Persistence — сохранение/загрузка Game State в localStorage.
 * Store и Engine используют только эти функции.
 * ============================================================ */

const STORAGE_KEY = "delo-save-v1";

export function saveGame(state: GameStateData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage недоступен — тихо пропускаем
  }
}

export function loadGame(): GameStateData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameStateData;
    // минимальная проверка формы сохранения
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.business !== "object" ||
      typeof parsed.finance !== "object"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
