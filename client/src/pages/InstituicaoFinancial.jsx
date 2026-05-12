import React, { useState } from 'react';
import AdminSidebar from '../components/InstituicaoSidebar';

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
  // Estados para os filtros de data
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Dados de exemplo para os cards
  const financialData = {
    saldoDisponivel: ["List item", "List item", "List item", "List item", "List item"],
    totalFaturado: ["List item", "List item", "List item", "List item", "List item"],
    valoresAReceber: ["List item", "List item", "List item", "List item", "List item"],
  };

  // Funções de manipulação para os botões de download
  const handleDownloadPDF = () => {
    // A integração com a API do backend feita na Task 7.2 será inserida aqui
    console.log(`A solicitar PDF. Período: ${startDate} a ${endDate}`);
  };

  const handleDownloadCSV = () => {
    // A integração com a API do backend feita na Task 7.2 será inserida aqui
    console.log(`A solicitar CSV. Período: ${startDate} a ${endDate}`);
  };

  return (
    <div className="min-h-screen bg-new-bg text-white-text font-poppins flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Conteúdo Principal */}
      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Coluna de Menu Secundária */}
        <aside className="w-full lg:w-1/4 lg:max-w-xs bg-gray-800 rounded-lg p-4 flex flex-col gap-4">
          <button className="bg-sidebar-bg w-full py-3 rounded-lg font-bold text-white">
            Financeiro
          </button>
          <button className="bg-white text-dark-bg w-full py-3 rounded-lg font-semibold shadow-md">
            Painel de Saldo
          </button>
          <button className="bg-gray-700 text-white w-full py-3 rounded-lg font-semibold hover:bg-gray-600">
            Solicitar Saque
          </button>
          <button className="bg-gray-700 text-white w-full py-3 rounded-lg font-semibold hover:bg-gray-600">
            Histórico de Transações
          </button>
          <button className="bg-gray-700 text-white w-full py-3 rounded-lg font-semibold hover:bg-gray-600">
            Gerar Relatórios
          </button>
        </aside>

        {/* Coluna Principal: Painel Financeiro */}
        <section className="flex-grow flex flex-col bg-white rounded-lg p-6 text-black">
          
          {/* Barra de Ferramentas: Filtros de Data e Botões de Exportação */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
            
            {/* Filtros de Período */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <label htmlFor="startDate" className="text-sm font-semibold text-gray-700">Data Inicial:</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="endDate" className="text-sm font-semibold text-gray-700">Data Final:</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Botões de Download */}
            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow flex items-center justify-center gap-2"
              >
                📄 Fatura (PDF)
              </button>
              <button
                onClick={handleDownloadCSV}
                className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow flex items-center justify-center gap-2"
              >
                📊 Alunos (CSV)
              </button>
            </div>
            
          </div>

          {/* Grade de Cards Financeiros */}
          <div className="flex flex-col xl:flex-row gap-6">
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