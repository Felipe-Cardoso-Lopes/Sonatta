import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InstituicaoSidebar from '../components/InstituicaoSidebar';

function InstituicaoDashboard() {
  const navigate = useNavigate();
  
  // NOVO 1: Estado para armazenar as métricas vindas do banco
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalLessons: 0 });


  // Trava de segurança da rota (Mantida)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token) {
      navigate('/login');
    } else if (role === 'aluno') {
      navigate('/student-dashboard');
    } else if (role === 'professor' || role === 'ensinar') {
      navigate('/teacher-dashboard');
    }
    
  }, [navigate]);

  // NOVO 2: Função que busca os dados no backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    };

    // Só dispara a busca se o usuário for realmente o admin
    if (localStorage.getItem('userRole') === 'admin') {
      fetchStats();
    }
  }, []);

  const userName = "Instituição";

  return (
    <div className="min-h-screen bg-new-bg text-pure-white font-poppins flex flex-col md:flex-row">
      <InstituicaoSidebar />

      {/* Conteúdo Principal */}
      <div className="flex-grow flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="text-center w-full mb-8">
            <h1 className="text-4xl font-bold mb-2">Bem-Vindo(a), {userName}!</h1>
            <h2 className="text-2xl mb-4">Painel Administrativo Sonatta</h2>
            <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-8">
              Acompanhe o crescimento do negócio, gerencie o conteúdo e administre os professores da plataforma.
            </p> 

            {/* NOVO 3: Faixa de Estatísticas Rápidas */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="border border-key-divider px-8 py-4 rounded-lg border border-gray-700 shadow-md min-w-[150px]">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-1">Alunos</h3>
                <p className="text-3xl font-bold">{stats.totalStudents}</p>
              </div>
              <div className="border border-key-divider px-8 py-4 rounded-lg border border-gray-700 shadow-md min-w-[150px]">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-1">Professores</h3>
                <p className="text-3xl font-bold">{stats.totalTeachers}</p>
              </div>
              <div className="border border-key-divider px-8 py-4 rounded-lg border border-gray-700 shadow-md min-w-[150px]">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-1">Aulas</h3>
                <p className="text-3xl font-bold">{stats.totalLessons}</p>
              </div>
            </div>
          </div>
          
          <section className="flex flex-col xl:flex-row flex-wrap justify-center gap-8 md:gap-12 w-full px-4 md:px-0">
            <Link to="/admin/overview" className="group flex flex-col items-center text-center w-full md:w-auto max-w-[260px] md:max-w-none">
              <div className="w-full md:w-[260px] h-[300px] md:h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                <img src="/assets/Overview.png" alt="Visão Geral" className="w-32 h-32" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-pure-white">Visão Geral</span>
            </Link>
            
            <Link to="/instituicao/management" className="group flex flex-col items-center text-center w-full md:w-auto max-w-[260px] md:max-w-none">
              <div className="w-full md:w-[260px] h-[300px] md:h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                <img src="/assets/Gerenciamento.png" alt="Gerenciamento" className="w-32 h-32" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-pure-white">Gerenciamento</span>
            </Link>

            <Link to="/instituicao/financial" className="group flex flex-col items-center text-center w-full md:w-auto max-w-[260px] md:max-w-none">
              <div className="w-full md:w-[260px] h-[300px] md:h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                <img src="/assets/Financeiro.png" alt="Financeiro" className="w-32 h-32" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-pure-white">Financeiro</span>
            </Link>

            <Link to="/instituicao/settings" className="group flex flex-col items-center text-center w-full md:w-auto max-w-[260px] md:max-w-none">
              <div className="w-full md:w-[260px] h-[300px] md:h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                <img src="/assets/Escola.png" alt="Configurações da Escola" className="w-32 h-32" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-pure-white">Configurações da Escola</span>
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}

export default InstituicaoDashboard;