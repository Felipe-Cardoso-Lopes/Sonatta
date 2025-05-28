import React from 'react';
import Header from '../components/Header'; // Importa o Header
import Button from '../components/Button'; // Importa o componente Button
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div >
      <Header /> {/* Renderiza o componente Header */}
      
      {/* O main ocupa o resto da altura da tela e posiciona o conteúdo */}
      <main 
        className=" h-screen-full flex flex-col justify-center min-h-[calc(100vh-96px)] p-10" 
        style={{ backgroundImage: "url('/assets/background-guitar.jpg')" }}
      >
        <div className="pt-20"> {/* Adiciona padding top para não ficar por baixo do Header fixo */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 max-w-lg leading-tight">
            Aprenda no seu ritmo,<br />com tecnologia que escuta você.
          </h1>
           <div className="flex flex-col sm:flex-row gap-4">
            {/* Botão "Comece Agora Gratuitamente" que vai para o Cadastro */}
            {/* O Link envolve o Button. Adicionamos a classe 'no-underline' para remover o sublinhado padrão do link */}
            <Link to="/register" className="no-underline"> 
              <Button variant="primary">Comece Agora Gratuitamente</Button>
            </Link>

            {/* Botão "Veja como funciona" que vai para a página de explicação */}
            <Link to="/how-it-works" className="no-underline"> 
              <Button variant="secondary">Veja como funciona</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;