
"use client";

import React from "react";
import { Send, Bomb, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Aircraft as AircraftType, GameAnimation } from "@/types/game";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AircraftProps {
  aircraft: AircraftType;
  isSelected: boolean;
  isAttackable: boolean;
  isSupportable: boolean;
  animation: GameAnimation | null;
}

const aircraftIcons: Record<AircraftType["type"], React.ReactNode> = {
  fighter: <Send className="w-full h-full" />,
  bomber: <Bomb className="w-full h-full" />,
  support: <Shield className="w-full h-full" />,
};

const Aircraft: React.FC<AircraftProps> = ({
  aircraft,
  isSelected,
  isAttackable,
  isSupportable,
  animation,
}) => {
  const isAttacker =
    (animation?.type === "attack" || animation?.type === 'heal') && animation.attackerId === aircraft.id;
  const isDefender =
    (animation?.type === "attack" || animation?.type === 'heal') && animation.defenderId === aircraft.id;
  const isDestroyed = aircraft.stats.hp <= 0;


  const healthPercentage = (aircraft.stats.hp / aircraft.stats.maxHp) * 100;

  const getHealthColor = () => {
    if (healthPercentage > 70) return "bg-green-500";
    if (healthPercentage > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative w-full h-full flex flex-col items-center justify-center p-1 transition-all duration-300 rounded-lg group",
              aircraft.owner === "player" ? "text-primary" : "text-destructive",
              isSelected && "bg-accent/30 scale-110 animate-glow",
              isAttackable && "bg-destructive/50 cursor-crosshair animate-glow",
              isSupportable && "bg-green-500/50 cursor-pointer animate-glow",
              isDefender && animation?.type === 'attack' && "animate-shake",
              isAttacker && "animate-flash",
              isDefender && animation?.type === 'heal' && 'animate-heal',
              isDestroyed && "animate-destroy"
            )}
            data-owner={aircraft.owner}
          >
            {isDefender && animation?.damage && (
              <div className="absolute -top-6 text-destructive font-bold text-lg animate-damage-popup">
                -{animation.damage}
              </div>
            )}
            {isDefender && animation?.healAmount && (
              <div className="absolute -top-6 text-green-400 font-bold text-lg animate-damage-popup">
                +{animation.healAmount}
              </div>
            )}
            <div
              className={cn(
                "w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 [filter:drop-shadow(0_2px_2px_rgba(0,0,0,0.4))]",
                "group-hover:scale-110"
              )}
            >
              {aircraftIcons[aircraft.type]}
            </div>
            <div className="absolute bottom-0 w-full px-1">
              <Progress
                value={healthPercentage}
                className="h-1 bg-secondary"
                indicatorClassName={getHealthColor()}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-48 p-2">
            <div className="font-bold capitalize text-lg mb-2">{aircraft.type}</div>
            <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                    <span>HP:</span>
                    <span>{aircraft.stats.hp} / {aircraft.stats.maxHp}</span>
                </div>
                <div className="flex justify-between">
                    <span>Attack:</span>
                    <span>{aircraft.stats.attack}</span>
                </div>
                <div className="flex justify-between">
                    <span>Defense:</span>
                    <span>{aircraft.stats.defense}</span>
                </div>
                <div className="flex justify-between">
                    <span>Range:</span>
                    <span>{aircraft.stats.range}</span>
                </div>
                <div className="flex justify-between">
                    <span>Speed:</span>
                    <span>{aircraft.stats.speed}</span>
                </div>
            </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Aircraft;
