/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e6f2',
          200: '#b3cce5',
          300: '#8db2d8',
          400: '#6699cc',
          500: '#4080b3',
          600: '#2d5a7a',
          700: '#1e3a5f',
          800: '#142a44',
          900: '#0f172a',
        },
        orange: {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffc780',
          300: '#ffb34d',
          400: '#ff9f1a',
          500: '#f97316',
          600: '#ea580c',
          700: '#c24a0a',
          800: '#9a3b08',
          900: '#712c06',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}