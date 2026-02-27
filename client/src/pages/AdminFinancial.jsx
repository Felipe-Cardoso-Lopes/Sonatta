import React from 'react';
import AdminSidebar from '../components/AdminSidebar';

// Componente para os cards de informações financeiras
const FinancialCard = ({ title, items, isHighlighted }) => {
  const cardClasses = isHighlighted 
    ? "bg-gray-800 text-white" 
    : "bg-gray-100 text-black";
  
  const buttonClasses = isHighlighted
    ? "bg-white text-black"
    : "bg-gray-800 text-white";

  return (
    <div className={`p-6 rounded-lg shadow-md flex-1 ${cardClasses}`}>
      <h3 className="font-bold text-xl mb-4">{title}</h3>
      <ul className="list-disc list-inside space-y-2 mb-6">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <button className={`w-full py-2 rounded-lg font-semibold ${buttonClasses}`}>
        Detalhes
      </button>
    </div>
  );
};

function AdminFinancial() {
  // Dados de exemplo para os cards
  const financialData = {
    saldoDisponivel: ["List item", "List item", "List item", "List item", "List item"],
    totalFaturado: ["List item", "List item", "List item", "List item", "List item"],
    valoresAReceber: ["List item", "List item", "List item", "List item", "List item"],
  };

  return (
    <div className="min-h-screen bg-new-bg text-white-text font-poppins flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Conteúdo Principal */}
      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Coluna de Menu Secundária */}
        <aside className="w-full lg:w-1/4 lg:max-w-xs bg-gray-800 rounded-lg p-4 flex flex-col gap-4">
          <button className="bg-sidebar-bg w-full py-3 rounded-lg font-bold">
            Financeiro
          </button>
          <button className="bg-white text-dark-bg w-full py-3 rounded-lg font-semibold shadow-md">
            Painel de Saldo
          </button>
          <button className="bg-gray-700 w-full py-3 rounded-lg font-semibold hover:bg-gray-600">
            Solicitar Saque
          </button>
          <button className="bg-gray-700 w-full py-3 rounded-lg font-semibold hover:bg-gray-600">
            Histórico de Transações
          </button>
          <button className="bg-gray-700 w-full py-3 rounded-lg font-semibold hover:bg-gray-600">
            Gerar Relatórios
          </button>
        </aside>

        {/* Coluna Principal: Painel Financeiro */}
        <section className="flex-grow flex flex-col bg-white rounded-lg p-6 text-black">
          {/* Filtros de Período */}
          <div className="flex justify-center items-center gap-6 mb-6 text-gray-600 font-semibold">
            <a href="#" className="hover:text-black">Mensal</a>
            <a href="#" className="hover:text-black">Anual</a>
            <a href="#" className="hover:text-black">Link</a>
          </div>

          {/* Grade de Cards Financeiros */}
          <div className="flex flex-col lg:flex-row gap-6">
            <FinancialCard title="Saldo Disponível" items={financialData.saldoDisponivel} />
            <FinancialCard title="Total Faturado" items={financialData.totalFaturado} isHighlighted={true} />
            <FinancialCard title="Valores a receber" items={financialData.valoresAReceber} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminFinancial;