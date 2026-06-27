import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Sub-componente que adiciona a barra lateral indicadora se a rota estiver ativa
const NavIndicator = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname.includes(to);

  return (
    <div className="relative flex items-center justify-center">
      {/* Barrinha indicadora que aparece se a rota estiver ativa */}
      {isActive && (
        <div className="absolute -left-4 w-1.5 h-10 bg-white rounded-full shadow-[0_0_8px_#ffffff]"></div>
      )}
      {children}
    </div>
  );
};

function SuperAdminSidebar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
  };

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
        className={`fixed md:static top-0 left-0 h-full w-24 min-h-screen bg-gray-800 border-r border-gray-700 p-4 flex flex-col justify-between items-center shrink-0 z-50 transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col items-center gap-6">

          {/* Logo Sonatta (Redireciona para o Dashboard / Torre de Controle) */}
          <Link to="/super-admin/dashboard" onClick={() => setIsMenuOpen(false)} className="w-14 h-14 scale-150 transition-transform hover:scale-125 mb-4">
            <img src="/assets/sonatta-logo.png" alt="Sonatta Logo" />
          </Link>

          {/* Gestão de Escolas */}
          <NavIndicator to="/super-admin/schools">
            <Link to="/super-admin/schools" onClick={() => setIsMenuOpen(false)} className="transition-transform hover:scale-125 block" title="Gestão de Escolas">
              <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center shadow-lg">
                <img src="/assets/Escola.png" alt="Gestão de Escolas" className="w-8 h-8 scale-150" />
              </div>
            </Link>
          </NavIndicator>

          {/* Professores Solo (Link corrigido e integrado) */}
          <NavIndicator to="/super-admin/solo-teachers">
            <Link to="/super-admin/solo-teachers" onClick={() => setIsMenuOpen(false)} className="transition-transform hover:scale-125 block" title="Professores Solo">
              <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center shadow-lg">
                <img src="/assets/Professor.png" alt="Professores Solo" className="w-8 h-8 scale-150" />
              </div>
            </Link>
          </NavIndicator>

          {/* Assinaturas SaaS */}
          <NavIndicator to="/super-admin/subscriptions">
            <Link to="/super-admin/subscriptions" onClick={() => setIsMenuOpen(false)} className="transition-transform hover:scale-125 block" title="Assinaturas SaaS">
              <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center shadow-lg">
                <img src="/assets/Financeiro.png" alt="Assinaturas SaaS" className="w-8 h-8 scale-150" />
              </div>
            </Link>
          </NavIndicator>

          {/* Sistema e Logs */}
          <NavIndicator to="/super-admin/system">
            <Link to="/super-admin/system" onClick={() => setIsMenuOpen(false)} className="transition-transform hover:scale-125 block" title="Sistema e Logs">
              <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center shadow-lg">
                <img src="/assets/Gerenciamento.png" alt="Sistema e Logs" className="w-8 h-8 scale-150" />
              </div>
            </Link>
          </NavIndicator>

        </div>

        {/* Botão de Logout */}
        <button
          onClick={() => { setIsMenuOpen(false); handleLogout(); }}
          className="transition-transform hover:scale-125 mt-4"
          title="Sair do Sistema"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500/10 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        </button>
      </aside>
    </>
  );
}

export default SuperAdminSidebar;
