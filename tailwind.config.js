/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C7A96D',
          50: '#F7F4EC',
          100: '#F0E9D9',
          200: '#E6D9BC',
          300: '#DBC99F',
          400: '#D1B982',
          500: '#C7A96D',
          600: '#B69451',
          700: '#967A3E',
          800: '#75602F',
          900: '#544621',
          950: '#2A2311',
        },
        secondary: "#DEB64B",
        third: "#F1E3A4",
        light: "#FAF9D0",
        dark: "#101114",
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
} 