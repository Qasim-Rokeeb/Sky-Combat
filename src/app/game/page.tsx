
"use client";

import React, { useCallback, useEffect, useReducer, useState } from "react";
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
} from "@/types/game";
import { createInitialState, opponentAI } from "@/lib/game-utils";
import Battlefield from "@/components/sky-combat/Battlefield";
import GameControls from "@/components/sky-combat/GameControls";
import GameOverDialog from "@/components/sky-combat/GameOverDialog";
import { useToast } from "@/hooks/use-toast";
import PlayerStats from "@/components/sky-combat/PlayerStats";
import MiniMap from "@/components/sky-combat/MiniMap";

type GameAction =
  | { type: "SELECT_AIRCRAFT"; payload: { aircraftId: string } }
  | { type: "SELECT_ACTION"; payload: { action: ActionType } }
  | { type: "MOVE_AIRCRAFT"; payload: { x: number; y: number } }
  | { type: "ATTACK_AIRCRAFT"; payload: { targetId: string } }
  | { type: "END_TURN" }
  | { type: "START_OPPONENT_TURN" }
  | { type: "SET_GAME_OVER"; payload: { winner: Player | null } }
  | { type: "RESET_GAME" }
  | { type: "SHOW_ANIMATION"; payload: { attackerId: string, defenderId: string } }
  | { type: "CLEAR_ANIMATION" };

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
      };
    }

    case "SELECT_ACTION": {
      if (!state.selectedAircraftId) return state;
      const { action } = action.payload;
      const aircraft = state.aircrafts[state.selectedAircraftId];

      if (action === "move" && !aircraft.hasMoved) {
        const highlights = [];
        for (let i = -aircraft.stats.speed; i <= aircraft.stats.speed; i++) {
          for (let j = -aircraft.stats.speed; j <= aircraft.stats.speed; j++) {
            if (Math.abs(i) + Math.abs(j) <= aircraft.stats.speed && Math.abs(i) + Math.abs(j) !== 0) {
              const newX = aircraft.position.x + i;
              const newY = aircraft.position.y + j;
              if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT && !state.grid[newY][newX]) {
                highlights.push({ x: newX, y: newY });
              }
            }
          }
        }
        return { ...state, selectedAction: "move", actionHighlights: highlights, attackableAircraftIds: [] };
      }

      if (action === "attack" && !aircraft.hasAttacked) {
        const attackable = Object.values(state.aircrafts).filter(target => {
          if (target.owner === state.currentPlayer) return false;
          const distance = Math.abs(target.position.x - aircraft.position.x) + Math.abs(target.position.y - aircraft.position.y);
          return distance <= aircraft.stats.range;
        }).map(a => a.id);
        return { ...state, selectedAction: "attack", actionHighlights: [], attackableAircraftIds: attackable };
      }
      return {
        ...state,
        selectedAction: "none",
        actionHighlights: [],
        attackableAircraftIds: []
      };
    }

    case "MOVE_AIRCRAFT": {
      if (!state.selectedAircraftId || state.selectedAction !== "move") return state;
      const { x, y } = action.payload;
      const aircraft = state.aircrafts[state.selectedAircraftId];

      const newGrid: Grid = state.grid.map(row => [...row]);
      newGrid[aircraft.position.y][aircraft.position.x] = null;
      newGrid[y][x] = aircraft;

      const updatedAircraft = { ...aircraft, position: { x, y }, hasMoved: true };
      
      return {
        ...state,
        grid: newGrid,
        aircrafts: { ...state.aircrafts, [state.selectedAircraftId]: updatedAircraft },
        selectedAction: "none",
        actionHighlights: [],
      };
    }

    case "ATTACK_AIRCRAFT": {
      if (!state.selectedAircraftId || state.selectedAction !== "attack") return state;
      const { targetId } = action.payload;
      const attacker = state.aircrafts[state.selectedAircraftId];
      const defender = state.aircrafts[targetId];

      const damage = Math.max(1, attacker.stats.attack - defender.stats.defense);
      const newHp = defender.stats.hp - damage;

      const updatedAircrafts = { ...state.aircrafts };
      updatedAircrafts[attacker.id] = { ...attacker, hasAttacked: true };

      let newGrid = state.grid.map(row => [...row]);
      if (newHp <= 0) {
        delete updatedAircrafts[targetId];
        newGrid[defender.position.y][defender.position.x] = null;
      } else {
        updatedAircrafts[targetId] = { ...defender, stats: { ...defender.stats, hp: newHp } };
      }

      return {
        ...state,
        aircrafts: updatedAircrafts,
        grid: newGrid,
        selectedAction: "none",
        attackableAircraftIds: [],
        animation: { type: 'attack', attackerId: attacker.id, defenderId: defender.id },
      };
    }
    
    case "END_TURN": {
        const nextPlayer = state.currentPlayer === 'player' ? 'opponent' : 'player';
        const updatedAircrafts = { ...state.aircrafts };
        Object.values(state.aircrafts).forEach(a => {
            if (a.owner === nextPlayer) {
                updatedAircrafts[a.id] = { ...a, hasMoved: false, hasAttacked: false };
            }
        });

        return {
            ...state,
            currentPlayer: nextPlayer,
            selectedAircraftId: null,
            selectedAction: 'none',
            actionHighlights: [],
            attackableAircraftIds: [],
            aircrafts: updatedAircrafts,
            turnNumber: nextPlayer === 'player' ? state.turnNumber + 1 : state.turnNumber,
        };
    }

    case "SET_GAME_OVER":
        return { ...state, phase: 'gameOver', winner: action.payload.winner };

    case "RESET_GAME":
        return createInitialState(GRID_WIDTH, GRID_HEIGHT);
    
    case "SHOW_ANIMATION":
        return {...state, animation: {type: 'attack', attackerId: action.payload.attackerId, defenderId: action.payload.defenderId}};

    case "CLEAR_ANIMATION":
        return {...state, animation: null};

    default:
      return state;
  }
};

