
import type { GameState, Grid, Aircraft } from "@/types/game";
import { AIRCRAFT_STATS, TURN_TIME_LIMIT } from "./game-constants";

export const createInitialState = (width: number, height: number): GameState => {
  const grid: Grid = Array(height)
    .fill(null)
    .map(() => Array(width).fill(null));

  const aircrafts: Record<string, Aircraft> = {};
  const occupiedPositions = new Set<string>();

  // Simple pseudo-random generator to avoid client-server mismatch
  const pseudoRandom = (seed: number) => {
      let x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
  }

  const getRandomPosition = (player: 'player' | 'opponent', seed: number) => {
    let x, y;
    const yRange = player === 'player' 
        ? {min: height - 3, max: height - 1} 
        : {min: 0, max: 2};
    
    let randomSeed = seed;
    do {
        randomSeed++;
        x = Math.floor(pseudoRandom(randomSeed * 10) * width);
        y = Math.floor(pseudoRandom(randomSeed * 100) * (yRange.max - yRange.min + 1)) + yRange.min;
    } while (occupiedPositions.has(`${x},${y}`));
    
    occupiedPositions.add(`${x},${y}`);
    return {x, y};
  }

  const createAircraft = (id: string, type: "fighter" | "bomber" | "support", owner: 'player' | 'opponent', seed: number) => {
    const position = getRandomPosition(owner, seed);
    const baseStats = AIRCRAFT_STATS[type];
    
    const aircraft: Aircraft = {
      id,
      type,
      position,
      owner,
      stats: { 
        ...baseStats,
        hp: baseStats.maxHp, // Start with full health
        xp: 0,
        level: 1,
        energy: baseStats.maxEnergy,
        actionPoints: baseStats.maxActionPoints,
        dodgeChance: baseStats.dodgeChance,
      },
      specialAbilityCooldown: 0,
      statusEffects: [],
    };
    aircrafts[id] = aircraft;
    grid[position.y][position.x] = aircraft;
  }

  // Player aircraft
  const playerAircraftTypes: { id: string, type: "fighter" | "bomber" | "support" }[] = [
    { id: "p-f1", type: "fighter"},
    { id: "p-b1", type: "bomber"},
    { id: "p-s1", type: "support"},
  ];

  playerAircraftTypes.forEach((a, index) => {
    createAircraft(a.id, a.type, 'player', index + 1);
  });

  // Opponent aircraft
  const opponentAircraftTypes: { id: string, type: "fighter" | "bomber" | "support" }[] = [
    { id: "o-f1", type: "fighter" },
    { id: "o-b1", type: "bomber" },
    { id: "o-s1", "type": "support" },
  ];

  opponentAircraftTypes.forEach((a, index) => {
    createAircraft(a.id, a.type, 'opponent', (index + 1) * 100);
  });

  return {
    grid,
    aircrafts,
    destroyedAircrafts: {},
    currentPlayer: "player",
    phase: "playing",
    winner: null,
    selectedAircraftId: null,
    selectedAction: "none",
    actionHighlights: [],
    attackableAircraftIds: [],
    supportableAircraftIds: [],
    animation: null,
    turnNumber: 1,
    lastMove: null,
    actionLog: ["Game has started. It's player's turn."],
    turnTimeRemaining: TURN_TIME_LIMIT,
  };
};

