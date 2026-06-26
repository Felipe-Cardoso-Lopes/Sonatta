import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoloTeacherSidebar from '../components/SoloTeacherSidebar';

function SoloTeacherFinancial() {
  const navigate = useNavigate();

  // Trava de Segurança
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const teacherType = localStorage.getItem('teacherType');

    if (!token) {
      navigate('/login');
    } else if (role !== 'professor' || teacherType !== 'independente') {
      navigate('/');
    }
  }, [navigate]);

  // Dados simulados para o layout
  const [transactions] = useState([
    { id: 1, student: 'Lucas Gabriel', course: 'Violão para Iniciantes', date: '15/05/2026', amount: 'R$ 150,00', status: 'Aprovado' },
    { id: 2, student: 'Mariana Costa', course: 'Teoria Musical', date: '14/05/2026', amount: 'R$ 90,00', status: 'Pendente' },
    { id: 3, student: 'Pedro Henrique', course: 'Masterclass de Guitarra', date: '10/05/2026', amount: 'R$ 200,00', status: 'Aprovado' },
  ]);

  return (
    <div className="min-h-screen bg-piano-black text-white-text font-poppins flex overflow-x-hidden">
      <SoloTeacherSidebar />
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">

          <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Controle Financeiro</h1>
              <p className="text-gray-400">Acompanhe os seus ganhos, histórico de pagamentos e solicite saques.</p>
            </div>
            <button className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg flex items-center justify-center gap-2">
              <span>💸</span> Solicitar Saque
            </button>
          </header>

          {/* Cards de Métricas Financeiras */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700 shadow-lg border-l-4 border-l-purple-500">
              <h3 className="text-gray-400 text-sm font-medium mb-1">Saldo Disponível</h3>
              <p className="text-3xl font-bold text-white">R$ 1.250,00</p>
            </div>
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700 shadow-lg border-l-4 border-l-yellow-500">
              <h3 className="text-gray-400 text-sm font-medium mb-1">A Receber (Próximos 30 dias)</h3>
              <p className="text-3xl font-bold text-white">R$ 450,00</p>
            </div>
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700 shadow-lg border-l-4 border-l-green-500">
              <h3 className="text-gray-400 text-sm font-medium mb-1">Total Arrecadado no Mês</h3>
              <p className="text-3xl font-bold text-white">R$ 3.450,00</p>
            </div>
          </div>

          {/* Tabela de Histórico */}
          <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>📄</span> Histórico de Transacções
            </h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-700 text-gray-400 text-sm">
                    <th className="pb-3 font-medium">Aluno</th>
                    <th className="pb-3 font-medium">Curso/Serviço</th>
                    <th className="pb-3 font-medium">Data</th>
                    <th className="pb-3 font-medium">Valor</th>
                    <th className="pb-3 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id} className="border-b border-gray-800 hover:bg-[#252525] transition-colors">
                      <td className="py-4 font-semibold text-white">{t.student}</td>
                      <td className="py-4 text-gray-300 text-sm">{t.course}</td>
                      <td className="py-4 text-gray-400 text-sm">{t.date}</td>
                      <td className="py-4 font-medium text-white">{t.amount}</td>
                      <td className="py-4 text-center">
                        <span className={`px-3 py-1 text-xs rounded-full border ${
                          t.status === 'Aprovado' 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}

export default SoloTeacherFinancial;