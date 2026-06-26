import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InstituicaoSidebar from '../components/InstituicaoSidebar';

function InstituicaoOverview() {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    totalCourses: 0,
    activeSub: 'Nenhum plano ativo'
  });
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const res = await axios.get(`${API_URL}/api/instituicao/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao coletar estatísticas da instituição", error);
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const metricCards = [
    { label: 'Professores Ativos', value: stats.totalTeachers, icon: '👨‍🏫', color: 'text-purple-400' },
    { label: 'Alunos Matriculados', value: stats.totalStudents, icon: '👨‍🎓', color: 'text-blue-400' },
    { label: 'Cursos Ofertados', value: stats.totalCourses, icon: '🎵', color: 'text-green-400' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row relative overflow-x-hidden">
      <div className="shrink-0 z-20">
        <InstituicaoSidebar />
      </div>

      <main className="flex-grow p-6 md:p-10 flex flex-col h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Visão Geral</h1>
            <p className="text-gray-400">Acompanhe as métricas de escala e o status da sua infraestrutura de ensino musical.</p>
          </div>

          {isLoading ? (
            <p className="text-gray-400">Carregando visão geral...</p>
          ) : (
            <>
              {/* PLANO ATIVO BANNER */}
              <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-6 rounded-xl border border-purple-500/30 flex justify-between items-center shadow-md">
                <div>
                  <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-1">Status da Assinatura SaaS</h3>
                  <p className="text-xl font-bold text-white">{stats.activeSub}</p>
                </div>
                <span className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-green-500/30"> Ativo </span>
              </div>

              {/* GRID DE CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metricCards.map((card, i) => (
                  <div key={i} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex items-center justify-between hover:border-gray-600 transition-all">
                    <div>
                      <p className="text-gray-400 text-sm mb-1 font-medium">{card.label}</p>
                      <p className={`text-4xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                    <div className="text-5xl opacity-80">{card.icon}</div>
                  </div>
                ))}
              </div>

              {/* NOTAS E DIRETRIZES */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                <h3 className="text-lg font-bold text-gray-200 mb-3">Atividades Recentes da Escola</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Os dados acima representam a consolidação em tempo real de matrículas e contratações. Para incluir novos alunos ou vincular professores externos à sua grade corporativa, acesse a aba de gerenciamento na barra lateral.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default InstituicaoOverview;