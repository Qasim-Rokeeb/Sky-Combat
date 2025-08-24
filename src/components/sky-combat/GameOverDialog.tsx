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
import { Home } from "lucide-react";
import type { Player, GameMode } from "@/types/game";
import { Button } from "../ui/button";
import { RotateCcw } from "lucide-react";
import Link from "next/link";

interface GameOverDialogProps {
  isOpen: boolean;
  winner: Player | null;
  onReset: () => void;
  mode: GameMode;
  waveNumber?: number;
}

const GameOverDialog: React.FC<GameOverDialogProps> = ({ isOpen, winner, onReset, mode, waveNumber }) => {
    const getTitle = () => {
        if (winner === 'player') {
            return mode === 'survival' ? `You Survived Wave ${waveNumber}!` : 'Victory!';
        }
        return 'Defeat!';
    }
    const getDescription = () => {
        if (winner === 'player') {
            return mode === 'survival' 
                ? 'You live to fight another day.'
                : 'You have successfully eliminated all enemy aircraft. Well done, commander!';
        }
        return `You made it to wave ${waveNumber} in survival mode. Better luck next time.`;
    }


  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-center font-headline">
            {getTitle()}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Main Menu
            </Link>
          </Button>
          <AlertDialogAction onClick={onReset} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Replay
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GameOverDialog;
