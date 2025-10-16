import React from 'react';
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

function AdminSidebar() {
  return (
    <aside className="w-24 min-h-screen bg-sidebar-bg p-4 flex flex-col justify-between items-center">
      <div className="flex flex-col items-center gap-6">
        
        <Link to="/admin-dashboard" className="w-13 h-13 scale-150 transition-transform hover:scale-125">
          <img src="/assets/sonatta-logo.png" alt="Sonatta Logo" />
        </Link>

        <NavIndicator to="/admin/overview">
          <Link to="/admin/overview" className="transition-transform hover:scale-125">
            <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center">
              <img src="/assets/Overview.png" alt="Ícone de Visão Geral" className="w-7 h-7 scale-150 "/>
            </div>
          </Link>
        </NavIndicator>

        <NavIndicator to="/admin/management">
          <Link to="/admin/management" className="transition-transform hover:scale-125">
            <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center">
              <img src="/assets/Gerenciamento.png" alt="Ícone de Gerenciamento" className="w-8 h-8 scale-150" />
            </div>
          </Link>
        </NavIndicator>

        <NavIndicator to="/admin/financial">
          <Link to="/admin/financial" className="transition-transform hover:scale-125">
            <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center">
              <img src="/assets/Financeiro.png" alt="Ícone de Financeiro" className="w-7 h-7 scale-150" />
            </div>
          </Link>
        </NavIndicator>

        <NavIndicator to="/admin/settings">
          <Link to="/admin/settings" className="transition-transform hover:scale-125">
            <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center">
              <img src="/assets/Escola.png" alt="Ícone de Configurações" className="w-8 h-8 scale-150" />
            </div>
          </Link>
        </NavIndicator>

      </div>
      
      <NavIndicator to="/admin-profile">
        <Link to="/admin-profile" className="transition-transform hover:scale-125">
          <img src="/assets/Meu-Perfil.png" alt="Perfil" className="w-9 h-9 scale-150" />
        </Link>
      </NavIndicator>
    </aside>
  );
}

export default AdminSidebar;