
"use client";

import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  Bomb,
  Crosshair,
  Move,
  Shield,
  Send,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

import type {
  GameState,
  Player,
  ActionType,
  Aircraft,
  Grid,
  LastMove,
  GameMode,
  BattleSummary,
} from "@/types/game";
import { createInitialState, opponentAI, spawnWave } from "@/lib/game-utils";
import { TURN_TIME_LIMIT } from "@/lib/game-constants";
import Battlefield from "@/components/sky-combat/Battlefield";
import GameControls from "@/components/sky-combat/GameControls";
import GameOverDialog from "@/components/sky-combat/GameOverDialog";
import { useToast } from "@/hooks/use-toast";
import PlayerStats from "@/components/sky-combat/PlayerStats";
import MiniMap from "@/components/sky-combat/MiniMap";
import { cn } from "@/lib/utils";
import Scoreboard from "@/components/sky-combat/Scoreboard";
import VictoryAnimation from "@/components/sky-combat/VictoryAnimation";
import DefeatAnimation from "@/components/sky-combat/DefeatAnimation";
import ActionLog from "@/components/sky-combat/ActionLog";
import { useSearchParams } from "next/navigation";
import TutorialDialog from "@/components/sky-combat/TutorialDialog";

type GameAction =
  | { type: "SELECT_AIRCRAFT"; payload: { aircraftId: string } }
  | { type: "SELECT_ACTION"; payload: { action: ActionType } }
  | { type: "MOVE_AIRCRAFT"; payload: { x: number; y: number } }
  | { type: "ATTACK_AIRCRAFT"; payload: { targetId: string } }
  | { type: "SPECIAL_AIRCRAFT"; payload: { targetId?: string, position?: { x: number, y: number} } }
  | { type: "UNDO_MOVE" }
  | { type: "END_TURN" }
  | { type: "START_OPPONENT_TURN" }
  | { type: "SET_GAME_OVER"; payload: { winner: Player | null } }
  | { type: "RESET_GAME"; payload: { mode?: GameMode, challenge?: string | null } }
  | { type: "SHOW_ANIMATION"; payload: { type: 'attack' | 'heal' | 'levelUp', aircraftId: string, defenderId?: string, damage?: number, healAmount?: number, level?: number } }
  | { type: "CLEAR_ANIMATION" }
  | { type: "UPDATE_STATUS_EFFECTS" }
  | { type: "TICK_TIMER" }
  | { type: "START_NEW_WAVE" };

