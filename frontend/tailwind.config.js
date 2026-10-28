/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#F8F5EE',
          200: '#EFE9DE',
          300: '#E2D9C8',
          400: '#C9BDA6',
          500: '#AFA189',
        },
        forest: {
          50: '#EDF7F2',
          100: '#D8EFE4',
          200: '#B3DFC9',
          300: '#84C9A6',
          400: '#4FA97E',
          500: '#2D6A4F',
          600: '#1B4332',
          700: '#143628',
          800: '#0E271D',
          900: '#081711',
        },
        amberfood: {
          50: '#FFF8F1',
          100: '#FEEDDE',
          200: '#FDD6BC',
          300: '#FAB88F',
          400: '#F7915B',
          500: '#EA580C',
          600: '#C2410C',
          700: '#9A3412',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'elevated': '0 10px 25px -5px rgba(27, 67, 50, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
