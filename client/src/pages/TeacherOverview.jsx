import React, { useState, useRef, useEffect } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';

function TeacherOverview() {
  const metrics = [
    { label: 'Alunos Ativos', value: '24', icon: '👨‍🎓', color: 'text-blue-400' },
    { label: 'Aulas na Semana', value: '18', icon: '📅', color: 'text-purple-400' },
    { label: 'Horas Lecionadas', value: '120h', icon: '⏱️', color: 'text-green-400' },
  ];

  const todaysLessons = [
    { id: 1, student: 'Lucas Mendes', instrument: 'Violão', time: '14:00 - 15:00', status: 'Confirmada' },
    { id: 2, student: 'Amanda Silva', instrument: 'Piano', time: '16:30 - 17:30', status: 'Pendente' },
  ];

  // ================= ESTADOS DO CHAT =================
  const [activeChatStudent, setActiveChatStudent] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const chatScrollRef = useRef(null);
  
  // Histórico de chat separado por aluno (Usando o nome como chave para demonstração)
  const [chatHistories, setChatHistories] = useState({
    'Lucas Mendes': [
      { id: 1, sender: 'student', text: 'Professor, estou com dúvidas no compasso 4.', time: '09:15' },
      { id: 2, sender: 'teacher', text: 'Olá! Não se preocupe, vamos revisar isso no início da aula.', time: '09:30' },
    ],
    'Amanda Silva': [
      { id: 1, sender: 'student', text: 'Posso usar o pedal de sustain no exercício 2?', time: '10:00' },
    ]
  });

  // Efeito para rolar o chat para baixo automaticamente
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeChatStudent, chatHistories]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatStudent) return;

    const msg = {
      id: Date.now(),
      sender: 'teacher',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Atualiza o histórico apenas do aluno selecionado
    setChatHistories(prev => ({
      ...prev,
      [activeChatStudent]: [...(prev[activeChatStudent] || []), msg]
    }));
    
    setNewMessage('');
  };

  const openChat = (studentName) => {
    setActiveChatStudent(studentName);
  };

  // Pega as mensagens do aluno atual (ou uma lista vazia se não tiverem conversado)
  const currentMessages = activeChatStudent ? (chatHistories[activeChatStudent] || []) : [];

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row relative">
      <div className="shrink-0 z-20">
        <TeacherSidebar />
      </div>

      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div>
            <h1 className="text-3xl font-bold mb-2">Visão Geral</h1>
            <p className="text-gray-400">Um resumo rápido do seu desempenho e da sua agenda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-purple-300">Agenda de Hoje</h2>
                <button className="text-sm bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-white transition">Ver tudo</button>
              </div>
              
              <div className="space-y-4">
                {todaysLessons.map(lesson => (
                  <div key={lesson.id} className="flex justify-between items-center p-4 bg-gray-900 rounded-lg border-l-4 border-purple-500 hover:bg-gray-750 transition group">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-bold text-white">{lesson.time}</h3>
                        <p className="text-sm text-gray-400">{lesson.student} • {lesson.instrument}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Botão de Chat */}
                      <button 
                        onClick={() => openChat(lesson.student)}
                        className="opacity-0 md:opacity-100 lg:opacity-0 group-hover:opacity-100 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white p-2 rounded-full transition-all duration-300"
                        title="Enviar Mensagem"
                      >
                        💬
                      </button>
                      <span className={`text-xs px-2 py-1 rounded font-bold ${lesson.status === 'Confirmada' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {lesson.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg">
              <h2 className="text-xl font-bold text-purple-300 mb-6">Avisos do Sistema</h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start p-3 bg-blue-900/20 border border-blue-800/50 rounded-lg">
                  <span className="text-xl">🔔</span>
                  <div>
                    <h4 className="font-bold text-sm text-blue-300">Nova matrícula</h4>
                    <p className="text-xs text-gray-400">Carlos Eduardo se matriculou no seu curso.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= MODAL DE CHAT ================= */}
      {activeChatStudent && (
        <div className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-80 bg-gray-800 border border-gray-600 rounded-t-xl md:rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden h-[400px]">
          {/* Cabeçalho do Chat */}
          <div className="bg-purple-600 p-3 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm shadow-inner">
                {activeChatStudent.charAt(0)}
              </div>
              <h3 className="font-bold text-sm truncate max-w-[150px]">{activeChatStudent}</h3>
            </div>
            <button onClick={() => setActiveChatStudent(null)} className="hover:text-gray-300 font-bold text-lg leading-none">&times;</button>
          </div>

          {/* Área de Mensagens (com ref para o auto-scroll) */}
          <div ref={chatScrollRef} className="flex-grow p-4 bg-gray-900 overflow-y-auto flex flex-col gap-3">
            {currentMessages.length === 0 ? (
              <p className="text-center text-gray-500 text-sm mt-10">Envie o primeiro "Olá" para {activeChatStudent}!</p>
            ) : (
              currentMessages.map(msg => (
                <div key={msg.id} className={`max-w-[85%] p-2 rounded-lg text-sm break-words ${msg.sender === 'teacher' ? 'bg-purple-600 text-white self-end rounded-br-none' : 'bg-gray-700 text-gray-200 self-start rounded-bl-none'}`}>
                  <p>{msg.text}</p>
                  <span className="text-[10px] text-white/50 block mt-1 text-right">{msg.time}</span>
                </div>
              ))
            )}
          </div>

          {/* Campo de Digitação */}
          <form onSubmit={handleSendMessage} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Sua mensagem..." 
              className="flex-grow bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-sm text-white outline-none focus:border-purple-500 transition-colors"
            />
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition shrink-0 shadow-lg">
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default TeacherOverview;