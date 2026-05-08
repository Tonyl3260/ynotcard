import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark charcoal scale - background surfaces
        canvas: {
          950: '#080E1A',
          900: '#0C1524',
          800: '#101E30',
          700: '#152538',
          600: '#1A3050',
        },
        // Primary accent: electric blue
        primary: {
          950: '#0D1E3D',
          900: '#1E3A6E',
          700: '#1D4ED8',
          600: '#2563EB',
          500: '#3B82F6',
          400: '#60A5FA',
          300: '#93C5FD',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      backdropBlur: {
        glass: '12px',
      },
      boxShadow: {
        card:        '0 4px 24px rgba(0,0,0,0.5)',
        'glow-blue': '0 0 20px rgba(59,130,246,0.25), 0 0 60px rgba(59,130,246,0.08)',
        'glow-gold': '0 0 20px rgba(251,191,36,0.20), 0 0 60px rgba(251,191,36,0.06)',
        'glow-green':'0 0 20px rgba(16,185,129,0.20)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
