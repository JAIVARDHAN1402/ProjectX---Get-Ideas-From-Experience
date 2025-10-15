/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",      // pages folder ke sab files
    "./components/**/*.{js,ts,jsx,tsx}" // components folder ke sab files
  ],
  theme: {
    extend: {},  // yahan tum custom colors, fonts, spacing etc. add kar sakte ho
  },
  plugins: [],    // yahan plugins add kar sakte ho
}
