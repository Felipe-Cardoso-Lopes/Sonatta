import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Sub-componente que adiciona a barra lateral se a rota estiver ativa
const NavIndicator = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <div className="relative flex items-center justify-center">
      {/* A barrinha indicadora que só aparece se a rota estiver ativa */}
      {isActive && (
        <div className="absolute -left-4 w-1.5 h-10 bg-white rounded-full"></div>
      )}
      {children}
    </div>
  );
};

function StudentSidebar() {
  return (
    <aside className="w-24 min-h-screen bg-sidebar-bg p-4 flex flex-col justify-between items-center ">
      <div className="flex flex-col items-center gap-6">
        
        {/* Logo Sonatta */}
        <Link to="/student-dashboard" className="w-13 h-13 scale-150 transition-transform hover:scale-125">
          {/* Caminho da imagem corrigido */}
          <img src="/assets/sonatta-logo.png" alt="Sonatta Logo" />
        </Link>

        {/* Botão Minhas Aulas */}
        <NavIndicator to="/lessons">
          <Link to="/lessons" className="transition-transform hover:scale-125 ">
            <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center">
              {/* Caminho da imagem corrigido */}
              <img src="/assets/Minhas Aulas.png" alt="Ícone de Minhas Aulas" className="w-12 h-12 scale-150"/>
            </div>
          </Link>
        </NavIndicator>

        {/* Botão Praticar */}
        <NavIndicator to="/practice">
          {/* O <button> foi trocado por <Link> para permitir a navegação */}
          <Link to="/practice" className="transition-transform hover:scale-125 ">
            <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center">
              {/* Caminho da imagem corrigido */}
              <img src="/assets/Praticar.png" alt="Ícone de Praticar" className="w-12 h-12 scale-150" />
            </div>
          </Link>
        </NavIndicator>

      </div>

      {/* Botão Meu Perfil */}
      <NavIndicator to="/student-profile">
        <Link to="/student-profile" className="transition-transform hover:scale-125 ">
          {/* Caminho da imagem corrigido */}
          <img src="/assets/Meu-Perfil.png" alt="Perfil" className="w-9 h-9 scale-150" />
        </Link>
      </NavIndicator>
    </aside>
  );
}

export default StudentSidebar;