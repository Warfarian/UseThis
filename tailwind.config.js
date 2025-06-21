/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-charcoal': '#222831',
        'gunmetal': '#393E46',
        'cyan': '#00ADB5',
        'light-gray': '#EEEEEE',
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
        'primary': ['Playfair Display', 'serif'],
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
        'fade-in-up': 'fade-in-up 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'fade-in': 'fade-in 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'scale-in': 'scale-in 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-in-left': 'slide-in-left 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'slide-in-right': 'slide-in-right 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'float': 'float 12s ease-in-out infinite',
        'rotate': 'rotate 20s linear infinite',
        'pulse': 'pulse 2s infinite',
        'loading': 'loading 1.5s infinite'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(100px)' 
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
            transform: 'scale(0.8) translateY(40px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1) translateY(0)' 
          }
        },
        'slide-in-left': {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(-80px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          }
        },
        'slide-in-right': {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(80px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-30px) rotate(1deg)' },
          '50%': { transform: 'translateY(-15px) rotate(-1deg)' },
          '75%': { transform: 'translateY(-25px) rotate(0.5deg)' }
        },
        'rotate': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
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
        'tightest': '-0.025em',
        'extra-wide': '0.1em'
      }
    },
  },
  plugins: [],
}