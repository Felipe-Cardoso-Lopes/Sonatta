import React, { useState, useEffect } from 'react';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import Header from '../components/Header';

function SuperAdminSystem() {
  const [systemStats, setSystemStats] = useState({
    status: 'Online',
    uptime: '99.9%',
    cpuUsage: '0%',
    memoryUsage: '0 MB',
    activeUsers: 0
  });
  const [logs, setLogs] = useState([]);

  // Simulação de busca de dados do servidor (Polling a cada 5 segundos)
  useEffect(() => {
    fetchSystemHealth();
    const interval = setInterval(fetchSystemHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemHealth = async () => {
    try {
      // Preparado para uma futura rota real de monitoramento do Node.js
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/super-admin/system-stats`).catch(() => null);
      
      if (response && response.ok) {
        const data = await response.json();
        setSystemStats(data.stats);
        setLogs(data.logs);
      } else {
        // Fallback de simulação visual (Mamba Mode: simulando o motor girando)
        const mockCpu = Math.floor(Math.random() * (45 - 20 + 1) + 20); // Entre 20% e 45%
        const mockRam = Math.floor(Math.random() * (512 - 400 + 1) + 400); // Entre 400MB e 512MB
        
        setSystemStats({
          status: 'Online (Simulado)',
          uptime: '14d 05h 22m',
          cpuUsage: `${mockCpu}%`,
          memoryUsage: `${mockRam} MB`,
          activeUsers: Math.floor(Math.random() * 15) + 10
        });

        // Simula logs do sistema em tempo real
        setLogs(prevLogs => {
          const newLog = `[${new Date().toLocaleTimeString()}] GET /api/users - 200 OK - ${Math.floor(Math.random() * 50)}ms`;
          const updatedLogs = [newLog, ...prevLogs];
          return updatedLogs.slice(0, 8); // Mantém apenas os últimos 8 logs
        });
      }
    } catch (error) {
      console.error('Erro ao buscar status do sistema:', error);
    }
  };

  return (
    <div className="flex h-screen bg-piano-black text-pure-white font-poppins">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Monitoramento do Sistema</h1>
              <p className="text-gray-400">Telemetria em tempo real e saúde do servidor da plataforma Sonatta.</p>
            </header>

            {/* Grid de Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Status do Servidor" value={systemStats.status} color="text-green-400" icon="🟢" />
              <StatCard title="Tempo de Atividade" value={systemStats.uptime} color="text-purple-400" icon="⏱️" />
              <StatCard title="Uso de CPU" value={systemStats.cpuUsage} color="text-blue-400" icon="⚙️" />
              <StatCard title="Uso de RAM" value={systemStats.memoryUsage} color="text-orange-400" icon="🧠" />
            </div>

            {/* Seção de Logs do Sistema (Emulação de Terminal) */}
            <div className="bg-[#121212] rounded-lg border border-key-divider overflow-hidden">
              <div className="bg-[#1a1a1a] p-4 border-b border-key-divider flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span>💻</span> Terminal de Acessos (Live)
                </h2>
                <span className="flex items-center gap-2 text-xs text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Conectado
                </span>
              </div>
              <div className="p-4 h-64 overflow-y-auto font-mono text-sm text-gray-300">
                {logs.length === 0 ? (
                  <p className="text-gray-500">Aguardando dados de telemetria...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1 hover:bg-[#1a1a1a] p-1 rounded">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

// Componente auxiliar para os Cards de métrica
function StatCard({ title, value, color, icon }) {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-key-divider shadow-lg flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <span className="text-xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default SuperAdminSystem;