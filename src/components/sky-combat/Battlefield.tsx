"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { Grid, Aircraft, GameAnimation } from "@/types/game";
import AircraftComponent from "./Aircraft";

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
  return (
    <div className="aspect-square w-full max-w-[calc(100vh-4rem)] bg-card/50 backdrop-blur-sm rounded-lg p-2 shadow-inner border border-primary/20">
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
                  "border border-primary/10 flex items-center justify-center transition-all duration-300 hover:scale-105",
                  (isPlayerTurn || (cell && cell.owner === 'player')) && "cursor-pointer",
                  !isPlayerTurn && "cursor-not-allowed",
                  isHighlighted ? "bg-primary/30" : "hover:bg-accent/20"
                )}
                onClick={() => isPlayerTurn && onCellClick(x, y, grid[y][x])}
              >
                {grid[y][x] && (
                  <AircraftComponent
                    aircraft={grid[y][x]!}
                    isSelected={grid[y][x]!.id === selectedAircraftId}
                    isAttackable={isAttackable}
                    isSupportable={isSupportable}
                    animation={animation}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Battlefield;
