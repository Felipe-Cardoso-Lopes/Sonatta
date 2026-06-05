import React, { useState } from 'react';
import InstituicaoSidebar from '../components/InstituicaoSidebar';

function InstituicaoSettings() {
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  // Função disparada ao clicar em "Fazer Upgrade"
  const handleUpgrade = async () => {
    setIsLoadingPayment(true);
    try {
      const token = localStorage.getItem('token'); 
      
      const response = await fetch('http://localhost:5000/api/payments/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: 'PRO',
          description: 'Assinatura Sonatta - Plano Instituição',
          price: 499.90
        })
      });

      const data = await response.json();

      // Redireciona para o Checkout Pro do Mercado Pago
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Erro ao gerar sessão de pagamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao redirecionar para pagamento:', error);
      alert('Falha na comunicação com o servidor de pagamentos.');
    } finally {
      setIsLoadingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-new-bg text-white-text font-poppins flex flex-col md:flex-row">
      <InstituicaoSidebar />

      {/* Conteúdo Principal */}
      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Coluna de Menu Secundária */}
        <aside className="w-full lg:w-1/4 lg:max-w-xs bg-gray-800 rounded-lg p-4 flex flex-col gap-4 h-fit">
          <button className="bg-gray-700 text-white w-full py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
            Configurações da Escola
          </button>
          <button className="bg-gray-700 text-white w-full py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
            Perfil da Escola
          </button>
          <button className="bg-sidebar-bg w-full py-3 rounded-lg font-bold text-white shadow-md">
            Configurações de Pagamento
          </button>
          <button className="bg-gray-700 text-white w-full py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
            Notificações
          </button>
        </aside>

        {/* Coluna Principal: Área de Configuração */}
        <section className="flex-grow flex flex-col bg-white rounded-lg p-6 text-black">
          
          <h2 className="text-2xl font-bold border-b border-gray-200 pb-4 mb-6">Gerenciamento de Assinatura</h2>
          
          {/* Secção de Upgrade de Plano */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
              
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Plano Atual: <span className="text-gray-500">Gratuito (Trial)</span></h3>
                <p className="text-sm text-gray-600 mb-4">
                  Faça o upgrade para o <strong className="text-blue-600">Plano Pro</strong> e desbloqueie o cadastro ilimitado de professores e alunos, além da emissão de relatórios consolidados.
                </p>
                
                <ul className="text-sm text-gray-700 space-y-2 list-none">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Professores Ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Alunos Ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Faturamento e Relatórios CSV/PDF
                  </li>
                </ul>
              </div>

              <div className="w-full xl:w-auto flex flex-col items-center gap-4 border-t xl:border-t-0 xl:border-l border-gray-200 pt-6 xl:pt-0 xl:pl-8">
                <div className="text-center">
                  <span className="text-3xl font-black text-gray-800">R$ 499,90</span>
                  <span className="text-sm font-normal text-gray-500">/mês</span>
                </div>
                
                <button
                  onClick={handleUpgrade}
                  disabled={isLoadingPayment}
                  className={`px-8 py-3 rounded-lg font-bold text-white transition-all shadow-md flex items-center justify-center w-full min-w-[240px]
                    ${isLoadingPayment ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isLoadingPayment ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Gerando Sessão...
                    </span>
                  ) : (
                    '⭐ Assinar Plano Pro'
                  )}
                </button>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  🔒 Pagamento seguro via Mercado Pago
                </span>
              </div>
              
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

export default InstituicaoSettings;