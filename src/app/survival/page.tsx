
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Swords, Users, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SurvivalPage() {

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-foreground bg-clouds">
      <header className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold font-headline tracking-widest text-primary-foreground animate-glow">
          Survival Mode
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          How long can you last against endless waves of enemies?
        </p>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <Card className="max-w-2xl w-full bg-card/50 backdrop-blur-sm border-primary shadow-lg shadow-primary/20">
            <CardHeader className="text-center items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Shield className="w-12 h-12 text-primary" />
                </div>
                <CardTitle className="text-3xl font-headline flex items-center gap-4">
                    Endless Onslaught
                </CardTitle>
                <CardDescription className="text-lg pt-2">
                    Face off against increasingly difficult waves of enemy aircraft. Each wave you defeat brings stronger foes. Your fleet does not replenish, so make every move count. Good luck, commander.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <div className="flex gap-4 justify-center mt-4">
                    <Link href={`/game?mode=survival`}>
                        <Button size="lg" className="font-bold text-lg">
                            Begin Survival
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button size="lg" variant="outline">
                            Back to Menu
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
