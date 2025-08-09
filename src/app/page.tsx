
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Rocket, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 py-6 flex items-center gap-4">
        <Rocket className="w-10 h-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-widest text-primary animate-glow">
          Sky Combat
        </h1>
      </header>

      <main className="flex-grow">
        <section className="relative h-[60vh] flex items-center justify-center text-center px-4 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
          <div className="z-10">
            <h2 className="text-5xl md:text-7xl font-bold font-headline mb-4">
              Dominate the Skies
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Engage in thrilling turn-based aerial warfare. Command your fleet,
              outsmart your opponents, and become the master of the skies in
              this strategic grid-based combat game.
            </p>
            <Link href="/game">
              <Button size="lg" className="font-bold text-lg">
                <Gamepad2 className="mr-2" />
                Play Now
              </Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold font-headline">Core Features</h3>
            <p className="text-muted-foreground mt-2">
              Everything you need for strategic aerial combat.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Rocket className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-headline">
                  Strategic Gameplay
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Plan your moves, anticipate your enemy, and utilize unique
                aircraft abilities to gain the upper hand on a grid-based
                battlefield.
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-headline">
                  Multiple Aircrafts
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Command a diverse fleet of fighters, bombers, and support
                aircraft, each with distinct stats and powerful special
                abilities.
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Gamepad2 className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-headline">AI Opponent</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Test your tactical skills against a challenging AI opponent. Plus,
                get strategic suggestions from an integrated AI assistant.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 sm:py-24">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 className="text-4xl font-bold font-headline mb-4">Visualize the Battlefield</h3>
                    <p className="text-muted-foreground text-lg mb-6">
                        An intuitive and responsive UI brings the battlefield to life. Track your aircrafts, monitor their health, and execute your strategy with ease.
                    </p>
                    <Link href="/game">
                        <Button variant="outline">
                            Start Your Conquest
                        </Button>
                    </Link>
                </div>
                <div>
                    <Image 
                        src="https://placehold.co/600x400.png"
                        alt="Gameplay Screenshot"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-2xl"
                        data-ai-hint="gameplay screenshot"
                    />
                </div>
            </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; 2024 Sky Combat. All rights reserved.</p>
      </footer>
    </div>
  );
}
