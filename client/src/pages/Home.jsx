import React from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import MusicParticles from '../components/MusicParticles';

function Home() {
  return (
    // Adicionado 'overflow-hidden' para evitar scrollbars indesejadas
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <MusicParticles /> 
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header /> 
        
        <main className="flex-grow flex flex-col justify-center p-6 md:p-10">
          <div className="pt-10 md:pt-20"> 
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 max-w-lg leading-tight">
              Aprenda no seu ritmo,<br />com tecnologia que escuta você.
            </h1>
             <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="no-underline"> 
                <Button variant="primary">Comece Agora Gratuitamente</Button>
              </Link>
            
              <Link to="/how-it-works" className="no-underline"> 
                <Button variant="secondary">Veja como funciona</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;