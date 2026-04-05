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
        'piano-black': '#000000', // O fundo absoluto (a caixa do piano)
        'piano-white': '#FDFDFD', // O branco das teclas (quase puro, levemente suave para a vista)
        'pure-white': '#FFFFFF',  // Para textos em cima de fundos pretos
        'pedal-gray': '#737373',  // Cinza médio para textos secundários (subtítulos, placeholders)
        'key-divider': '#2A2A2A', // Cinza muito escuro para separar componentes (bordas, sidebars)
      }
    },
  },
  plugins: [],
}