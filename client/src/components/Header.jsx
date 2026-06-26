import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Adicionamos a prop 'variant' com um valor padrão 'public'
function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Esconde os botões se estiver nas rotas de autenticação/cadastro
  const hideAuthLinks =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname.startsWith('/about-you') ||
    location.pathname.startsWith('/musical-profile');

  return (
    <header className="relative z-30 flex justify-between items-center p-5">
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
        <>
          {/* Navegação desktop: visível apenas a partir de md */}
          <div className="hidden md:flex gap-6">
            <Link to="/register" className="text-xl hover:font-bold">
              Cadastrar
            </Link>

            <Link to="/login" className="text-white text-xl hover:font-bold">
              Entrar
            </Link>
          </div>

          {/* Botão hambúrguer: visível apenas abaixo de md */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center w-10 h-10 text-white"
            aria-label="Abrir menu de navegação"
            aria-expanded={isMenuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Menu mobile (dropdown) */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full right-5 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl flex flex-col p-2 z-40 animate-fadeIn">
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-white text-base hover:bg-gray-700 transition-colors"
              >
                Cadastrar
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-white text-base hover:bg-gray-700 transition-colors"
              >
                Entrar
              </Link>
            </div>
          )}
        </>
      )}
    </header>
  );
}

export default Header;
