import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Sub-componente que adiciona a barra lateral se a rota estiver ativa
const NavIndicator = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <div className="relative flex items-center justify-center">
      {isActive && (
        <div className="absolute -left-3 w-1.5 h-10 bg-white rounded-full"></div>
      )}
      {children}
    </div>
  );
};

function InstituicaoSidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Botão hambúrguer: visível apenas em mobile, fixo no topo */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 w-10 h-10 flex items-center justify-center bg-gray-800 border border-gray-700 rounded-lg text-white shadow-lg"
        aria-label="Abrir menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay de fundo em mobile, fecha o menu ao clicar fora */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full w-24 min-h-screen bg-gray-800 border-r border-gray-700 p-4 flex flex-col justify-between items-center z-50 transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col items-center gap-6">

          <Link to="/instituicao/dashboard" onClick={() => setIsMenuOpen(false)} className="w-13 h-13 scale-150 transition-transform hover:scale-125">
            <img src="/assets/sonatta-logo.png" alt="Sonatta Logo" />
          </Link>

          <NavIndicator to="/instituicao/overview">
            <Link to="/instituicao/overview" onClick={() => setIsMenuOpen(false)} className="transition-transform hover:scale-125">
              <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center">
                <img src="/assets/Overview.png" alt="Ícone de Visão Geral" className="w-7 h-7 scale-150 "/>
              </div>
            </Link>
          </NavIndicator>

          <NavIndicator to="/instituicao/management">
            <Link to="/instituicao/management" onClick={() => setIsMenuOpen(false)} className="transition-transform hover:scale-125">
              <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center">
                <img src="/assets/Gerenciamento.png" alt="Ícone de Gerenciamento" className="w-8 h-8 scale-150" />
              </div>
            </Link>
          </NavIndicator>

          <NavIndicator to="/instituicao/financial">
            <Link to="/instituicao/financial" onClick={() => setIsMenuOpen(false)} className="transition-transform hover:scale-125">
              <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center">
                <img src="/assets/Financeiro.png" alt="Ícone de Financeiro" className="w-7 h-7 scale-150" />
              </div>
            </Link>
          </NavIndicator>

          <NavIndicator to="/instituicao/settings">
            <Link to="/instituicao/settings" onClick={() => setIsMenuOpen(false)} className="transition-transform hover:scale-125">
              <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center">
                <img src="/assets/Escola.png" alt="Ícone de Configurações" className="w-8 h-8 scale-150" />
              </div>
            </Link>
          </NavIndicator>

        </div>

        <NavIndicator to="/instituicao/profile">
          <Link to="/instituicao/profile" onClick={() => setIsMenuOpen(false)} className="transition-transform hover:scale-125">
            <img src="/assets/Meu-Perfil.png" alt="Perfil" className="w-9 h-9 scale-150" />
          </Link>
        </NavIndicator>
      </aside>
    </>
  );
}

export default InstituicaoSidebar;
