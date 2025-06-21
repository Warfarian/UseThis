/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'canvas': '#000000',
        'ink': '#EEEEEE', 
        'focus': '#393E46',
        'muted': '#222831',
        'accent-1': '#00ADB5',
        'accent-2': '#00ADB5',
        'pure-white': '#FFFFFF',
        'pure-black': '#000000',
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        'primary': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'display-1': 'clamp(4rem, 12vw, 12rem)',
        'display-2': 'clamp(3rem, 8vw, 8rem)',
        'heading-1': 'clamp(2.5rem, 6vw, 6rem)',
        'heading-2': 'clamp(2rem, 4vw, 4rem)',
        'body-large': 'clamp(1.25rem, 2vw, 1.5rem)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
      animation: {
        'fade-in-up': 'fade-in-up 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in': 'fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'scale-in': 'scale-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-in-left': 'slide-in-left 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-in-right': 'slide-in-right 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'float': 'float 8s ease-in-out infinite',
        'rotate': 'rotate 15s linear infinite',
        'pulse': 'pulse 1.5s infinite',
        'loading': 'loading 1.2s infinite'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(60px)' 
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
            transform: 'scale(0.9) translateY(20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1) translateY(0)' 
          }
        },
        'slide-in-left': {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(-40px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          }
        },
        'slide-in-right': {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(40px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'rotate': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'loading': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      letterSpacing: {
        'tightest': '-0.02em',
        'extra-wide': '0.08em'
      }
    },
  },
  plugins: [],
}