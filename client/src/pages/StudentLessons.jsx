import React, { useState, useEffect } from "react";
import StudentSidebar from "../components/StudentSidebar";

// Adicionei 'onClick' e 'isSelected' para sabermos qual curso está ativo
const CourseCard = ({
  title,
  professor,
  instrument,
  modules,
  progress,
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
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">
          {professor.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold">{professor}</p>
          <p className="text-xs text-gray-400">{instrument}</p>
        </div>
      </div>
      <span className="text-xs bg-gray-800 px-2 py-1 rounded">Sonatta</span>
    </div>
    <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
      <div
        className="bg-purple-500 h-2 rounded-full transition-all"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <div>
      <p className="font-semibold mb-2 text-sm text-gray-300">Módulos</p>
      {modules &&
        modules.slice(0, 2).map((mod, index) => (
          <div key={index} className="flex items-center gap-2 p-1 rounded">
            <span className="text-purple-400 text-xs">★</span>
            <p className="text-xs text-gray-300 truncate">{mod.title}</p>
          </div>
        ))}
      {modules && modules.length > 2 && (
        <p className="text-xs text-gray-500 mt-1">
          + {modules.length - 2} módulos
        </p>
      )}
    </div>
  </div>
);

function StudentLessons() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null); // Estado para o curso ativo na direita
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // DADOS FALSOS (Mock) - Simula o retorno do banco de dados (tabelas: courses, modules, enrollments)
    const mockData = [
      {
        id: 1,
        title: "Piano Essencial: Do Zero às Suas Primeiras Melodias",
        professor: "Prof. Carlos Silva",
        instrument: "Piano",
        progress: 45,
        currentLesson: "Aula 12: A Mágica dos Acordes",
        description:
          "Neste curso, você vai aprender desde a postura correta das mãos até a leitura de partituras básicas. Ao final, será capaz de tocar músicas populares completas usando as duas mãos com independência.",
        modules: [
          { title: "Introdução ao Teclado" },
          { title: "Leitura de Partitura" },
          { title: "Acordes Maiores e Menores" },
          { title: "Independência das Mãos" },
        ],
      },
      {
        id: 2,
        title: "Guitarra Rock - Nível 1",
        professor: "Profa. Ana Rita",
        instrument: "Guitarra",
        progress: 10,
        currentLesson: "Aula 3: Palhetada Alternada",
        description:
          "Domine a guitarra elétrica! Vamos passar por power chords, riffs clássicos do rock, uso de distorção e técnicas básicas de solo (bends, vibratos e slides).",
        modules: [
          { title: "Conhecendo o Instrumento" },
          { title: "Power Chords" },
          { title: "Escala Pentatônica" },
        ],
      },
    ];

    setCourses(mockData);
    setSelectedCourse(mockData[0]); // Seleciona o primeiro curso por padrão
    setIsLoading(false);
  }, []);

  const renderCourseList = () => {
    if (isLoading)
      return (
        <p className="text-gray-400 text-center py-4">Carregando aulas...</p>
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
      <StudentSidebar />

      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8 overflow-hidden">
        {/* Coluna da Esquerda: Lista de Cursos */}
        <aside className="w-full lg:w-1/3 bg-gray-800 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-4rem)] shadow-lg">
          <button className="bg-sidebar-bg w-full py-3 rounded-lg font-bold hover:bg-opacity-80 transition-colors">
            Aprender
          </button>

          <div className="flex flex-col gap-4">{renderCourseList()}</div>
        </aside>

        {/* Coluna da Direita: Detalhes da Aula Selecionada */}
        <section className="flex-grow flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-4rem)] pr-2">
          {selectedCourse ? (
            <>
              {/* Vídeo / Thumbnail Placeholder */}
              <div className="relative w-full h-64 md:h-96 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700 shadow-lg overflow-hidden group cursor-pointer">
                <button className="absolute top-4 left-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors z-10">
                  ♡
                </button>
                {/* Botão de Play Central */}
                <div className="w-20 h-20 bg-purple-600/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform z-10 shadow-lg">
                  <span className="text-white text-3xl ml-1">▶</span>
                </div>
                {/* Imagem de Fundo Simulada */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-80"></div>
              </div>

              {/* Informações da Aula */}
              <div className="flex-grow bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                  <span className="bg-purple-600 text-xs px-3 py-1 rounded-full">
                    {selectedCourse.instrument}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-gray-700 p-4 rounded-md mb-6 mt-4 cursor-pointer hover:bg-gray-600 transition-colors border-l-4 border-purple-500">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Próxima aula</p>
                    <span className="font-semibold text-lg">
                      {selectedCourse.currentLesson}
                    </span>
                  </div>
                  <span className="text-2xl text-purple-400">›</span>
                </div>

                <button className="w-full bg-sidebar-bg py-3 rounded-lg font-bold hover:bg-opacity-80 mb-6 transition-colors shadow-md">
                  Continuar Aprendendo
                </button>

                <div>
                  <h4 className="font-bold mb-2 text-purple-300 border-b border-gray-700 pb-2">
                    Sobre este curso
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed mt-3">
                    {selectedCourse.description}
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
