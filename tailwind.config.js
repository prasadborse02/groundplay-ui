/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary': '#0984e3',  // Electric blue
        'secondary': '#fd79a8', // Coral pink
        'accent': '#00b894',    // Mint green
        'background': '#f9f9f9',
      },
      borderRadius: {
        'xl': '1rem',
      },
    },
  },
  plugins: [],
}