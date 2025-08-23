
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
  const healthPercentage = aircraft ? (aircraft.stats.hp / aircraft.stats.maxHp) * 100 : 0;
  const energyPercentage = aircraft ? (aircraft.stats.energy / aircraft.stats.maxEnergy) * 100 : 0;
  const xpPercentage = aircraft ? (aircraft.stats.xp / (100 * aircraft.stats.level)) * 100 : 0;
  
  const getHealthColor = () => {
    if (healthPercentage > 70) return "bg-green-500";
    if (healthPercentage > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4 font-headline tracking-widest text-primary-foreground animate-glow">Aircraft Stats</h2>
      {aircraft ? (
        <Card className="bg-secondary/50 border-primary/20">
          <CardHeader className="p-4">
            <CardTitle className="text-lg capitalize flex items-center justify-between font-headline">
              <div className="flex items-center gap-2">
                {aircraft.type}
                <span className="text-sm font-normal text-muted-foreground">({aircraft.owner})</span>
              </div>
              <span>Lvl. {aircraft.stats.level}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-sm space-y-2">
              <div>
                  <div className="flex justify-between">
                      <span>HP</span>
                      <span>{aircraft.stats.hp} / {aircraft.stats.maxHp}</span>
                  </div>
                  <Progress value={healthPercentage} className="h-2" indicatorClassName={getHealthColor()}/>
              </div>
               <div>
                  <div className="flex justify-between">
                      <span>Energy</span>
                      <span>{aircraft.stats.energy} / {aircraft.stats.maxEnergy}</span>
                  </div>
                  <Progress value={energyPercentage} className="h-2" indicatorClassName="bg-cyan-400"/>
              </div>
              <div>
                  <div className="flex justify-between">
                      <span>XP</span>
                      <span>{aircraft.stats.xp} / {100 * aircraft.stats.level}</span>
                  </div>
                  <Progress value={xpPercentage} className="h-2" indicatorClassName="bg-blue-400"/>
              </div>
              <div className="flex justify-between"><span>Attack:</span> <span>{aircraft.stats.attack}</span></div>
              <div className="flex justify-between"><span>Defense:</span> <span>{aircraft.stats.defense}</span></div>
              <div className="flex justify-between"><span>Range:</span> <span>{aircraft.stats.range}</span></div>
              <div className="flex justify-between"><span>Speed:</span> <span>{aircraft.stats.speed}</span></div>
              <div className="flex justify-between"><span>Crit Chance:</span> <span>{Math.round(aircraft.stats.critChance * 100)}%</span></div>
              <div className="flex justify-between"><span>Crit Damage:</span> <span>{Math.round(aircraft.stats.critDamage * 100)}%</span></div>
              <div className="flex justify-between"><span>Dodge Chance:</span> <span>{Math.round(aircraft.stats.dodgeChance * 100)}%</span></div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-secondary/50 border-primary/20 flex items-center justify-center h-64">
          <CardContent className="p-4 text-center text-muted-foreground">
            <p>Select an aircraft to view its stats.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayerStats;
