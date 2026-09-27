import type { Effect, GameStateData } from "@/types/game";
import { getLocationById } from "@/game/data/locations";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export function applyEffects(
  state: GameStateData,
  effects: Effect[]
): GameStateData {
  let next: GameStateData = { ...state };

  for (const effect of effects) {
    switch (effect.type) {
      case "money": {
        next = {
          ...next,
          finance: {
            ...next.finance,
            money: next.finance.money + effect.delta,
            ...(effect.delta < 0
              ? { expensesToday: next.finance.expensesToday - effect.delta }
              : { revenueToday: next.finance.revenueToday + effect.delta }),
          },
        };
        break;
      }

      case "reputation": {
        next = {
          ...next,
          reputation: clamp(next.reputation + effect.delta, 0, 100),
        };
        break;
      }

      case "relationship": {
        next = {
          ...next,
          relationships: next.relationships.map((r) =>
            r.id === effect.target || r.label === effect.target
              ? { ...r, value: clamp(r.value + effect.delta, 0, 100) }
              : r
          ),
          suppliers: next.suppliers.map((s) =>
            s.id === effect.target || s.name === effect.target
              ? {
                  ...s,
                  relationship: clamp(
                    s.relationship + effect.delta,
                    0,
                    100
                  ),
                }
              : s
          ),
        };
        break;
      }

      case "risk": {
        next = {
          ...next,
          risk: clamp(next.risk + effect.delta, 0, 100),
        };
        break;
      }

      case "inventory": {
        const exists = next.inventory.some(
          (i) => i.id === effect.itemId
        );

        next = {
          ...next,
          inventory: exists
            ? next.inventory.map((i) =>
                i.id === effect.itemId
                  ? {
                      ...i,
                      quantity: Math.max(
                        0,
                        i.quantity + effect.delta
                      ),
                    }
                  : i
              )
            : [
                ...next.inventory,
                {
                  id: effect.itemId,
                  name: effect.itemId,
                  unit: "шт",
                  quantity: Math.max(0, effect.delta),
                },
              ],
        };
        break;
      }

      case "flag": {
        next = {
          ...next,
          flags: {
            ...next.flags,
            [effect.key]: effect.value,
          },
        };
        break;
      }

      case "set_location": {
        const location = getLocationById(effect.locationId);

        if (!location) {
          break;
        }

        next = {
          ...next,
          location: {
            ...next.location,
            selectedPremisesId: location.id,
            name: location.name,
            address: location.name,
            rent: location.rent,
            traffic: location.traffic,
            competition: location.competition,
            logistics: location.logistics,
            audience: location.audience,
            areaSqm: location.areaSqm,
          },
        };
        break;
      }

      case "set_rent": {
        next = {
          ...next,
          business: {
            ...next.business,
            monthlyRent: effect.monthlyRent,
          },
        };
        break;
      }

      case "pay_deposit": {
        next = {
          ...next,
          finance: {
            ...next.finance,
            money: next.finance.money - effect.amount,
            expensesToday:
              next.finance.expensesToday + effect.amount,
          },
          business: {
            ...next.business,
            securityDepositPaid: effect.amount,
          },
        };
        break;
      }
    }
  }

  return next;
}