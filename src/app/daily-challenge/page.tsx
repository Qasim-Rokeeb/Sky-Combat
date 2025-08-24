
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Shield, Swords, Rocket } from "lucide-react";
import Link from "next/link";
import React from "react";

const challenges = [
    {
        day: "Sunday",
        title: "Survival Sunday",
        description: "Survive for 10 turns with a single support aircraft against waves of fighters.",
        icon: <Shield className="w-12 h-12 text-primary" />,
        param: "survival_sunday"
    },
    {
        day: "Monday",
        title: "Bomber Blitz",
        description: "Destroy all enemy ground targets with a squadron of bombers before they escape.",
        icon: <Rocket className="w-12 h-12 text-primary" />,
        param: "bomber_blitz"
    },
    {
        day: "Tuesday",
        title: "Tactical Tuesday",
        description: "Win a battle with a pre-set fleet of aircraft, each with unique limitations.",
        icon: <Swords className="w-12 h-12 text-primary" />,
        param: "tactical_tuesday"
    },
    {
        day: "Wednesday",
        title: "Windy Wednesday",
        description: "Navigate a battlefield with extreme weather conditions that change every turn.",
        icon: <Shield className="w-12 h-12 text-primary" />,
        param: "windy_wednesday"
    },
    {
        day: "Thursday",
        title: "Thunder Thursday",
        description: "A fierce battle in the middle of a thunderstorm. All aircraft have reduced range.",
        icon: <Rocket className="w-12 h-12 text-primary" />,
        param: "thunder_thursday"
    },
    {
        day: "Friday",
        title: "Fighter Frenzy",
        description: "A pure dogfight! Both sides have only fighter jets. Last one standing wins.",
        icon: <Swords className="w-12 h-12 text-primary" />,
        param: "fighter_frenzy"
    },
    {
        day: "Saturday",
        title: "Stealth Saturday",
        description: "All aircraft are hidden in fog of war. Rely on your senses to find and destroy the enemy.",
        icon: <Shield className="w-12 h-12 text-primary" />,
        param: "stealth_saturday"
    }
];

export default function DailyChallengePage() {
    const today = new Date().getDay();
    const currentChallenge = challenges[today];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-gray-900 text-foreground">
      <header className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold font-headline tracking-widest text-primary-foreground animate-glow">
          Daily Challenge
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A new challenge awaits you every day. Good luck, commander!
        </p>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <Card className="max-w-2xl w-full bg-card/50 backdrop-blur-sm border-primary shadow-lg shadow-primary/20">
            <CardHeader className="text-center items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    {currentChallenge.icon}
                </div>
                <CardTitle className="text-3xl font-headline flex items-center gap-4">
                    <Calendar /> 
                    {currentChallenge.day}: {currentChallenge.title}
                </CardTitle>
                <CardDescription className="text-lg pt-2">{currentChallenge.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <div className="flex gap-4 justify-center mt-4">
                    <Link href={`/game?challenge=${currentChallenge.param}`}>
                        <Button size="lg" className="font-bold text-lg">
                            Start Challenge
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
