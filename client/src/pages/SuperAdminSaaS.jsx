import React, { useState, useEffect } from 'react';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import Header from '../components/Header';
import Button from '../components/Button';

function SuperAdminSaaS() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/super-admin/saas-plans`);
        if (response.ok) {
          const data = await response.json();
          setPlans(data);
        }
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="flex h-screen bg-piano-black text-pure-white font-poppins">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Configuração SaaS</h1>
                <p className="text-gray-400">Gerencie os planos, preços e limites da plataforma Sonatta.</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading ? <p>Carregando planos...</p> : plans.map(plan => (
                <div key={plan.id} className="bg-[#1a1a1a] p-6 rounded-lg border border-key-divider flex flex-col">
                  <h2 className="text-2xl font-bold text-purple-400 mb-4">{plan.name}</h2>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Preço Mensal:</span>
                      <span className="font-bold">R$ {plan.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Limite de Alunos:</span>
                      <span className="font-bold">{plan.max_students || 'Ilimitado'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Limite de Professores:</span>
                      <span className="font-bold">{plan.max_teachers || 'Ilimitado'}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-6">Editar Plano</Button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SuperAdminSaaS;