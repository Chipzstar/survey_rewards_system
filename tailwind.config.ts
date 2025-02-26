import { withUt } from 'uploadthing/tw';

/** @type {import('tailwindcss').Config} */
export default withUt({
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      height: {
        '18': '4.5rem'
      },
      width: {
        '18': '4.5rem'
      },
      colors: {
        primary: {
          DEFAULT: '#2AA6B7',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#B07DE1',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#ECE0F8',
          300: '#D8BFF0',
          400: '#C49EE9',
          500: '#B07DE1',
          600: '#944FD6',
          700: '#782DC1',
          800: '#5C2294',
          900: '#401866',
          950: '#31124F',
          foreground: '#ffffff'
        },
        tertiary: {
          DEFAULT: '#2EEED8',
          50: '#D8FCF8',
          100: '#C5FAF4',
          200: '#9FF7ED',
          300: '#79F4E6',
          400: '#54F1DF',
          500: '#2EEED8',
          600: '#11D3BD',
          700: '#0D9F8E',
          800: '#096B60',
          900: '#043731',
          950: '#021D1A',
          foreground: '#ffffff'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        radius: '0.5rem'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
});
