
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Aircraft } from "@/types/game";
import { Shield, Bomb, Send, Heart, Swords, ShieldCheck as DefenseShield, Star, Skull } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ScoreboardProps {
  aircrafts: Aircraft[];
  destroyedAircrafts: Aircraft[];
}

const aircraftIcons = {
  fighter: <Send className="w-4 h-4" />,
  bomber: <Bomb className="w-4 h-4" />,
  support: <Shield className="w-4 h-4" />,
};

const Scoreboard: React.FC<ScoreboardProps> = ({ aircrafts, destroyedAircrafts }) => {
  const playerAircrafts = aircrafts.filter((a) => a.owner === "player");
  const opponentAircrafts = aircrafts.filter((a) => a.owner === "opponent");
  const playerDestroyed = destroyedAircrafts.filter(a => a.owner === 'player');
  const opponentDestroyed = destroyedAircrafts.filter(a => a.owner === 'opponent');

  const renderAircraftRow = (aircraft: Aircraft) => (
    <TableRow key={aircraft.id} className="text-xs">
      <TableCell className="p-2">
        <div className={aircraft.owner === 'player' ? 'text-primary' : 'text-destructive'}>
          {aircraftIcons[aircraft.type]}
        </div>
      </TableCell>
      <TableCell className="p-2">{aircraft.stats.hp}/{aircraft.stats.maxHp}</TableCell>
      <TableCell className="p-2">{aircraft.stats.attack}</TableCell>
      <TableCell className="p-2">{aircraft.stats.defense}</TableCell>
      <TableCell className="p-2">{aircraft.stats.level}</TableCell>
    </TableRow>
  );

  const renderDestroyedRow = (aircraft: Aircraft) => (
     <TableRow key={aircraft.id} className="text-xs opacity-50">
      <TableCell className="p-2">
        <div className={aircraft.owner === 'player' ? 'text-primary' : 'text-destructive'}>
            <Skull className="w-4 h-4" />
        </div>
      </TableCell>
      <TableCell className="p-2" colSpan={4}>{aircraft.type} (Destroyed)</TableCell>
     </TableRow>
  )

  return (
    <Card className="bg-secondary/50 border-primary/20">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-headline">Scoreboard</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <TooltipProvider>
            <div className="space-y-4">
            <div>
                <h4 className="font-semibold mb-2 text-primary">Player Fleet</h4>
                <Table>
                <TableHeader>
                    <TableRow className="text-xs">
                        <TableHead className="p-1"><Tooltip><TooltipTrigger>Type</TooltipTrigger><TooltipContent>Aircraft Type</TooltipContent></Tooltip></TableHead>
                        <TableHead className="p-1"><Tooltip><TooltipTrigger><Heart className="w-4 h-4"/></TooltipTrigger><TooltipContent>Health</TooltipContent></Tooltip></TableHead>
                        <TableHead className="p-1"><Tooltip><TooltipTrigger><Swords className="w-4 h-4"/></TooltipTrigger><TooltipContent>Attack</TooltipContent></Tooltip></TableHead>
                        <TableHead className="p-1"><Tooltip><TooltipTrigger><DefenseShield className="w-4 h-4"/></TooltipTrigger><TooltipContent>Defense</TooltipContent></Tooltip></TableHead>
                        <TableHead className="p-1"><Tooltip><TooltipTrigger><Star className="w-4 h-4"/></TooltipTrigger><TooltipContent>Level</TooltipContent></Tooltip></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {playerAircrafts.map(renderAircraftRow)}
                    {playerDestroyed.map(renderDestroyedRow)}
                </TableBody>
                </Table>
            </div>
            <div>
                <h4 className="font-semibold mb-2 text-destructive">Opponent Fleet</h4>
                <Table>
                <TableHeader>
                    <TableRow className="text-xs">
                        <TableHead className="p-1"><Tooltip><TooltipTrigger>Type</TooltipTrigger><TooltipContent>Aircraft Type</TooltipContent></Tooltip></TableHead>
                        <TableHead className="p-1"><Tooltip><TooltipTrigger><Heart className="w-4 h-4"/></TooltipTrigger><TooltipContent>Health</TooltipContent></Tooltip></TableHead>
                        <TableHead className="p-1"><Tooltip><TooltipTrigger><Swords className="w-4 h-4"/></TooltipTrigger><TooltipContent>Attack</TooltipContent></Tooltip></TableHead>
                        <TableHead className="p-1"><Tooltip><TooltipTrigger><DefenseShield className="w-4 h-4"/></TooltipTrigger><TooltipContent>Defense</TooltipContent></Tooltip></TableHead>
                        <TableHead className="p-1"><Tooltip><TooltipTrigger><Star className="w-4 h-4"/></TooltipTrigger><TooltipContent>Level</TooltipContent></Tooltip></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {opponentAircrafts.map(renderAircraftRow)}
                    {opponentDestroyed.map(renderDestroyedRow)}
                </TableBody>
                </Table>
            </div>
            </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default Scoreboard;
