import React from 'react';
import AdminSidebar from '../components/AdminSidebar';

// Componente reutilizável para os cards de informação
const InfoCard = ({ title, period, icon, }) => (
  <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col text-gray-800 min-h-[200px]">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold">
          {icon}
        </div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-xs text-gray-500">{period}</p>
        </div>
      </div>
      <button className="text-gray-500">•••</button>
    </div>
    <div className="flex-grow bg-gray-200 rounded-lg flex items-center justify-center">
      {/* Placeholder para o conteúdo do card (gráfico/ícone grande) */}
      <div className="w-16 h-16 bg-gray-300 rounded-md"></div>
    </div>
    {(title === 'Gráfico de Desempenho' || title === 'Feed de atividades') && (
      <div className="mt-4">
        <p className="font-bold">Title</p>
        <p className="text-sm text-gray-500">Subtitle</p>
      </div>
    )}
  </div>
);

function AdminOverview() {
  const cards = [
    { title: 'Receitas', period: 'Outubro', icon: 'R' },
    { title: 'Novas Inscrições', period: 'Outubro', icon: 'N' },
    { title: 'Alunos novos', period: 'Outubro', icon: 'A' },
    { title: 'Dúvidas', period: 'Outubro', icon: 'D' },
  ];

  const largeCards = [
    { title: 'Gráfico de Desempenho', period: 'Outubro', icon: 'A' },
    { title: 'Feed de atividades', period: 'Outubro', icon: 'A' },
  ];

  return (
    <div className="min-h-screen bg-new-bg text-white-text font-poppins flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Conteúdo Principal */}
      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Coluna de Menu Secundária */}
        <aside className="w-full lg:w-1/4 lg:max-w-xs bg-gray-800 rounded-lg p-4 flex flex-col gap-4">
          <button className="bg-sidebar-bg w-full py-3 rounded-lg font-bold">
            Visão Geral
          </button>
          <button className="bg-white text-dark-bg w-full py-3 rounded-lg font-semibold shadow-md">
            Painel de Controle
          </button>
        </aside>

        {/* Coluna Principal: Grade de Cards */}
        <section className="flex-grow flex flex-col gap-6">
          {/* Linha Superior de Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <InfoCard key={index} {...card} />
            ))}
          </div>
          
          {/* Linha Inferior de Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
            {largeCards.map((card, index) => (
              <InfoCard key={index} {...card} />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

export default AdminOverview;