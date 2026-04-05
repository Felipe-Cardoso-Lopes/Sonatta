import React from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import MusicParticles from '../components/MusicParticles';

function HowItWorks() {
  return (
    // Adicionado w-full e overflow-x-hidden
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <MusicParticles />
      
      {/* Wrapper para o conteúdo ficar acima das partículas */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header /> 
        
        <main className="flex-grow p-8 pt-20"> 
          <h1 className="text-4xl font-bold text-center mb-10 text-pure-white">Como o Sonatta funciona?</h1>
          
          <section className="mb-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4 text-center text-pure-white">A tecnologia que te ouve e te ensina.</h2>
            <p className="text-lg text-center leading-relaxed text-gray-300">
              No Sonatta, a inteligência artificial é sua aliada. Ao tocar seu instrumento, nossa IA escuta, analisa seu desempenho em tempo real e oferece feedback preciso para você aprimorar suas habilidades.
            </p>
            <div className="flex flex-col md:flex-row justify-around items-stretch mt-8 gap-8">
              {/* Card 1 */}
              <div className="text-center p-6 rounded-lg bg-gray-900/80 backdrop-blur-sm border border-gray-800 flex-1">
                <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  🎤
                </div>
                <h3 className="text-xl font-bold mb-2 text-pure-white">Análise em Tempo Real</h3>
                <p className="text-sm text-gray-400">Receba feedback instantâneo sobre sua afinação, ritmo e técnica.</p>
              </div>
              {/* Card 2 */}
              <div className="text-center p-6 rounded-lg bg-gray-900/80 backdrop-blur-sm border border-gray-800 flex-1">
                <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  📈
                </div>
                <h3 className="text-xl font-bold mb-2 text-pure-white">Caminho Personalizado</h3>
                <p className="text-sm text-gray-400">Exercícios adaptados ao seu progresso e desafios específicos.</p>
              </div>
              {/* Card 3 */}
              <div className="text-center p-6 rounded-lg bg-gray-900/80 backdrop-blur-sm border border-gray-800 flex-1">
                <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  🎸
                </div>
                <h3 className="text-xl font-bold mb-2 text-pure-white">Pratique com Confiança</h3>
                <p className="text-sm text-gray-400">Desenvolva suas habilidades em um ambiente de suporte e aprendizado.</p>
              </div>
            </div>
          </section>

          {/* Placeholder Vídeo */}
          <section className="mb-12 max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-4 text-center text-pure-white">Veja o Sonatta em ação!</h2>
            <div className="bg-gray-800/50 w-full aspect-video flex items-center justify-center rounded-xl border border-gray-700 text-gray-400 text-xl md:text-2xl p-4 text-center">
              [ Placeholder para Vídeo Demonstrativo ]
            </div>
          </section>

          <section className="text-center mt-12 mb-20">
            <h2 className="text-3xl font-bold mb-6 text-pure-white">Pronto para transformar sua prática musical?</h2>
            <Link to="/register">
              <Button variant="primary">
                Comece Agora Gratuitamente
              </Button>
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}

export default HowItWorks;