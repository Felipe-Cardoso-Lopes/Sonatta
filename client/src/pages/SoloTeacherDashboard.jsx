import React from 'react';
import SoloTeacherSidebar from '../components/SoloTeacherSidebar';

function SoloTeacherDashboard() {
  const metrics = [
    { label: 'Faturamento Mensal', value: 'R$ 3.450', icon: '💰', color: 'text-green-400' },
    { label: 'Alunos Ativos', value: '28', icon: '📈', color: 'text-blue-400' },
    { label: 'Aulas Hoje', value: '4', icon: '📅', color: 'text-purple-400' },
  ];

  const todaysLessons = [
    { id: 1, student: 'Lucas Mendes', instrument: 'Violão', time: '14:00 - 15:00', type: 'Ao Vivo' },
    { id: 2, student: 'Amanda Silva', instrument: 'Piano', time: '16:30 - 17:30', type: 'Presencial' },
  ];

  const pendingPayments = [
    { id: 1, student: 'Marcos Paulo', amount: 'R$ 150,00', dueDate: 'Hoje' },
    { id: 2, student: 'Julia Costa', amount: 'R$ 200,00', dueDate: 'Amanhã' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row relative">
      <SoloTeacherSidebar />

      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard do Professor</h1>
              <p className="text-gray-400">Visão geral do seu negócio e agenda do dia.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1 font-medium">{metric.label}</p>
                  <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>
                <div className="text-4xl opacity-80">{metric.icon}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-700 p-6 shadow-lg flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-purple-300">Próximas Aulas (Hoje)</h2>
              </div>
              <div className="space-y-4">
                {todaysLessons.map(lesson => (
                  <div key={lesson.id} className="flex justify-between items-center p-4 bg-gray-800 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-600/20 text-purple-400 rounded-lg flex items-center justify-center font-bold">
                        {lesson.time.split(':')[0]}h
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{lesson.student}</h3>
                        <p className="text-sm text-gray-400">{lesson.instrument}</p>
                      </div>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                      {lesson.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 shadow-lg flex flex-col">
              <h2 className="text-xl font-bold text-green-400 mb-6">Alertas Financeiros</h2>
              <div className="space-y-3">
                {pendingPayments.map(payment => (
                  <div key={payment.id} className="p-4 bg-gray-800 border border-gray-700 rounded-lg relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-gray-200">{payment.student}</h4>
                      <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 rounded font-bold">Vence {payment.dueDate}</span>
                    </div>
                    <p className="text-lg font-bold text-white mt-1">{payment.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SoloTeacherDashboard;