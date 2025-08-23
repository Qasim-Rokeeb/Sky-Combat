
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DefeatAnimationProps {
  show: boolean;
}

const DefeatAnimation: React.FC<DefeatAnimationProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
      <h1
        className={cn(
          "text-8xl font-black font-headline text-destructive tracking-widest animate-defeat-display",
          "[text-shadow:0_4px_8px_hsl(var(--destructive))]"
        )}
      >
        DEFEAT
      </h1>
    </div>
  );
};

export default DefeatAnimation;
