import React from 'react';
import { Link } from 'react-router-dom';

function Header() { // Nome da função agora é Header
  return (
    <header className="flex justify-between items-center p-6 bg-dark-bg text-white-text fixed top-0 left-0 w-full z-10">
      <div className="flex items-center gap-2">
        {/* Placeholder para a logo. Você pode substituir por um <img src="/assets/logo-real.svg" alt="Logo Sonatta" className="w-7 h-7" /> */}
        <div className="w-7 h-7 bg-white-text rounded-md"></div> {/* Placeholder visual */}
        <Link to="/" className="text-xl font-bold">Sonatta</Link>
      </div>
      <nav>
        <Link to="/register" className="mr-4 hover:underline">Cadastrar</Link>
        <Link to="/login" className="hover:underline">Entrar</Link>
      </nav>
    </header>
  );
}

export default Header; // Exporta como Header