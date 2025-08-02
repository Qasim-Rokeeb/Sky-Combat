"use client";

import React from "react";
import { Send, Bomb, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Aircraft as AircraftType, GameAnimation } from "@/types/game";
import { Progress } from "@/components/ui/progress";

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
  const isAttacker = animation?.type === 'attack' && animation.attackerId === aircraft.id;
  const isDefender = animation?.type === 'attack' && animation.defenderId === aircraft.id;

  const healthPercentage = (aircraft.stats.hp / aircraft.stats.maxHp) * 100;

  return (
    <div
      className={cn(
        "relative w-full h-full flex flex-col items-center justify-center p-1 transition-all duration-300 rounded-lg group",
        aircraft.owner === "player" ? "text-primary" : "text-destructive",
        isSelected && "bg-accent/30 scale-110",
        isAttackable && "bg-destructive/50 cursor-crosshair animate-glow",
        isDefender && "animate-shake",
        isAttacker && "animate-flash"
      )}
      data-owner={aircraft.owner}
    >
      <div className={cn(
          "w-8 h-8 md:w-10 md:h-10 transition-transform duration-300",
          "group-hover:scale-110"
        )}>
        {aircraftIcons[aircraft.type]}
      </div>
      <div className="absolute bottom-0 w-full px-1">
        <Progress value={healthPercentage} className="h-1 bg-secondary" />
      </div>
    </div>
  );
};

export default Aircraft;
