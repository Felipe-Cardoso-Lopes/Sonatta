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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/super-admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Correção: Garante que o status do servidor mude para 'Online' se a API responder,
          // mesclando com os dados de totalSchools e totalUsers vindos do banco.
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
    <div className="min-h-screen bg-new-bg text-pure-white font-poppins flex flex-col md:flex-row">
      <SuperAdminSidebar />

      <div className="flex-grow flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="text-center w-full mb-8">
            <h1 className="text-4xl font-bold mb-2 text-purple-500">Torre de Controle</h1>
            <h2 className="text-2xl mb-4">Bem-vindo(a), {userName}!</h2>
            <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-8">
              Visão global da plataforma Sonatta. Gerencie as escolas parceiras, assinaturas ativas e a saúde do sistema.
            </p> 

            {/* Faixa de Estatísticas REAIS */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="border border-key-divider px-8 py-4 rounded-lg border border-purple-700 shadow-md min-w-[150px]">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-1">Escolas Ativas</h3>
                <p className="text-3xl font-bold">{stats.totalSchools}</p>
              </div>
              <div className="border border-key-divider px-8 py-4 rounded-lg border border-blue-700 shadow-md min-w-[150px]">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-1">Usuários Totais</h3>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="border border-key-divider px-8 py-4 rounded-lg border border-green-700 shadow-md min-w-[150px]">
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-1">Status do Servidor</h3>
                <p className={`text-3xl font-bold ${
                  stats.serverStatus === 'Online' ? 'text-green-500' : 
                  stats.serverStatus === 'Carregando...' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {stats.serverStatus}
                </p>
              </div>
            </div>
          </div>
          
          <section className="flex flex-col xl:flex-row flex-wrap justify-center gap-8 md:gap-12 w-full px-4 md:px-0">
            <Link to="/super-admin/schools" className="group flex flex-col items-center text-center w-full md:w-auto max-w-[260px] md:max-w-none">
              <div className="w-full md:w-[260px] h-[300px] md:h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105 border-4 border-transparent group-hover:border-purple-500">
                <img src="/assets/Escola.png" alt="Gestão de Escolas" className="w-32 h-32" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-pure-white">Gestão de Escolas</span>
            </Link>
            
            <Link to="/super-admin/subscriptions" className="group flex flex-col items-center text-center w-full md:w-auto max-w-[260px] md:max-w-none">
              <div className="w-full md:w-[260px] h-[300px] md:h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105 border-4 border-transparent group-hover:border-purple-500">
                <img src="/assets/Financeiro.png" alt="Assinaturas SaaS" className="w-32 h-32" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-pure-white">Assinaturas SaaS</span>
            </Link>

            <Link to="/super-admin/system" className="group flex flex-col items-center text-center w-full md:w-auto max-w-[260px] md:max-w-none">
              <div className="w-full md:w-[260px] h-[300px] md:h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105 border-4 border-transparent group-hover:border-purple-500">
                <img src="/assets/Gerenciamento.png" alt="Sistema e Logs" className="w-32 h-32" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-pure-white">Sistema e Logs</span>
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;