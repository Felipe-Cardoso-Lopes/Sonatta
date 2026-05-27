import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import TeacherSidebar from "../components/TeacherSidebar";

function TeacherOverview() {
  const [metrics, setMetrics] = useState([
    { label: "Alunos Ativos", value: "0", icon: "👨‍🎓", color: "text-blue-400" },
    {
      label: "Cursos Criados",
      value: "0",
      icon: "📚",
      color: "text-purple-400",
    },
    { label: "Avisos", value: "0", icon: "🔔", color: "text-green-400" },
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

  // ================= FUNÇÕES DE BUSCA (API) ================= //
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses/teacher/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
      setMetrics((prev) => {
        const newMetrics = [...prev];
        newMetrics[0].value = res.data.length.toString();
        return newMetrics;
      });
    } catch (err) {
      console.error("Erro ao carregar alunos", err);
    }
  };

  const fetchUnreadCounts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/messages/unread-counts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const counts = {};
      res.data.forEach((item) => {
        counts[item.sender_id] = item.unread_count;
      });
      setUnreadCounts(counts);
    } catch (err) {
      console.error("Erro ao buscar contagem de mensagens", err);
    }
  };

  const fetchChatHistory = async (studentId) => {
    try {
      const res = await axios.get(`${API_URL}/api/messages/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
      
      // Remove as notificações não lidas deste aluno localmente
      setUnreadCounts((prev) => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
      
      socket?.emit("check_online", studentId);
    } catch (err) {
      console.error("Erro ao carregar mensagens", err);
    }
  };

  // ================= USE EFFECTS (CICLOS DE VIDA) ================= //

  // 1. ATUALIZA A REF DO ALUNO SELECIONADO
  useEffect(() => {
    activeChatStudentIdRef.current = activeChatStudent
      ? String(activeChatStudent.id)
      : null;
  }, [activeChatStudent]);

  // 2. ATUALIZA O CARD DE "AVISOS" (BLINDADO CONTRA DADOS FANTASMAS)
  useEffect(() => {
    let totalUnread = 0;

    // A MÁGICA AQUI: Só soma avisos se o sender_id existir na lista REAL de alunos do professor
    students.forEach((student) => {
      if (unreadCounts[student.id]) {
        totalUnread += Number(unreadCounts[student.id]);
      }
    });

    setMetrics((prev) => {
      const updated = [...prev];
      updated[2].value = totalUnread.toString();
      return updated;
    });
  }, [unreadCounts, students]); // Depende tanto das contagens quanto dos alunos carregados

  // 3. BUSCA INICIAL
  useEffect(() => {
    fetchStudents();
    fetchUnreadCounts(); 
  }, []);

  // Referência para os alunos (necessária para quando o Socket reconectar)
  const studentsRef = useRef([]);
  useEffect(() => {
    studentsRef.current = students;
  }, [students]);

  // 4. CONEXÃO DO SOCKET (ISOLADA)
  useEffect(() => {
    if (!userId || userId === "null" || userId === "undefined") return;

    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(`🔌 [Socket] Conectado! Avisando o servidor que meu ID é: ${userId}`);
      newSocket.emit("user_connected", userId);

      if (studentsRef.current.length > 0) {
        studentsRef.current.forEach((student) => {
          newSocket.emit("check_online", student.id);
        });
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
        // Atualiza como lido no backend silenciosamente
        axios.get(`${API_URL}/api/messages/${messagePayload.sender_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Se a mensagem for de outro aluno, soma +1 no contador de avisos local
        setUnreadCounts((prev) => ({
          ...prev,
          [messagePayload.sender_id]: (prev[messagePayload.sender_id] || 0) + 1,
        }));
      }
    });

    newSocket.on("user_typing", ({ senderId }) => {
      setTypingUsers((prev) => new Set(prev).add(String(senderId)));
    });

    newSocket.on("user_stop_typing", ({ senderId }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(String(senderId));
        return next;
      });
    });

    return () => newSocket.disconnect();
  }, []);

  // 5. RADAR: Pergunta quem está online assim que a lista carregar da API
  useEffect(() => {
    if (socket && students.length > 0) {
      students.forEach(student => socket.emit('check_online', student.id));
    }
  }, [socket, students]);

  // 6. BUSCA HISTÓRICO AO CLICAR EM UM ALUNO E LIMPA AVISOS
  useEffect(() => {
    if (activeChatStudent) fetchChatHistory(activeChatStudent.id);
  }, [activeChatStudent]);

  // ROLAGEM AUTOMÁTICA DO CHAT
  useEffect(() => {
    if (chatScrollRef.current)
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [messages, typingUsers]);

  // ================= EVENTOS DO CHAT ================= //
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (socket && activeChatStudent) {
      socket.emit("typing", {
        senderId: userId,
        receiverId: activeChatStudent.id,
      });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop_typing", {
          senderId: userId,
          receiverId: activeChatStudent.id,
        });
      }, 2000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatStudent) return;

    try {
      socket?.emit("stop_typing", {
        senderId: userId,
        receiverId: activeChatStudent.id,
      });
      const res = await axios.post(
        `${API_URL}/api/messages`,
        { receiver_id: activeChatStudent.id, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      alert("Erro ao enviar mensagem.");
    }
  };

  // ================= RENDERIZAÇÃO DA TELA ================= //
  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row relative">
      <div className="shrink-0 z-20">
        <TeacherSidebar />
      </div>

      <main className="flex-grow p-6 md:p-10 flex flex-col h-screen overflow-hidden">
        <div className="max-w-6xl mx-auto w-full flex flex-col h-full gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Visão Geral</h1>
            <p className="text-gray-400">
              Suas métricas e comunicação em tempo real com alunos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex items-center justify-between"
              >
                <div>
                  <p className="text-gray-400 text-sm mb-1">{metric.label}</p>
                  <p className={`text-4xl font-bold ${metric.color}`}>
                    {metric.value}
                  </p>
                </div>
                <div className="text-5xl opacity-80">{metric.icon}</div>
              </div>
            ))}
          </div>

          <div className="flex-grow flex flex-col lg:flex-row gap-6 min-h-0">
            {/* BARRA LATERAL DE ALUNOS */}
            <aside className="w-full lg:w-1/3 bg-gray-800 rounded-xl border border-gray-700 flex flex-col overflow-hidden shadow-lg">
              <div className="p-4 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-purple-300">
                  Meus Alunos
                </h2>
              </div>

              <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar">
                {students.length === 0 ? (
                  <p className="text-gray-500 text-center mt-4">
                    Nenhum aluno encontrado.
                  </p>
                ) : (
                  students.map((student) => {
                    const isOnline = onlineUsers.has(String(student.id));
                    const unreadCount = unreadCounts[student.id] || 0;

                    return (
                      <div
                        key={student.id}
                        onClick={() => setActiveChatStudent(student)}
                        className={`p-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 relative ${activeChatStudent?.id === student.id ? "bg-purple-600 shadow-md" : "bg-gray-700 hover:bg-gray-600"}`}
                      >
                        <div className="relative">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-inner ${activeChatStudent?.id === student.id ? "bg-purple-800 text-white" : "bg-blue-500 text-white"}`}
                          >
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          {isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></span>
                          )}
                        </div>
                        <div className="flex-grow overflow-hidden">
                          <p
                            className={`font-semibold text-sm truncate ${activeChatStudent?.id === student.id ? "text-white" : "text-gray-200"}`}
                          >
                            {student.name}
                          </p>
                          <p
                            className={`text-xs truncate ${activeChatStudent?.id === student.id ? "text-purple-200" : "text-gray-400"}`}
                          >
                            {student.course_title}
                          </p>
                        </div>

                        {unreadCount > 0 &&
                          activeChatStudent?.id !== student.id && (
                            <div className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center absolute right-4">
                              {unreadCount}
                            </div>
                          )}
                      </div>
                    );
                  })
                )}
              </div>
            </aside>

            {/* JANELA DE CHAT */}
            <section className="w-full lg:w-2/3 bg-gray-900 rounded-xl border border-gray-700 flex flex-col shadow-lg overflow-hidden">
              {activeChatStudent ? (
                <>
                  <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center gap-3 shadow-md z-10">
                    <div className="relative">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white text-xl">
                        {activeChatStudent.name.charAt(0).toUpperCase()}
                      </div>
                      {onlineUsers.has(String(activeChatStudent.id)) && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-gray-800 rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <h2 className="font-bold text-lg leading-tight">
                        {activeChatStudent.name}
                      </h2>
                      <p className="text-xs text-gray-400">
                        {onlineUsers.has(String(activeChatStudent.id)) ? (
                          <span className="text-green-400">Online</span>
                        ) : (
                          "Offline"
                        )}
                      </p>
                    </div>
                  </div>

                  <div
                    ref={chatScrollRef}
                    className="flex-grow overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar"
                  >
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`p-3 rounded-xl max-w-[80%] text-sm shadow-md ${msg.isMine ? "bg-purple-600 text-white rounded-br-none" : "bg-gray-700 text-gray-200 rounded-bl-none"}`}
                        >
                          <p>{msg.message}</p>
                          {msg.time && (
                            <span className="text-[10px] opacity-50 block mt-1 text-right">
                              {msg.time}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {typingUsers.has(String(activeChatStudent.id)) && (
                      <div className="flex justify-start">
                        <div className="p-3 rounded-xl bg-gray-700 text-gray-400 rounded-bl-none text-xs italic flex gap-1">
                          Digitando<span className="animate-bounce">.</span>
                          <span className="animate-bounce delay-100">.</span>
                          <span className="animate-bounce delay-200">.</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 bg-gray-800 border-t border-gray-700 flex gap-3"
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={handleTyping}
                      placeholder="Escreva sua mensagem..."
                      className="flex-grow bg-gray-900 border border-gray-600 rounded-full px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white w-12 h-12 rounded-full flex items-center justify-center transition shadow-lg shrink-0"
                    >
                      ➤
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-grow flex items-center justify-center text-gray-500">
                  Selecione um aluno na lista para conversar
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