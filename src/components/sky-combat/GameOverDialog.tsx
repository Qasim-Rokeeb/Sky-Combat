
"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Home, Star, Swords, ShieldOff, HeartCrack, Timer } from "lucide-react";
import type { Player, GameMode, BattleSummary } from "@/types/game";
import { Button } from "../ui/button";
import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";

interface GameOverDialogProps {
  isOpen: boolean;
  winner: Player | null;
  onReset: () => void;
  mode: GameMode;
  waveNumber?: number;
  summary: BattleSummary | null;
}

const GameOverDialog: React.FC<GameOverDialogProps> = ({ isOpen, winner, onReset, mode, waveNumber, summary }) => {
    const getTitle = () => {
        if (winner === 'player') {
            return mode === 'survival' ? `Victory!` : 'Victory!';
        }
        return 'Defeat!';
    }
    const getDescription = () => {
        if (winner === 'player') {
             return mode === 'survival' 
                ? `You survived ${waveNumber} waves!`
                : 'You have successfully eliminated all enemy aircraft. Well done, commander!';
        }
         return mode === 'survival' 
            ? `You made it to wave ${waveNumber || 0} in survival mode. Better luck next time.`
            : 'Your fleet has been destroyed. Better luck next time, commander.';
    }


  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl text-center font-headline tracking-wider">
            {getTitle()}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {summary && (
            <div className="my-4 space-y-4">
                <Separator />
                <h3 className="text-xl font-headline text-center">Battle Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                     <div>
                        <Timer className="w-8 h-8 mx-auto text-muted-foreground" />
                        <p className="font-bold text-2xl">{summary.totalTurns}</p>
                        <p className="text-sm text-muted-foreground">Total Turns</p>
                    </div>
                    <div>
                        <Swords className="w-8 h-8 mx-auto text-destructive" />
                        <p className="font-bold text-2xl">{summary.opponentAircraftsDestroyed}</p>
                        <p className="text-sm text-muted-foreground">Enemies Defeated</p>
                    </div>
                     <div>
                        <ShieldOff className="w-8 h-8 mx-auto text-primary" />
                        <p className="font-bold text-2xl">{summary.playerAircraftsLost}</p>
                        <p className="text-sm text-muted-foreground">Aircrafts Lost</p>
                    </div>
                     <div>
                        <HeartCrack className="w-8 h-8 mx-auto text-destructive" />
                        <p className="font-bold text-2xl">{summary.totalDamageDealt}</p>
                        <p className="text-sm text-muted-foreground">Damage Dealt</p>
                    </div>
                </div>

                <div className="space-y-2 pt-2">
                    <h4 className="font-semibold text-center text-lg">XP Earned</h4>
                    {summary.playerAircrafts.map(aircraft => (
                        <div key={aircraft.id} className="text-sm">
                            <div className="flex justify-between items-center">
                                <p className="font-medium capitalize">{aircraft.type} (Lvl {aircraft.stats.level})</p>
                                <p className="text-muted-foreground">
                                    +{summary.xpGained[aircraft.id] || 0} XP
                                </p>
                            </div>
                             <Progress value={(aircraft.stats.xp / (100 * aircraft.stats.level)) * 100} className="h-2" indicatorClassName="bg-purple-400" />
                        </div>
                    ))}
                </div>
                <Separator />
            </div>
        )}

        <AlertDialogFooter className="gap-2">
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Main Menu
            </Link>
          </Button>
          <AlertDialogAction onClick={onReset} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Play Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GameOverDialog;
