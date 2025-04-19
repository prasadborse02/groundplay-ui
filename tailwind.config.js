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
      animation: {
        'sports-scroll': 'sports-scroll 30s linear infinite',
        'bounce-short': 'bounce-short 0.6s ease-out',
      },
      keyframes: {
        'sports-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-240px * 5))' }, // 5 items * width+margin
        },
        'bounce-short': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}