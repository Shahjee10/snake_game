/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        retro: ['"Press Start 2P"', 'cursive'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      colors: {
        neon: {
          green:  '#39FF14',
          cyan:   '#00FFFF',
          pink:   '#FF2D78',
          yellow: '#FFE600',
        },
        dark: {
          900: '#060810',
          800: '#0D1117',
          700: '#161B27',
          600: '#1E2536',
        }
      },
      boxShadow: {
        neon:      '0 0 8px #39FF14, 0 0 20px #39FF1455',
        'neon-lg': '0 0 16px #39FF14, 0 0 40px #39FF1466',
        'neon-cyan':'0 0 8px #00FFFF, 0 0 20px #00FFFF55',
      },
      animation: {
        'pulse-fast': 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker':    'flicker 3s linear infinite',
        'scanline':   'scanline 8s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 95%, 100%': { opacity: 1 },
          '96%':           { opacity: 0.6 },
          '97%':           { opacity: 0.9 },
          '98%':           { opacity: 0.5 },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        }
      }
    },
  },
  plugins: [],
}