const GRID_WIDTH = 12;
const GRID_HEIGHT = 12;

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "SELECT_AIRCRAFT": {
      const { aircraftId } = action.payload;
      const aircraft = state.aircrafts[aircraftId];
      if (aircraft.owner !== state.currentPlayer || state.phase === 'gameOver') return state;

      return {
        ...state,
        selectedAircraftId: aircraftId,
        selectedAction: "none",
        actionHighlights: [],
        attackableAircraftIds: [],
        supportableAircraftIds: [],
      };
    }

    case "SELECT_ACTION": {
      if (!state.selectedAircraftId) return state;
      const { action } = action.payload;
      const aircraft = state.aircrafts[state.selectedAircraftId];
      if (aircraft.stats.actionPoints <= 0) return state;

      if (action === "move") {
        const highlights = [];
        const queue: {x: number, y: number, dist: number}[] = [{x: aircraft.position.x, y: aircraft.position.y, dist: 0}];
        const visited = new Set<string>([`${aircraft.position.x},${aircraft.position.y}`]);

        while(queue.length > 0){
            const {x, y, dist} = queue.shift()!;

            if(dist >= aircraft.stats.speed) continue;

            const neighbors = [{dx: 0, dy: 1}, {dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: -1, dy: 0}];
            for(const {dx, dy} of neighbors){
                const newX = x + dx;
                const newY = y + dy;
                const key = `${newX},${newY}`;

                if(newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT && !visited.has(key) && !state.grid[newY][newX]){
                    visited.add(key);
                    highlights.push({x: newX, y: newY});
                    queue.push({x: newX, y: newY, dist: dist + 1});
                }
            }
        }
        
        return { ...state, selectedAction: "move", actionHighlights: highlights, attackableAircraftIds: [], supportableAircraftIds: [] };
      }

      if (action === "attack") {
        const attackRange = state.weather === 'Thunderstorm' ? aircraft.stats.range - 1 : aircraft.stats.range;
        const attackable = Object.values(state.aircrafts).filter(target => {
          if (target.owner === state.currentPlayer) return false;
          const distance = Math.abs(target.position.x - aircraft.position.x) + Math.abs(target.position.y - aircraft.position.y);
          return distance <= attackRange;
        }).map(a => a.id);
        return { ...state, selectedAction: "attack", actionHighlights: [], attackableAircraftIds: attackable, supportableAircraftIds: [] };
      }
      
      if (action === "special" && aircraft.specialAbilityCooldown === 0 && aircraft.stats.energy >= aircraft.stats.specialAbilityCost) {
          if (aircraft.type === 'support') {
            const destroyedFriendlies = Object.values(state.destroyedAircrafts).filter(a => a.owner === state.currentPlayer);
            if (destroyedFriendlies.length === 0) {
                 // No one to revive, maybe heal later? For now, do nothing.
                return {...state, selectedAction: 'none'};
            }

            // Highlight all empty tiles on the grid for revival
             const highlights = [];
             for(let y = 0; y < GRID_HEIGHT; y++){
                 for(let x = 0; x < GRID_WIDTH; x++){
                     if(!state.grid[y][x]){
                         highlights.push({x,y});
                     }
                 }
             }
            return {...state, selectedAction: 'special', actionHighlights: highlights, attackableAircraftIds: [], supportableAircraftIds: []};
          }
      }

      return {
        ...state,
        selectedAction: "none",
        actionHighlights: [],
        attackableAircraftIds: [],
        supportableAircraftIds: []
      };
    }

    case "MOVE_AIRCRAFT": {
      if (!state.selectedAircraftId || state.selectedAction !== "move") return state;
      const { x, y } = action.payload;
      const aircraft = state.aircrafts[state.selectedAircraftId];
      if (aircraft.stats.actionPoints <= 0) return state;

      const newGrid: Grid = state.grid.map(row => [...row]);
      newGrid[aircraft.position.y][aircraft.position.x] = null;
      newGrid[y][x] = aircraft;

      const updatedAircraft = { 
          ...aircraft, 
          position: { x, y }, 
          stats: {...aircraft.stats, actionPoints: aircraft.stats.actionPoints - 1} 
      };
      
      const lastMove: LastMove = {
          aircraftId: aircraft.id,
          from: aircraft.position,
          to: {x, y},
      }

      const logMessage = `${aircraft.owner === 'player' ? 'Player' : 'Opponent'}'s ${aircraft.type} moved to (${x}, ${y}).`;

      return {
        ...state,
        grid: newGrid,
        aircrafts: { ...state.aircrafts, [state.selectedAircraftId]: updatedAircraft },
        selectedAction: "none",
        actionHighlights: [],
        lastMove,
        actionLog: [...state.actionLog, logMessage].slice(-5),
      };
    }

    case "ATTACK_AIRCRAFT": {
      if (!state.selectedAircraftId || state.selectedAction !== "attack") return state;
      const { targetId } = action.payload;
      const attacker = state.aircrafts[state.selectedAircraftId];
      if (attacker.stats.actionPoints <= 0) return state;

      const defender = state.aircrafts[targetId];

      const updatedAircrafts = { ...state.aircrafts };
      const updatedDestroyed = { ...state.destroyedAircrafts };
      let newActionLog = [...state.actionLog];
      let animation = state.animation;
      let newDamageDealt = state.damageDealt;
      let newDamageTaken = state.damageTaken;

      const attackerName = `${attacker.owner === 'player' ? 'Player' : 'Opponent'}'s ${attacker.type}`;
      const defenderName = `${defender.owner === 'player' ? 'Player' : 'Opponent'}'s ${defender.type}`;
      
      updatedAircrafts[attacker.id] = { ...attacker, stats: {...attacker.stats, actionPoints: attacker.stats.actionPoints - 1} };

      // Dodge check with evasion calculation
      const speedDifference = defender.stats.speed - attacker.stats.speed;
      const levelDifference = defender.stats.level - attacker.stats.level;
      let baseDodgeChance = defender.stats.dodgeChance;
      if (state.weather === 'Strong Winds') {
          baseDodgeChance += 0.15; // 15% bonus dodge in Strong Winds
      }
      const effectiveDodgeChance = baseDodgeChance + (speedDifference * 0.01) + (levelDifference * 0.01);
      
      const didDodge = Math.random() < effectiveDodgeChance;
      if (didDodge) {
          newActionLog.push(`${defenderName} dodged the attack from ${attackerName}! (Evasion: ${Math.round(effectiveDodgeChance * 100)}%)`);
          return {
            ...state,
            aircrafts: updatedAircrafts,
            selectedAction: 'none',
            attackableAircraftIds: [],
            animation: { type: 'dodge', attackerId: attacker.id, defenderId: defender.id },
            lastMove: null,
            actionLog: newActionLog.slice(-5),
          }
      }

      const isCritical = Math.random() < attacker.stats.critChance;
      let baseDamage = Math.max(1, attacker.stats.attack - defender.stats.defense);
      const damage = isCritical ? Math.floor(baseDamage * attacker.stats.critDamage) : baseDamage;

      if (attacker.owner === 'player') {
          newDamageDealt += damage;
      } else {
          newDamageTaken += damage;
      }

      const newHp = defender.stats.hp - damage;
      const xpGained = damage; // Gain XP equal to damage dealt

      const newAttackerStats = { ...attacker.stats, xp: attacker.stats.xp + xpGained, actionPoints: attacker.stats.actionPoints - 1 };
      
      let levelUpAnimation = null;
      // Simple leveling up
      if (newAttackerStats.xp >= 100 * newAttackerStats.level) {
        newAttackerStats.level += 1;
        newAttackerStats.xp = 0;
        newAttackerStats.attack += 5;
        newAttackerStats.maxHp += 10;
        newAttackerStats.hp += 10;
        newActionLog.push(`${attackerName} leveled up to level ${newAttackerStats.level}!`);
        levelUpAnimation = { type: 'levelUp', aircraftId: attacker.id, level: newAttackerStats.level };
      }

      updatedAircrafts[attacker.id] = { ...attacker, stats: newAttackerStats };

      if (isCritical) {
        newActionLog.push(`CRITICAL HIT! ${attackerName} attacked ${defenderName} for ${damage} damage.`);
      } else {
        newActionLog.push(`${attackerName} attacked ${defenderName} for ${damage} damage.`);
      }

      let newGrid = state.grid.map(row => [...row]);
      if (newHp <= 0) {
        updatedDestroyed[defender.id] = { ...defender, stats: { ...defender.stats, hp: 0 }};
        delete updatedAircrafts[targetId];
        newGrid[defender.position.y][defender.position.x] = null;
        newActionLog.push(`${defenderName} has been destroyed!`);

        const remainingDefenders = Object.values(updatedAircrafts).filter(a => a.owner === defender.owner);
        if (remainingDefenders.length === 0 && state.mode !== 'survival') {
             animation = { type: 'finalExplosion', attackerId: attacker.id, defenderId: defender.id, position: defender.position };
        }
      } else {
        updatedAircrafts[targetId] = { ...defender, stats: { ...defender.stats, hp: newHp } };
        animation = { type: 'attack', attackerId: attacker.id, defenderId: defender.id, damage, isCritical };
      }

      return {
        ...state,
        aircrafts: updatedAircrafts,
        destroyedAircrafts: updatedDestroyed,
        grid: newGrid,
        selectedAction: "none",
        attackableAircraftIds: [],
        supportableAircraftIds: [],
        animation: levelUpAnimation ?? animation,
        lastMove: null,
        actionLog: newActionLog.slice(-5),
        damageDealt: newDamageDealt,
        damageTaken: newDamageTaken,
      };
    }
    
    case "SPECIAL_AIRCRAFT": {
        if (!state.selectedAircraftId || state.selectedAction !== 'special') return state;
        
        const supporter = state.aircrafts[state.selectedAircraftId];
        if (supporter.stats.actionPoints <= 0) return state;

        if (supporter.type === 'support') {
            const { position, targetId } = action.payload;

            // Revive logic
            const friendlyDestroyed = Object.values(state.destroyedAircrafts).filter(a => a.owner === state.currentPlayer);
            if (friendlyDestroyed.length > 0 && position) {
                 const aircraftToRevive = targetId // AI provides targetId
                    ? state.destroyedAircrafts[targetId]
                    : friendlyDestroyed[0]; // For player, just revive the first one for now

                if (!aircraftToRevive) return state;

                const revivedAircraft: Aircraft = {
                    ...aircraftToRevive,
                    position: position,
                    stats: {
                        ...aircraftToRevive.stats,
                        hp: Math.floor(aircraftToRevive.stats.maxHp * 0.25), // Revive with 25% health
                        actionPoints: 0, // Cant act after being revived in the same turn
                    },
                    specialAbilityCooldown: 0,
                    statusEffects: []
                };

                const newAircrafts = {...state.aircrafts, [revivedAircraft.id]: revivedAircraft};
                const newDestroyed = {...state.destroyedAircrafts};
                delete newDestroyed[revivedAircraft.id];

                const newGrid = state.grid.map(row => [...row]);
                newGrid[position.y][position.x] = revivedAircraft;

                const newSupporterStats = {
                    ...supporter.stats, 
                    energy: supporter.stats.energy - supporter.stats.specialAbilityCost,
                    actionPoints: supporter.stats.actionPoints - 1,
                };
                
                const updatedSupporter = {
                    ...supporter, 
                    stats: newSupporterStats, 
                    specialAbilityCooldown: 5, // Long cooldown for revive
                    statusEffects: [...supporter.statusEffects.filter(e => e !== 'empowered'), 'empowered']
                };

                newAircrafts[supporter.id] = updatedSupporter;
                
                const supporterName = `${supporter.owner === 'player' ? 'Player' : 'Opponent'}'s ${supporter.type}`;
                const revivedName = `${revivedAircraft.owner === 'player' ? 'Player' : 'Opponent'}'s ${revivedAircraft.type}`;
                const logMessage = `${supporterName} revived ${revivedName}!`;

                return {
                    ...state,
                    aircrafts: newAircrafts,
                    destroyedAircrafts: newDestroyed,
                    grid: newGrid,
                    selectedAction: 'none',
                    actionHighlights: [],
                    animation: {type: 'revive', attackerId: supporter.id, defenderId: revivedAircraft.id},
                    lastMove: null,
                    actionLog: [...state.actionLog, logMessage].slice(-5),
                };
            }
        }
        return state;
    }
    
    case "UNDO_MOVE": {
        if (!state.lastMove) return state;
        const { aircraftId, from, to } = state.lastMove;
        const aircraft = state.aircrafts[aircraftId];
        
        // Check if the aircraft is still in the 'to' position
        if (state.grid[to.y][to.x]?.id !== aircraftId) return state;

        const newGrid = state.grid.map(row => [...row]);
        newGrid[to.y][to.x] = null;
        newGrid[from.y][from.x] = aircraft;

        const updatedAircraft = { 
            ...aircraft, 
            position: from, 
            stats: {...aircraft.stats, actionPoints: aircraft.stats.actionPoints + 1}
        };

        return {
            ...state,
            grid: newGrid,
            aircrafts: { ...state.aircrafts, [aircraftId]: updatedAircraft },
            lastMove: null,
            selectedAction: 'none',
            actionHighlights: [],
            actionLog: state.actionLog.slice(0, -1), // Remove the move log
        };
    }

    case "END_TURN": {
        const nextPlayer = state.currentPlayer === 'player' ? 'opponent' : 'player';
        const newTurnNumber = nextPlayer === 'player' ? state.turnNumber + 1 : state.turnNumber;
        const logMessage = `Turn ${newTurnNumber} has begun. It's ${nextPlayer}'s turn.`;
        const updatedAircrafts = { ...state.aircrafts };

        Object.values(state.aircrafts).forEach(a => {
            // Reset actionPoints & regen energy for the player whose turn is starting
            if (a.owner === nextPlayer) {
                updatedAircrafts[a.id] = { 
                    ...a, 
                    stats: {
                        ...a.stats,
                        actionPoints: a.stats.maxActionPoints,
                        energy: Math.min(a.stats.maxEnergy, a.stats.energy + 10) // Regenerate 10 energy
                    }
                };
            }
            // Cooldowns tick down for everyone at the end of the current player's turn.
             if (a.owner === state.currentPlayer) {
                updatedAircrafts[a.id] = {
                    ...updatedAircrafts[a.id],
                    specialAbilityCooldown: Math.max(0, a.specialAbilityCooldown -1),
                    // empowered status wears off at the end of the turn it was used
                    statusEffects: a.statusEffects.filter(e => e !== 'empowered')
                }
             }
        });

        const newVisibleGrid = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(false));
        if (nextPlayer === 'opponent') {
            // During opponent's turn, everything is visible for simplicity
            for(let y=0; y<GRID_HEIGHT; y++) {
                for(let x=0; x<GRID_WIDTH; x++) {
                    newVisibleGrid[y][x] = true;
                }
            }
        } else {
             const playerAircrafts = Object.values(updatedAircrafts).filter(a => a.owner === 'player');
             for(const aircraft of playerAircrafts) {
                const {x, y} = aircraft.position;
                const visionRange = aircraft.stats.range + 2; 

                for(let i = x - visionRange; i <= x + visionRange; i++) {
                    for(let j = y - visionRange; j <= y + visionRange; j++) {
                        if (i >= 0 && i < GRID_WIDTH && j >= 0 && j < GRID_HEIGHT) {
                            if(Math.abs(x - i) + Math.abs(y - j) <= visionRange) {
                                newVisibleGrid[j][i] = true;
                            }
                        }
                    }
                }
            }
        }

        return {
            ...state,
            currentPlayer: nextPlayer,
            selectedAircraftId: null,
            selectedAction: 'none',
            actionHighlights: [],
            attackableAircraftIds: [],
            supportableAircraftIds: [],
            aircrafts: updatedAircrafts,
            turnNumber: newTurnNumber,
            lastMove: null, // Clear last move on turn end
            actionLog: [...state.actionLog, logMessage].slice(-5),
            turnTimeRemaining: TURN_TIME_LIMIT,
            visibleGrid: newVisibleGrid,
        };
    }

    case "SET_GAME_OVER": {
        const { winner } = action.payload;

        const playerAircrafts = Object.values(state.aircrafts).filter(a => a.owner === 'player');
        const opponentAircraftsDestroyedCount = Object.keys(state.destroyedAircrafts).filter(id => state.destroyedAircrafts[id].owner === 'opponent').length;
        const playerAircraftsLostCount = Object.keys(state.destroyedAircrafts).filter(id => state.destroyedAircrafts[id].owner === 'player').length;
        
        const xpGained: Record<string, number> = {};
        playerAircrafts.forEach(finalAircraft => {
            const initialAircraft = state.initialAircrafts[finalAircraft.id];
            if (initialAircraft) {
                xpGained[finalAircraft.id] = finalAircraft.stats.xp - initialAircraft.stats.xp;
            }
        });

        const battleSummary: BattleSummary = {
            playerAircrafts: playerAircrafts,
            opponentAircraftsDestroyed: opponentAircraftsDestroyedCount,
            playerAircraftsLost: playerAircraftsLostCount,
            xpGained,
            totalTurns: state.turnNumber,
            totalDamageDealt: state.damageDealt,
            totalDamageTaken: state.damageTaken,
        };
        
        const logMessage = winner === 'player' 
            ? (state.mode === 'survival' ? `Game Over! You survived ${state.waveNumber} waves!` : 'Game Over! You were victorious!')
            : 'Game Over! You were defeated.';

        return { ...state, phase: 'gameOver', winner, battleSummary, actionLog: [...state.actionLog, logMessage].slice(-5)};
    }
    case "RESET_GAME":
        return createInitialState(GRID_WIDTH, GRID_HEIGHT, action.payload.mode, action.payload.challenge);
    
    case "SHOW_ANIMATION": {
        if (action.payload.type === 'attack') {
             return {...state, animation: {type: 'attack', attackerId: action.payload.aircraftId, defenderId: action.payload.defenderId!, damage: action.payload.damage}};
        }
        if (action.payload.type === 'heal') {
             return {...state, animation: {type: 'heal', attackerId: action.payload.aircraftId, defenderId: action.payload.defenderId!, healAmount: action.payload.healAmount}};
        }
        if (action.payload.type === 'levelUp') {
            return {...state, animation: {type: 'levelUp', aircraftId: action.payload.aircraftId, level: action.payload.level }};
        }
        return state;
    }

    case "CLEAR_ANIMATION":
        return {...state, animation: null};
    
    case "UPDATE_STATUS_EFFECTS": {
        // This can be used to centrally manage status effects over time, e.g. stun wearing off
        return state;
    }

    case "TICK_TIMER": {
        if (state.phase !== 'playing') return state;
        const newTime = state.turnTimeRemaining - 1;
        if (newTime <= 0) {
            // Time's up, auto-end turn. This is a bit tricky because END_TURN is complex.
            // For simplicity, we'll just return the state that would be returned by END_TURN.
             const nextPlayer = state.currentPlayer === 'player' ? 'opponent' : 'player';
            const updatedAircrafts = { ...state.aircrafts };
            const newTurnNumber = nextPlayer === 'player' ? state.turnNumber + 1 : state.turnNumber;
            const logMessage = `Turn automatically ended for ${state.currentPlayer}. It's ${nextPlayer}'s turn.`;

            Object.values(state.aircrafts).forEach(a => {
                if (a.owner === nextPlayer) {
                    updatedAircrafts[a.id] = { ...a, stats: {...a.stats, actionPoints: a.stats.maxActionPoints, energy: Math.min(a.stats.maxEnergy, a.stats.energy + 10)}};
                }
                 if (a.owner === state.currentPlayer) {
                    updatedAircrafts[a.id] = { ...updatedAircrafts[a.id], specialAbilityCooldown: Math.max(0, a.specialAbilityCooldown -1), statusEffects: a.statusEffects.filter(e => e !== 'empowered')};
                 }
            });

            return {
                ...state,
                currentPlayer: nextPlayer,
                selectedAircraftId: null,
                selectedAction: 'none',
                actionHighlights: [],
                attackableAircraftIds: [],
                supportableAircraftIds: [],
                aircrafts: updatedAircrafts,
                turnNumber: newTurnNumber,
                lastMove: null,
                actionLog: [...state.actionLog, logMessage].slice(-5),
                turnTimeRemaining: TURN_TIME_LIMIT,
            };
        }
        return { ...state, turnTimeRemaining: newTime };
    }
    
    case "START_NEW_WAVE": {
        if (state.mode !== 'survival') return state;
        const newWaveNumber = (state.waveNumber || 1) + 1;
        const { newAircrafts, newGrid } = spawnWave(newWaveNumber, state.grid, state.aircrafts);

        return {
            ...state,
            waveNumber: newWaveNumber,
            aircrafts: newAircrafts,
            grid: newGrid,
            actionLog: [...state.actionLog, `Wave ${newWaveNumber} has started!`].slice(-5),
        };
    }

    default:
      return state;
  }
};

