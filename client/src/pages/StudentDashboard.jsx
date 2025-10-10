// felipe-cardoso-lopes/sonatta/Sonatta-d63186ec006a2e56cd14b87d9cb8564ef4006ca1/client/src/pages/StudentDashboard.jsx
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
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex">
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
            {/* 3. BOTÃO "MINHAS AULAS" ATUALIZADO */}
            <Link to="" className="group flex flex-col items-center text-center">
              <img 
                src="/assets/Minhas Aulas.png" 
                alt="Minhas Aulas" 
                className="w-[260px] h-[390px] rounded-[15px] object-cover transition-transform group-hover:scale-105"
              />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4">Minhas Aulas</span>
            </Link>
            
            {/* 4. BOTÃO "PRATICAR" ATUALIZADO */}
            <Link to="" className="group flex flex-col items-center text-center">
              <img 
                src="/assets/Praticar.png" 
                alt="Praticar" 
                className="w-[260px] h-[390px] rounded-[15px] object-cover transition-transform group-hover:scale-105"
              />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4">Praticar</span>
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;