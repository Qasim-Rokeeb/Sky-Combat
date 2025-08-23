
import type { AircraftStats } from "@/types/game";

export const AIRCRAFT_STATS: Record<"fighter" | "bomber" | "support", Omit<AircraftStats, 'hp' | 'xp' | 'level'>> = {
  fighter: {
    maxHp: 100,
    attack: 30,
    defense: 20,
    range: 3,
    speed: 4,
    specialAbilityDescription: "A powerful, precise strike against a single target. High damage, but requires careful positioning."
  },
  bomber: {
    maxHp: 120,
    attack: 50,
    defense: 10,
    range: 2,
    speed: 3,
    specialAbilityDescription: "Drops a payload of explosives, damaging all units in a target area."
  },
  support: {
    maxHp: 80,
    attack: 15,
    defense: 20,
    range: 2,
    speed: 3,
    specialAbilityDescription: "Deploys a repair drone to a friendly unit, restoring a portion of its health."
  },
};
