/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
      },
      colors: {
        bgDarkSonatta: "#0C0C0C",
      },
    },
  },
  plugins: [],
};
