/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
          DEFAULT: 'var(--color-primary-light)',
        },
        secondary: {
          light: 'var(--color-secondary-light)',
          dark: 'var(--color-secondary-dark)',
          DEFAULT: 'var(--color-secondary-light)',
        },
        danger: {
          light: 'var(--color-danger-light)',
          dark: 'var(--color-danger-dark)',
          DEFAULT: 'var(--color-danger-light)',
        },
        warning: {
          light: 'var(--color-warning-light)',
          dark: 'var(--color-warning-dark)',
          DEFAULT: 'var(--color-warning-light)',
        },
        background: {
          light: 'var(--color-background-light)',
          dark: 'var(--color-background-dark)',
          DEFAULT: 'var(--color-background-light)',
        },
        surface: {
          light: 'var(--color-surface-light)',
          dark: 'var(--color-surface-dark)',
          DEFAULT: 'var(--color-surface-light)',
        },
        // For backwards compatibility with 'accent' used in old project
        accent: {
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
          DEFAULT: 'var(--color-primary-light)',
        }
      },
      animation: {
        'move-slow': 'move-slow 10s linear infinite',
        'move-reverse': 'move-back 12s linear infinite',
      },
      keyframes: {
        'move-slow': {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(20px, 30px) rotate(5deg)' },
          '100%': { transform: 'translate(0, 0) rotate(0deg)' },
        },
        'move-back': {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(-30px, -20px) rotate(-10deg)' },
          '100%': { transform: 'translate(0, 0) rotate(0deg)' },
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '3rem',
      }
    },
  },
  plugins: [],
}
