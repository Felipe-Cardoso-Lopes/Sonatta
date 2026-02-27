import React from 'react';
import TeacherSidebar from '../components/TeacherSidebar';

// Componente para um item da lista de mensagens
const MessageItem = ({ name, course, isNew }) => (
  <div className={`p-3 rounded-lg flex items-center justify-between cursor-pointer ${isNew ? 'bg-gray-600' : 'hover:bg-gray-600'}`}>
    <div className="flex items-center gap-3">
      <span className="text-yellow-400">☆</span>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-xs text-gray-400">{course}</p>
      </div>
    </div>
    <div className="w-6 h-6 bg-gray-800 rounded-sm flex items-center justify-center">
      {isNew ? '■' : '□'}
    </div>
  </div>
);


function TeacherOverview() {
  // Dados de exemplo para as mensagens
  const messages = [
    { name: 'João Roberto', course: 'Curso: Piano para Iniciantes', isNew: true },
    { name: 'Guilherme Barros', course: 'Formas de praticar', isNew: false },
    { name: 'Felipe Cardoso', course: 'Preciso de um feedback', isNew: false },
  ];

  return (
    <div className="min-h-screen bg-new-bg text-white-text font-poppins flex flex-col md:flex-row">
      <TeacherSidebar />

      {/* Conteúdo Principal */}
      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Coluna de Menu Secundária */}
        <aside className="w-full lg:w-1/4 lg:max-w-xs bg-gray-800 rounded-lg p-4 flex flex-col gap-4">
          <button className="bg-sidebar-bg w-full py-3 rounded-lg font-bold hover:bg-opacity-80">
            Visão Geral
          </button>
          <button className="bg-gray-700 w-full py-3 rounded-lg hover:bg-gray-600">
            Atividades Recentes
          </button>
          
          {/* Seção de Mensagens */}
          <div className="bg-gray-700 rounded-lg p-3 flex-grow">
            <h3 className="font-bold mb-3 px-2">Mensagens Recentes</h3>
            <div className="flex flex-col gap-2">
              {messages.map((msg, index) => (
                <MessageItem key={index} {...msg} />
              ))}
            </div>
          </div>

          <button className="bg-gray-700 w-full py-3 rounded-lg hover:bg-gray-600">
            Calendário
          </button>
          <button className="bg-gray-700 w-full py-3 rounded-lg hover:bg-gray-600">
            Notificações
          </button>
        </aside>

        {/* Coluna Principal: Chat */}
        <section className="flex-grow flex flex-col bg-black rounded-lg p-6 min-h-[500px] lg:min-h-0">
          <div className="flex-grow overflow-y-auto">
            {/* Mensagens do Chat */}
            <div className="mb-4">
              <div className="bg-white text-black p-3 rounded-lg max-w-md">
                Bom dia Professor! Estou com uma dúvida num exercício do módulo 1.
              </div>
            </div>
            <div className="flex justify-end mb-4">
              <div className="bg-white text-black p-3 rounded-lg max-w-md">
                Sim, vamos começar!
              </div>
            </div>
          </div>

          {/* Input de Mensagem */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Mensagem" 
              className="flex-grow bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sidebar-bg"
            />
            <button className="bg-sidebar-bg px-8 py-3 rounded-lg font-bold hover:bg-opacity-80">
              Enviar
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}

export default TeacherOverview;