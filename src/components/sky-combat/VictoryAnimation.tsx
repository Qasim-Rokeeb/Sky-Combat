
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface VictoryAnimationProps {
  show: boolean;
}

const VictoryAnimation: React.FC<VictoryAnimationProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
      <h1
        className={cn(
          "text-8xl font-black font-headline text-primary-foreground tracking-widest animate-victory-display",
          "[text-shadow:0_4px_8px_hsl(var(--primary))]"
        )}
      >
        VICTORY!
      </h1>
    </div>
  );
};

export default VictoryAnimation;
