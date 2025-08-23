import type { GameState, Grid, Aircraft } from "@/types/game";
import { AIRCRAFT_STATS } from "./game-constants";

export const createInitialState = (width: number, height: number): GameState => {
  const grid: Grid = Array(height)
    .fill(null)
    .map(() => Array(width).fill(null));

  const aircrafts: Record<string, Aircraft> = {};

  // Player aircraft
  const playerAircraft = [
    { id: "p-f1", type: "fighter", position: { x: 2, y: height - 2 } },
    { id: "p-b1", type: "bomber", position: { x: 3, y: height - 2 } },
    { id: "p-s1", type: "support", position: { x: 4, y: height - 2 } },
  ];

  playerAircraft.forEach((a) => {
    const stats = AIRCRAFT_STATS[a.type];
    const aircraft: Aircraft = {
      ...a,
      owner: "player",
      stats: { 
        ...stats,
        hp: stats.maxHp,
        xp: 0,
        level: 1,
      },
      hasMoved: false,
      hasAttacked: false,
    };
    aircrafts[a.id] = aircraft;
    grid[a.position.y][a.position.x] = aircraft;
  });

  // Opponent aircraft
  const opponentAircraft = [
    { id: "o-f1", type: "fighter", position: { x: width - 3, y: 1 } },
    { id:o-b1", type: "bomber", position: { x: width - 4, y: 1 } },
    { id: "o-s1", type: "support", position: { x: width - 5, y: 1 } },
  ];

  opponentAircraft.forEach((a) => {
    const stats = AIRCRAFT_STATS[a.type];
    const aircraft: Aircraft = {
      ...a,
      owner: "opponent",
      stats: { 
        ...stats,
        hp: stats.maxHp,
        xp: 0,
        level: 1,
       },
      hasMoved: false,
      hasAttacked: false,
    };
    aircrafts[a.id] = aircraft;
    grid[a.position.y][a.position.x] = aircraft;
  });

  return {
    grid,
    aircrafts,
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
  };
};

export const opponentAI = async (state: GameState, dispatch: React.Dispatch<any>) => {
    const opponentAircrafts = Object.values(state.aircrafts).filter(a => a.owner === 'opponent');
    const playerAircrafts = Object.values(state.aircrafts).filter(a => a.owner === 'player');
    
    for (const aircraft of opponentAircrafts) {

        // If support aircraft, try to heal
        if (aircraft.type === 'support' && !aircraft.hasAttacked) {
            let targetToHeal: Aircraft | null = null;
            let lowestHpPercentage = 100;
            const friendlyAircrafts = Object.values(state.aircrafts).filter(a => a.owner === 'opponent' && a.id !== aircraft.id);

            for (const target of friendlyAircrafts) {
                const distance = Math.abs(aircraft.position.x - target.position.x) + Math.abs(aircraft.position.y - target.position.y);
                const hpPercentage = (target.stats.hp / target.stats.maxHp) * 100;

                if (distance <= aircraft.stats.range && hpPercentage < 100 && hpPercentage < lowestHpPercentage) {
                    targetToHeal = target;
                    lowestHpPercentage = hpPercentage;
                }
            }

            if (targetToHeal) {
                await new Promise(resolve => setTimeout(resolve, 300));
                dispatch({ type: 'SELECT_AIRCRAFT', payload: { aircraftId: aircraft.id } });
                await new Promise(resolve => setTimeout(resolve, 200));
                dispatch({ type: 'SELECT_ACTION', payload: { action: 'support' } });
                await new Promise(resolve => setTimeout(resolve, 200));
                dispatch({ type: 'SUPPORT_AIRCRAFT', payload: { targetId: targetToHeal.id } });
                await new Promise(resolve => setTimeout(resolve, 500));
                continue; // Next aircraft
            }
        }


        // 1. Try to attack
        if (!aircraft.hasAttacked) {
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
                continue; // Next aircraft
            }
        }

        // 2. If cannot act, move towards the closest player
        if (!aircraft.hasMoved) {
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

                for (let i = -aircraft.stats.speed; i <= aircraft.stats.speed; i++) {
                    for (let j = -aircraft.stats.speed; j <= aircraft.stats.speed; j++) {
                        if (Math.abs(i) + Math.abs(j) > aircraft.stats.speed || (i === 0 && j === 0)) continue;

                        const newX = aircraft.position.x + i;
                        const newY = aircraft.position.y + j;
                        
                        if (newX >= 0 && newX < state.grid[0].length && newY >= 0 && newY < state.grid.length && !state.grid[newY][newX]) {
                           const distanceToTarget = Math.abs(newX - closestTarget.position.x) + Math.abs(newY - closestTarget.position.y);
                           if(distanceToTarget < bestMoveDistance){
                               bestMoveDistance = distanceToTarget;
                               bestMove = {x: newX, y: newY};
                           }
                        }
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
