import type { Effect, GameAction } from "@/types/game";
import { useGameStore } from "@/game/state/store";
import { applyEffects } from "./effects";
import { SCENES } from "@/game/data/scenes";

interface SetBusinessNamePayload {
  name: string;
}

interface ApplyEffectsPayload {
  effects: Effect[];
}

interface CompleteScenePayload {
  sceneId: string;
}

interface SelectLocationPayload {
  locationId: string;
}

function getStateData() {
  const s = useGameStore.getState();

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
      store.pushNotification(
        "Игра начата. Придумайте название бизнесу."
      );
      break;
    }

    case "SET_BUSINESS_NAME": {
      const name =
        ((action.payload as SetBusinessNamePayload)?.name ?? "").trim();

      if (!name) break;

      const next = applyEffects(getStateData(), [
        { type: "flag", key: "name_set", value: true },
      ]);

      store.setStateData({
        business: {
          ...store.business,
          name,
          status: "preparation",
        },
        flags: next.flags,
      });

      store.pushNotification(
        `Бизнес «${name}» зарегистрирован как идея. Статус: подготовка.`
      );
      break;
    }

    case "APPLY_EFFECTS": {
      const effects =
        (action.payload as ApplyEffectsPayload)?.effects ?? [];

      const next = applyEffects(getStateData(), effects);
      store.setStateData(next);
      break;
    }

    case "SELECT_LOCATION": {
      const locationId = (
        action.payload as SelectLocationPayload
      )?.locationId;

      if (!locationId) break;

      const state = getStateData();

      const next = applyEffects(state, [
        {
          type: "set_location",
          locationId,
        },
      ]);

      const rent = next.location.rent;

      if (!rent) break;

      const location = next.location;

      const deposit = rent;

      if (next.finance.money < deposit) {
        store.pushNotification(
          "Недостаточно денег для оплаты депозита."
        );
        break;
      }

      const finalState = applyEffects(next, [
        {
          type: "set_rent",
          monthlyRent: rent,
        },
        {
          type: "pay_deposit",
          amount: deposit,
        },
        {
          type: "flag",
          key: "premises_selected",
          value: true,
        },
        {
          type: "flag",
          key: `location_selected:${locationId}`,
          value: true,
        },
      ]);

      store.setStateData(finalState);

      store.pushNotification(
        `Выбрано помещение: ${location.name}. Депозит: ${deposit.toLocaleString(
          "ru-RU"
        )} ₽.`
      );

      break;
    }

    case "COMPLETE_SCENE": {
      const sceneId = (
        action.payload as CompleteScenePayload
      )?.sceneId;

      if (!sceneId) break;

      const scene = SCENES[sceneId];

      if (!scene) break;

      if (getStateData().completedScenes.includes(sceneId)) break;

      const next = applyEffects(
        getStateData(),
        scene.effects
      );

      store.setStateData({
        ...next,
        completedScenes: [
          ...getStateData().completedScenes,
          sceneId,
        ],
        currentSceneId: null,
      });

      store.pushNotification(
        `Сцена завершена: ${scene.title}`
      );

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

export function applyEffectsAction(effects: Effect[]): void {
  dispatch({
    kind: "APPLY_EFFECTS",
    payload: { effects },
  });
}