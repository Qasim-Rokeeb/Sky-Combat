
"use client";

import React from "react";
import { Crosshair, Move, Home, Music, VolumeX, Volume2, ShieldCheck, Zap } from "lucide-react";

import type { GameState, ActionType, Aircraft } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StrategyAssistant from "./StrategyAssistant";
import { Progress } from "../ui/progress";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { Slider } from "../ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { AIRCRAFT_STATS } from "@/lib/game-constants";

interface GameControlsProps {
  gameState: GameState;
  onActionSelect: (action: ActionType) => void;
  onEndTurn: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  volume: number;
  onVolumeChange: (value: number[]) => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onActionSelect,
  onEndTurn,
  isMusicPlaying,
  onToggleMusic,
  volume,
  onVolumeChange,
}) => {
  const selectedAircraft = gameState.selectedAircraftId
    ? gameState.aircrafts[gameState.selectedAircraftId]
    : null;

  const isPlayerTurn = gameState.currentPlayer === "player";
  const canAct = isPlayerTurn && !!selectedAircraft;
  
  const hasSpecialAbility = selectedAircraft?.type === 'support'; // Add other types here later
  const specialAbilityOnCooldown = hasSpecialAbility && selectedAircraft.specialAbilityCooldown > 0;
  const specialAbilityDescription = selectedAircraft ? AIRCRAFT_STATS[selectedAircraft.type].specialAbilityDescription : "";

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-center font-headline tracking-widest text-primary-foreground animate-glow">Sky Combat</h1>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onToggleMusic}>
              {isMusicPlaying ? <Volume2 /> : <VolumeX />}
            </Button>
            <ThemeToggle />
            <Link href="/">
                <Button variant="outline" size="icon">
                    <Home />
                </Button>
            </Link>
        </div>
      </div>

      <Card className="bg-secondary/50 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Volume2 className="text-accent" />
            <Slider
              value={[volume]}
              onValueChange={onVolumeChange}
              max={1}
              step={0.1}
            />
          </div>
        </CardContent>
      </Card>


      <Card className="bg-secondary/50 border-primary/20">
        <CardContent className="p-4 text-center">
            <div className="flex justify-between items-center">
                <p className="text-lg font-semibold font-headline">
                    Turn: <span className="text-primary">{gameState.turnNumber}</span>
                </p>
                <p className="text-lg font-semibold font-headline">
                    Player: <span className={`${isPlayerTurn ? 'text-primary' : 'text-destructive'} animate-glow`}>{gameState.currentPlayer.toUpperCase()}</span>
                </p>
            </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="font-semibold text-center font-headline">Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onActionSelect("move")}
            disabled={!canAct || selectedAircraft!.hasMoved}
            variant={gameState.selectedAction === 'move' ? 'default' : 'secondary'}
          >
            <Move className="mr-2 h-4 w-4" /> Move
          </Button>
          <Button
            onClick={() => onActionSelect("attack")}
            disabled={!canAct || selectedAircraft!.hasAttacked}
            variant={gameState.selectedAction === 'attack' ? 'destructive' : 'secondary'}
          >
            <Crosshair className="mr-2 h-4 w-4" /> Attack
          </Button>
          {hasSpecialAbility && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild className="col-span-2">
                    <Button
                    onClick={() => onActionSelect("special")}
                    disabled={!canAct || selectedAircraft!.hasAttacked || specialAbilityOnCooldown}
                    variant={gameState.selectedAction === 'special' ? 'default' : 'secondary'}
                    >
                    <Zap className="mr-2 h-4 w-4" /> Special Ability
                    {specialAbilityOnCooldown && ` (${selectedAircraft.specialAbilityCooldown})`}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{specialAbilityDescription}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      
      <Button onClick={onEndTurn} disabled={!isPlayerTurn} className="w-full font-bold">
        End Turn
      </Button>
      
      <Separator />

      <StrategyAssistant gameState={gameState} />
    </div>
  );
};

export default GameControls;
