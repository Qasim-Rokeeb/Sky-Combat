export type Player = "player" | "opponent";

export interface AircraftStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  range: number;
  speed: number;
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
}

export type GridCell = Aircraft | null;
export type Grid = GridCell[][];

export type GamePhase = "playing" | "gameOver";

export type ActionType = "move" | "attack" | "none";

export interface GameAnimation {
  type: 'attack';
  attackerId: string;
  defenderId: string;
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
  animation: GameAnimation | null;
  turnNumber: number;
}