export const opponentAI = async (state: GameState, dispatch: React.Dispatch<any>) => {
    const opponentAircrafts = Object.values(state.aircrafts).filter(a => a.owner === 'opponent');
    const playerAircrafts = Object.values(state.aircrafts).filter(a => a.owner === 'player');
    
    for (const aircraft of opponentAircrafts) {
        if(aircraft.stats.actionPoints <= 0) continue;

        // If support aircraft, try to revive a fallen comrade
        if (aircraft.type === 'support' && aircraft.stats.actionPoints > 0 && aircraft.specialAbilityCooldown === 0 && aircraft.stats.energy >= aircraft.stats.specialAbilityCost) {
            const friendlyDestroyed = Object.values(state.destroyedAircrafts).filter(a => a.owner === 'opponent');
            if (friendlyDestroyed.length > 0) {
                // Find an empty tile to revive on
                let reviveTile: {x: number, y: number} | null = null;
                const { x, y } = aircraft.position;

                // Check adjacent tiles
                const adjacent = [{dx:0, dy:1}, {dx:0, dy:-1}, {dx:1, dy:0}, {dx:-1, dy:0}];
                for (const {dx, dy} of adjacent) {
                    const newX = x + dx;
                    const newY = y + dy;
                    if (newX >= 0 && newX < state.grid[0].length && newY >= 0 && newY < state.grid.length && !state.grid[newY][newX]) {
                        reviveTile = { x: newX, y: newY };
                        break;
                    }
                }
                
                if (reviveTile) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                    dispatch({ type: 'SELECT_AIRCRAFT', payload: { aircraftId: aircraft.id } });
                    await new Promise(resolve => setTimeout(resolve, 200));
                    dispatch({ type: 'SELECT_ACTION', payload: { action: 'special' } });
                    await new Promise(resolve => setTimeout(resolve, 200));
                    dispatch({ type: 'SPECIAL_AIRCRAFT', payload: { targetId: friendlyDestroyed[0].id, position: reviveTile } });
                    await new Promise(resolve => setTimeout(resolve, 500));
                    if(aircraft.stats.actionPoints - 1 <= 0) continue; 
                }
            }
        }


        // 1. Try to attack
        if (aircraft.stats.actionPoints > 0) {
            let targetToAttack: Aircraft | null = null;
            let minDistance = Infinity;

            for (const target of playerAircrafts) {
                const distance = Math.abs(aircraft.position.x - target.position.x) + Math.abs(aircraft.position.y - target.position.y);
                if (distance <= aircraft.stats.range && distance < minDistance) {
                    targetToAttack = target;
                    minDistance = distance;
                }
            }
            
            if (targetToAttack) {
                await new Promise(resolve => setTimeout(resolve, 300));
                dispatch({ type: 'SELECT_AIRCRAFT', payload: { aircraftId: aircraft.id } });
                await new Promise(resolve => setTimeout(resolve, 200));
                dispatch({ type: 'SELECT_ACTION', payload: { action: 'attack' } });
                await new Promise(resolve => setTimeout(resolve, 200));
                dispatch({ type: 'ATTACK_AIRCRAFT', payload: { targetId: targetToAttack.id } });
                await new Promise(resolve => setTimeout(resolve, 500)); // wait for animation
                 if(aircraft.stats.actionPoints - 1 <= 0) continue; 
            }
        }

        // 2. If cannot act, move towards the closest player
        if (aircraft.stats.actionPoints > 0) {
            let closestTarget: Aircraft | null = null;
            let minDistance = Infinity;
            for (const target of playerAircrafts) {
                const distance = Math.abs(aircraft.position.x - target.position.x) + Math.abs(aircraft.position.y - target.position.y);
                if (distance < minDistance) {
                    closestTarget = target;
                    minDistance = distance;
                }
            }

            if (closestTarget) {
                let bestMove: {x: number, y: number} | null = null;
                let bestMoveDistance = Infinity;

                // Simple pathfinding: move towards target
                const dx = Math.sign(closestTarget.position.x - aircraft.position.x);
                const dy = Math.sign(closestTarget.position.y - aircraft.position.y);

                let possibleMoves = [];
                for (let i = 1; i <= aircraft.stats.speed; i++) {
                    // Try moving horizontally then vertically
                    let moveX = aircraft.position.x + i * dx;
                    let moveY = aircraft.position.y;
                     if(Math.abs(dx) + Math.abs(dy) > i) {
                        moveY = aircraft.position.y + (i - Math.abs(dx)) * dy;
                     }
                    if(moveX >= 0 && moveX < state.grid[0].length && moveY >= 0 && moveY < state.grid.length && !state.grid[moveY][moveX]){
                        possibleMoves.push({x: moveX, y: moveY});
                    }
                    // Try moving vertically then horizontally
                    moveX = aircraft.position.x;
                    moveY = aircraft.position.y + i * dy;
                    if(Math.abs(dx) + Math.abs(dy) > i){
                         moveX = aircraft.position.x + (i - Math.abs(dy)) * dx;
                    }
                    if(moveX >= 0 && moveX < state.grid[0].length && moveY >= 0 && moveY < state.grid.length && !state.grid[moveY][moveX]){
                        possibleMoves.push({x: moveX, y: moveY});
                    }
                }
                
                // Find the best move among possibilities
                 for(const move of possibleMoves){
                    const distanceToTarget = Math.abs(move.x - closestTarget.position.x) + Math.abs(move.y - closestTarget.position.y);
                    if(distanceToTarget < bestMoveDistance){
                        bestMoveDistance = distanceToTarget;
                        bestMove = move;
                    }
                }


                if(bestMove){
                    await new Promise(resolve => setTimeout(resolve, 300));
                    dispatch({ type: 'SELECT_AIRCRAFT', payload: { aircraftId: aircraft.id } });
                    await new Promise(resolve => setTimeout(resolve, 200));
                    dispatch({ type: 'SELECT_ACTION', payload: { action: 'move' } });
                    await new Promise(resolve => setTimeout(resolve, 200));
                    dispatch({ type: 'MOVE_AIRCRAFT', payload: bestMove });
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        }
    }
};
