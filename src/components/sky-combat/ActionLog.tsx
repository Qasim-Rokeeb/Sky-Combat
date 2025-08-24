
"use client";

import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListCollapse } from "lucide-react";

interface ActionLogProps {
  log: string[];
}

const ActionLog: React.FC<ActionLogProps> = ({ log }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // The DOM element for the viewport is the first child of the ref's current value
        const viewport = scrollAreaRef.current.querySelector(':scope > div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [log]);

  return (
    <Card className="bg-secondary/50 border-primary/20 flex-grow flex flex-col">
      <CardHeader className="p-4">
        <CardTitle className="text-lg flex items-center gap-2 font-headline">
          <ListCollapse className="text-accent" />
          Action Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <ScrollArea className="h-24 w-full rounded-md border border-primary/20 bg-background/30 p-2" ref={scrollAreaRef}>
          <div className="flex flex-col gap-1 text-xs">
            {log.map((entry, index) => (
              <p key={index} className="leading-relaxed">
                <span className="text-muted-foreground mr-1">{index + 1}:</span>
                {entry}
              </p>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActionLog;
