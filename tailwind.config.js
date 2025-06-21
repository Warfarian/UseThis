/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // RCA-inspired bold palette
        'electric': '#00FF41',
        'hot-pink': '#FF0080',
        'neon-blue': '#0080FF',
        'acid-yellow': '#FFFF00',
        'blood-red': '#FF0000',
        'pure-black': '#000000',
        'pure-white': '#FFFFFF',
        'concrete': '#F5F5F5',
        'charcoal': '#1A1A1A',
        'steel': '#808080',
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'mega': 'clamp(6rem, 15vw, 20rem)',
        'giant': 'clamp(4rem, 10vw, 12rem)',
        'huge': 'clamp(3rem, 8vw, 8rem)',
        'big': 'clamp(2rem, 5vw, 5rem)',
      },
      animation: {
        'glitch': 'glitch 0.3s infinite',
        'pulse-neon': 'pulse-neon 2s infinite',
        'slide-brutal': 'slide-brutal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'bounce-hard': 'bounce-hard 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'pulse-neon': {
          '0%, 100%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
            opacity: '1'
          },
          '50%': { 
            boxShadow: '0 0 2px currentColor, 0 0 5px currentColor, 0 0 8px currentColor',
            opacity: '0.8'
          },
        },
        'slide-brutal': {
          '0%': { transform: 'translateX(-100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'bounce-hard': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      backdropBlur: {
        'brutal': '2px'
      }
    },
  },
  plugins: [],
}