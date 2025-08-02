"use client";

import React, { useState } from "react";
import { Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStrategySuggestion } from "@/ai/flows/strategy-ai-assistant";
import type { GameState } from "@/types/game";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

interface StrategyAssistantProps {
  gameState: GameState;
}

const StrategyAssistant: React.FC<StrategyAssistantProps> = ({ gameState }) => {
  const [suggestion, setSuggestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setSuggestion("");

    const simplifiedAircrafts = Object.values(gameState.aircrafts).map((a) => ({
      id: a.id,
      owner: a.owner,
      type: a.type,
      hp: a.stats.hp,
      position: a.position,
      canMove: !a.hasMoved,
      canAttack: !a.hasAttacked,
    }));

    const serializedState = JSON.stringify(
      {
        currentPlayer: gameState.currentPlayer,
        playerAircrafts: simplifiedAircrafts.filter(a => a.owner === 'player'),
        opponentAircrafts: simplifiedAircrafts.filter(a => a.owner === 'opponent'),
        selectedAircraftId: gameState.selectedAircraftId,
      },
      null,
      2
    );

    try {
      const result = await getStrategySuggestion({ gameState: serializedState });
      if (result.suggestion) {
        setSuggestion(result.suggestion);
      }
    } catch (error) {
      console.error("Error getting suggestion:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch AI suggestion.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex-grow flex flex-col bg-secondary/50 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-headline">
          <Lightbulb className="text-accent" />
          Strategy Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="text-sm text-muted-foreground min-h-[6rem]">
            {isLoading && (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-primary/20" />
                    <Skeleton className="h-4 w-full bg-primary/20" />
                    <Skeleton className="h-4 w-3/4 bg-primary/20" />
                </div>
            )}
            {suggestion && <p>{suggestion}</p>}
            {!isLoading && !suggestion && <p>Click for a strategic tip from our AI assistant.</p>}
        </div>
        <Button
          onClick={handleGetSuggestion}
          disabled={isLoading || gameState.currentPlayer !== 'player'}
          className="w-full mt-4"
          variant="outline"
        >
          {isLoading ? "Analyzing..." : "Get AI Suggestion"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StrategyAssistant;
