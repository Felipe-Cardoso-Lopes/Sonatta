import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function SuperAdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  // Função auxiliar para destacar o link ativo
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-full md:w-64 border border-key-divider border-r flex flex-col min-h-screen">
      {/* Cabeçalho da Sidebar / Logo */}
      <div className="p-6 flex items-center justify-center border-b border-gray-800">
        <Link to="/super-admin-dashboard" className="flex items-center gap-3 transition-transform hover:scale-105">
          <img src="/assets/sonatta-logo.png" alt="Sonatta Logo" className="w-10 h-10" />
          <span className="text-2xl font-bold text-pure-white">Sonatta</span>
        </Link>
      </div>
      
      {/* Badge de Identificação da Equipe */}
      <div className="bg-purple-900/30 py-2 px-4 text-center border-b border-purple-800/50">
        <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Equipe Global</span>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link 
          to="/super-admin-dashboard" 
          className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/super-admin-dashboard') ? 'bg-purple-600 text-white font-bold shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
        >
          Torre de Controle
        </Link>

        <Link 
          to="/super-admin/schools" 
          className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/super-admin/schools') ? 'bg-purple-600 text-white font-bold shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
        >
          Gestão de Escolas
        </Link>

        <Link 
          to="/super-admin/subscriptions" 
          className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/super-admin/subscriptions') ? 'bg-purple-600 text-white font-bold shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
        >
          Assinaturas SaaS
        </Link>

        <Link 
          to="/super-admin/system" 
          className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/super-admin/system') ? 'bg-purple-600 text-white font-bold shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
        >
          Sistema e Logs
        </Link>
      </nav>

      {/* Botão de Logout */}
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          className="w-full px-4 py-3 flex items-center justify-center gap-2 rounded-lg font-bold transition duration-300 ease-in-out cursor-pointer bg-transparent text-red-500 border border-red-500 hover:bg-red-500 hover:text-white"
        >
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}

export default SuperAdminSidebar;