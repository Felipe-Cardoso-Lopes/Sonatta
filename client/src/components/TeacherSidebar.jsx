import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Sub-componente para cada item de navegação
const NavItem = ({ to, imgSrc, altText }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to); // Usando startsWith para rotas filhas

  return (
    <div className="relative flex items-center justify-center">
      {isActive && (
        <div className="absolute -left-3 w-1.5 h-10 bg-white rounded-full"></div>
      )}
      
      <Link to={to} className="group transition-transform hover:scale-110">
        <div className="w-[80px] h-[80px] bg-white rounded-[15px] flex items-center justify-center">
          <img src={imgSrc} alt={altText} className="w-[60px] h-[60px]" />
        </div>
      </Link>
    </div>
  );
};

function TeacherSidebar() {
  return (
    <aside className="w-24 min-h-screen bg-sidebar-bg p-4 flex flex-col justify-between items-center">
      <div className="flex flex-col items-center gap-6">
        
        <Link to="/teacher-dashboard" className="w-13 h-13 scale-150 transition-transform hover:scale-125">
          <img src="../public/assets/sonatta-logo.png" alt="Sonatta Logo" />
        </Link>
        
        <button className="transition-transform hover:scale-125">
          <div className="w-14 h-14  bg-white rounded-[15px] flex items-center justify-center">
            <img src="/assets/Gerenciamento.png" alt="Ícone de Gerenciamento" className="w-8 h-8 scale-150" />
          </div>
        </button>
        
        <button className="transition-transform hover:scale-125">
          <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center">
            <img src="/assets/Overview.png" alt="Ícone de Visão Geral" className="w-7 h-7 scale-150" />
          </div>
        </button>

      </div>
      
      <button className="transition-transform hover:scale-125">
                <img src="../public/assets/Meu-Perfil.png" alt="Perfil" className="w-9 h-9 scale-150 " />
      </button>
    </aside>
  );
}

export default TeacherSidebar;