export default function SkyCombatPage() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState(GRID_WIDTH, GRID_HEIGHT));
  const { toast } = useToast();

  const handleCellClick = (x: number, y: number, aircraft: Aircraft | null) => {
    if (state.phase === 'gameOver') return;

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
    }
  };

  const handleActionSelect = (action: ActionType) => {
    if (state.selectedAction === action) {
        dispatch({ type: "SELECT_ACTION", payload: { action: 'none' } });
    } else {
        dispatch({ type: "SELECT_ACTION", payload: { action } });
    }
  };
  
  const handleEndTurn = () => {
    dispatch({ type: "END_TURN" });
  };
  
  const handleResetGame = () => {
      dispatch({type: 'RESET_GAME'});
  }

  // Game Over Check
  useEffect(() => {
    const playerAircraft = Object.values(state.aircrafts).filter(a => a.owner === 'player');
    const opponentAircraft = Object.values(state.aircrafts).filter(a => a.owner === 'opponent');
    if (playerAircraft.length === 0) {
      dispatch({ type: 'SET_GAME_OVER', payload: { winner: 'opponent' } });
    } else if (opponentAircraft.length === 0) {
      dispatch({ type: 'SET_GAME_OVER', payload: { winner: 'player' } });
    }
  }, [state.aircrafts]);

  // Opponent Turn Logic
  useEffect(() => {
    if (state.currentPlayer === 'opponent' && state.phase === 'playing') {
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
  }, [state.currentPlayer, state.phase, toast]);

  // Animation Cleanup
  useEffect(() => {
    if (state.animation) {
        const timer = setTimeout(() => {
            dispatch({ type: 'CLEAR_ANIMATION' });
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [state.animation]);

  const selectedAircraft = state.selectedAircraftId
    ? state.aircrafts[state.selectedAircraftId]
    : null;

  return (
    <main className="flex h-screen w-screen flex-col lg:flex-row bg-gradient-to-b from-blue-900 via-purple-900 to-gray-900 text-foreground p-4 gap-4 overflow-hidden">
      <aside className="w-full lg:w-80 bg-card/50 backdrop-blur-sm text-card-foreground rounded-lg shadow-lg p-4 flex flex-col gap-4 overflow-y-auto">
        <PlayerStats aircraft={selectedAircraft} />
        <MiniMap gameState={state} />
      </aside>
      <div className="flex-grow flex items-center justify-center">
        <Battlefield
          grid={state.grid}
          onCellClick={handleCellClick}
          selectedAircraftId={state.selectedAircraftId}
          actionHighlights={state.actionHighlights}
          attackableAircraftIds={state.attackableAircraftIds}
          animation={state.animation}
          isPlayerTurn={state.currentPlayer === 'player'}
        />
      </div>
      <aside className="w-full lg:w-80 bg-card/50 backdrop-blur-sm text-card-foreground rounded-lg shadow-lg p-4 flex flex-col gap-4 overflow-y-auto">
        <GameControls
          gameState={state}
          onActionSelect={handleActionSelect}
          onEndTurn={handleEndTurn}
        />
      </aside>
      <GameOverDialog 
        isOpen={state.phase === 'gameOver'} 
        winner={state.winner}
        onReset={handleResetGame}
      />
    </main>
  );
}

    