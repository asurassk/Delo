import type { GameStateData } from "@/types/game";

/* ============================================================
 * Начальное состояние игры «ДЕЛО»
 * MVP: кофейня, стартовый капитал 500 000 ₽, день 1
 * ============================================================ */

export const INITIAL_MONEY = 500_000;

export function createInitialGameState(): GameStateData {
  return {
    player: {
      name: "",
      createdAt: Date.now(),
    },
    business: {
      name: "",
      type: "coffee_shop",
      status: "idea",
      opened: false,
      monthlyRent: 0,
      securityDepositPaid: 0,
    },
    finance: {
      money: INITIAL_MONEY,
      day: 1,
      revenueToday: 0,
      expensesToday: 0,
    },
    location: {
      selectedPremisesId: null,
      rent: 0,
      address: null,
      name: null,
      traffic: 0,
      competition: 0,
      logistics: 0,
      audience: null,
      areaSqm: 0,
    },
    employees: [],
    suppliers: [],
    inventory: [],
    shipments: [],
    documents: [
      { id: "doc_ogrn", name: "Регистрация ИП / ОГРН", status: "none" },
      { id: "doc_cash_register", name: "Кассовый аппарат (ОФД)", status: "none" },
      { id: "doc_sanitary", name: "Санитарная книжка", status: "none" },
      { id: "doc_lease", name: "Договор аренды помещения", status: "none" },
      { id: "doc_fire", name: "Пожарная декларация", status: "none" },
    ],
    relationships: [
      { id: "rel_suppliers", label: "Поставщики", value: 50 },
      { id: "rel_authorities", label: "Проверяющие органы", value: 50 },
      { id: "rel_neighbors", label: "Соседи", value: 50 },
    ],
    events: [],
    flags: {},
    achievements: [],
    reputation: 50,
    risk: 10,
    notifications: [],
    currentSceneId: null,
    completedScenes: [],
    started: false,
  };
}
