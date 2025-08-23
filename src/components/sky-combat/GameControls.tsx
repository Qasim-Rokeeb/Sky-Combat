
"use client";

import React from "react";
import { Crosshair, Move, Home } from "lucide-react";

import type { GameState, ActionType, Aircraft } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StrategyAssistant from "./StrategyAssistant";
import { Progress } from "../ui/progress";
import Link from "next/link";

interface GameControlsProps {
  gameState: GameState;
  onActionSelect: (action: ActionType) => void;
  onEndTurn: () => void;
}

const SelectedAircraftInfo: React.FC<{ aircraft: Aircraft }> = ({ aircraft }) => (
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
);

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onActionSelect,
  onEndTurn,
}) => {
  const selectedAircraft = gameState.selectedAircraftId
    ? gameState.aircrafts[gameState.selectedAircraftId]
    : null;

  const isPlayerTurn = gameState.currentPlayer === "player";
  const canAct = isPlayerTurn && !!selectedAircraft;

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-center font-headline tracking-widest text-primary-foreground animate-glow">Sky Combat</h1>
        <Link href="/">
            <Button variant="outline" size="icon">
                <Home />
            </Button>
        </Link>
      </div>


      <Card className="bg-secondary/50 border-primary/20">
        <CardContent className="p-4 text-center">
            <p className="text-lg font-semibold font-headline">
                Turn: <span className={isPlayerTurn ? 'text-primary' : 'text-destructive'}>{gameState.currentPlayer.toUpperCase()}</span>
            </p>
        </CardContent>
      </Card>

      {selectedAircraft && <SelectedAircraftInfo aircraft={selectedAircraft} />}

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
