import React, { useState, useEffect } from 'react';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import Header from '../components/Header';
import Button from '../components/Button';

function SuperAdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/super-admin/subscriptions`);
      const data = await response.json();
      
      if (response.ok) {
        setSubscriptions(data);
      }
    } catch (error) {
      console.error('Erro ao buscar assinaturas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Tem certeza que deseja remover esta assinatura? A instituição perderá o acesso premium imediatamente.');
    if (!confirm) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/super-admin/subscriptions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
        alert('Assinatura removida com sucesso!');
      } else {
        const data = await response.json();
        alert(data.message || 'Erro ao remover assinatura.');
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
    }
  };

  return (
    <div className="flex h-screen bg-piano-black text-pure-white font-poppins">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Gestão de Assinaturas</h1>
                <p className="text-gray-400">Torre de Controle: Monitore os planos das instituições parceiras.</p>
              </div>
              <Button variant="primary">Nova Assinatura</Button>
            </header>

            <div className="bg-[#1a1a1a] rounded-lg border border-key-divider overflow-hidden">
              {loading ? (
                <p className="p-6 text-center text-gray-500 text-piano-keys">Carregando dados globais...</p>
              ) : subscriptions.length === 0 ? (
                <p className="p-6 text-center text-gray-500">Nenhuma assinatura ativa no sistema.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#2a2a2a] border-b border-key-divider text-sm">
                      <th className="p-4 font-semibold">Instituição</th>
                      <th className="p-4 font-semibold">Plano</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Vencimento</th>
                      <th className="p-4 font-semibold text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="border-b border-key-divider hover:bg-[#252525] transition-colors">
                        <td className="p-4 font-medium text-white">
                          {sub.instituicao_nome || `ID: ${sub.instituicao_id}`}
                        </td>
                        <td className="p-4 text-purple-400 font-bold">{sub.plan_name}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                            sub.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400">
                          {new Date(sub.end_date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleDelete(sub.id)}
                            className="text-red-500 hover:text-red-400 text-sm font-semibold"
                          >
                            Cancelar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SuperAdminSubscriptions;