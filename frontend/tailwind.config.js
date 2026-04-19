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
        background: '#020617',
        surface: 'rgba(30, 41, 59, 0.4)',
        border: 'rgba(255, 255, 255, 0.08)',
        brand: {
          cyan:   '#06b6d4',
          blue:   '#3b82f6',
          purple: '#8b5cf6',
          fraud:  '#ef4444',
          safe:   '#10b981',
          warn:   '#f59e0b',
        },
      },
      backgroundImage: {
        'mesh': 'radial-gradient(at 40% 20%, rgba(59, 130, 246, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(6, 182, 212, 0.15) 0px, transparent 50%)',
        'glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
      },
      animation: {
        'blob': 'blob 10s infinite alternate',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 15px rgba(6, 182, 212, 0.5)' },
          '50%': { opacity: 0.8, boxShadow: '0 0 5px rgba(6, 182, 212, 0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    }
  },
  plugins: []
}
