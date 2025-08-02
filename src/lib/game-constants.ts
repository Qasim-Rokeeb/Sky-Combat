import type { AircraftStats } from "@/types/game";

export const AIRCRAFT_STATS: Record<"fighter" | "bomber" | "support", AircraftStats> = {
  fighter: {
    maxHp: 100,
    hp: 100,
    attack: 35,
    defense: 15,
    range: 3,
    speed: 4,
  },
  bomber: {
    maxHp: 120,
    hp: 120,
    attack: 50,
    defense: 5,
    range: 1,
    speed: 3,
  },
  support: {
    maxHp: 80,
    hp: 80,
    attack: 15,
    defense: 20,
    range: 2,
    speed: 3,
  },
};
