import React from 'react';
import StudentSidebar from '../components/StudentSidebar';

// Componente reutilizável para o card de curso na lateral
const PracticeCourseCard = ({ title, professor, instrument }) => (
  <div className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600">
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-lg">{title}</h3>
      <span className="text-2xl">›</span>
    </div>
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center gap-2">
        <img src="/assets/avatar-placeholder.png" alt="Professor" className="w-8 h-8 rounded-full" />
        <div>
          <p className="text-sm font-semibold">{professor}</p>
          <p className="text-xs text-gray-400">{instrument}</p>
        </div>
      </div>
      <span className="text-xs bg-gray-600 px-2 py-1 rounded">Escola 1</span>
    </div>
    {/* Barra de Progresso */}
    <div className="w-full bg-gray-600 rounded-full h-2 mt-3">
      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
    </div>
  </div>
);


function StudentPractice() {
  // Dados de exemplo para a lista de cursos
  const courses = [
    { title: 'Piano para Iniciantes', professor: 'Professor', instrument: 'Pianista' },
    { title: 'Violão do Zero', professor: 'Professor', instrument: 'Violonista' },
    { title: 'Como tocar Guitarra', professor: 'Professor', instrument: 'Guitarrista' },
  ];

  return (
    <div className="min-h-screen bg-new-bg text-white-text font-poppins flex flex-col md:flex-row">
      <StudentSidebar />

      {/* Conteúdo Principal */}
      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Coluna da Esquerda: Lista de Cursos para Praticar */}
        <aside className="w-full lg:w-1/3 lg:max-w-sm bg-gray-800 rounded-lg p-4 flex flex-col gap-4">
          <button className="bg-sidebar-bg w-full py-3 rounded-lg font-bold hover:bg-opacity-80">
            Praticar
          </button>
          <div className="flex flex-col gap-4 overflow-y-auto">
            {courses.map((course, index) => (
              <PracticeCourseCard key={index} {...course} />
            ))}
          </div>
        </aside>

        {/* Coluna da Direita: Trilha de Exercícios */}
        <section className="flex-grow flex items-center justify-center bg-black rounded-lg min-h-[400px] lg:min-h-0">
          {/* Este é o espaço reservado para o seu futuro componente de trilha.
            Ele já está centralizado dentro da área preta.
          */}
          <div className="text-center text-gray-500 p-4">
            <h2 className="text-2xl font-bold">Trilha de Exercícios</h2>
            <p>(Componente a ser implementado)</p>
          </div>
        </section>

      </main>
    </div>
  );
}

export default StudentPractice;