/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0A0A0A',
        paper: '#FAFAFA',
        ink: '#F5F5F5',
        accent: {
          1: '#FF6B35',
          2: '#F7931E'
        },
        focus: '#666666',
        muted: '#333333'
      },
      fontFamily: {
        'primary': ['Playfair Display', 'serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
        '10xl': '10rem'
      },
      animation: {
        'fade-in-up': 'fade-in-up 1s ease-out forwards',
        'fade-in': 'fade-in 1s ease-out forwards',
        'scale-in': 'scale-in 1s ease-out forwards',
        'slide-in-left': 'slide-in-left 1s ease-out forwards',
        'slide-in-right': 'slide-in-right 1s ease-out forwards',
        'float': 'float 8s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(30px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'scale-in': {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.9)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1)' 
          }
        },
        'slide-in-left': {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(-30px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          }
        },
        'slide-in-right': {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(30px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(5px) rotate(-1deg)' }
        },
        'glow': {
          '0%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 107, 53, 0.3)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}