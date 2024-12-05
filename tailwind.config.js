/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: '#f0f2f5',
        secondary: '#ff813f',
        tertiary: '#222222',
        slate: {
          10: '#f1f3f4',
        },
        green: {
          50: '#30AF5B',
          90: '#292C27',
        },
        gray: {
          10: '#EEEEEE',
          20: '#A2A2A2',
          30: '#7B7B7B',
          50: '#585858',
          90: '#141414',
        },
        'custom-gray': '#2A2A2B',
        bgChapterReader: '#0D1117',
        // Add 'gold' color for the stroke
        gold: '#FAAF00',
      },
      backgroundImage: {
        hero: "url('/src/assets/bgecom.png')",
        banneroffer: "url('/src/assets/banneroffer.png')",
      },
      screens: {
        xs: '400px',
        '3xl': '1680px',
        '4xl': '2200px',
      },
      maxWidth: {
        '10xl': '1512px',
      },
      borderRadius: {
        '5xl': '40px',
      },
      // Add stroke and strokeWidth utilities
      stroke: (theme) => ({
        ...theme('colors'),
      }),
      strokeWidth: {
        '0': '0',
        '1': '1',
        '2': '2',
        '3': '3',
      },
    },
  },
  variants: {
    extend: {
      stroke: ['responsive', 'hover', 'focus'],
      strokeWidth: ['responsive', 'hover', 'focus'],
    },
  },
  plugins: [],
}