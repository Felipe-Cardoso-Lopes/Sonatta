import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Adicionamos a prop 'variant' com um valor padrão 'public'
function Header() { 
 const location = useLocation();
  // Esconde os botões se estiver nas rotas de autenticação/cadastro
  const hideAuthLinks = 
    location.pathname === '/login' || 
    location.pathname === '/register' || 
    location.pathname.startsWith('/about-you') || 
    location.pathname.startsWith('/musical-profile');

  return (
    <header className="relative z-10 flex justify-between items-center p-5">
       <div className="flex items-center gap-3 transition-transform hover:scale-125">
        <Link to="/">
        <img
          src="/assets/sonatta-logo.png"
          alt="Sonatta Logo"
          className="w-12 h-12 scale-150 "
        />
        </Link>
        <Link to="/" className="text-2xl font-bold">
          Sonatta
        </Link>
      </div>


      {!hideAuthLinks && (
          // Senão, mostra a navegação para visitantes (padrão)
          <div className="flex gap-6">
        <Link to="/register" className="text-xl hover:font-bold">
          Cadastrar
        </Link>

        <Link to="/login" className="text-white text-xl hover:font-bold">
          Entrar
        </Link>
      </div>

        )}
    </header>
  );
}

export default Header;