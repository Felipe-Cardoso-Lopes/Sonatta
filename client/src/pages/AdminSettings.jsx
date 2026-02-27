import React from 'react';
import AdminSidebar from '../components/AdminSidebar';

// Componente para um card na grade de exibição
const ItemCard = ({ text, price }) => (
  <div className="bg-gray-100 rounded-lg p-4 text-black text-center">
    <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center mb-3">
      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    </div>
    <p className="font-semibold">{text}</p>
    <p className="text-sm text-gray-600">{price}</p>
  </div>
);

function AdminSettings() {
  // Dados de exemplo para os cards
  const items = [
    { text: 'Text', price: '$0' },
    { text: 'Text', price: '$0' },
    { text: 'Text', price: '$0' },
  ];

  return (
    <div className="min-h-screen bg-new-bg text-white-text font-poppins flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Conteúdo Principal */}
      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Coluna de Menu Secundária */}
        <aside className="w-full lg:w-1/4 lg:max-w-xs bg-gray-800 rounded-lg p-4 flex flex-col gap-4">
          <button className="bg-sidebar-bg w-full py-3 rounded-lg font-bold">
            Configurações da Escola
          </button>
          <button className="bg-white text-dark-bg w-full py-3 rounded-lg font-semibold shadow-md">
            Perfil da Escola
          </button>
          <button className="bg-gray-700 w-full py-3 rounded-lg font-semibold hover:bg-gray-600">
            Configurações de Pagamento
          </button>
          <button className="bg-gray-700 w-full py-3 rounded-lg font-semibold hover:bg-gray-600">
            Notificações
          </button>
        </aside>

        {/* Coluna Principal: Área de Configuração */}
        <section className="flex-grow flex flex-col lg:flex-row bg-white rounded-lg p-6 text-black gap-6">
          
          {/* Coluna de Filtros (à esquerda dentro da seção principal) */}
          <div className="w-full lg:w-1/3 lg:max-w-xs flex flex-col gap-4">
            <div>
              <h4 className="font-bold mb-2">Keywords</h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-200 text-sm px-2 py-1 rounded-full flex items-center">Spring <button className="ml-1">×</button></span>
                <span className="bg-gray-200 text-sm px-2 py-1 rounded-full flex items-center">Smart <button className="ml-1">×</button></span>
                <span className="bg-gray-200 text-sm px-2 py-1 rounded-full flex items-center">Modern <button className="ml-1">×</button></span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label><input type="checkbox" className="mr-2" defaultChecked readOnly /> Label</label>
              <p className="text-xs text-gray-500 pl-6">Description</p>
              <label><input type="checkbox" className="mr-2" defaultChecked readOnly /> Label</label>
              <p className="text-xs text-gray-500 pl-6">Description</p>
              <label><input type="checkbox" className="mr-2" defaultChecked readOnly /> Label</label>
              <p className="text-xs text-gray-500 pl-6">Description</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="font-bold">Label</label>
                <span>$0-100</span>
              </div>
              <input type="range" className="w-full" />
            </div>

            <div>
              <h4 className="font-bold mb-2">Color</h4>
              <div className="space-y-2">
                <label><input type="checkbox" className="mr-2" defaultChecked readOnly /> Label</label>
                <label><input type="checkbox" className="mr-2" /> Label</label>
                <label><input type="checkbox" className="mr-2" /> Label</label>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-2">Size</h4>
              <div className="space-y-2">
                <label><input type="checkbox" className="mr-2" defaultChecked readOnly /> Label</label>
                <label><input type="checkbox" className="mr-2" defaultChecked readOnly /> Label</label>
                <label><input type="checkbox" className="mr-2" /> Label</label>
              </div>
            </div>
          </div>

          {/* Área de Exibição (à direita dentro da seção principal) */}
          <div className="flex-grow flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <div className="relative w-full md:w-1/3">
                <input type="text" placeholder="Search" className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-400" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button className="bg-black text-white text-sm px-3 py-1 rounded-md">✓ New</button>
                <button className="text-sm text-gray-600 px-3 py-1">Price ascending</button>
                <button className="text-sm text-gray-600 px-3 py-1">Price descending</button>
                <button className="text-sm text-gray-600 px-3 py-1">Rating</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <ItemCard key={index} {...item} />
              ))}
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

export default AdminSettings;