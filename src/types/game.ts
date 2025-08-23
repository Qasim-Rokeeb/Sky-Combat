
export type Player = "player" | "opponent";

export type StatusEffect = 'stunned' | 'shielded' | 'empowered';

export interface AircraftStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  range: number;
  speed: number;
  xp: number;
  level: number;
  energy: number;
  maxEnergy: number;
  specialAbilityCost: number;
  specialAbilityDescription: string;
}

export type AircraftType = "fighter" | "bomber" | "support";

export interface Aircraft {
  id: string;
  owner: Player;
  type: AircraftType;
  stats: AircraftStats;
  position: { x: number; y: number };
  hasMoved: boolean;
  hasAttacked: boolean;
  specialAbilityCooldown: number;
  statusEffects: StatusEffect[];
}

export type GridCell = Aircraft | null;
export type Grid = GridCell[][];

export type GamePhase = "playing" | "gameOver";

export type ActionType = "move" | "attack" | "special" | "none";

export interface GameAnimation {
  type: 'attack' | 'heal';
  attackerId: string;
  defenderId: string;
  damage?: number;
  healAmount?: number;
}

export interface LastMove {
    aircraftId: string;
    from: { x: number; y: number };
    to: { x: number; y: number };
}

export interface GameState {
  grid: Grid;
  aircrafts: Record<string, Aircraft>;
  currentPlayer: Player;
  phase: GamePhase;
  winner: Player | null;
  selectedAircraftId: string | null;
  selectedAction: ActionType;
  actionHighlights: { x: number; y: number }[];
  attackableAircraftIds: string[];
  supportableAircraftIds: string[];
  animation: GameAnimation | null;
  turnNumber: number;
  lastMove: LastMove | null;
}
