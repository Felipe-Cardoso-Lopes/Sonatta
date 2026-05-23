import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SoloTeacherSidebar from '../components/SoloTeacherSidebar';

function SoloTeacherDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || "Professor";

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const teacherType = localStorage.getItem('teacherType');

    // Validação estrita da trava de segurança
    if (!token) {
      navigate('/login');
    } else if (role !== 'professor' || teacherType !== 'independente') {
      // Se não for professor ou se for do tipo institucional, barra o acesso
      navigate('/');
    }
  }, [navigate]);

  // Mantive a estrutura original das suas métricas
  const metrics = [
    { label: 'Faturamento Mensal', value: 'R$ 3.450', icon: '💰', color: 'text-green-400' },
    { label: 'Alunos Ativos', value: '28', icon: '👥', color: 'text-blue-400' },
    { label: 'Aulas Hoje', value: '4', icon: '📅', color: 'text-purple-400' },
  ];

  return (
    <div className="flex h-screen bg-piano-black text-pure-white font-poppins">
      <SoloTeacherSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Painel do Professor Independente</h1>
        <p className="text-gray-400 mb-8">Bem-vindo de volta, {userName}!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, idx) => (
             <div key={idx} className="bg-[#1a1a1a] p-6 rounded-lg border border-key-divider">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-400 text-sm font-medium">{metric.label}</h3>
                  <span className="text-xl">{metric.icon}</span>
                </div>
                <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
             </div>
          ))}
        </div>

        {/* Mantenha o restante do código que você já tiver aqui dentro do dashboard */}
      </div>
    </div>
  );
}

export default SoloTeacherDashboard;