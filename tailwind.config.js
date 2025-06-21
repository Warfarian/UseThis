/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#1A1A2E',
        paper: '#F8F8F8',
        ink: '#E0E0E0',
        accent: {
          1: '#00C9A7',
          2: '#845EC2'
        },
        focus: '#9CA3AF'
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
        'jitter': 'jitter 0.2s ease-in-out infinite alternate',
        'lift': 'lift 0.15s ease-out',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'float': 'float 8s ease-in-out infinite',
        'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite'
      },
      keyframes: {
        jitter: {
          '0%': { transform: 'translateX(0px) translateY(0px)' },
          '25%': { transform: 'translateX(-0.5px) translateY(-0.5px)' },
          '50%': { transform: 'translateX(0.5px) translateY(0px)' },
          '75%': { transform: 'translateX(0px) translateY(0.5px)' },
          '100%': { transform: 'translateX(-0.5px) translateY(0px)' }
        },
        lift: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-2px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 201, 167, 0.2)' },
          '100%': { boxShadow: '0 0 15px rgba(0, 201, 167, 0.4)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' }
        },
        'gentle-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}