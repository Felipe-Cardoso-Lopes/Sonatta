/** @type {import('tailwindcss').Config} */
export default {
  // Configura os arquivos onde o Tailwind deve procurar por classes CSS
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      // Nova paleta minimalista focada no tema "Piano"
       colors: {
        'dark-bg': '#0C0C0C', 
        'white-text': '#FFFFFF', 
        'sidebar-bg': '#393E46', 
        'dark-gray': '#222831',
      }
    },
  },
  plugins: [],
}