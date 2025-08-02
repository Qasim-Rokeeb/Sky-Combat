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
import { RotateCcw } from "lucide-react";
import type { Player } from "@/types/game";

interface GameOverDialogProps {
  isOpen: boolean;
  winner: Player | null;
  onReset: () => void;
}

const GameOverDialog: React.FC<GameOverDialogProps> = ({ isOpen, winner, onReset }) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-center">
            {winner === "player" ? "Victory!" : "Defeat!"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {winner === "player"
              ? "You have successfully eliminated all enemy aircraft. Well done, commander!"
              : "All your aircraft have been destroyed. Better luck next time."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
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
