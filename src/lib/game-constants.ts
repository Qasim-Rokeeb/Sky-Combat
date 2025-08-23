
import type { AircraftStats } from "@/types/game";

export const AIRCRAFT_STATS: Record<"fighter" | "bomber" | "support", Omit<AircraftStats, 'hp' | 'xp' | 'level' | 'energy'>> = {
  fighter: {
    maxHp: 100,
    attack: 30,
    defense: 20,
    range: 3,
    speed: 4,
    maxEnergy: 100,
    specialAbilityCost: 50,
    specialAbilityDescription: "A powerful, precise strike against a single target. High damage, but requires careful positioning.",
    critChance: 0.15, // 15%
    critDamage: 1.5, // 150% damage
    dodgeChance: 0.15, // 15%
  },
  bomber: {
    maxHp: 120,
    attack: 50,
    defense: 10,
    range: 2,
    speed: 3,
    maxEnergy: 100,
    specialAbilityCost: 75,
    specialAbilityDescription: "Drops a payload of explosives, damaging all units in a target area.",
    critChance: 0.05, // 5%
    critDamage: 1.5, // 150% damage
    dodgeChance: 0.05, // 5%
  },
  support: {
    maxHp: 80,
    attack: 15,
    defense: 20,
    range: 2,
    speed: 3,
    maxEnergy: 120,
    specialAbilityCost: 40,
    specialAbilityDescription: "Deploys a repair drone to a friendly unit, restoring a portion of its health.",
    critChance: 0.10, // 10%
    critDamage: 1.5, // 150% damage
    dodgeChance: 0.10, // 10%
  },
};
