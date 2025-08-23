import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Exo_2, Orbitron } from 'next/font/google';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Sky Combat',
  description: 'An aircraft war game built with Next.js',
};

const fontHeadline = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
});

const fontBody = Exo_2({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("font-body antialiased bg-clouds", fontHeadline.variable, fontBody.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
