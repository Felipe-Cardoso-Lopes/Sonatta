import React from 'react';
import { Link } from 'react-router-dom';

function AdminSidebar() {
  return (
    <aside className="w-24 min-h-screen bg-sidebar-bg p-4 flex flex-col justify-between items-center">
      <div className="flex flex-col items-center gap-6">
        {/* Botão com o Logo */}
        <Link to="/admin-dashboard" className="w-13 h-13 scale-150 transition-transform hover:scale-125">
          <img src="/assets/sonatta-logo.png" alt="Sonatta Logo" />
        </Link>
        
        <button className="transition-transform hover:scale-125 p-2">
          <img src="/assets/icon-visao-geral.png" alt="Ícone de Visão Geral" className="w-9 h-9 scale-150 rounded-[10px]"/>
        </button>
        
        <button className="transition-transform hover:scale-125 p-2">
          <img src="/assets/icon-gerenciamento.png" alt="Ícone de Gerenciamento" className="w-9 h-9 scale-150 rounded-[10px]" />
        </button>

        <button className="transition-transform hover:scale-125 p-2">
          <img src="../public/assets/Financeiro.jpeg"  alt="Ícone de Financeiro" className="w-9 h-9 scale-150 rounded-[10px]" />
        </button>

        <button className="transition-transform hover:scale-125 p-2">
          <img src="../public/assets/Escola.jpeg"  alt="Ícone de Configurações da Escola" className="w-9 h-9 scale-150 rounded-[10px]" />
        </button>
      </div>
      
      {/* Botão de Perfil */}
      <button className="transition-transform hover:scale-125 p-2">
        <img src="/assets/Meu-Perfil.png" alt="Perfil" className="w-9 h-9 scale-150 rounded-[10px]" />
      </button>
    </aside>
  );
}

export default AdminSidebar;