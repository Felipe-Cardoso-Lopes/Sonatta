import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TeacherSidebar from '../components/TeacherSidebar';

function TeacherDashboard() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div className="min-h-screen bg-new-bg text-white-text font-poppins flex">
      <TeacherSidebar />

      {/* Conteúdo Principal */}
      <div className="flex-grow flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="text-center w-full mb-12">
            <h1 className="text-4xl font-bold mb-2">Bem-Vindo(a), {userName}!</h1>
            <h2 className="text-2xl mb-4">Área do Professor Sonatta</h2>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto">
              Gerencie suas turmas, crie conteúdos e acompanhe o progresso de seus alunos.
            </p>
          </div>
          <section className="flex gap-12">

            <Link to="/teacher/management" className="group flex flex-col items-center text-center">
              <div className="w-[260px] h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                <img 
                  src="/assets/Gerenciamento.png" // Substitua pela sua imagem sem fundo
                  alt="Gerenciamento" 
                  className="w-32 h-32"
                />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-white-text">Gerenciamento</span>
            </Link>
            
            <Link to="/teacher/overview" className="group flex flex-col items-center text-center">
              <div className="w-[260px] h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                <img 
                  src="/assets/Overview.png" // Substitua pela sua imagem sem fundo
                  alt="Visão Geral" 
                  className="w-32 h-32"
                />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-white-text">Visão Geral</span>
            </Link>

          </section>
        </main>
      </div>
    </div>
  );
}

export default TeacherDashboard;