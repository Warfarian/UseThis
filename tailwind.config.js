/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#111111',
        paper: '#F5F5F5',
        ink: '#EAEAEA',
        accent: {
          1: '#F9CB40',
          2: '#FF6F61'
        },
        focus: '#888888'
      },
      fontFamily: {
        'primary': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'accent': ['Times', 'serif']
      },
      fontSize: {
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
        '10xl': '10rem'
      },
      animation: {
        'jitter': 'jitter 0.3s ease-in-out infinite alternate',
        'lift': 'lift 0.2s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        jitter: {
          '0%': { transform: 'translateX(0px) translateY(0px)' },
          '25%': { transform: 'translateX(-1px) translateY(-1px)' },
          '50%': { transform: 'translateX(1px) translateY(0px)' },
          '75%': { transform: 'translateX(0px) translateY(1px)' },
          '100%': { transform: 'translateX(-1px) translateY(0px)' }
        },
        lift: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-4px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(249, 203, 64, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(249, 203, 64, 0.6)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}