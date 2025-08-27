
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-body)', 'sans-serif'],
        headline: ['var(--font-headline)', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        flash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px currentColor)' },
          '50%': { filter: 'drop-shadow(0 0 5px currentColor)' },
        },
        'empowered-glow': {
            '0%, 100%': { filter: 'drop-shadow(0 0 3px hsl(var(--primary)))' },
            '50%': { filter: 'drop-shadow(0 0 8px hsl(var(--primary)))' },
        },
        clouds: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '-200% -200%' },
        },
        'damage-popup': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-1.5rem) scale(1.1)', opacity: '0' },
        },
        'critical-popup': {
            '0%': { transform: 'scale(0.5)', opacity: '0' },
            '50%': { transform: 'scale(1.2)', opacity: '1' },
            '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'victory-display': {
          '0%': { transform: 'scale(0.3) rotate(-15deg)', opacity: '0' },
          '50%': { transform: 'scale(1.1) rotate(5deg)', opacity: '1' },
          '75%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'defeat-display': {
          '0%': { transform: 'scale(1.5) translateY(20px)', opacity: '0' },
          '50%': { transform: 'scale(1) translateY(0)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        heal: {
            '0%': {boxShadow: '0 0 0 0 rgba(74, 222, 128, 0.7)',},
            '70%': {boxShadow: '0 0 0 10px rgba(74, 222, 128, 0)',},
            '100%': {boxShadow: '0 0 0 0 rgba(74, 222, 128, 0)',},
        },
        destroy: {
            '0%': { transform: 'scale(1)', opacity: '1' },
            '100%': { transform: 'scale(0.5)', opacity: '0' },
        },
        'low-hp-pulse': {
          '0%, 100%': { boxShadow: 'inset 0 0 0 2px hsl(var(--destructive))' },
          '50%': { boxShadow: 'inset 0 0 0 2px hsl(var(--destructive) / 0.5)' },
        },
        'dodge': {
            '0%, 100%': { transform: 'translateX(0)' },
            '50%': { transform: 'translateX(10px) scale(1.1)' },
        },
        'final-explosion': {
            '0%': { transform: 'scale(0)', opacity: '0' },
            '50%': { transform: 'scale(3) rotate(360deg)', opacity: '1' },
            '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        'stun': {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.4' },
        },
        'level-up': {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.1)', filter: 'brightness(2) drop-shadow(0 0 8px hsl(var(--primary)))' },
          '100%': { transform: 'scale(1)', filter: 'brightness(1)' },
        },
        'level-up-glow': {
          '0%, 100%': { boxShadow: '0 0 5px hsl(var(--primary))' },
          '50%': { boxShadow: '0 0 20px hsl(var(--primary))' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'shake': 'shake 0.3s ease-in-out',
        'flash': 'flash 0.2s ease-in-out',
        'glow': 'glow 1.5s ease-in-out infinite',
        'empowered-glow': 'empowered-glow 1s ease-in-out infinite',
        'clouds': 'clouds 120s linear infinite',
        'damage-popup': 'damage-popup 0.7s ease-out forwards',
        'critical-popup': 'critical-popup 0.5s ease-out forwards',
        'victory-display': 'victory-display 1.5s ease-out forwards',
        'defeat-display': 'defeat-display 1.5s ease-out forwards',
        'spin-slow': 'spin-slow 1.5s linear infinite',
        'heal': 'heal 0.7s ease-in-out',
        'destroy': 'destroy 0.3s ease-in-out forwards',
        'low-hp-pulse': 'low-hp-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'dodge': 'dodge 0.3s ease-in-out',
        'final-explosion': 'final-explosion 0.7s ease-out forwards',
        'stun': 'stun 0.5s ease-in-out infinite',
        'level-up': 'level-up 0.7s ease-out',
        'level-up-glow': 'level-up-glow 1.5s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

    