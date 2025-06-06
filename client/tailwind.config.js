/** @type {import('tailwindcss').Config} */
export default {
  // Configura os arquivos onde o Tailwind deve procurar por classes CSS
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Busca em todos os arquivos JS, TS, JSX, TSX dentro de src/
  ],
  theme: {
    extend: {
      // Adiciona a família de fontes Poppins ao Tailwind
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      // Define suas cores personalizadas
      colors: {
        'dark-bg': '#0C0C0C', // Cor de fundo principal (quase preto)
        'white-text': '#FFFFFF', // Cor de texto principal (branco)
      }
    },
  },
  plugins: [],
}