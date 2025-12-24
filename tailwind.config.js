/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rock: { primary: '#3a3a3a', secondary: '#6b4423', accent: '#8b2635' },
        paper: { primary: '#ffffff', secondary: '#a8d5e2', accent: '#f7dc6f' },
        scissors: { primary: '#c9c9c9', secondary: '#6a4c93', accent: '#00d4ff' },
      },
    },
  },
  theme: {
    extend: {
      colors: {
        rock: {
          primary: '#3a3a3a',
          secondary: '#6b4423',
          accent: '#8b2635',
          highlight: '#d4af37',
          dark: '#2a2a2a',
        },
        paper: {
          primary: '#ffffff',
          secondary: '#a8d5e2',
          accent: '#f7dc6f',
          highlight: '#c0c0c0',
          dark: '#f0f0f0',
        },
        scissors: {
          primary: '#c9c9c9',
          secondary: '#6a4c93',
          accent: '#2c3e50',
          highlight: '#00d4ff',
          dark: '#1a1a2e',
        },
        neutral: {
          bg: '#1c1c1e',
          text: '#ffffff',
          border: 'rgba(255, 255, 255, 0.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        fantasy: ['Cinzel', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'shake': 'shake 0.3s ease-in-out',
        'pulse-glow': 'pulseGlow 1.5s infinite',
        'particle-burst': 'particleBurst 0.8s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255,255,255,0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255,255,255,0.8)' },
        },
        particleBurst: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

