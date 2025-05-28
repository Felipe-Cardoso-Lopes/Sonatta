import React from 'react';
import { Link } from 'react-router-dom';

function Header() { // Nome da função agora é Header
  return (
    <header className="flex justify-between items-center p-6 bg-dark-bg text-white-text fixed top-0 left-0 w-full z-10">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3 ">
        <img src="../assets/sonatta-logo.png" alt="Sonatta Logo" className="w-12 h-12 scale-150 transition-transform hover:scale-125"/>
        <Link to="/" className="text-xl font-bold">Sonatta</Link>
      </div>
      </div>
      <nav>
        <Link to="/register" className="mr-4 hover:underline">Cadastrar</Link>
        <Link to="/login" className="hover:underline">Entrar</Link>
      </nav>
    </header>
  );
}

export default Header; // Exporta como Header