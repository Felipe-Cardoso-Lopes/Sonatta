import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import StudentSidebar from '../components/StudentSidebar';

const CourseCard = ({ title, professor, instrument, progress, is_enrolled, onClick, isSelected }) => (
  <div onClick={onClick} className={`p-4 rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-gray-600 border border-purple-500' : 'bg-gray-700 hover:bg-gray-600 border border-transparent'}`}>
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
          {professor ? professor.charAt(0) : 'P'}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{professor}</p>
          <p className="text-xs text-gray-400">{instrument}</p>
        </div>
      </div>
      {is_enrolled ? (
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold">Matriculado</span>
      ) : (
        <span className="text-xs bg-gray-800 px-2 py-1 rounded">Disponível</span>
      )}
    </div>
  </div>
);

function StudentLessons() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados do Chat do Aluno
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatScrollRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/courses/student`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
      if(response.data.length > 0) setSelectedCourse(response.data[0]);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar cursos", error);
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      await axios.post(`${API_URL}/api/courses/student/enroll`, 
        { course_id: selectedCourse.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Matrícula realizada com sucesso!");
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao se matricular.");
    }
  };

  // Funções do Chat
  const openChat = async () => {
    setIsChatOpen(true);
    try {
      const res = await axios.get(`${API_URL}/api/messages/${selectedCourse.teacher_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Erro ao carregar chat", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCourse) return;

    try {
      const res = await axios.post(`${API_URL}/api/messages`, 
        { receiver_id: selectedCourse.teacher_id, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      alert("Erro ao enviar mensagem.");
    }
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row relative">
      <div className="shrink-0 z-20">
        <StudentSidebar />
      </div>

      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8 overflow-hidden">
        
        {/* Catálogo de Cursos */}
        <aside className="w-full lg:w-1/3 bg-gray-800 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-4rem)] shadow-lg">
          <button className="bg-sidebar-bg w-full py-3 rounded-lg font-bold">Aprender</button>
          <div className="flex flex-col gap-4">
            {isLoading ? <p className="text-gray-400 text-center">Carregando...</p> : 
             courses.length === 0 ? <p className="text-gray-400 text-center">Nenhum curso disponível.</p> :
             courses.map(course => (
              <CourseCard key={course.id} {...course} isSelected={selectedCourse?.id === course.id} onClick={() => setSelectedCourse(course)} />
            ))}
          </div>
        </aside>

        {/* Detalhes do Curso */}
        <section className="flex-grow flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-4rem)] pr-2">
          {selectedCourse ? (
            <>
              <div className="relative w-full h-64 md:h-96 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700 shadow-lg group">
                <div className="w-20 h-20 bg-purple-600/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                  <span className="text-white text-3xl ml-1">▶</span>
                </div>
              </div>

              <div className="flex-grow bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                  <span className="bg-purple-600 text-xs px-3 py-1 rounded-full">{selectedCourse.instrument}</span>
                </div>
                
                {selectedCourse.is_enrolled ? (
                  <div className="flex gap-4 mb-6 mt-6">
                    <button className="flex-grow bg-sidebar-bg py-3 rounded-lg font-bold hover:bg-opacity-80 transition-colors shadow-md text-white">
                      Continuar Aprendendo
                    </button>
                    {/* Botão de Chat Adicionado */}
                    <button onClick={openChat} className="bg-blue-600 hover:bg-blue-700 py-3 px-6 rounded-lg font-bold transition-colors shadow-md text-white flex items-center gap-2">
                      💬 Falar com Prof.
                    </button>
                  </div>
                ) : (
                  <button onClick={handleEnroll} className="mt-4 w-full bg-green-600 py-3 rounded-lg font-bold hover:bg-green-700 mb-6 transition text-white">
                    Inscrever-se neste Curso
                  </button>
                )}

                <div>
                  <h4 className="font-bold mb-2 text-purple-300 border-b border-gray-700 pb-2">Sobre este curso</h4>
                  <p className="text-sm text-gray-300 leading-relaxed mt-3">{selectedCourse.description}</p>
                  <p className="text-sm text-gray-400 mt-2"><strong>Professor:</strong> {selectedCourse.professor}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400">Selecione um curso para ver os detalhes.</p>
            </div>
          )}
        </section>
      </main>

      {/* ================= MODAL DE CHAT DO ALUNO ================= */}
      {isChatOpen && selectedCourse && (
        <div className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-80 bg-gray-800 border border-gray-600 rounded-t-xl md:rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden h-[450px]">
          <div className="bg-blue-600 p-3 flex justify-between items-center text-white shadow-md z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                {selectedCourse.professor.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Prof. {selectedCourse.professor}</h3>
                <p className="text-[10px] text-blue-200">{selectedCourse.title}</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="hover:text-gray-300 font-bold text-xl leading-none">&times;</button>
          </div>

          <div ref={chatScrollRef} className="flex-grow p-4 bg-gray-900 overflow-y-auto flex flex-col gap-3">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 text-sm mt-10">Envie uma mensagem para tirar sua dúvida!</p>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-xl max-w-[85%] text-sm shadow-md ${msg.isMine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                    <p>{msg.message}</p>
                    {msg.time && <span className="text-[10px] opacity-50 block mt-1 text-right">{msg.time}</span>}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
            <input 
              type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua dúvida..." 
              className="flex-grow bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-sm text-white outline-none focus:border-blue-500 transition"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition shrink-0">
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default StudentLessons;