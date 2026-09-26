import type { Effect, SceneRef } from "@/types/game";

/* ============================================================
 * Game Data — статический контент игры.
 * Здесь описываются сцены, эффекты и задачи.
 * UI не содержит игровых данных, движок — тоже.
 * ============================================================ */

export interface SceneDefinition {
  id: string;
  title: string;
  description: string;
  effects: Effect[];
}

/** Стартовые сцены MVP (инфраструктура, наполняется позже). */
export const SCENES: Record<string, SceneDefinition> = {
  scene_intro: {
    id: "scene_intro",
    title: "Знакомство с делом",
    description: "Вы решили открыть небольшую кофейню.",
    effects: [{ type: "flag", key: "intro_seen", value: true }],
  },
};

export function listScenes(): SceneRef[] {
  return Object.values(SCENES).map((s) => ({ id: s.id, title: s.title }));
}

/** Текущие задачи игрока (простой список, без сложной логики). */
export interface TaskItem {
  id: string;
  text: string;
  doneFlag: string | null;
}

export const STARTER_TASKS: TaskItem[] = [
  { id: "task_name", text: "Придумать название бизнесу", doneFlag: "name_set" },
  { id: "task_premises", text: "Выбрать помещение", doneFlag: "premises_selected" },
  { id: "task_docs", text: "Оформить базовые документы", doneFlag: "docs_started" },
  { id: "task_suppliers", text: "Найти поставщиков", doneFlag: "suppliers_found" },
  { id: "task_hire", text: "Нанять сотрудников", doneFlag: "team_hired" },
  { id: "task_open", text: "Открыть кофейню", doneFlag: "coffee_opened" },
];
