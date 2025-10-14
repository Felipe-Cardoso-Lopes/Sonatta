import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';

function StudentDashboard() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  return (
    <div className="min-h-screen bg-new-bg text-white-text font-poppins flex">
      <StudentSidebar />

      {/* Conteúdo Principal */}
      <div className="flex-grow flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="text-center w-full mb-12">
            <h1 className="text-4xl font-bold mb-2">Bem-Vindo(a), {userName}!</h1>
            <h2 className="text-2xl mb-4">Seu Caminho Musical no Sonatta</h2>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto">
              Continue sua jornada de aprendizado personalizada. Aqui você encontra suas aulas, suas atividades e seu progresso.
            </p>
          </div>
          <section className="flex gap-12">
            
            <Link to="/lessons" className="group flex flex-col items-center text-center">
              {/* Card Branco do Botão */}
              <div className="w-[260px] h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                <img 
                  src="/assets/Minhas Aulas.png" // Substitua pelo caminho da sua nova imagem sem fundo
                  alt="Minhas Aulas" 
                  className="w-55 h-55" // Tamanho do ícone dentro do card
                />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-white-text">Minhas Aulas</span>
            </Link>
            
            <Link to="/practice" className="group flex flex-col items-center text-center">
              {/* Card Branco do Botão */}
              <div className="w-[260px] h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                <img 
                  src="/assets/Praticar.png" // Substitua pelo caminho da sua nova imagem sem fundo
                  alt="Praticar" 
                  className="w-55 h-55" // Tamanho do ícone dentro do card
                />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-white-text">Praticar</span>
            </Link>

          </section>
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;