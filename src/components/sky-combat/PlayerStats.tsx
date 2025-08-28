
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Aircraft, WeatherCondition, GameAnimation } from "@/types/game";
import { Skeleton } from "../ui/skeleton";
import { Sun, Wind, CloudLightning } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerStatsProps {
  aircraft: Aircraft | null;
  weather: WeatherCondition;
  animation: GameAnimation | null;
}

const weatherIcons: Record<WeatherCondition, React.ReactNode> = {
    "Clear Skies": <Sun className="w-5 h-5 text-yellow-400" />,
    "Strong Winds": <Wind className="w-5 h-5 text-gray-400" />,
    "Thunderstorm": <CloudLightning className="w-5 h-5 text-purple-400" />,
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ aircraft, weather, animation }) => {
  const healthPercentage = aircraft ? (aircraft.stats.hp / aircraft.stats.maxHp) * 100 : 0;
  const energyPercentage = aircraft ? (aircraft.stats.energy / aircraft.stats.maxEnergy) * 100 : 0;
  const xpPercentage = aircraft ? (aircraft.stats.xp / (100 * aircraft.stats.level)) * 100 : 0;
  const apPercentage = aircraft ? (aircraft.stats.actionPoints / aircraft.stats.maxActionPoints) * 100 : 0;
  
  const getHealthColor = () => {
    if (healthPercentage > 70) return "bg-green-500";
    if (healthPercentage > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const displayRange = aircraft ? (weather === 'Thunderstorm' ? aircraft.stats.range -1 : aircraft.stats.range) : 0;
  const displayDodge = aircraft ? (weather === 'Strong Winds' ? aircraft.stats.dodgeChance + 0.15 : aircraft.stats.dodgeChance) : 0;
  
  const isLevelingUp = animation?.type === 'levelUp' && animation?.aircraftId === aircraft?.id;

  return (
    <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold font-headline tracking-widest text-primary-foreground animate-glow">Aircraft Stats</h2>
          <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-lg border-primary/20">
            {weatherIcons[weather]}
            <span className="text-sm font-semibold">{weather}</span>
          </div>
        </div>
      {aircraft ? (
        <Card className={cn("bg-secondary/50 border-primary/20", animation?.type === 'levelUp' && animation.aircraftId === aircraft.id && "animate-level-up-glow")}>
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
                      <span>Action Points</span>
                      <span>{aircraft.stats.actionPoints} / {aircraft.stats.maxActionPoints}</span>
                  </div>
                  <Progress value={apPercentage} className="h-2" indicatorClassName="bg-yellow-400"/>
              </div>
               <div>
                  <div className="flex justify-between">
                      <span>Energy</span>
                      <span>{aircraft.stats.energy} / {aircraft.stats.maxEnergy}</span>
                  </div>
                  <Progress value={energyPercentage} className="h-2" indicatorClassName="bg-primary"/>
              </div>
              <div>
                  <div className="flex justify-between">
                      <span>XP</span>
                      <span>{aircraft.stats.xp} / {100 * aircraft.stats.level}</span>
                  </div>
                  <Progress value={xpPercentage} className="h-2" indicatorClassName="bg-purple-400"/>
              </div>
              <div className="flex justify-between"><span>Attack:</span> <span>{aircraft.stats.attack}</span></div>
              <div className="flex justify-between"><span>Defense:</span> <span>{aircraft.stats.defense}</span></div>
              <div className="flex justify-between">
                <span>Range:</span> 
                <span>
                    {displayRange} 
                    {weather === 'Thunderstorm' && <span className="text-destructive text-xs"> (-1)</span>}
                </span>
              </div>
              <div className="flex justify-between"><span>Speed:</span> <span>{aircraft.stats.speed}</span></div>
              <div className="flex justify-between"><span>Crit Chance:</span> <span>{Math.round(aircraft.stats.critChance * 100)}%</span></div>
              <div className="flex justify-between"><span>Crit Damage:</span> <span>{Math.round(aircraft.stats.critDamage * 100)}%</span></div>
              <div className="flex justify-between">
                <span>Dodge Chance:</span> 
                <span>
                    {Math.round(displayDodge * 100)}% 
                    {weather === 'Strong Winds' && <span className="text-primary text-xs"> (+15%)</span>}
                </span>
              </div>
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
