/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        background: '#050505',
        surface: 'rgba(10, 10, 10, 0.8)',
        border: 'rgba(0, 240, 255, 0.2)',
        brand: {
          cyan:   '#00f0ff',
          pink:   '#ff003c',
          yellow: '#fcee09',
          green:  '#39ff14',
          dark:   '#0a0a0a',
        },
      },
      backgroundImage: {
        'cyber-grid': `
          linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)
        `,
        'cyber-scanline': 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))',
      },
      backgroundSize: {
        'cyber-grid': '30px 30px',
        'cyber-scanline': '100% 4px',
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 240, 255, 0.2), 0 0 20px rgba(0, 240, 255, 0.1)',
        'neon-cyan-strong': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-pink': '0 0 10px rgba(255, 0, 60, 0.3), 0 0 20px rgba(255, 0, 60, 0.2)',
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glitch': 'glitch 1s linear infinite',
      },
      keyframes: {
        glitch: {
          '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
          '62%': { transform: 'translate(0,0) skew(5deg)' },
        }
      },
    }
  },
  plugins: []
}
