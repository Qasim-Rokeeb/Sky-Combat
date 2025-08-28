
"use client";

import { Award, Crown, Rocket, Star, Trophy, ShieldOff, Swords, Flame, RotateCcw, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/types/achievements";
import React, { useEffect, useState } from "react";

const achievementsList: Achievement[] = [
  {
    id: "first-victory",
    title: "First Victory",
    description: "Win your first game against the AI opponent.",
    icon: <Trophy />,
    unlocked: true,
  },
  {
    id: "ace-pilot",
    title: "Ace Pilot",
    description: "Destroy 10 fighter jets.",
    icon: <Rocket />,
    unlocked: true,
  },
  {
    id: "veteran-commander",
    title: "Veteran Commander",
    description: "Win 10 games.",
    icon: <Star />,
    unlocked: false,
  },
  {
    id: "bomber-baron",
    title: "Bomber Baron",
    description: "Destroy 10 bombers.",
    icon: <Crown />,
    unlocked: false,
  },
  {
    id: "support-specialist",
    title: "Support Specialist",
    description: "Revive 5 friendly aircraft.",
    icon: <Award />,
    unlocked: false,
  },
  {
    id: "flawless-victory",
    title: "Flawless Victory",
    description: "Win a game without losing any of your aircraft.",
    icon: <Trophy />,
    unlocked: false,
  },
];

interface Rank {
    name: string;
    battlesRequired: number;
    icon: React.ReactElement;
}

const ranks: Rank[] = [
    { name: "Recruit", battlesRequired: 0, icon: <Shield className="w-8 h-8"/> },
    { name: "Private", battlesRequired: 10, icon: <Shield className="w-8 h-8"/> },
    { name: "Corporal", battlesRequired: 25, icon: <Star className="w-8 h-8"/> },
    { name: "Sergeant", battlesRequired: 50, icon: <Star className="w-8 h-8"/> },
    { name: "Lieutenant", battlesRequired: 100, icon: <Award className="w-8 h-8"/> },
    { name: "Captain", battlesRequired: 200, icon: <Trophy className="w-8 h-8"/> },
    { name: "Major", battlesRequired: 500, icon: <Crown className="w-8 h-8"/> },
    { name: "Colonel", battlesRequired: 1000, icon: <Crown className="w-8 h-8"/> },
];


export default function AchievementsPage() {
    const unlockedCount = achievementsList.filter(a => a.unlocked).length;
    const totalCount = achievementsList.length;
    const [lossCount, setLossCount] = useState(0);
    const [battlesPlayed, setBattlesPlayed] = useState(0);
    const [winStreak, setWinStreak] = useState(0);

    useEffect(() => {
        const storedLosses = localStorage.getItem('sky-combat-losses');
        if (storedLosses) {
            setLossCount(parseInt(storedLosses, 10));
        }
        const storedBattles = localStorage.getItem('sky-combat-battles-played');
        if (storedBattles) {
            setBattlesPlayed(parseInt(storedBattles, 10));
        }
        const storedWinStreak = localStorage.getItem('sky-combat-win-streak');
        if (storedWinStreak) {
            setWinStreak(parseInt(storedWinStreak, 10));
        }
    }, []);
    
    const currentRank = ranks.slice().reverse().find(rank => battlesPlayed >= rank.battlesRequired) || ranks[0];

    const handleResetStats = () => {
        localStorage.removeItem('sky-combat-losses');
        localStorage.removeItem('sky-combat-battles-played');
        localStorage.removeItem('sky-combat-win-streak');
        setLossCount(0);
        setBattlesPlayed(0);
        setWinStreak(0);
    };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-foreground bg-clouds">
      <header className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold font-headline tracking-widest text-primary-foreground animate-glow">
          Achievements
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
            You have unlocked {unlockedCount} of {totalCount} achievements.
        </p>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
             <Card className="bg-primary/20 backdrop-blur-sm border-primary shadow-lg shadow-primary/20">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        {currentRank.icon}
                    </div>
                    <CardTitle className="font-headline text-primary-foreground">
                        Player Rank
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-4xl font-bold text-primary-foreground">{currentRank.name}</p>
                </CardContent>
            </Card>
            <Card className="bg-primary/20 backdrop-blur-sm border-primary shadow-lg shadow-primary/20">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Swords className="w-8 h-8" />
                    </div>
                    <CardTitle className="font-headline text-primary-foreground">
                        Total Battles
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-6xl font-bold text-primary-foreground">{battlesPlayed}</p>
                </CardContent>
            </Card>
             <Card className="bg-primary/20 backdrop-blur-sm border-primary shadow-lg shadow-primary/20">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Flame className="w-8 h-8" />
                    </div>
                    <CardTitle className="font-headline text-primary-foreground">
                        Win Streak
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-6xl font-bold text-primary-foreground">{winStreak}</p>
                </CardContent>
            </Card>
            <Card className="bg-destructive/20 backdrop-blur-sm border-destructive shadow-lg shadow-destructive/20">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 rounded-full bg-destructive/10 text-destructive">
                        <ShieldOff className="w-8 h-8" />
                    </div>
                    <CardTitle className="font-headline text-destructive-foreground">
                        Total Losses
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-6xl font-bold text-destructive-foreground">{lossCount}</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievementsList.map((achievement) => (
            <Card
              key={achievement.id}
              className={cn(
                "bg-card/50 backdrop-blur-sm transition-all",
                achievement.unlocked ? "border-primary shadow-lg shadow-primary/20" : "border-muted/20 opacity-60"
              )}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={cn("p-3 rounded-full bg-primary/10", achievement.unlocked ? "text-primary" : "text-muted-foreground")}>
                  {React.cloneElement(achievement.icon, { className: "w-8 h-8" })}
                </div>
                <CardTitle className={cn("font-headline", !achievement.unlocked && "text-muted-foreground")}>
                    {achievement.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {achievement.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

       <footer className="container mx-auto px-4 py-8 text-center">
            <div className="flex justify-center gap-4">
                <Link href="/">
                  <Button size="lg">
                    Back to Main Menu
                  </Button>
                </Link>
                <Button size="lg" variant="destructive" onClick={handleResetStats}>
                    <RotateCcw className="mr-2" />
                    Reset Stats
                </Button>
            </div>
        </footer>
    </div>
  );
}
