import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InstituicaoSidebar from '../components/InstituicaoSidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function InstituicaoFinancial() {
  const [summary, setSummary] = useState({ currentMonthRevenue: 0, pendingTransfers: 0 });
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: 'all' });

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  useEffect(() => {
    fetchFinancialData();
  }, [filters]);

  const fetchFinancialData = async () => {
    try {
      const sumRes = await axios.get(`${API_URL}/api/payments/institution/summary`, getAuthHeaders());
      setSummary(sumRes.data);

      // Constrói Query String
      const query = new URLSearchParams(filters).toString();
      const transRes = await axios.get(`${API_URL}/api/payments/institution/transactions?${query}`, getAuthHeaders());
      setTransactions(transRes.data);
    } catch (err) { console.error('Erro ao buscar dados financeiros', err); }
  };

  // F22: Exportar Relatório em CSV
  const exportToCSV = () => {
    if (transactions.length === 0) return alert("Não há dados para exportar.");
    const headers = "ID,Aluno,Curso,Valor Bruto,Taxa,Líquido,Status,Data\\n";
    const csvRows = transactions.map(t => 
      `${t.id},${t.student_name},${t.course_name},${t.gross_value},${t.platform_fee},${t.net_value},${t.status},${new Date(t.payment_date).toLocaleDateString('pt-BR')}`
    ).join("\\n");

    const blob = new Blob([headers + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'relatorio_financeiro.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Mock para o Gráfico (Evolução)
  const chartData = [
    { name: 'Jan', receita: 1200 }, { name: 'Fev', receita: 1900 },
    { name: 'Mar', receita: 1500 }, { name: 'Abr', receita: 2200 },
    { name: 'Mai', receita: summary.currentMonthRevenue || 0 },
  ];

  return (
    <div className="min-h-screen bg-piano-black text-white-text flex">
      <InstituicaoSidebar />
      <main className="flex-grow p-8 overflow-y-auto">
        
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Financeiro e Repasses</h1>
            <p className="text-gray-400">Acompanhe suas receitas, extrato de vendas e repasses da Sonatta.</p>
          </div>
          <button onClick={exportToCSV} className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-bold border border-gray-600 transition flex items-center gap-2">
            📄 Exportar Extrato (CSV)
          </button>
        </header>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-700 shadow-lg border-l-4 border-l-green-500">
            <p className="text-gray-400 text-sm font-semibold uppercase">Faturamento Líquido (Mês)</p>
            <h2 className="text-3xl font-bold text-white mt-2">R$ {summary.currentMonthRevenue.toFixed(2)}</h2>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-700 shadow-lg border-l-4 border-l-yellow-500">
            <p className="text-gray-400 text-sm font-semibold uppercase">Repasses Pendentes</p>
            <h2 className="text-3xl font-bold text-white mt-2">R$ {summary.pendingTransfers.toFixed(2)}</h2>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-700 shadow-lg border-l-4 border-l-blue-500">
            <p className="text-gray-400 text-sm font-semibold uppercase">Taxa Padrão Sonatta</p>
            <h2 className="text-3xl font-bold text-blue-400 mt-2">10% / Venda</h2>
          </div>
        </div>

        {/* Gráfico e Filtros em Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Gráfico */}
          <div className="lg:col-span-2 bg-[#1a1a1a] p-6 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="font-bold mb-4 text-purple-300">Evolução de Receitas Líquidas</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="receita" stroke="#a855f7" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filtros do Extrato */}
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col gap-4">
            <h3 className="font-bold text-purple-300">Filtros do Extrato</h3>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Data Inicial</label>
              <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="w-full bg-[#252525] border border-gray-600 rounded p-2 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Data Final</label>
              <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} className="w-full bg-[#252525] border border-gray-600 rounded p-2 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Status do Repasse</label>
              <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="w-full bg-[#252525] border border-gray-600 rounded p-2 text-white text-sm">
                <option value="all">Todas as transações</option>
                <option value="paid">Repassado / Concluído</option>
                <option value="pending">Pendente</option>
                <option value="refunded">Reembolsado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela de Extrato */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-700 shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-900 border-b border-gray-700">
            <h3 className="font-bold text-white">Extrato Detalhado</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Data</th>
                  <th className="p-4 font-semibold">Aluno / Curso</th>
                  <th className="p-4 font-semibold">Valor Bruto</th>
                  <th className="p-4 font-semibold">Taxa</th>
                  <th className="p-4 font-semibold text-purple-300">Receita Líquida</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {transactions.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-gray-500">Nenhuma transação encontrada no período.</td></tr>
                ) : (
                  transactions.map(t => (
                    <tr key={t.id} className="hover:bg-[#252525] transition-colors">
                      <td className="p-4 text-gray-300">{new Date(t.payment_date).toLocaleDateString('pt-BR')}</td>
                      <td className="p-4">
                        <p className="font-bold text-white">{t.student_name}</p>
                        <p className="text-xs text-gray-500">{t.course_name}</p>
                      </td>
                      <td className="p-4 text-gray-400">R$ {parseFloat(t.gross_value).toFixed(2)}</td>
                      <td className="p-4 text-red-400">- R$ {parseFloat(t.platform_fee).toFixed(2)}</td>
                      <td className="p-4 font-bold text-green-400">R$ {parseFloat(t.net_value).toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${t.status === 'paid' ? 'bg-green-500/20 text-green-400' : t.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                          {t.status === 'paid' ? 'Repassado' : t.status === 'pending' ? 'Pendente' : 'Estornado'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

export default InstituicaoFinancial;