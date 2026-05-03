/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        accent: 'var(--color-accent)',
        textMain: 'var(--color-text-main)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Using Inter for cinematic feel
      }
    },
  },
  plugins: [],
}
