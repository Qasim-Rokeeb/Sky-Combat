
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { Grid, Aircraft, GameAnimation } from "@/types/game";
import AircraftComponent from "./Aircraft";
import { Bomb } from "lucide-react";

interface BattlefieldProps {
  grid: Grid;
  onCellClick: (x: number, y: number, aircraft: Aircraft | null) => void;
  selectedAircraftId: string | null;
  actionHighlights: { x: number; y: number }[];
  attackableAircraftIds: string[];
  supportableAircraftIds: string[];
  animation: GameAnimation | null;
  isPlayerTurn: boolean;
}

const Battlefield: React.FC<BattlefieldProps> = ({
  grid,
  onCellClick,
  selectedAircraftId,
  actionHighlights,
  attackableAircraftIds,
  supportableAircraftIds,
  animation,
  isPlayerTurn,
}) => {
  // Memoize enemy positions to avoid recalculating on every render
  const enemyPositions = React.useMemo(() => {
    const playerEnemies: Aircraft[] = [];
    const opponentEnemies: Aircraft[] = [];
    grid.flat().forEach(cell => {
      if (cell) {
        if (cell.owner === 'player') opponentEnemies.push(cell);
        else playerEnemies.push(cell);
      }
    });
    return { player: playerEnemies, opponent: opponentEnemies };
  }, [grid]);

  const getIsFlipped = (aircraft: Aircraft) => {
    const enemies = aircraft.owner === 'player' ? enemyPositions.player : enemyPositions.opponent;
    if (enemies.length === 0) return false;

    let closestEnemy: Aircraft | null = null;
    let minDistance = Infinity;

    for (const enemy of enemies) {
      const distance = Math.abs(aircraft.position.x - enemy.position.x) + Math.abs(aircraft.position.y - enemy.position.y);
      if (distance < minDistance) {
        minDistance = distance;
        closestEnemy = enemy;
      }
    }

    if (closestEnemy) {
      // Flip if the closest enemy is to the left. Default sprite faces right.
      return closestEnemy.position.x < aircraft.position.x;
    }
    
    return false;
  };


  return (
    <div className="relative aspect-square w-full max-w-[calc(100vh-4rem)] bg-card/50 backdrop-blur-sm rounded-lg p-2 shadow-inner border border-primary/20">
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
        }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => {
            const isHighlighted = actionHighlights.some(p => p.x === x && p.y === y);
            const aircraftOnCell = grid[y][x];
            const isAttackable = aircraftOnCell ? attackableAircraftIds.includes(aircraftOnCell.id) : false;
            const isSupportable = aircraftOnCell ? supportableAircraftIds.includes(aircraftOnCell.id) : false;

            return (
              <div
                key={`${x}-${y}`}
                className={cn(
                  "border border-primary/10 flex items-center justify-center transition-all duration-300",
                  isPlayerTurn && "cursor-pointer",
                  !isPlayerTurn && !cell && "cursor-not-allowed",
                  isHighlighted ? "bg-primary/30" : "hover:bg-accent/20"
                )}
                onClick={() => isPlayerTurn && onCellClick(x, y, grid[y][x])}
              >
                {aircraftOnCell && (
                  <AircraftComponent
                    aircraft={aircraftOnCell}
                    isSelected={aircraftOnCell.id === selectedAircraftId}
                    isAttackable={isAttackable}
                    isSupportable={isSupportable}
                    animation={animation}
                    isFlipped={getIsFlipped(aircraftOnCell)}
                    onClick={() => isPlayerTurn && onCellClick(x, y, grid[y][x])}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

        {animation?.type === 'finalExplosion' && animation.position && (
            <div 
                className="absolute flex items-center justify-center pointer-events-none"
                style={{
                    left: `${(animation.position.x / grid[0].length) * 100}%`,
                    top: `${(animation.position.y / grid.length) * 100}%`,
                    width: `${(1 / grid[0].length) * 100}%`,
                    height: `${(1 / grid.length) * 100}%`,
                }}
            >
                <div className="text-destructive animate-final-explosion">
                    <Bomb className="w-16 h-16" />
                </div>
            </div>
        )}
    </div>
  );
};

export default Battlefield;
