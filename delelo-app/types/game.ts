/* ============================================================
 * ДЕЛО — базовые игровые типы
 * Этот слой не зависит от UI и движка.
 * ============================================================ */

export type BusinessType = "coffee_shop";

export type BusinessStatus =
  | "idea" // идея
  | "preparation" // подготовка
  | "registered" // зарегистрирован
  | "open" // работает
  | "closed"; // закрыт

export type DocumentStatus = "none" | "submitted" | "approved" | "rejected";

export interface PlayerState {
  name: string;
  createdAt: number;
}

export interface BusinessState {
  name: string;
  type: BusinessType;
  status: BusinessStatus;
  opened: boolean;
}

export interface FinanceState {
  money: number;
  day: number;
  revenueToday: number;
  expensesToday: number;
}

export interface LocationState {
  selectedPremisesId: string | null;
  rent: number;
  address: string | null;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  salary: number;
  hired: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  relationship: number; // 0..100
  active: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
}

export interface Shipment {
  id: string;
  supplierId: string;
  itemIds: string[];
  status: "ordered" | "in_transit" | "delivered";
  arriveDay: number;
}

export interface GameDocument {
  id: string;
  name: string;
  status: DocumentStatus;
}

export interface RelationshipState {
  id: string;
  label: string;
  value: number; // 0..100
}

export interface ActiveEvent {
  id: string;
  title: string;
  description: string;
  resolved: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  unlocked: boolean;
}

export interface Notification {
  id: string;
  text: string;
  day: number;
}

/* ---------- Effects (изменения состояния, применяемые движком) ---------- */

export type Effect =
  | { type: "money"; delta: number }
  | { type: "reputation"; delta: number }
  | { type: "relationship"; target: string; delta: number }
  | { type: "risk"; delta: number }
  | { type: "inventory"; itemId: string; delta: number }
  | { type: "flag"; key: string; value: boolean };

export type ActionKind =
  | "START_GAME"
  | "SET_BUSINESS_NAME"
  | "APPLY_EFFECTS"
  | "COMPLETE_SCENE"
  | "ADVANCE_DAY"
  | "RESET_GAME";

/* Игровое действие: UI отправляет Action → Engine обрабатывает → State меняется */
export interface GameAction {
  kind: ActionKind;
  payload?: unknown;
}

export interface SceneRef {
  id: string;
  title: string;
}

/* ---------- Полный GameState ---------- */

export interface GameStateData {
  player: PlayerState;
  business: BusinessState;
  finance: FinanceState;
  location: LocationState;
  employees: Employee[];
  suppliers: Supplier[];
  inventory: InventoryItem[];
  shipments: Shipment[];
  documents: GameDocument[];
  relationships: RelationshipState[];
  events: ActiveEvent[];
  flags: Record<string, boolean>;
  achievements: Achievement[];
  reputation: number;
  risk: number;
  notifications: Notification[];
  currentSceneId: string | null;
  completedScenes: string[];
  started: boolean;
}
