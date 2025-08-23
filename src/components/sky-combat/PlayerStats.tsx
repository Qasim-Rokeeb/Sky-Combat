
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Aircraft } from "@/types/game";
import { Skeleton } from "../ui/skeleton";

interface PlayerStatsProps {
  aircraft: Aircraft | null;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ aircraft }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4 font-headline tracking-widest text-primary-foreground animate-glow">Aircraft Stats</h2>
      {aircraft ? (
        <Card className="bg-secondary/50 border-primary/20">
          <CardHeader className="p-4">
            <CardTitle className="text-lg capitalize flex items-center gap-2 font-headline">
              {aircraft.type}
              <span className="text-sm font-normal text-muted-foreground">({aircraft.owner})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-sm space-y-2">
              <div>
                  <div className="flex justify-between">
                      <span>HP</span>
                      <span>{aircraft.stats.hp} / {aircraft.stats.maxHp}</span>
                  </div>
                  <Progress value={(aircraft.stats.hp / aircraft.stats.maxHp) * 100} className="h-2"/>
              </div>
              <div className="flex justify-between"><span>Attack:</span> <span>{aircraft.stats.attack}</span></div>
              <div className="flex justify-between"><span>Defense:</span> <span>{aircraft.stats.defense}</span></div>
              <div className="flex justify-between"><span>Range:</span> <span>{aircraft.stats.range}</span></div>
              <div className="flex justify-between"><span>Speed:</span> <span>{aircraft.stats.speed}</span></div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-secondary/50 border-primary/20 flex items-center justify-center h-48">
          <CardContent className="p-4 text-center text-muted-foreground">
            <p>Select an aircraft to view its stats.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayerStats;
