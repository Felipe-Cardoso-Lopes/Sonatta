import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from '../components/TeacherSidebar';
import SoloTeacherSidebar from '../components/SoloTeacherSidebar'; // Importando a nova sidebar

function TeacherChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeContact, setActiveContact] = useState(null);
  
  // Identifica que tipo de professor está acessando
  const teacherType = localStorage.getItem('teacherType') || 'institucional';

  // Mantenha a sua lógica existente de mensagens aqui
  // Exemplo de alunos mockados:
  const contacts = [
    { id: 1, name: 'Ana Silva', status: 'online' },
    { id: 2, name: 'Carlos Santos', status: 'offline' }
  ];

  return (
    <div className="flex h-screen bg-piano-black text-pure-white font-poppins overflow-x-hidden">
      
      {/* 1. MÁGICA ACONTECENDO AQUI: Renderização condicional da Sidebar */}
      {teacherType === 'independente' ? <SoloTeacherSidebar /> : <TeacherSidebar />}
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto h-full flex bg-[#1a1a1a] rounded-lg border border-key-divider overflow-hidden">
            
            {/* Lista de Contatos */}
            <div className="w-1/3 border-r border-key-divider flex flex-col">
              <div className="p-4 border-b border-key-divider">
                <h2 className="text-xl font-bold">Mensagens</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {contacts.map(contact => (
                  <div 
                    key={contact.id}
                    onClick={() => setActiveContact(contact)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${activeContact?.id === contact.id ? 'bg-[#2a2a2a] border border-purple-500/30' : 'hover:bg-[#252525]'}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{contact.name}</span>
                      <span className={`w-2 h-2 rounded-full ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Área do Chat */}
            <div className="w-2/3 flex flex-col">
              {activeContact ? (
                <>
                  <div className="p-4 border-b border-key-divider bg-[#222]">
                    <h3 className="text-lg font-bold">{activeContact.name}</h3>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto bg-[#121212]">
                    {/* Mensagens aparecerão aqui */}
                    <p className="text-gray-500 text-center text-sm mt-4">Início da conversa com {activeContact.name}</p>
                  </div>
                  <div className="p-4 border-t border-key-divider bg-[#1a1a1a] flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Digite sua mensagem..." 
                      className="flex-1 bg-[#252525] border border-gray-700 rounded p-2 text-white outline-none focus:border-purple-500"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded font-semibold transition-colors">
                      Enviar
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Selecione um aluno para iniciar o chat
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default TeacherChat;