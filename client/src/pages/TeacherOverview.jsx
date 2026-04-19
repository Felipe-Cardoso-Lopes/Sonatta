import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import TeacherSidebar from '../components/TeacherSidebar';

function TeacherOverview() {
  const [metrics, setMetrics] = useState([
    { label: 'Alunos Ativos', value: '0', icon: '👨‍🎓', color: 'text-blue-400' },
    { label: 'Cursos Criados', value: '0', icon: '📚', color: 'text-purple-400' },
    { label: 'Avisos', value: '0', icon: '🔔', color: 'text-green-400' },
  ]);

  // Estados do Banco de Dados
  const [students, setStudents] = useState([]);
  const [activeChatStudent, setActiveChatStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const chatScrollRef = useRef(null);
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // 1. Busca os alunos do professor ao abrir a tela
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Usamos a rota que já criamos no courseController para pegar os alunos
      const res = await axios.get(`${API_URL}/api/courses/teacher/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
      
      // Atualiza métricas
      setMetrics(prev => {
        const newMetrics = [...prev];
        newMetrics[0].value = res.data.length.toString(); // Alunos ativos
        return newMetrics;
      });
    } catch (err) {
      console.error("Erro ao carregar alunos", err);
    }
  };

  // 2. Busca o histórico de chat sempre que clicar num aluno
  useEffect(() => {
    if (activeChatStudent) {
      fetchChatHistory(activeChatStudent.id);
    }
  }, [activeChatStudent]);

  const fetchChatHistory = async (studentId) => {
    try {
      const res = await axios.get(`${API_URL}/api/messages/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Erro ao carregar mensagens", err);
    }
  };

  // 3. Rola o chat para baixo sempre que atualizar as mensagens
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 4. Envia a mensagem para o banco
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatStudent) return;

    try {
      const res = await axios.post(`${API_URL}/api/messages`, 
        { receiver_id: activeChatStudent.id, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Adiciona a mensagem real que voltou do banco
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      alert("Erro ao enviar mensagem.");
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row relative">
      <div className="shrink-0 z-20">
        <TeacherSidebar />
      </div>

      <main className="flex-grow p-6 md:p-10 flex flex-col h-screen overflow-hidden">
        <div className="max-w-6xl mx-auto w-full flex flex-col h-full gap-6">
          
          <div>
            <h1 className="text-3xl font-bold mb-2">Visão Geral</h1>
            <p className="text-gray-400">Suas métricas e comunicação com alunos.</p>
          </div>

          {/* Topo: Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{metric.label}</p>
                  <p className={`text-4xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>
                <div className="text-5xl opacity-80">{metric.icon}</div>
              </div>
            ))}
          </div>

          {/* Área Principal: Lista de Alunos e Chat Lado a Lado */}
          <div className="flex-grow flex flex-col lg:flex-row gap-6 min-h-0">
            
            {/* Coluna Esquerda: Lista de Alunos */}
            <aside className="w-full lg:w-1/3 bg-gray-800 rounded-xl border border-gray-700 flex flex-col overflow-hidden shadow-lg">
              <div className="p-4 bg-gray-900 border-b border-gray-700">
                <h2 className="text-lg font-bold text-purple-300">Meus Alunos</h2>
              </div>
              
              <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-2">
                {students.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm mt-4">Nenhum aluno matriculado.</p>
                ) : (
                  students.map(student => (
                    <div 
                      key={student.id}
                      onClick={() => setActiveChatStudent(student)}
                      className={`p-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${activeChatStudent?.id === student.id ? 'bg-purple-600 shadow-md' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-inner ${activeChatStudent?.id === student.id ? 'bg-purple-800 text-white' : 'bg-blue-500 text-white'}`}>
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <p className={`font-semibold text-sm truncate ${activeChatStudent?.id === student.id ? 'text-white' : 'text-gray-200'}`}>{student.name}</p>
                        <p className={`text-xs truncate ${activeChatStudent?.id === student.id ? 'text-purple-200' : 'text-gray-400'}`}>{student.course_title}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </aside>

            {/* Coluna Direita: Janela de Chat */}
            <section className="w-full lg:w-2/3 bg-gray-900 rounded-xl border border-gray-700 flex flex-col shadow-lg overflow-hidden">
              {activeChatStudent ? (
                <>
                  {/* Cabeçalho do Chat */}
                  <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center gap-3 shadow-md z-10">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white text-xl">
                      {activeChatStudent.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-bold text-lg leading-tight">{activeChatStudent.name}</h2>
                      <p className="text-xs text-gray-400">Matriculado em: {activeChatStudent.course_title}</p>
                    </div>
                  </div>

                  {/* Mensagens */}
                  <div ref={chatScrollRef} className="flex-grow overflow-y-auto p-6 flex flex-col gap-4">
                    {messages.length === 0 ? (
                      <div className="flex-grow flex items-center justify-center text-gray-500 text-sm">
                        Nenhuma mensagem encontrada. Envie um "Olá"!
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-3 rounded-xl max-w-[80%] text-sm shadow-md ${msg.isMine ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                            <p>{msg.message}</p>
                            {msg.time && <span className="text-[10px] opacity-50 block mt-1 text-right">{msg.time}</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSendMessage} className="p-4 bg-gray-800 border-t border-gray-700 flex gap-3">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escreva sua mensagem..." 
                      className="flex-grow bg-gray-900 border border-gray-600 rounded-full px-4 py-3 text-sm text-white outline-none focus:border-purple-500 transition-colors"
                    />
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white w-12 h-12 rounded-full flex items-center justify-center transition shadow-lg shrink-0">
                      ➤
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-gray-500 p-6 text-center">
                  <span className="text-6xl mb-4 opacity-50">💬</span>
                  <p className="text-lg font-semibold text-gray-400">Selecione um aluno</p>
                  <p className="text-sm">Clique em um aluno na lista ao lado para ver o histórico e enviar mensagens.</p>
                </div>
              )}
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}

export default TeacherOverview;