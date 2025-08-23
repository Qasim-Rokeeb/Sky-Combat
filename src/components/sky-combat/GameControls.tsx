
"use client";

import React from "react";
import { Crosshair, Move, Home, Music, VolumeX, Volume2, ShieldCheck, Zap, Undo2, BrainCircuit, Timer } from "lucide-react";

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
import { AIRCRAFT_STATS, TURN_TIME_LIMIT } from "@/lib/game-constants";
import { cn } from "@/lib/utils";

interface GameControlsProps {
  gameState: GameState;
  onActionSelect: (action: ActionType) => void;
  onEndTurn: () => void;
  onUndoMove: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  volume: number;
  onVolumeChange: (value: number[]) => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onActionSelect,
  onEndTurn,
  onUndoMove,
  isMusicPlaying,
  onToggleMusic,
  volume,
  onVolumeChange,
}) => {
  const selectedAircraft = gameState.selectedAircraftId
    ? gameState.aircrafts[gameState.selectedAircraftId]
    : null;

  const isPlayerTurn = gameState.currentPlayer === "player";
  const canAct = isPlayerTurn && selectedAircraft && selectedAircraft.stats.actionPoints > 0;
  
  const hasSpecialAbility = selectedAircraft?.type === 'support'; // Add other types here later
  const specialAbilityOnCooldown = hasSpecialAbility && selectedAircraft.specialAbilityCooldown > 0;
  const hasEnoughEnergy = selectedAircraft && selectedAircraft.stats.energy >= selectedAircraft.stats.specialAbilityCost;
  const specialAbilityDescription = selectedAircraft ? `${AIRCRAFT_STATS[selectedAircraft.type].specialAbilityDescription} (Cost: ${AIRCRAFT_STATS[selectedAircraft.type].specialAbilityCost} Energy, 1 AP)` : "";

  const canUndo = isPlayerTurn && gameState.lastMove?.aircraftId === selectedAircraft?.id;
  
  const timerPercentage = (gameState.turnTimeRemaining / TURN_TIME_LIMIT) * 100;


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
            <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-semibold font-headline">
                    Turn: <span className="text-primary">{gameState.turnNumber}</span>
                </p>
                <div className="flex items-center gap-2 text-lg font-semibold font-headline">
                  <Timer className={cn("w-6 h-6", gameState.turnTimeRemaining <= 5 && "text-destructive animate-pulse")} />
                  <span className={cn(gameState.turnTimeRemaining <= 5 && "text-destructive animate-pulse")}>
                    {gameState.turnTimeRemaining}s
                  </span>
                </div>
                <p className="text-lg font-semibold font-headline">
                    Player: <span className={`${isPlayerTurn ? 'text-primary' : 'text-destructive'} animate-glow`}>{gameState.currentPlayer.toUpperCase()}</span>
                </p>
            </div>
             <div className={cn("relative transition-all duration-300", isPlayerTurn ? "max-h-0 opacity-0" : "max-h-20 opacity-100")}>
                <div className="flex items-center justify-center gap-2 text-2xl font-headline text-destructive animate-pulse">
                    <BrainCircuit className="w-8 h-8" />
                    <p>AI's Turn</p>
                </div>
            </div>
             <Progress value={timerPercentage} className="h-1 bg-primary/20" indicatorClassName="bg-primary" />
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="font-semibold text-center font-headline">Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2 relative">
            <Button
              onClick={() => onActionSelect("move")}
              disabled={!canAct}
              variant={gameState.selectedAction === 'move' ? 'default' : 'secondary'}
              className="w-full"
            >
              <Move className="mr-2 h-4 w-4" /> Move (1 AP)
            </Button>
            {canUndo && (
              <Button
                onClick={onUndoMove}
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              >
                <Undo2 />
              </Button>
            )}
          </div>
          <Button
            onClick={() => onActionSelect("attack")}
            disabled={!canAct}
            variant={gameState.selectedAction === 'attack' ? 'destructive' : 'secondary'}
          >
            <Crosshair className="mr-2 h-4 w-4" /> Attack (1 AP)
          </Button>
          {hasSpecialAbility && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                    <div className="col-span-2">
                        <Button
                        onClick={() => onActionSelect("special")}
                        disabled={!canAct || specialAbilityOnCooldown || !hasEnoughEnergy}
                        variant={gameState.selectedAction === 'special' ? 'default' : 'secondary'}
                        className="w-full"
                        >
                        <Zap className="mr-2 h-4 w-4" /> Special Ability
                        {specialAbilityOnCooldown && ` (${selectedAircraft.specialAbilityCooldown})`}
                        </Button>
                    </div>
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
