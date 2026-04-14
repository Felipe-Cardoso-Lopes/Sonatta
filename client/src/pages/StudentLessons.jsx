import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentSidebar from "../components/StudentSidebar";

const CourseCard = ({
  title,
  professor,
  instrument,
  progress,
  is_enrolled,
  onClick,
  isSelected,
}) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-lg cursor-pointer transition-all ${isSelected ? "bg-gray-600 border border-purple-500" : "bg-gray-700 hover:bg-gray-600 border border-transparent"}`}
  >
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
          {professor ? professor.charAt(0) : "P"}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{professor}</p>
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
    {is_enrolled && (
      <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
        <div
          className="bg-purple-500 h-2 rounded-full transition-all"
          style={{ width: `${progress || 0}%` }}
        ></div>
      </div>
    )}
  </div>
);

function StudentLessons() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await axios.get(`${API_URL}/api/courses/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses(response.data);
      if (response.data.length > 0) setSelectedCourse(response.data[0]);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar catálogo de cursos", error);
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      await axios.post(
        `${API_URL}/api/courses/student/enroll`,
        { course_id: selectedCourse.id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Matrícula realizada com sucesso!");
      fetchCourses(); // Atualiza a lista para o curso ficar como matriculado
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao se matricular.");
    }
  };

  const renderCourseList = () => {
    if (isLoading)
      return (
        <p className="text-gray-400 text-center py-4">Carregando aulas...</p>
      );
    if (courses.length === 0)
      return (
        <p className="text-gray-400 text-center py-4">
          Nenhum curso disponível no momento.
        </p>
      );

    return courses.map((course) => (
      <CourseCard
        key={course.id}
        {...course}
        isSelected={selectedCourse?.id === course.id}
        onClick={() => setSelectedCourse(course)}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row">
      <div className="shrink-0 z-20">
        <StudentSidebar />
      </div>

      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8 overflow-hidden">
        <aside className="w-full lg:w-1/3 bg-gray-800 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-4rem)] shadow-lg">
          <button className="bg-sidebar-bg w-full py-3 rounded-lg font-bold hover:bg-opacity-80 transition-colors">
            Aprender
          </button>

          <div className="flex flex-col gap-4">{renderCourseList()}</div>
        </aside>

        <section className="flex-grow flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-4rem)] pr-2">
          {selectedCourse ? (
            <>
              <div className="relative w-full h-64 md:h-96 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700 shadow-lg overflow-hidden group cursor-pointer">
                <div className="w-20 h-20 bg-purple-600/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform z-10 shadow-lg">
                  <span className="text-white text-3xl ml-1">▶</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-80"></div>
              </div>

              <div className="flex-grow bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                  <span className="bg-purple-600 text-xs px-3 py-1 rounded-full">
                    {selectedCourse.instrument}
                  </span>
                </div>

                {selectedCourse.is_enrolled ? (
                  <>
                    <div className="flex justify-between items-center bg-gray-700 p-4 rounded-md mb-6 mt-4 cursor-pointer hover:bg-gray-600 transition-colors border-l-4 border-purple-500">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Status</p>
                        <span className="font-semibold text-lg text-green-400">
                          Matriculado
                        </span>
                      </div>
                      <span className="text-2xl text-purple-400">›</span>
                    </div>
                    <button className="w-full bg-sidebar-bg py-3 rounded-lg font-bold hover:bg-opacity-80 mb-6 transition-colors shadow-md text-white">
                      Continuar Aprendendo
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="mt-4 w-full bg-green-600 py-3 rounded-lg font-bold hover:bg-green-700 mb-6 transition-colors shadow-md text-white"
                  >
                    Inscrever-se neste Curso
                  </button>
                )}

                <div>
                  <h4 className="font-bold mb-2 text-purple-300 border-b border-gray-700 pb-2">
                    Sobre este curso
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed mt-3">
                    {selectedCourse.description ||
                      "Nenhuma descrição fornecida para este curso."}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed mt-2">
                    <strong>Professor:</strong> {selectedCourse.professor}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400">
                Selecione um curso para ver os detalhes.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default StudentLessons;
