import { create } from "zustand";
import type { GameStateData, Notification } from "@/types/game";
import { createInitialGameState } from "@/game/data/initialState";
import { loadGame, saveGame, clearSave } from "./persistence";

/* ============================================================
 * Game State — Zustand store.
 * Хранит только данные и примитивные мутации.
 * Игровая логика живёт в Game Engine (game/engine),
 * UI вызывает engine.dispatch(...), а не трогает store напрямую.
 * ============================================================ */

export interface GameStore extends GameStateData {
  hydrated: boolean;
  /* примитивные мутации — используются движком, не UI-компонентами */
  setStateData: (patch: Partial<GameStateData>) => void;
  pushNotification: (text: string) => void;
  markHydrated: () => void;
  hydrateFromStorage: () => void;
  persistToStorage: () => void;
  resetState: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialGameState(),
  hydrated: false,

  setStateData: (patch) => set(patch),

  pushNotification: (text) => {
    const state = get();
    const notification: Notification = {
      id: `n_${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
      text,
      day: state.finance.day,
    };
    set({ notifications: [notification, ...state.notifications].slice(0, 20) });
  },

  markHydrated: () => set({ hydrated: true }),

  hydrateFromStorage: () => {
    const saved = loadGame();
    if (saved) {
      set({ ...saved, hydrated: true });
    } else {
      set({ hydrated: true });
    }
  },

  persistToStorage: () => {
    const { hydrated, setStateData, pushNotification, markHydrated, hydrateFromStorage, persistToStorage, resetState, ...data } =
      get();
    void hydrated;
    void setStateData;
    void pushNotification;
    void markHydrated;
    void hydrateFromStorage;
    void persistToStorage;
    void resetState;
    saveGame(data as GameStateData);
  },

  resetState: () => {
    clearSave();
    set({ ...createInitialGameState(), hydrated: true });
  },
}));

/** Автосохранение при любом изменении состояния (после гидратации). */
useGameStore.subscribe((state, prev) => {
  if (state.hydrated && state !== prev) {
    state.persistToStorage();
  }
});
