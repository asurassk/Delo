import type { Effect, GameAction } from "@/types/game";
import { useGameStore } from "@/game/state/store";
import { applyEffects } from "./effects";
import { SCENES } from "@/game/data/scenes";

/* ============================================================
 * Game Engine — единственная точка входа для UI.
 *
 * Схема:  UI → dispatch(Action) → Engine → Store → UI
 *
 * Компоненты никогда не вызывают store-мутации напрямую,
 * они отправляют действия в движок.
 * ============================================================ */

interface SetBusinessNamePayload {
  name: string;
}

interface ApplyEffectsPayload {
  effects: Effect[];
}

interface CompleteScenePayload {
  sceneId: string;
}

function getStateData() {
  const s = useGameStore.getState();
  // только игровые данные, без функций/флагов гидратации
  return {
    player: s.player,
    business: s.business,
    finance: s.finance,
    location: s.location,
    employees: s.employees,
    suppliers: s.suppliers,
    inventory: s.inventory,
    shipments: s.shipments,
    documents: s.documents,
    relationships: s.relationships,
    events: s.events,
    flags: s.flags,
    achievements: s.achievements,
    reputation: s.reputation,
    risk: s.risk,
    notifications: s.notifications,
    currentSceneId: s.currentSceneId,
    completedScenes: s.completedScenes,
    started: s.started,
  };
}

export function dispatch(action: GameAction): void {
  const store = useGameStore.getState();

  switch (action.kind) {
    case "START_GAME": {
      store.setStateData({ started: true });
      store.pushNotification("Игра начата. Придумайте название бизнесу.");
      break;
    }

    case "SET_BUSINESS_NAME": {
      const name = ((action.payload as SetBusinessNamePayload)?.name ?? "").trim();
      if (!name) break;
      const next = applyEffects(getStateData(), [
        { type: "flag", key: "name_set", value: true },
      ]);
      store.setStateData({
        business: { ...store.business, name, status: "preparation" },
        flags: next.flags,
      });
      store.pushNotification(`Бизнес «${name}» зарегистрирован как идея. Статус: подготовка.`);
      break;
    }

    case "APPLY_EFFECTS": {
      const effects = (action.payload as ApplyEffectsPayload)?.effects ?? [];
      const next = applyEffects(getStateData(), effects);
      store.setStateData(next);
      break;
    }

    case "COMPLETE_SCENE": {
      const sceneId = (action.payload as CompleteScenePayload)?.sceneId;
      if (!sceneId) break;
      const scene = SCENES[sceneId];
      if (!scene) break;
      if (getStateData().completedScenes.includes(sceneId)) break;

      const next = applyEffects(getStateData(), scene.effects);
      store.setStateData({
        ...next,
        completedScenes: [...getStateData().completedScenes, sceneId],
        currentSceneId: null,
      });
      store.pushNotification(`Сцена завершена: ${scene.title}`);
      break;
    }

    case "ADVANCE_DAY": {
      store.setStateData({
        finance: {
          ...store.finance,
          day: store.finance.day + 1,
          revenueToday: 0,
          expensesToday: 0,
        },
      });
      break;
    }

    case "RESET_GAME": {
      store.resetState();
      break;
    }
  }
}

/** Вспомогательная отправка effects из UI (например, из сцен событий). */
export function applyEffectsAction(effects: Effect[]): void {
  dispatch({ kind: "APPLY_EFFECTS", payload: { effects } });
}
