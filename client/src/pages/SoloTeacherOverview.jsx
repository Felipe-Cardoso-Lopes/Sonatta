import React, { useState, useEffect } from "react";
import SoloTeacherSidebar from "../components/SoloTeacherSidebar";

function SoloTeacherOverview() {
  const [userName, setUserName] = useState("");
  
  // Estrutura de métricas semelhante ao Overview do Professor
  const [metrics, setMetrics] = useState([
    { label: "Alunos Ativos", value: "0", icon: "👨‍🎓", color: "text-blue-400" },
    { label: "Cursos Criados", value: "0", icon: "📚", color: "text-purple-400" },
    { label: "Aulas Hoje", value: "0", icon: "📅", color: "text-green-400" },
    { label: "Faturamento Mensal", value: "R$ 0,00", icon: "💰", color: "text-yellow-400" },
  ]);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
    // No futuro, adicione a chamada à API (axios/fetch) aqui para preencher as métricas reais
  }, []);

  return (
    <div className="min-h-screen bg-piano-black text-white-text font-poppins flex">
      <SoloTeacherSidebar />
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <main className="flex-grow p-8 overflow-y-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Visão Geral</h1>
            <p className="text-gray-400">Resumo do seu desempenho e atividades recentes, {userName}.</p>
          </header>

          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, idx) => (
              <div key={idx} className="bg-[#1a1a1a] p-6 rounded-lg border border-key-divider shadow-lg flex flex-col justify-between hover:border-purple-500/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-gray-400 text-sm font-medium">{metric.label}</h3>
                  <span className="text-2xl">{metric.icon}</span>
                </div>
                <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Área de Atividades (Layout em 2 Colunas) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Próximas Aulas (Baseado na Agenda) */}
            <div className="bg-[#1a1a1a] rounded-lg border border-key-divider p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🗓️</span> Próximas Aulas
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-[#252525] rounded-lg border border-gray-700 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-white">Aula de Violão - Iniciante</h4>
                    <p className="text-sm text-gray-400">Com João Pedro</p>
                  </div>
                  <div className="text-right">
                    <span className="text-purple-400 font-bold">14:00</span>
                    <p className="text-xs text-gray-500">Hoje</p>
                  </div>
                </div>
                <div className="p-4 bg-[#252525] rounded-lg border border-gray-700 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-white">Teoria Musical</h4>
                    <p className="text-sm text-gray-400">Com Ana Clara</p>
                  </div>
                  <div className="text-right">
                    <span className="text-purple-400 font-bold">16:30</span>
                    <p className="text-xs text-gray-500">Hoje</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Atividades Recentes e Notificações */}
            <div className="bg-[#1a1a1a] rounded-lg border border-key-divider p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>⚡</span> Atividades Recentes
              </h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex gap-3 items-center">
                  <span className="text-green-400 text-lg">●</span>
                  <span><strong>Marcos</strong> comprou o curso "Piano do Zero".</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="text-blue-400 text-lg">●</span>
                  <span>Você adicionou uma nova aula em "Teoria Musical".</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="text-purple-400 text-lg">●</span>
                  <span><strong>Julia</strong> enviou uma mensagem no chat.</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="text-yellow-400 text-lg">●</span>
                  <span>Pagamento de R$ 150,00 liberado na sua conta.</span>
                </li>
              </ul>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default SoloTeacherOverview;