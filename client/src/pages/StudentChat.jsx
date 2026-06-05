import React, { useState, useEffect } from 'react';
import StudentSidebar from '../components/StudentSidebar';
import Header from '../components/Header';

function StudentChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeContact, setActiveContact] = useState(null);
  
  // Exemplo estático de contactos (No futuro, pode vir de uma API /api/users/teachers)
  const contacts = [
    { id: 2, name: 'Prof. Silva (Piano)', role: 'teacher' },
    { id: 3, name: 'Prof. Costa (Teoria)', role: 'teacher' }
  ];

  useEffect(() => {
    if (activeContact) {
      fetchMessages(activeContact.id);
    }
  }, [activeContact]);

  const fetchMessages = async (contactId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token'); // Assumindo que a rota está protegida
      
      const response = await fetch(`${API_URL}/api/messages/${contactId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        // Fallback visual para testes caso o backend retorne erro de auth
        setMessages([{ id: 1, sender_id: contactId, content: 'Olá! Como vão os estudos da pauta?', created_at: new Date() }]);
      }
    } catch (error) {
      console.error('Erro ao procurar mensagens:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    // Adiciona otimisticamente na UI
    const tempMsg = { id: Date.now(), sender_id: 'me', content: newMessage, created_at: new Date() };
    setMessages(prev => [...prev, tempMsg]);
    setNewMessage('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: activeContact.id,
          content: newMessage
        })
      });
    } catch (error) {
      console.error('Erro ao enviar:', error);
    }
  };

  return (
    <div className="flex h-screen bg-piano-black text-pure-white font-poppins">
      <StudentSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        
        <main className="flex-1 flex overflow-hidden p-6 gap-6">
          {/* Lista de Contactos */}
          <div className="w-1/3 max-w-sm bg-[#1a1a1a] rounded-lg border border-key-divider flex flex-col">
            <div className="p-4 border-b border-key-divider">
              <h2 className="text-xl font-bold">Mensagens</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {contacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => setActiveContact(contact)}
                  className={`w-full text-left p-4 rounded-lg mb-2 transition-colors ${
                    activeContact?.id === contact.id ? 'bg-purple-900/50 border border-purple-500' : 'hover:bg-[#252525]'
                  }`}
                >
                  <div className="font-semibold text-white">{contact.name}</div>
                  <div className="text-xs text-purple-400 capitalize">{contact.role}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Área do Chat */}
          <div className="flex-1 bg-[#121212] rounded-lg border border-key-divider flex flex-col">
            {activeContact ? (
              <>
                <div className="p-4 bg-[#1a1a1a] border-b border-key-divider flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                    {activeContact.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-lg">{activeContact.name}</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === 'me' || msg.sender_id !== activeContact.id;
                    return (
                      <div key={msg.id} className={`max-w-[70%] rounded-xl p-4 ${
                        isMe ? 'bg-purple-600 self-end rounded-tr-none' : 'bg-[#2a2a2a] self-start rounded-tl-none'
                      }`}>
                        <p>{msg.content}</p>
                        <span className="text-[10px] text-gray-300 mt-2 block opacity-70">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 bg-[#1a1a1a] border-t border-key-divider flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escreva a sua mensagem..."
                    className="flex-1 bg-piano-black border border-key-divider rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-500 px-6 font-bold rounded-lg transition-colors"
                  >
                    Enviar
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col text-gray-500">
                <span className="text-4xl mb-4">💬</span>
                <p>Selecione um contacto para iniciar a conversa</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentChat;