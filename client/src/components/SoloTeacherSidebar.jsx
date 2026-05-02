import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Sub-componente que adiciona a barra lateral se a rota estiver ativa
const NavIndicator = ({ to, children }) => {
  const location = useLocation();
  // Verifica se a rota atual começa com o caminho especificado (útil para sub-rotas) ou é exatamente igual
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

function SoloTeacherSidebar() {
  return (
    <aside className="w-24 min-h-screen bg-gray-800 border-r border-gray-700 p-4 flex flex-col justify-between items-center shrink-0">
      <div className="flex flex-col items-center gap-6">
        
        {/* Logo Sonatta */}
        <Link to="/solo-teacher" className="w-13 h-13 scale-150 transition-transform hover:scale-125 ">
          <img src="/assets/sonatta-logo.png" alt="Sonatta Logo" />
        </Link>

        {/* Botão Dashboard (Overview) */}
        <NavIndicator to="/solo-teacher">
          <Link to="/solo-teacher" className="transition-transform hover:scale-125">
            <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center shadow-lg">
              <img src="/assets/Overview.png" alt="Dashboard" className="w-7 h-7 scale-150" />
            </div>
          </Link>
        </NavIndicator>

        {/* Botão Agenda de Aulas */}
        <NavIndicator to="/solo-teacher/schedule">
          <Link to="/solo-teacher/schedule" className="transition-transform hover:scale-125">
            <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center shadow-lg">
              <img src="/assets/Minhas Aulas.png" alt="Agenda" className="w-12 h-12 scale-150" />
            </div>
          </Link>
        </NavIndicator>

        {/* Botão Meus Cursos */}
        <NavIndicator to="/solo-teacher/courses">
          <Link to="/solo-teacher/courses" className="transition-transform hover:scale-125">
            <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center shadow-lg">
              <img src="/assets/Gerenciamento.png" alt="Cursos" className="w-8 h-8 scale-150" />
            </div>
          </Link>
        </NavIndicator>

        {/* Botão Alunos (CRM) */}
        <NavIndicator to="/solo-teacher/students">
          <Link to="/solo-teacher/students" className="transition-transform hover:scale-125">
            <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center shadow-lg">
              <img src="/assets/Escola.png" alt="Alunos" className="w-8 h-8 scale-150" />
            </div>
          </Link>
        </NavIndicator>

        {/* Botão Financeiro */}
        <NavIndicator to="/solo-teacher/financial">
          <Link to="/solo-teacher/financial" className="transition-transform hover:scale-125">
            <div className="w-14 h-14 bg-white rounded-[15px] flex items-center justify-center shadow-lg">
              <img src="/assets/Financeiro.png" alt="Financeiro" className="w-7 h-7 scale-150" />
            </div>
          </Link>
        </NavIndicator>

      </div>

      {/* Botão Minha Vitrine / Configurações (Fica solto no rodapé igual ao Meu Perfil) */}
      <NavIndicator to="/solo-teacher/showcase">
        <Link to="/solo-teacher/showcase" className="transition-transform hover:scale-125 mt-auto">
          <img src="/assets/Meu-Perfil.png" alt="Minha Vitrine" className="w-9 h-9 scale-150 opacity-80 hover:opacity-100 transition-opacity" />
        </Link>
      </NavIndicator>
    </aside>
  );
}

export default SoloTeacherSidebar;