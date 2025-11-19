import React from 'react';
import AdminSidebar from '../components/AdminSidebar';

// Componente para o Card na grade de gerenciamento
const ManagementCard = ({ text, price }) => (
  <div className="bg-white rounded-lg shadow p-4 text-black">
    <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center mb-4">
      {/* Placeholder para a imagem */}
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    </div>
    <p className="font-semibold">{text}</p>
    <p className="text-gray-600">{price}</p>
  </div>
);

function AdminManagement() {
  // Dados de exemplo para os cards
  const items = [
    { text: 'Text', price: '$0' },
    { text: 'Text', price: '$0' },
    { text: 'Text', price: '$0' },
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
            Gerenciamento
          </button>
          <button className="bg-white text-dark-bg w-full py-3 rounded-lg font-semibold shadow-md">
            Cursos
          </button>
          <button className="bg-gray-700 w-full py-3 rounded-lg font-semibold hover:bg-gray-600">
            Alunos
          </button>
          <button className="bg-gray-700 w-full py-3 rounded-lg font-semibold hover:bg-gray-600">
            Professores
          </button>
        </aside>

        {/* Coluna Principal: Grade de Itens */}
        <section className="flex-grow flex flex-col bg-white rounded-lg p-6 text-black">
          {/* Barra de Busca */}
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>

          {/* Grade de Itens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <ManagementCard key={index} {...item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminManagement;