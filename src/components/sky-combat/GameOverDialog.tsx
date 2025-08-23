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
import type { Player } from "@/types/game";
import { Button } from "../ui/button";
import { RotateCcw } from "lucide-react";
import Link from "next/link";

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
          <AlertDialogTitle className="text-2xl text-center font-headline">
            {winner === "player" ? "Victory!" : "Defeat!"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {winner === "player"
              ? "You have successfully eliminated all enemy aircraft. Well done, commander!"
              : "All your aircraft have been destroyed. Better luck next time."}
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
