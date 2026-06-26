import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SuperAdminSidebar from '../components/SuperAdminSidebar';

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || "Equipe Sonatta";
  
  // ESTADO: Armazena as métricas reais vindas do backend
  const [stats, setStats] = useState({ totalSchools: 0, totalUsers: 0, serverStatus: 'Carregando...' });

  // Trava de segurança
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token) {
      navigate('/login');
    } else if (role !== 'super_admin') {
      navigate('/');
    }
  }, [navigate]);

  // BUSCA DE DADOS: Conecta com a nova rota /api/super-admin/stats
  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/super-admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setStats({
            totalSchools: data.totalSchools || 0,
            totalUsers: data.totalUsers || 0,
            serverStatus: 'Online'
          });
        } else {
          setStats(prev => ({ ...prev, serverStatus: 'Instável' }));
        }
      } catch (error) {
        console.error("Erro ao carregar métricas globais:", error);
        setStats(prev => ({ ...prev, serverStatus: 'Offline' }));
      }
    };

    fetchGlobalStats();
  }, []);

  return (
    <div className="min-h-screen bg-piano-black text-pure-white font-poppins flex flex-col md:flex-row overflow-x-hidden">
      <SuperAdminSidebar />

      <div className="flex-grow flex flex-col h-screen overflow-y-auto custom-scrollbar">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="text-center w-full mb-8 mt-10">
            <h1 className="text-4xl font-bold mb-2 text-purple-500">Torre de Controle</h1>
            <h2 className="text-2xl mb-4">Bem-vindo(a), {userName}!</h2>
            <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto mb-8">
              Visão global da plataforma Sonatta. Gerencie escolas parceiras, rede de professores, assinaturas ativas e a saúde do sistema.
            </p> 

            {/* Faixa de Estatísticas REAIS */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="bg-[#1a1a1a] border border-gray-700 px-8 py-4 rounded-lg border-b-4 border-b-purple-500 shadow-lg min-w-[150px]">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Escolas Ativas</h3>
                <p className="text-3xl font-bold text-white">{stats.totalSchools}</p>
              </div>
              <div className="bg-[#1a1a1a] border border-gray-700 px-8 py-4 rounded-lg border-b-4 border-b-blue-500 shadow-lg min-w-[150px]">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Usuários Totais</h3>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <div className="bg-[#1a1a1a] border border-gray-700 px-8 py-4 rounded-lg border-b-4 border-b-green-500 shadow-lg min-w-[150px]">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Status do Servidor</h3>
                <p className={`text-3xl font-bold ${
                  stats.serverStatus === 'Online' ? 'text-green-500' : 
                  stats.serverStatus === 'Carregando...' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {stats.serverStatus}
                </p>
              </div>
            </div>
          </div>
          
         {/* Grelha (Grid) de Navegação - Alinhamento Perfeito */}
          {/* Usamos grid em vez de flex para garantir um alinhamento rigoroso */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 w-full max-w-7xl mx-auto px-4 md:px-8 pb-12">
            
            <Link to="/super-admin/schools"  className="group flex flex-col items-center text-center w-full md:w-auto max-w-[260px] md:max-w-none">
              <div className="w-full md:w-[260px] h-[300px] md:h-[350px] rounded-3xl bg-white flex flex-col items-center justify-center transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.4)] border-4 border-transparent group-hover:border-purple-500">
                <img src="/assets/Escola.png" alt="Gestão de Escolas" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-lg mt-4 text-white tracking-wide">Gestão de Escolas</span>
            </Link>
            
            <Link to="/super-admin/solo-teachers"  className="group flex flex-col items-center text-center w-full md:w-auto max-w-[260px] md:max-w-none">
              <div className="w-full md:w-[260px] h-[300px] md:h-[350px] rounded-3xl bg-white flex flex-col items-center justify-center transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.4)] border-4 border-transparent group-hover:border-purple-500">
                <img src="/assets/Professor.png" alt="Professores Solo" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-lg mt-4 text-white tracking-wide">Professores Solo</span>
            </Link>

            <Link to="/super-admin/subscriptions"  className="group flex flex-col items-center text-center w-full md:w-auto max-w-[260px] md:max-w-none">
              <div className="w-full md:w-[260px] h-[300px] md:h-[350px] rounded-3xl bg-white flex flex-col items-center justify-center transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.4)] border-4 border-transparent group-hover:border-purple-500">
                <img src="/assets/Financeiro.png" alt="Assinaturas SaaS" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-lg mt-4 text-white tracking-wide">Assinaturas SaaS</span>
            </Link>

            <Link to="/super-admin/system"  className="group flex flex-col items-center text-center w-full md:w-auto max-w-[260px] md:max-w-none">
              <div className="w-full md:w-[260px] h-[300px] md:h-[350px] rounded-3xl bg-white flex flex-col items-center justify-center transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.4)] border-4 border-transparent group-hover:border-purple-500">
                <img src="/assets/Gerenciamento.png" alt="Sistema e Logs" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-lg mt-4 text-white tracking-wide">Sistema e Logs</span>
            </Link>

          </section>
        </main>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;