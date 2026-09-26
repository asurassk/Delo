import type { LocationInfo } from "@/types/game";

/* ============================================================
 * Game Data — помещения условного города.
 * Статические игровые данные: UI и Engine читают их,
 * но не изменяют. Выбранное помещение сохраняется в GameState
 * через эффект set_location.
 * ============================================================ */

export const LOCATIONS: LocationInfo[] = [
  {
    id: "gallery_mall",
    name: "ТЦ «Галерея»",
    rent: 120_000,
    traffic: 5,
    competition: 4,
    logistics: 5,
    audience: "Широкая аудитория: покупатели торгового центра",
    areaSqm: 50,
    deposit: 120_000,
  },
  {
    id: "park_bc",
    name: "Бизнес-центр «Парк»",
    rent: 80_000,
    traffic: 3,
    competition: 2,
    logistics: 4,
    audience: "Офисные сотрудники",
    areaSqm: 50,
    deposit: 80_000,
  },
  {
    id: "university",
    name: "Университетская",
    rent: 55_000,
    traffic: 3,
    competition: 1,
    logistics: 3,
    audience: "Студенты",
    areaSqm: 50,
    deposit: 55_000,
  },
  {
    id: "central",
    name: "Центральная",
    rent: 95_000,
    traffic: 4,
    competition: 5,
    logistics: 4,
    audience: "Смешанная аудитория",
    areaSqm: 50,
    deposit: 95_000,
  },
  {
    id: "residential",
    name: "Спальный район",
    rent: 45_000,
    traffic: 2,
    competition: 2,
    logistics: 3,
    audience: "Жители района",
    areaSqm: 50,
    deposit: 45_000,
  },
];

export function getLocationById(id: string): LocationInfo | undefined {
  return LOCATIONS.find((l) => l.id === id);
}
