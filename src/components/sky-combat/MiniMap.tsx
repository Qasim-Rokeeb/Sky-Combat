
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { GameState } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor } from "lucide-react";

interface MiniMapProps {
  gameState: GameState;
}

const MiniMap: React.FC<MiniMapProps> = ({ gameState }) => {
  const { grid } = gameState;

  return (
    <Card className="bg-secondary/50 border-primary/20">
      <CardHeader className="p-4">
        <CardTitle className="text-lg flex items-center gap-2 font-headline">
          <Monitor className="text-accent" />
          Mini-Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="aspect-square w-full bg-card/50 rounded-md p-1 border border-primary/20">
          <div
            className="grid h-full w-full"
            style={{
              gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
              gridTemplateRows: `repeat(${grid.length}, 1fr)`,
            }}
          >
            {grid.map((row, y) =>
              row.map((cell, x) => {
                const aircraft = cell;
                return (
                  <div
                    key={`${x}-${y}`}
                    className="flex items-center justify-center"
                  >
                    {aircraft && (
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          aircraft.owner === "player"
                            ? "bg-primary"
                            : "bg-destructive"
                        )}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniMap;
