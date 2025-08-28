
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Rocket, Trophy, Zap, Calendar, Shield, Star } from "lucide-react";

const reviews = [
  {
    name: "Cmdr. Maverick",
    rating: 5,
    quote: "The tactical depth is incredible. Every match feels like a high-stakes aerial chess game. I can't get enough!",
  },
  {
    name: "Sgt. Stryker",
    rating: 5,
    quote: "Finally, a strategy game that rewards smart thinking over quick reflexes. The AI is challenging, and the special abilities add so much variety.",
  },
  {
    name: "Ace Pilot 'Ghost'",
    rating: 4,
    quote: "A fantastic turn-based combat game. The UI is clean, and the gameplay is addictive. My only wish is for more aircraft types in the future!",
  },
];


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-foreground bg-clouds">
      <header className="container mx-auto px-4 py-8 text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
          <h1 className="text-5xl md:text-6xl font-bold font-headline tracking-widest text-primary-foreground animate-glow">
            Sky Combat
          </h1>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative flex items-center justify-center text-center px-4 py-20 md:py-28">
          <div className="z-10">
            <h2 className="text-5xl md:text-7xl font-bold font-headline mb-4">
              Dominate the Skies
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Engage in thrilling turn-based aerial warfare. Command your fleet,
              outsmart your opponents, and become the master of the skies in
              this strategic grid-based combat game.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/game">
                <Button size="lg" className="font-bold text-lg">
                  <Gamepad2 className="mr-2" />
                  Play Now
                </Button>
              </Link>
               <Link href="/survival">
                <Button size="lg" className="font-bold text-lg" variant="secondary">
                  <Shield className="mr-2" />
                  Survival Mode
                </Button>
              </Link>
               <Link href="/daily-challenge">
                <Button size="lg" className="font-bold text-lg" variant="secondary">
                  <Calendar className="mr-2" />
                  Daily Challenge
                </Button>
              </Link>
               <Link href="/achievements">
                <Button size="lg" className="font-bold text-lg" variant="outline">
                  <Trophy className="mr-2" />
                  Achievements
                </Button>
              </Link>
            </div>
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
            <Card className="bg-card/50 backdrop-blur-sm">
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
            <Card className="bg-card/50 backdrop-blur-sm">
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
            <Card className="bg-card/50 backdrop-blur-sm">
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
           <div className="text-center mb-12">
             <h3 className="text-4xl font-bold font-headline">What Pilots Are Saying</h3>
             <p className="text-muted-foreground mt-2">
               Feedback from the front lines.
             </p>
           </div>
           <div className="grid md:grid-cols-3 gap-8">
             {reviews.map((review, index) => (
               <Card key={index} className="bg-card/50 backdrop-blur-sm flex flex-col">
                 <CardHeader>
                   <div className="flex items-center gap-2">
                     {Array.from({ length: 5 }).map((_, i) => (
                       <Star
                         key={i}
                         className={
                           i < review.rating
                             ? "w-5 h-5 text-primary"
                             : "w-5 h-5 text-muted-foreground"
                         }
                         fill={
                           i < review.rating ? "currentColor" : "none"
                         }
                       />
                     ))}
                   </div>
                 </CardHeader>
                 <CardContent className="flex-grow">
                   <p className="text-muted-foreground italic">"{review.quote}"</p>
                 </CardContent>
                 <div className="p-6 pt-0">
                    <p className="font-bold font-headline text-right">- {review.name}</p>
                 </div>
               </Card>
             ))}
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
                        src="https://picsum.photos/600/400"
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

      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground border-t border-primary/20">
        <p className="mb-2 font-bold">A turn-based aerial strategy game built with Next.js and Genkit.</p>
        <p className="font-bold">&copy; 2025 Sky Combat. All rights reserved.</p>
      </footer>
    </div>
  );
}
