/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors from the design if needed
        primary: '#377DFF', // Example from HTML svg
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"], // Force light theme for now as per design
  },
}
