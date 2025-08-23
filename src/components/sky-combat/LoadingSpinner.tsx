
"use client";

import { Rocket } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Rocket className="w-8 h-8 text-primary animate-spin-slow" />
      <p className="text-sm text-muted-foreground">Analyzing battlefield...</p>
    </div>
  );
};

export default LoadingSpinner;