const GamePageContent = () => {
  const searchParams = useSearchParams();
  const challenge = searchParams.get('challenge');
  const modeParam = searchParams.get('mode');
  const mode = (modeParam === 'survival' || modeParam === 'challenge' ? modeParam : 'standard') as GameMode;

  const [state, dispatch] = useReducer(gameReducer, createInitialState(GRID_WIDTH, GRID_HEIGHT, mode, challenge));
  const { toast } = useToast();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const musicAudioRef = useRef<HTMLAudioElement>(null);
  const abilityAudioRef = useRef<HTMLAudioElement>(null);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const tutorialShown = localStorage.getItem('sky-combat-tutorial-shown');
    if (!tutorialShown) {
        setShowTutorial(true);
    }
  }, []);

  const handleTutorialFinish = () => {
      localStorage.setItem('sky-combat-tutorial-shown', 'true');
      setShowTutorial(false);
  }

  const toggleMusic = () => {
    if (musicAudioRef.current) {
        if (isMusicPlaying) {
            musicAudioRef.current.pause();
        } else {
            musicAudioRef.current.play();
        }
        setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };
  
  // This calculates which tiles are visible to the player
  const visibleGrid = useMemo(() => {
    const visible = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(false));
    const playerAircrafts = Object.values(state.aircrafts).filter(a => a.owner === 'player');

    // For the player, calculate visibility based on their aircrafts
    for(const aircraft of playerAircrafts) {
        const {x, y} = aircraft.position;
        const visionRange = aircraft.stats.range + 2; // Vision is slightly larger than attack range

        for(let i = x - visionRange; i <= x + visionRange; i++) {
            for(let j = y - visionRange; j <= y + visionRange; j++) {
                if (i >= 0 && i < GRID_WIDTH && j >= 0 && j < GRID_HEIGHT) {
                    if(Math.abs(x - i) + Math.abs(y - j) <= visionRange) {
                        visible[j][i] = true;
                    }
                }
            }
        }
    }

     if (state.currentPlayer === 'opponent') {
        // During opponent's turn, reveal all tiles for simplicity
        for(let y=0; y < GRID_HEIGHT; y++) {
            for(let x=0; x < GRID_WIDTH; x++) {
                visible[y][x] = true;
            }
        }
    }
    return visible;
  }, [state.aircrafts, state.currentPlayer]);
  
  // This filters the grid to only show aircraft in visible cells
  const playerVisibleGrid = useMemo(() => {
    return state.grid.map((row, y) => {
        return row.map((cell, x) => {
            // During player's turn, only show what's in the visibleGrid
            if (state.currentPlayer === 'player' && visibleGrid[y][x]) {
                return cell;
            }
            // During opponent's turn, show everything.
            if (state.currentPlayer === 'opponent') {
                return cell;
            }
            return null;
        });
    });
  }, [state.grid, visibleGrid, state.currentPlayer]);


  useEffect(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = volume;
    }
    if (abilityAudioRef.current) {
      abilityAudioRef.current.volume = volume;
    }
  }, [volume]);

  // Game Timer
  useEffect(() => {
    if (state.phase === 'playing' && !showTutorial) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.phase, showTutorial]);


  // Play ability sound effect when animation type is heal
  useEffect(() => {
      if((state.animation?.type === 'heal' || state.animation?.type === 'revive' || state.animation?.type === 'levelUp') && abilityAudioRef.current){
          abilityAudioRef.current.currentTime = 0;
          abilityAudioRef.current.play();
      }
  }, [state.animation]);


  const handleCellClick = (x: number, y: number, aircraft: Aircraft | null) => {
    if (state.phase === 'gameOver' || showTutorial) return;

    if (aircraft && aircraft.owner === state.currentPlayer) {
      dispatch({ type: "SELECT_AIRCRAFT", payload: { aircraftId: aircraft.id } });
    } else if (state.selectedAircraftId && state.selectedAction === "move" && !aircraft) {
      if (state.actionHighlights.some(p => p.x === x && p.y === y)) {
        dispatch({ type: "MOVE_AIRCRAFT", payload: { x, y } });
      }
    } else if (state.selectedAircraftId && state.selectedAction === "attack" && aircraft && aircraft.owner !== state.currentPlayer) {
        if (state.attackableAircraftIds.includes(aircraft.id)) {
            dispatch({ type: "ATTACK_AIRCRAFT", payload: { targetId: aircraft.id } });
        }
    } else if (state.selectedAircraftId && state.selectedAction === 'special' && !aircraft) {
        const selectedAircraft = state.aircrafts[state.selectedAircraftId];
        if (selectedAircraft.type === 'support') {
            if (state.actionHighlights.some(p => p.x === x && p.y === y)){
                dispatch({type: "SPECIAL_AIRCRAFT", payload: {position: { x, y }}});
            }
        }
    }
  };

  const handleActionSelect = (action: ActionType) => {
    if (showTutorial) return;
    if (state.selectedAction === action) {
        dispatch({ type: "SELECT_ACTION", payload: { action: 'none' } });
    } else {
        dispatch({ type: "SELECT_ACTION", payload: { action } });
    }
  };
  
  const handleEndTurn = () => {
    if (showTutorial) return;
    dispatch({ type: "END_TURN" });
  };
  
  const handleUndoMove = () => {
    if (showTutorial) return;
    dispatch({ type: "UNDO_MOVE" });
  };

  const handleResetGame = () => {
      setShowGameOverDialog(false);
      dispatch({type: 'RESET_GAME', payload: { mode, challenge }});
  }

  // Game Over Check
  useEffect(() => {
    if (state.phase === 'playing') {
      const playerAircraft = Object.values(state.aircrafts).filter(a => a.owner === 'player');
      const opponentAircraft = Object.values(state.aircrafts).filter(a => a.owner === 'opponent');
      
      if (playerAircraft.length === 0) {
        dispatch({ type: 'SET_GAME_OVER', payload: { winner: 'opponent' } });
         const currentLosses = parseInt(localStorage.getItem('sky-combat-losses') || '0', 10);
         localStorage.setItem('sky-combat-losses', (currentLosses + 1).toString());
         localStorage.setItem('sky-combat-win-streak', '0');
         const currentBattles = parseInt(localStorage.getItem('sky-combat-battles-played') || '0', 10);
         localStorage.setItem('sky-combat-battles-played', (currentBattles + 1).toString());

      } else if (opponentAircraft.length === 0) {
          if(state.mode === 'survival') {
             dispatch({ type: 'START_NEW_WAVE' });
             toast({ title: "Wave Cleared!", description: "The next wave is approaching." });
          } else {
            dispatch({ type: 'SET_GAME_OVER', payload: { winner: 'player' } });
            const currentWinStreak = parseInt(localStorage.getItem('sky-combat-win-streak') || '0', 10);
            localStorage.setItem('sky-combat-win-streak', (currentWinStreak + 1).toString());
            const currentBattles = parseInt(localStorage.getItem('sky-combat-battles-played') || '0', 10);
            localStorage.setItem('sky-combat-battles-played', (currentBattles + 1).toString());
          }
      }
    }
  }, [state.aircrafts, state.phase, state.mode, toast, dispatch]);
  
  // Game Over Dialog trigger
  useEffect(() => {
    if (state.phase === 'gameOver') {
      const timer = setTimeout(() => {
        setShowGameOverDialog(true);
      }, state.winner === 'player' ? 2000 : 500); // Longer delay for victory animation
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.winner]);

  // Opponent Turn Logic
  useEffect(() => {
    if (state.currentPlayer === 'opponent' && state.phase === 'playing' && !showTutorial) {
      const opponentTurn = async () => {
          await new Promise(resolve => setTimeout(resolve, 500));
          toast({ title: "Opponent's Turn", description: "The opponent is making its move." });
          await opponentAI(state, dispatch);
          await new Promise(resolve => setTimeout(resolve, 500));
          dispatch({ type: 'END_TURN' });
          toast({ title: "Your Turn", description: "It's now your turn to act." });
      };
      opponentTurn();
    }
  }, [state.currentPlayer, state.phase, toast, state, showTutorial]);

  // Animation Cleanup
  useEffect(() => {
    if (state.animation) {
        const timer = setTimeout(() => {
            dispatch({ type: 'CLEAR_ANIMATION' });
        }, 700);
        return () => clearTimeout(timer);
    }
  }, [state.animation]);

  const selectedAircraft = state.selectedAircraftId
    ? state.aircrafts[state.selectedAircraftId]
    : null;

  return (
    <main className="relative flex h-screen w-screen flex-col lg:flex-row bg-gradient-to-br from-slate-900 via-black to-slate-900 text-foreground p-4 gap-4 overflow-hidden">
        <VictoryAnimation show={state.phase === 'gameOver' && state.winner === 'player'} />
        <DefeatAnimation show={state.phase === 'gameOver' && state.winner === 'opponent'} />
        <div className={cn("absolute inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-500", 
            state.currentPlayer === 'opponent' && !showTutorial ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}>
            <div className="flex items-center justify-center h-full">
                <p className="text-3xl font-headline text-destructive animate-pulse">Opponent's Turn</p>
            </div>
        </div>
      <audio ref={musicAudioRef} loop>
        <source src="https://www.chosic.com/wp-content/uploads/2021/07/The-Road-To-The-Unknown.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={abilityAudioRef}>
        <source src="https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8b6a31262.mp3?filename=power-up-7103.mp3" type="audio/mpeg" />
      </audio>
      <aside className="w-full lg:w-80 bg-card/50 backdrop-blur-sm text-card-foreground rounded-lg shadow-lg p-4 flex flex-col gap-4 overflow-y-auto">
        <PlayerStats aircraft={selectedAircraft} weather={state.weather} animation={state.animation} />
        <MiniMap gameState={state} />
        <Scoreboard aircrafts={Object.values(state.aircrafts)} destroyedAircrafts={Object.values(state.destroyedAircrafts)} />
        <ActionLog log={state.actionLog} />
      </aside>
      <div className="flex-grow flex items-center justify-center">
        <Battlefield
          grid={state.grid}
          visibleGrid={visibleGrid}
          onCellClick={handleCellClick}
          selectedAircraftId={state.selectedAircraftId}
          actionHighlights={state.actionHighlights}
          attackableAircraftIds={state.attackableAircraftIds}
          supportableAircraftIds={state.supportableAircraftIds}
          animation={state.animation}
          isPlayerTurn={state.currentPlayer === 'player'}
        />
      </div>
      <aside className="w-full lg:w-80 bg-card/50 backdrop-blur-sm text-card-foreground rounded-lg shadow-lg p-4 flex flex-col gap-4 overflow-y-auto">
        <GameControls
          gameState={state}
          onActionSelect={handleActionSelect}
          onEndTurn={handleEndTurn}
          onUndoMove={handleUndoMove}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={toggleMusic}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          isTutorialActive={showTutorial}
        />
      </aside>
      <GameOverDialog 
        isOpen={showGameOverDialog} 
        winner={state.winner}
        onReset={handleResetGame}
        waveNumber={state.waveNumber}
        mode={state.mode}
        summary={state.battleSummary}
      />
      <TutorialDialog isOpen={showTutorial} onFinish={handleTutorialFinish} />
    </main>
  );
}

export default function SkyCombatPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <GamePageContent />
        </React.Suspense>
    )
}
