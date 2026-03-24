import React, { useState, useEffect } from 'react';
import StudentSidebar from '../components/StudentSidebar';

const PracticeCourseCard = ({ title, professor, instrument, progress, onClick, isSelected }) => (
  <div 
    onClick={onClick}
    className={`p-4 rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-gray-600 border border-purple-500' : 'bg-gray-700 hover:bg-gray-600 border border-transparent'}`}
  >
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-lg">{title}</h3>
      <span className="text-2xl text-purple-400">›</span>
    </div>
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">
          {professor.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold">{professor}</p>
          <p className="text-xs text-gray-400">{instrument}</p>
        </div>
      </div>
    </div>
    <div className="w-full bg-gray-800 rounded-full h-2 mt-3">
      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);


function StudentPractice() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    // DADOS FALSOS (Mock) - Simula os módulos de exercícios do banco de dados
    const mockData = [
      { 
        id: 1, title: 'Piano para Iniciantes', professor: 'Prof. Carlos', instrument: 'Piano', progress: 50,
        trail: [
          { id: 101, title: 'Reconhecimento de Notas', type: 'Teoria', status: 'completed' },
          { id: 102, title: 'Exercício de Dedilhado (1-2-3-4-5)', type: 'Técnica', status: 'completed' },
          { id: 103, title: 'Acordes Dó, Fá e Sol', type: 'Prática', status: 'current' },
          { id: 104, title: 'Música: Ode à Alegria', type: 'Repertório', status: 'locked' },
        ]
      },
      { 
        id: 2, title: 'Violão do Zero', professor: 'Profa. Ana', instrument: 'Violão', progress: 25,
        trail: [
          { id: 201, title: 'Afinação Padrão', type: 'Teoria', status: 'completed' },
          { id: 202, title: 'Exercício Aranha', type: 'Técnica', status: 'current' },
          { id: 203, title: 'Transição C - Am - F - G', type: 'Prática', status: 'locked' },
        ]
      }
    ];

    setCourses(mockData);
    setSelectedCourse(mockData[0]);
  }, []);

  // Função para desenhar cada "nó" da trilha de exercícios
  const renderTrailNode = (exercise, index, total) => {
    const isCompleted = exercise.status === 'completed';
    const isCurrent = exercise.status === 'current';
    const isLocked = exercise.status === 'locked';

    let bgColor = 'bg-gray-700';
    let borderColor = 'border-gray-600';
    let textColor = 'text-gray-500';
    let icon = '🔒';

    if (isCompleted) {
      bgColor = 'bg-green-500 bg-opacity-20';
      borderColor = 'border-green-500';
      textColor = 'text-green-400';
      icon = '✓';
    } else if (isCurrent) {
      bgColor = 'bg-purple-600 bg-opacity-20';
      borderColor = 'border-purple-500';
      textColor = 'text-purple-400';
      icon = '▶';
    }

    return (
      <div key={exercise.id} className="relative flex items-center gap-6 w-full max-w-md mx-auto">
        {/* Linha vertical conectando os exercícios */}
        {index !== total - 1 && (
          <div className={`absolute left-7 top-14 bottom-[-2rem] w-1 rounded ${isCompleted ? 'bg-green-500' : 'bg-gray-700'}`}></div>
        )}

        {/* Círculo de Status */}
        <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center text-xl z-10 ${bgColor} ${borderColor} ${isCurrent ? 'shadow-[0_0_15px_rgba(168,85,247,0.5)]' : ''}`}>
          {icon}
        </div>

        {/* Card do Exercício */}
        <div className={`flex-grow p-4 rounded-xl border-2 transition-transform ${isCurrent ? 'border-purple-500 scale-105 bg-gray-800 cursor-pointer hover:bg-gray-700' : 'border-gray-700 bg-gray-800/50'}`}>
          <div className="flex justify-between items-start mb-1">
            <h4 className={`font-bold ${textColor}`}>{exercise.title}</h4>
            <span className="text-xs bg-gray-900 px-2 py-1 rounded text-gray-400">{exercise.type}</span>
          </div>
          {isCurrent && (
            <button className="mt-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-1 px-4 rounded transition-colors">
              Praticar Agora
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row">
      
      <div className="shrink-0 z-20">
        <StudentSidebar />
      </div>

      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8 overflow-hidden">
        
        {/* Coluna da Esquerda: Lista de Cursos para Praticar */}
        <aside className="w-full lg:w-1/3 lg:max-w-sm bg-gray-800 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-4rem)] shadow-lg">
          <button className="bg-sidebar-bg w-full py-3 rounded-lg font-bold hover:bg-opacity-80 transition-colors">
            Praticar
          </button>
          
          <div className="flex flex-col gap-4">
            {courses.map((course) => (
              <PracticeCourseCard 
                key={course.id} 
                {...course} 
                isSelected={selectedCourse?.id === course.id}
                onClick={() => setSelectedCourse(course)}
              />
            ))}
          </div>
        </aside>

        {/* Coluna da Direita: Trilha de Exercícios (Roadmap) */}
        <section className="flex-grow flex flex-col bg-gray-900 rounded-lg overflow-y-auto max-h-[calc(100vh-4rem)] border border-gray-700 shadow-xl p-8 relative">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Trilha de Exercícios</h2>
            <p className="text-gray-400">Complete as missões abaixo para avançar de nível em <strong className="text-purple-400">{selectedCourse?.title}</strong>.</p>
          </div>

          <div className="flex flex-col gap-8 pb-10">
            {selectedCourse ? (
              selectedCourse.trail.map((exercise, index) => 
                renderTrailNode(exercise, index, selectedCourse.trail.length)
              )
            ) : (
              <p className="text-center text-gray-500">Selecione um curso para ver sua trilha.</p>
            )}
          </div>
          
        </section>

      </main>
    </div>
  );
}

export default StudentPractice;