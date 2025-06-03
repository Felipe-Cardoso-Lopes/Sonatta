import React from 'react';
import Header from '../components/Header'; // Importa o Header
import Button from '../components/Button'; // Importa o componente Button
import { Link } from 'react-router-dom';
import MusicParticles from '../components/MusicParticles';

function HowItWorks() {
  return (
    <div >
      <MusicParticles /> 
      <Header /> 
      
      <main className="flex-grow p-8 pt-20 relative z-10"> 
        <h1 className="text-4xl font-bold text-center mb-10">Como o Sonatta funciona?</h1>
        
        <section className="mb-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4 text-center">A tecnologia que te ouve e te ensina.</h2>
          <p className="text-lg text-center leading-relaxed">
            No Sonatta, a inteligência artificial é sua aliada. Ao tocar seu instrumento, nossa IA escuta, analisa seu desempenho em tempo real e oferece feedback preciso para você aprimorar suas habilidades.
          </p>
          <div className="flex flex-col md:flex-row justify-around items-center mt-8 gap-8">
            <div className="text-center p-4 rounded-lg bg-gray-900">
              {/* Ícone ou ilustração 1 (substituir por um SVG real depois) */}
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white-text text-xl">
                <span role="img" aria-label="Microfone">🎤</span> {/* Exemplo de ícone */}
              </div>
              <h3 className="text-xl font-bold mb-2">Análise em Tempo Real</h3>
              <p className="text-sm">Receba feedback instantâneo sobre sua afinação, ritmo e técnica.</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-900">
              {/* Ícone ou ilustração 2 */}
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white-text text-xl">
                <span role="img" aria-label="Gráfico de Progresso">📈</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Caminho Personalizado</h3>
              <p className="text-sm">Exercícios adaptados ao seu progresso e desafios específicos.</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-900">
              {/* Ícone ou ilustração 3 */}
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white-text text-xl">
                <span role="img" aria-label="Mão tocando guitarra">🎸</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Pratique com Confiança</h3>
              <p className="text-sm">Desenvolva suas habilidades em um ambiente de suporte e aprendizado.</p>
            </div>
          </div>
        </section>

        {/* Mock de vídeo ou carrossel */}
        <section className="mb-12 max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4 text-center">Veja o Sonatta em ação!</h2>
          <div className="bg-gray-800 w-full h-96 flex items-center justify-center rounded-lg text-gray-400 text-2xl">
            [ Placeholder para Vídeo Demonstrativo ou Carrossel de Imagens ]
          </div>
        </section>

        <section className="text-center mt-12 mb-8">
          <h2 className="text-3xl font-bold mb-6">Pronto para transformar sua prática musical?</h2>
          <Link to="/register">
            <Button variant="primary">
              Comece Agora Gratuitamente
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
}

export default HowItWorks;