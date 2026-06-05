import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import SoloTeacherSidebar from "../components/SoloTeacherSidebar";

function SoloTeacherOverview() {
  const [metrics, setMetrics] = useState([
    { label: "Faturamento Estimado", value: "R$ 0,00", icon: "💰", color: "text-green-400" },
    { label: "Alunos Ativos", value: "0", icon: "👨‍🎓", color: "text-blue-400" },
    { label: "Cursos Criados", value: "0", icon: "📚", color: "text-purple-400" },
    { label: "Novos Avisos", value: "0", icon: "🔔", color: "text-red-400" },
  ]);

  const [students, setStudents] = useState([]);
  const [activeChatStudent, setActiveChatStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [unreadCounts, setUnreadCounts] = useState({});

  const typingTimeoutRef = useRef(null);
  const chatScrollRef = useRef(null);
  const activeChatStudentIdRef = useRef(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // MOCKS PARA A AGENDA E ATIVIDADES (Para manter o design antigo)
  const upcomingClasses = [
    { id: 1, student: "João Silva", time: "14:00", instrument: "Violão" },
    { id: 2, student: "Maria Souza", time: "15:30", instrument: "Piano" },
  ];
  const recentActivities = [
    { id: 1, text: "João concluiu o Módulo 1", time: "Há 2 horas" },
    { id: 2, text: "Nova matrícula de Maria", time: "Há 5 horas" },
  ];

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses/teacher/students`, { headers: { Authorization: `Bearer ${token}` } });
      setStudents(res.data);
      setMetrics((prev) => {
        const newMetrics = [...prev];
        newMetrics[1].value = res.data.length.toString();
        return newMetrics;
      });
    } catch (err) { console.error("Erro ao carregar alunos", err); }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses/teacher`, { headers: { Authorization: `Bearer ${token}` } });
      setMetrics((prev) => {
        const newMetrics = [...prev];
        newMetrics[2].value = res.data.length.toString();
        return newMetrics;
      });
    } catch (err) { console.error("Erro ao carregar cursos", err); }
  };

  const fetchUnreadCounts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/messages/unread-counts`, { headers: { Authorization: `Bearer ${token}` } });
      const counts = {};
      res.data.forEach((item) => { counts[item.sender_id] = item.unread_count; });
      setUnreadCounts(counts);
    } catch (err) { console.error("Erro ao buscar contagem", err); }
  };

  const fetchChatHistory = async (studentId) => {
    try {
      const res = await axios.get(`${API_URL}/api/messages/${studentId}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessages(res.data);
      setUnreadCounts((prev) => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
      socket?.emit("check_online", studentId);
    } catch (err) { console.error("Erro ao carregar mensagens", err); }
  };

  useEffect(() => { activeChatStudentIdRef.current = activeChatStudent ? String(activeChatStudent.id) : null; }, [activeChatStudent]);

  useEffect(() => {
    let totalUnread = 0;
    students.forEach((student) => {
      if (unreadCounts[student.id]) { totalUnread += Number(unreadCounts[student.id]); }
    });
    setMetrics((prev) => {
      const updated = [...prev];
      updated[3].value = totalUnread.toString();
      return updated;
    });
  }, [unreadCounts, students]);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchUnreadCounts();
  }, []);

  const studentsRef = useRef([]);
  useEffect(() => { studentsRef.current = students; }, [students]);

  useEffect(() => {
    if (!userId || userId === "null" || userId === "undefined") return;
    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("user_connected", userId);
      if (studentsRef.current.length > 0) {
        studentsRef.current.forEach((student) => { newSocket.emit("check_online", student.id); });
      }
    });

    newSocket.on("user_status_changed", ({ userId: changedUserId, status }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        status === "online" ? next.add(String(changedUserId)) : next.delete(String(changedUserId));
        return next;
      });
    });

    newSocket.on("online_status", ({ userId: checkedId, isOnline }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        isOnline ? next.add(String(checkedId)) : next.delete(String(checkedId));
        return next;
      });
    });

    newSocket.on("receive_message", (messagePayload) => {
      if (activeChatStudentIdRef.current === String(messagePayload.sender_id)) {
        setMessages((prev) => [...prev, messagePayload]);
        axios.get(`${API_URL}/api/messages/${messagePayload.sender_id}`, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [messagePayload.sender_id]: (prev[messagePayload.sender_id] || 0) + 1,
        }));
      }
    });

    newSocket.on("user_typing", ({ senderId }) => { setTypingUsers((prev) => new Set(prev).add(String(senderId))); });
    newSocket.on("user_stop_typing", ({ senderId }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(String(senderId));
        return next;
      });
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket && students.length > 0) {
      students.forEach(student => socket.emit('check_online', student.id));
    }
  }, [socket, students]);

  useEffect(() => {
    if (activeChatStudent) fetchChatHistory(activeChatStudent.id);
  }, [activeChatStudent]);

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [messages, typingUsers]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (socket && activeChatStudent) {
      socket.emit("typing", { senderId: userId, receiverId: activeChatStudent.id });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop_typing", { senderId: userId, receiverId: activeChatStudent.id });
      }, 2000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatStudent) return;
    try {
      socket?.emit("stop_typing", { senderId: userId, receiverId: activeChatStudent.id });
      const res = await axios.post(
        `${API_URL}/api/messages`,
        { receiver_id: activeChatStudent.id, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) { alert("Erro ao enviar mensagem."); }
  };

  return (
    <div className="min-h-screen bg-piano-black text-white-text font-poppins flex flex-col md:flex-row relative">
      <div className="shrink-0 z-20"><SoloTeacherSidebar /></div>
      <main className="flex-grow p-6 md:p-10 flex flex-col h-screen overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex flex-col h-full gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel de Controle</h1>
            <p className="text-gray-400">Acompanhe seu desempenho financeiro e o engajamento dos seus alunos.</p>
          </div>
          
          {/* Métricas (4 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-[#1a1a1a] p-5 rounded-xl border border-gray-700 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider font-semibold">{metric.label}</p>
                  <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>
                <div className="text-4xl opacity-80">{metric.icon}</div>
              </div>
            ))}
          </div>

          <div className="flex-grow flex flex-col lg:flex-row gap-6 min-h-0">
            
            {/* Esquerda: CHAT / CRM (Acupa 2/3 da tela) */}
            <div className="w-full lg:w-2/3 flex flex-col md:flex-row gap-4 bg-[#1a1a1a] rounded-xl border border-gray-700 shadow-lg p-2 overflow-hidden">
              {/* Lista de Alunos */}
              <aside className="w-full md:w-1/3 bg-gray-800 rounded-lg flex flex-col overflow-hidden border border-gray-700">
                <div className="p-3 bg-gray-900 border-b border-gray-700">
                  <h2 className="text-sm font-bold text-purple-300">Chats Ativos</h2>
                </div>
                <div className="flex-grow overflow-y-auto p-2 flex flex-col gap-2 custom-scrollbar">
                  {students.length === 0 ? (
                    <p className="text-gray-500 text-xs text-center mt-4">Nenhum aluno.</p>
                  ) : (
                    students.map((student) => {
                      const isOnline = onlineUsers.has(String(student.id));
                      const unreadCount = unreadCounts[student.id] || 0;
                      return (
                        <div key={student.id} onClick={() => setActiveChatStudent(student)} className={`p-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 relative ${activeChatStudent?.id === student.id ? "bg-purple-600 shadow-md" : "bg-gray-700 hover:bg-gray-600"}`}>
                          <div className="relative">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-inner ${activeChatStudent?.id === student.id ? "bg-purple-800 text-white" : "bg-blue-500 text-white"}`}>
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            {isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-gray-800 rounded-full"></span>}
                          </div>
                          <div className="flex-grow overflow-hidden">
                            <p className={`font-semibold text-xs truncate ${activeChatStudent?.id === student.id ? "text-white" : "text-gray-200"}`}>{student.name}</p>
                          </div>
                          {unreadCount > 0 && activeChatStudent?.id !== student.id && (
                            <div className="bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center absolute right-2">{unreadCount}</div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </aside>

              {/* Área da Conversa */}
              <section className="w-full md:w-2/3 bg-gray-900 rounded-lg border border-gray-700 flex flex-col overflow-hidden">
                {activeChatStudent ? (
                  <>
                    <div className="bg-gray-800 p-3 border-b border-gray-700 flex items-center gap-2 shadow-sm z-10">
                      <div>
                        <h2 className="font-bold text-sm leading-tight text-white">{activeChatStudent.name}</h2>
                        <p className="text-[10px] text-gray-400">{onlineUsers.has(String(activeChatStudent.id)) ? <span className="text-green-400">Online</span> : "Offline"}</p>
                      </div>
                    </div>
                    <div ref={chatScrollRef} className="flex-grow overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}>
                          <div className={`p-2.5 rounded-xl max-w-[85%] text-xs shadow-md ${msg.isMine ? "bg-purple-600 text-white rounded-br-none" : "bg-gray-700 text-gray-200 rounded-bl-none"}`}>
                            <p>{msg.message}</p>
                            {msg.time && <span className="text-[9px] opacity-50 block mt-1 text-right">{msg.time}</span>}
                          </div>
                        </div>
                      ))}
                      {typingUsers.has(String(activeChatStudent.id)) && (
                        <div className="flex justify-start">
                          <div className="p-2 rounded-xl bg-gray-700 text-gray-400 rounded-bl-none text-[10px] italic flex gap-1">
                            Digitando<span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <form onSubmit={handleSendMessage} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
                      <input type="text" value={newMessage} onChange={handleTyping} placeholder="Mensagem..." className="flex-grow bg-gray-900 border border-gray-600 rounded-full px-3 py-2 text-xs text-white outline-none focus:border-purple-500" />
                      <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition shadow-md shrink-0">➤</button>
                    </form>
                  </>
                ) : (
                  <div className="flex-grow flex items-center justify-center text-gray-500 text-sm">Selecione um aluno para iniciar</div>
                )}
              </section>
            </div>

            {/* Direita: WIDGETS (Acupa 1/3 da tela) */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
              
              <div className="bg-[#1a1a1a] rounded-xl border border-gray-700 p-5 shadow-lg">
                <h2 className="text-lg font-bold mb-4 text-purple-300">📅 Próximas Aulas ao Vivo</h2>
                <div className="space-y-3">
                  {upcomingClasses.map((aula) => (
                    <div key={aula.id} className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-sm text-white">{aula.student}</p>
                        <p className="text-xs text-gray-400">{aula.instrument}</p>
                      </div>
                      <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded text-xs font-bold border border-purple-500/30">
                        {aula.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1a1a1a] rounded-xl border border-gray-700 p-5 shadow-lg">
                <h2 className="text-lg font-bold mb-4 text-blue-300">⚡ Atividades Recentes</h2>
                <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-600 before:to-transparent">
                  {recentActivities.map((act) => (
                    <div key={act.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-blue-500 bg-gray-900 group-[.is-active]:bg-blue-500 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"></div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-md">
                        <p className="font-semibold text-xs text-white mb-1">{act.text}</p>
                        <p className="text-[10px] text-gray-400">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default SoloTeacherOverview;