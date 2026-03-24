import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TeacherSidebar from '../components/TeacherSidebar';

function TeacherDashboard() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Recupera o nome do professor armazenado no localStorage após o login
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex">
      {/* Menu Lateral do Professor */}
      <TeacherSidebar />

      {/* Conteúdo Principal */}
      <div className="flex-grow flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          
          {/* Cabeçalho de Boas-Vindas */}
          <div className="text-center w-full mb-12">
            <h1 className="text-4xl font-bold mb-2">Bem-Vindo(a), {userName}!</h1>
            <h2 className="text-2xl mb-4 text-gray-300">Área do Professor Sonatta</h2>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto text-gray-400">
              Gerencie suas turmas, crie conteúdos e acompanhe o progresso de seus alunos de forma centralizada.
            </p>
          </div>
          
          {/* Seção de Navegação por Cards */}
          <section className="flex gap-12">

            {/* Card Gerenciamento */}
            <Link to="/teacher/management" className="group flex flex-col items-center text-center">
              <div className="w-[260px] h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xl">
                <img 
                  src="/assets/Gerenciamento.png" 
                  alt="Gerenciamento" 
                  className="w-56 h-56 object-contain" // Aumentado para manter o padrão visual do aluno
                />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-xl mt-4">
                Gerenciamento
              </span>
            </Link>
            
            {/* Card Visão Geral */}
            <Link to="/teacher/overview" className="group flex flex-col items-center text-center">
              <div className="w-[260px] h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xl">
                <img 
                  src="/assets/Overview.png" 
                  alt="Visão Geral" 
                  className="w-56 h-56 object-contain" // Aumentado para manter o padrão visual do aluno
                />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-xl mt-4">
                Visão Geral
              </span>
            </Link>

          </section>
        </main>
      </div>
    </div>
  );
}

export default TeacherDashboard;