import React from 'react';
import Header from '../components/Header'; // Importa o Header
import Button from '../components/Button'; // Importa o componente Button
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col">
      <Header /> {/* Renderiza o componente Header */}
      
      {/* O main ocupa o resto da altura da tela e posiciona o conteúdo */}
      <main 
        className="flex flex-col justify-end h-screen p-6 pb-16 bg-cover bg-center" 
        style={{ backgroundImage: "url('/assets/background-guitar.jpg')" }}
      >
        <div className="pt-20"> {/* Adiciona padding top para não ficar por baixo do Header fixo */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 max-w-lg leading-tight">
            Aprenda no seu ritmo,<br />com tecnologia que escuta você.
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary">Comece Agora Gratuitamente</Button>
            <Link to="/how-it-works"> {/* Usamos Link para navegação interna */}
              <Button variant="secondary">Veja como funciona</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;