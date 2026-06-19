import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import StudentSidebar from "../components/StudentSidebar";
import ReviewModal from "../components/ReviewModal";

const CourseCard = ({ title, professor, teacher_name, instrument, is_enrolled, onClick, isSelected }) => {
  const nomeDoProf = professor || teacher_name || "Professor";

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-all ${isSelected ? "bg-gray-600 border border-purple-500" : "bg-gray-700 hover:bg-gray-600 border border-transparent"}`}
    >
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
            {nomeDoProf.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{nomeDoProf}</p>
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
};

function StudentLessons() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("enrolled");

  const [modules, setModules] = useState([]);
  const [activeClass, setActiveClass] = useState(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [socket, setSocket] = useState(null);
  const [isTeacherOnline, setIsTeacherOnline] = useState(false);
  const [isTeacherTyping, setIsTeacherTyping] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // Estados de Avaliação
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const typingTimeoutRef = useRef(null);
  const chatScrollRef = useRef(null);
  const activeTeacherIdRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/courses/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data);
      if (response.data.length > 0) {
        const enrolledCourses = response.data.filter(c => c.is_enrolled);
        setSelectedCourse(enrolledCourses.length > 0 ? enrolledCourses[0] : response.data[0]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar cursos", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      activeTeacherIdRef.current = selectedCourse.teacher_id;
      fetchModulesAndClasses(selectedCourse.id, selectedCourse.is_enrolled);
      if (selectedCourse.is_enrolled) {
        fetchCompletedLessons(selectedCourse.teacher_id);
      }
    }
  }, [selectedCourse]);

  const fetchModulesAndClasses = async (courseId, isEnrolled) => {
    if (!courseId) return;
    try {
      const res = await axios.get(`${API_URL}/api/courses/${courseId}/modules`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModules(res.data);
      if (isEnrolled && res.data.length > 0 && res.data[0].classes.length > 0) {
        setActiveClass(res.data[0].classes[0]);
      } else {
        setActiveClass(null);
      }
    } catch (err) {
      console.error('Erro ao buscar módulos', err);
    }
  };

  const handleEnroll = async () => {
    try {
      await axios.post(
        `${API_URL}/api/courses/student/enroll`,
        { course_id: selectedCourse.id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Matrícula realizada com sucesso!");
      fetchCourses(); 
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message.includes('já está matriculado')) {
         alert("Você já está matriculado neste curso.");
      } else {
         alert("Erro ao se matricular.");
      }
    }
  };

  const handleUnenroll = async () => {
    if(window.confirm('Tem certeza que deseja cancelar sua matrícula neste curso? Todo o progresso será perdido.')) {
      try {
        await axios.post(
          `${API_URL}/api/courses/unenroll`,
          { course_id: selectedCourse.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Matrícula cancelada.");
        setActiveClass(null);
        fetchCourses();
      } catch (error) {
        alert("Erro ao desmatricular.");
      }
    }
  };

  useEffect(() => {
    if (!userId || userId === "null" || userId === "undefined") return;

    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("user_connected", userId);
      if (activeTeacherIdRef.current) {
        newSocket.emit("check_online", activeTeacherIdRef.current);
      }
    });

    newSocket.on("receive_message", (msg) => {
      if (String(activeTeacherIdRef.current) === String(msg.sender_id)) {
        setMessages((prev) => [...prev, msg]);
      } else {
        setHasNewNotification(true);
      }
    });

    newSocket.on("user_typing", ({ senderId }) => {
      if (String(activeTeacherIdRef.current) === String(senderId)) setIsTeacherTyping(true);
    });

    newSocket.on("user_stop_typing", ({ senderId }) => {
      if (String(activeTeacherIdRef.current) === String(senderId)) setIsTeacherTyping(false);
    });

    newSocket.on("online_status", ({ userId: checkedId, isOnline }) => {
      if (String(activeTeacherIdRef.current) === String(checkedId)) setIsTeacherOnline(isOnline);
    });

    newSocket.on("user_status_changed", ({ userId: changedId, status }) => {
      if (String(activeTeacherIdRef.current) === String(changedId)) setIsTeacherOnline(status === "online");
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket && selectedCourse?.teacher_id) {
      socket.emit("check_online", selectedCourse.teacher_id);
    }
  }, [socket, selectedCourse]);

  useEffect(() => {
    if (isChatOpen && selectedCourse?.teacher_id) {
      const loadChatHistory = async () => {
        try {
          const res = await axios.get(
            `${API_URL}/api/messages/${selectedCourse.teacher_id}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setMessages(res.data);
          socket?.emit("check_online", selectedCourse.teacher_id);
          setIsTeacherTyping(false);
        } catch (err) {
          console.error("Erro ao transicionar histórico do chat:", err);
        }
      };
      loadChatHistory();
    }
  }, [selectedCourse, isChatOpen, socket]);

  const openChat = () => {
    setIsChatOpen(true);
    setHasNewNotification(false);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (socket && selectedCourse) {
      socket.emit("typing", { senderId: userId, receiverId: selectedCourse.teacher_id });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop_typing", { senderId: userId, receiverId: selectedCourse.teacher_id });
      }, 2000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCourse) return;

    try {
      socket?.emit("stop_typing", { senderId: userId, receiverId: selectedCourse.teacher_id });
      const res = await axios.post(
        `${API_URL}/api/messages`,
        { receiver_id: selectedCourse.teacher_id, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      alert("Erro ao enviar mensagem.");
    }
  };

  const fetchCompletedLessons = async (teacherId) => {
    try {
      const res = await axios.get(`${API_URL}/api/lessons/completed/${teacherId}`, { headers: { Authorization: `Bearer ${token}` } });
      setCompletedLessons(res.data);
    } catch (err) { console.error('Erro:', err); }
  };

 const openReviewModal = (lesson, type = 'lesson') => {
    // Adicionamos a propriedade reviewType para diferenciar de onde veio
    setSelectedLesson({ ...lesson, reviewType: type });
    setIsReviewModalOpen(true);
  };

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [messages, isChatOpen, isTeacherTyping]);

  const nomeProfSelected = selectedCourse?.teacher_name || selectedCourse?.professor || "Professor";

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row relative">
      <div className="shrink-0 z-20">
        <StudentSidebar />
      </div>

      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8 overflow-hidden h-screen">
        
        <aside className="w-full lg:w-1/4 bg-gray-800 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto max-h-full shadow-lg">
          <div className="flex gap-2 mb-2 p-1 bg-gray-900 rounded-lg shrink-0">
            <button
              onClick={() => setActiveTab("enrolled")}
              className={`flex-1 py-2 rounded-md font-bold text-sm transition-all duration-300 ${activeTab === "enrolled" ? "bg-sidebar-bg text-white shadow-md" : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"}`}
            >
              Meus Cursos
            </button>
            <button
              onClick={() => setActiveTab("discover")}
              className={`flex-1 py-2 rounded-md font-bold text-sm transition-all duration-300 ${activeTab === "discover" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"}`}
            >
              Descobrir
            </button>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar" data-testid="course-list-container">
            {isLoading ? (
              <p className="text-gray-400 text-center py-4">Carregando...</p>
            ) : activeTab === "enrolled" ? (
              courses.filter((c) => c.is_enrolled).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm mb-4">Você ainda não possui matrículas.</p>
                  <button onClick={() => setActiveTab("discover")} className="text-purple-400 text-sm hover:underline font-bold">Procurar cursos ›</button>
                </div>
              ) : (
                courses.filter((c) => c.is_enrolled).map((course) => (
                  <CourseCard key={course.id} {...course} isSelected={selectedCourse?.id === course.id} onClick={() => setSelectedCourse(course)} />
                ))
              )
            ) : courses.filter((c) => !c.is_enrolled).length === 0 ? (
              <p className="text-gray-400 text-center py-8 text-sm">Nenhum curso novo disponível no momento.</p>
            ) : (
              courses.filter((c) => !c.is_enrolled).map((course) => (
                <CourseCard key={course.id} {...course} isSelected={selectedCourse?.id === course.id} onClick={() => setSelectedCourse(course)} />
              ))
            )}
          </div>
        </aside>

        <section className="flex-grow flex flex-col lg:flex-row gap-6 overflow-y-auto pr-2 h-full">
          {selectedCourse ? (
            <>
              <div className="flex-grow flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2">
                <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 shrink-0">
                    <div>
                      <h2 className="text-xl font-bold">{selectedCourse.title}</h2>
                      <p className="text-sm text-gray-400">Prof. {nomeProfSelected}</p>
                    </div>
                    {selectedCourse.is_enrolled ? (
                      <div className="flex gap-2">
                        <button onClick={openChat} className="relative bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg font-bold transition-colors shadow-md text-white flex items-center gap-2 text-sm">
                          💬 Falar com Prof.
                          {hasNewNotification && !isChatOpen && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-gray-800"></span>
                            </span>
                          )}
                        </button>
                        <button onClick={handleUnenroll} className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-bold transition-colors shadow-md text-white text-sm">
                          Desmatricular
                        </button>
                      </div>
                    ) : (
                      <button onClick={handleEnroll} data-testid="course-enroll-button" className="bg-green-600 hover:bg-green-700 py-2 px-6 rounded-lg font-bold transition-colors shadow-md text-white text-sm shadow-[0_0_10px_rgba(22,163,74,0.4)] animate-pulse">
                        Inscrever-se Grátis
                      </button>
                    )}
                </div>

                {selectedCourse.is_enrolled ? (
                  activeClass ? (
                    <div className="flex flex-col gap-4">
                      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
                        <iframe className="w-full h-full" src={activeClass.video_url?.replace('watch?v=', 'embed/')} allowFullScreen></iframe>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                           <h1 className="text-2xl font-bold">{activeClass.title}</h1>
                           {/* Passe 'course_class' como segundo parâmetro: */}
<button onClick={() => openReviewModal(activeClass, 'course_class')} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded-lg text-sm shadow-md transition-colors flex items-center gap-2">
  ⭐ Avaliar Aula
</button>
                        </div>
                        <p className="text-gray-300 text-sm">{activeClass.description || "Nenhuma descrição."}</p>
                        {activeClass.documents && activeClass.documents.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-gray-700">
                            <h3 className="font-bold text-purple-300 mb-3 text-sm">Materiais de Apoio (Downloads)</h3>
                            <div className="flex flex-wrap gap-3">
                              {activeClass.documents.map(doc => (
                                <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded border border-gray-600 text-xs font-semibold flex items-center gap-2 transition text-white">
                                  📄 {doc.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-grow flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700 text-gray-500 p-6 text-center">
                      <p>Nenhuma aula selecionada ou o curso ainda não possui conteúdo.</p>
                    </div>
                  )
                ) : (
                  <div className="flex-grow bg-gray-800 rounded-lg p-8 shadow-lg border border-gray-700 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-6">
                      <span className="text-4xl">📚</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{selectedCourse.title}</h2>
                    <p className="text-gray-400 max-w-lg mb-8">{selectedCourse.description}</p>
                    <p className="text-sm text-yellow-400 font-semibold mb-4">Veja o conteúdo do curso na aba ao lado 👉</p>
                  </div>
                )}

                {selectedCourse.is_enrolled && completedLessons.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-4 shrink-0">
                    <p className="text-sm text-gray-400 mb-3 font-semibold">Pendentes de Avaliação (Aulas ao Vivo):</p>
                    <div className="flex flex-col gap-2">
                      {completedLessons.map(lesson => (
                        <div key={lesson.id} className="flex items-center justify-between bg-gray-900 px-4 py-3 rounded-lg border border-gray-700">
                          <span className="text-sm text-gray-200">{lesson.title}</span>
                          <button onClick={() => openReviewModal(lesson)} className="text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-3 py-1.5 rounded-lg transition-colors">
                            ⭐ Avaliar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <aside className="w-full lg:w-72 bg-[#1a1a1a] rounded-xl border border-gray-700 flex flex-col shadow-xl flex-shrink-0">
                <div className="p-4 border-b border-gray-700 bg-gray-900 rounded-t-xl">
                  <h2 className="font-bold text-base text-purple-300">Conteúdo do Curso</h2>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {modules.length === 0 ? <p className="text-sm text-gray-500 text-center mt-4">Nenhum módulo gravado.</p> : null}
                  
                  {modules.map(mod => (
                    <div key={mod.id} className="mb-4">
                      <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">{mod.title}</h3>
                      <div className="space-y-1">
                        {mod.classes?.map(cls => (
                          <button 
                            key={cls.id}
                            onClick={() => selectedCourse.is_enrolled ? setActiveClass(cls) : alert("Matricule-se no curso para assistir as aulas!")}
                            className={`w-full text-left p-3 rounded-lg text-sm transition-colors border ${
                              activeClass?.id === cls.id 
                                ? 'bg-purple-600/20 border-purple-500 text-purple-300 font-semibold' 
                                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            {selectedCourse.is_enrolled ? (activeClass?.id === cls.id ? '▶' : '•') : '🔒'} {cls.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center bg-gray-800 rounded-lg">
              <p className="text-gray-400">Selecione um curso na lista para visualizar o conteúdo.</p>
            </div>
          )}
        </section>
      </main>

      {isChatOpen && selectedCourse && (
        <div className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-80 bg-gray-800 border border-gray-600 rounded-t-xl md:rounded-xl shadow-2xl z-50 flex flex-col h-[450px]">
          <div className="bg-blue-600 p-3 flex justify-between items-center text-white shadow-md z-10">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                  {nomeProfSelected.charAt(0).toUpperCase()}
                </div>
                {isTeacherOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border border-blue-600 rounded-full"></span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">
                  Prof. {nomeProfSelected}
                </h3>
                <p className="text-[10px] text-blue-200">
                  {isTeacherOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="hover:text-gray-300 font-bold text-xl leading-none"
            >
              ×
            </button>
          </div>

          <div
            ref={chatScrollRef}
            className="flex-grow p-4 bg-gray-900 overflow-y-auto flex flex-col gap-3 custom-scrollbar"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[85%] text-sm shadow-md ${msg.isMine ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-700 text-gray-200 rounded-bl-none"}`}
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

            {isTeacherTyping && (
              <div className="flex justify-start">
                <div className="p-2 rounded-xl bg-gray-700 text-gray-400 rounded-bl-none text-xs italic flex gap-1">
                  Digitando<span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2"
          >
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Digite sua dúvida..."
              className="flex-grow bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-sm text-white outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* Altere o targetType para receber a propriedade dinâmica */}
      {isReviewModalOpen && selectedLesson && (
        <ReviewModal
          targetId={selectedLesson.id}
          targetType={selectedLesson.reviewType} 
          title={`Avaliando: ${selectedLesson.title}`}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={() => {
            setIsReviewModalOpen(false);
            alert("Obrigado pelo seu feedback! ⭐");
            fetchCompletedLessons(selectedCourse.teacher_id);
          }}
        />
      )}
    </div>
  );
}

export default StudentLessons;