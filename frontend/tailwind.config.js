/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        royal: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        gold: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        surface: {
          900: '#0a0e1a',
          800: '#0f1629',
          700: '#161d35',
          600: '#1e2642',
          500: '#252d4a',
        },
      },
      backgroundImage: {
        'mesh-royal': 'radial-gradient(at 20% 30%, rgba(139,92,246,0.08) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(59,130,246,0.06) 0px, transparent 50%), radial-gradient(at 50% 80%, rgba(139,92,246,0.05) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(139,92,246,0.15), 0 0 40px rgba(139,92,246,0.05)',
        'glow-gold': '0 0 20px rgba(251,191,36,0.15), 0 0 40px rgba(251,191,36,0.05)',
        'card': '0 4px 30px rgba(0,0,0,0.4), 0 0 1px rgba(139,92,246,0.1)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.5), 0 0 20px rgba(139,92,246,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up': 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        breathe: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        },
      },
    }
  },
  plugins: []
}
