/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'primary': '#5452D5',
        'secondary': '#C7BCFE',
        'rose': '#F7F3FF'
      }
    },
  },
  plugins: [],
}
