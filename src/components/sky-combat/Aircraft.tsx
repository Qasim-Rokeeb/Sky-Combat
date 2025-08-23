
"use client";

import React from "react";
import { Send, Bomb, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Aircraft as AircraftType, GameAnimation } from "@/types/game";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AircraftProps {
  aircraft: AircraftType;
  isSelected: boolean;
  isAttackable: boolean;
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
  animation,
}) => {
  const isAttacker =
    animation?.type === "attack" && animation.attackerId === aircraft.id;
  const isDefender =
    animation?.type === "attack" && animation.defenderId === aircraft.id;

  const healthPercentage = (aircraft.stats.hp / aircraft.stats.maxHp) * 100;

  const getHealthColor = () => {
    if (healthPercentage > 70) return "bg-green-500";
    if (healthPercentage > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "relative w-full h-full flex flex-col items-center justify-center p-1 transition-all duration-300 rounded-lg group",
            aircraft.owner === "player" ? "text-primary" : "text-destructive",
            isSelected && "bg-accent/30 scale-110 animate-glow animate-click-highlight",
            isAttackable && "bg-destructive/50 cursor-crosshair animate-glow",
            isDefender && "animate-shake",
            isAttacker && "animate-flash"
          )}
          data-owner={aircraft.owner}
        >
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
      <TooltipContent>
        <p className="capitalize">{aircraft.type}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default Aircraft;
