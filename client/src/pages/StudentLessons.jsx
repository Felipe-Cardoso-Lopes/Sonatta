import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import StudentSidebar from "../components/StudentSidebar";

const CourseCard = ({
  title,
  professor,
  teacher_name,
  instrument,
  is_enrolled,
  onClick,
  isSelected,
}) => {
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
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold">
            Matriculado
          </span>
        ) : (
          <span className="text-xs bg-gray-800 px-2 py-1 rounded">
            Disponível
          </span>
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

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [socket, setSocket] = useState(null);
  const [isTeacherOnline, setIsTeacherOnline] = useState(false);
  const [isTeacherTyping, setIsTeacherTyping] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const typingTimeoutRef = useRef(null);
  const chatScrollRef = useRef(null);
  const activeTeacherIdRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (selectedCourse) {
      activeTeacherIdRef.current = selectedCourse.teacher_id;
    }
  }, [selectedCourse]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!userId || userId === "null" || userId === "undefined") return;

    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(`🔌 [Socket] Conectado! Avisando o servidor que meu ID é: ${userId}`);
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
      if (String(activeTeacherIdRef.current) === String(senderId))
        setIsTeacherTyping(true);
    });

    newSocket.on("user_stop_typing", ({ senderId }) => {
      if (String(activeTeacherIdRef.current) === String(senderId))
        setIsTeacherTyping(false);
    });

    newSocket.on("online_status", ({ userId: checkedId, isOnline }) => {
      if (String(activeTeacherIdRef.current) === String(checkedId)) {
        setIsTeacherOnline(isOnline);
      }
    });

    newSocket.on("user_status_changed", ({ userId: changedId, status }) => {
      if (String(activeTeacherIdRef.current) === String(changedId)) {
        setIsTeacherOnline(status === "online");
      }
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

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/courses/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data);
      if (response.data.length > 0) setSelectedCourse(response.data[0]);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar cursos", error);
      setIsLoading(false);
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
      alert("Erro ao se matricular.");
    }
  };

  const openChat = () => {
    setIsChatOpen(true);
    setHasNewNotification(false);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (socket && selectedCourse) {
      socket.emit("typing", {
        senderId: userId,
        receiverId: selectedCourse.teacher_id,
      });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop_typing", {
          senderId: userId,
          receiverId: selectedCourse.teacher_id,
        });
      }, 2000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCourse) return;

    try {
      socket?.emit("stop_typing", {
        senderId: userId,
        receiverId: selectedCourse.teacher_id,
      });
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
      const res = await axios.get(`${API_URL}/api/lessons/completed/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompletedLessons(res.data);
    } catch (err) {
      console.error('Erro ao buscar aulas concluídas:', err);
    }
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      alert('Por favor, selecione uma nota.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      await axios.post(
        `${API_URL}/api/reviews`,
        {
          lesson_id: selectedLesson.id,
          rating: reviewRating,
          comment: reviewComment || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Avaliação enviada com sucesso! ⭐');
      setIsReviewModalOpen(false);
      setReviewRating(0);
      setReviewComment('');
      setSelectedLesson(null);
      fetchCompletedLessons(selectedCourse.teacher_id);
    } catch (err) {
      if (err.response?.status === 409) {
        alert('Você já avaliou esta aula.');
      } else {
        alert('Erro ao enviar avaliação.');
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const openReviewModal = (lesson) => {
    setSelectedLesson(lesson);
    setReviewRating(0);
    setReviewComment('');
    setIsReviewModalOpen(true);
  };

  useEffect(() => {
    if (chatScrollRef.current)
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [messages, isChatOpen, isTeacherTyping]);

  useEffect(() => {
    if (selectedCourse?.teacher_id && selectedCourse?.is_enrolled) {
      fetchCompletedLessons(selectedCourse.teacher_id);
    }
  }, [selectedCourse]);

  const nomeProfSelected =
    selectedCourse?.teacher_name || selectedCourse?.professor || "Professor";

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row relative">
      <div className="shrink-0 z-20">
        <StudentSidebar />
      </div>

      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8 overflow-hidden">
        <aside className="w-full lg:w-1/3 bg-gray-800 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-4rem)] shadow-lg">
          <div className="flex gap-2 mb-2 p-1 bg-gray-900 rounded-lg">
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

          <div className="flex flex-col gap-4">
            {isLoading ? (
              <p className="text-gray-400 text-center py-4">Carregando...</p>
            ) : activeTab === "enrolled" ? (
              courses.filter((c) => c.is_enrolled).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm mb-4">
                    Você ainda não possui matrículas.
                  </p>
                  <button
                    onClick={() => setActiveTab("discover")}
                    className="text-purple-400 text-sm hover:underline font-bold"
                  >
                    Procurar cursos ›
                  </button>
                </div>
              ) : (
                courses
                  .filter((c) => c.is_enrolled)
                  .map((course) => (
                    <CourseCard
                      key={course.id}
                      {...course}
                      isSelected={selectedCourse?.id === course.id}
                      onClick={() => setSelectedCourse(course)}
                    />
                  ))
              )
            ) : courses.filter((c) => !c.is_enrolled).length === 0 ? (
              <p className="text-gray-400 text-center py-8 text-sm">
                Nenhum curso novo disponível no momento.
              </p>
            ) : (
              courses
                .filter((c) => !c.is_enrolled)
                .map((course) => (
                  <CourseCard
                    key={course.id}
                    {...course}
                    isSelected={selectedCourse?.id === course.id}
                    onClick={() => setSelectedCourse(course)}
                  />
                ))
            )}
          </div>
        </aside>

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
                </div>

                {selectedCourse.is_enrolled ? (
                  <div className="flex gap-4 mb-6 mt-6">
                    <button className="flex-grow bg-sidebar-bg py-3 rounded-lg font-bold hover:bg-opacity-80 transition-colors shadow-md text-white">
                      Continuar Aprendendo
                    </button>
                    <button
                      onClick={openChat}
                      className="relative bg-blue-600 hover:bg-blue-700 py-3 px-6 rounded-lg font-bold transition-colors shadow-md text-white flex items-center gap-2"
                    >
                      💬 Falar com Prof.
                      {hasNewNotification && !isChatOpen && (
                        <span className="absolute -top-2 -right-2 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-gray-800"></span>
                        </span>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="mt-4 w-full bg-green-600 py-3 rounded-lg font-bold hover:bg-green-700 mb-6 transition text-white"
                  >
                    Inscrever-se neste Curso
                  </button>
                )}
                
                {completedLessons.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2 font-semibold">Aulas para avaliar:</p>
                    <div className="flex flex-col gap-2">
                      {completedLessons.map(lesson => (
                        <div key={lesson.id} className="flex items-center justify-between bg-gray-700 px-4 py-2 rounded-lg">
                          <span className="text-sm text-gray-200">{lesson.title}</span>
                          <button
                            onClick={() => openReviewModal(lesson)}
                            className="text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-3 py-1 rounded-lg transition-colors"
                          >
                            ⭐ Avaliar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-300 mt-3">
                    {selectedCourse.description}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center bg-gray-800 rounded-lg">
              <p className="text-gray-400">Selecione um curso.</p>
            </div>
          )}
        </section>
      </main>

      {/* MODAL DE CHAT */}
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
              &times;
            </button>
          </div>

          <div
            ref={chatScrollRef}
            className="flex-grow p-4 bg-gray-900 overflow-y-auto flex flex-col gap-3"
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

      {/* MODAL DE AVALIAÇÃO (MOVIDO PARA CÁ) */}
      {isReviewModalOpen && selectedLesson && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-600">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Como foi sua aula?</h2>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <p className="text-sm text-gray-400 mb-6 text-center">
              Avaliando: <span className="text-purple-400 font-semibold">{selectedLesson.title}</span>
            </p>

            <div className="flex justify-center gap-3 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="text-4xl transition-transform hover:scale-110"
                >
                  <span className={star <= (hoveredStar || reviewRating) ? 'text-yellow-400' : 'text-gray-600'}>
                    ★
                  </span>
                </button>
              ))}
            </div>

            {reviewRating > 0 && (
              <p className="text-center text-sm font-semibold mb-4 text-yellow-400">
                {['', 'Muito ruim', 'Ruim', 'Regular', 'Boa', 'Excelente!'][reviewRating]}
              </p>
            )}

            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              placeholder="Deixe um comentário (opcional)..."
              rows={3}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-purple-500 resize-none mb-6"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="flex-1 py-3 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 transition-colors font-semibold text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={reviewRating === 0 || isSubmittingReview}
                className="flex-1 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors"
              >
                {isSubmittingReview ? 'Enviando...' : 'Enviar Avaliação'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentLessons;