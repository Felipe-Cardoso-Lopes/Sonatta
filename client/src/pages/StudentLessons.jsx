import React from 'react';
import StudentSidebar from '../components/StudentSidebar';

// Componente para o Card de Curso (reutilizável)
const CourseCard = ({ title, professor, instrument, modules }) => (
  <div className="bg-gray-700 p-4 rounded-lg">
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <div className="flex items-center justify-between mb-3">
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
    <div className="w-full bg-gray-600 rounded-full h-2 mb-4">
      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
    </div>
    {/* Módulos */}
    <div>
      <p className="font-semibold mb-2">Heading</p>
      {modules.map((mod, index) => (
        <div key={index} className="flex items-center gap-2 p-2 rounded hover:bg-gray-600 cursor-pointer">
          <span className="text-gray-400">☆</span>
          <div>
            <p className="text-sm">{mod.label}</p>
            <p className="text-xs text-gray-400">{mod.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

function StudentLessons() {
  // Dados de exemplo
  const courses = [
    { title: 'Piano para Iniciantes', professor: 'Professor', instrument: 'Pianista', modules: [{ label: 'Menu Label', description: 'Menu description.' }, { label: 'Menu Label', description: 'Menu description.' }] },
    { title: 'Violão do Zero', professor: 'Professor', instrument: 'Violonista', modules: [] },
    { title: 'Como tocar Guitarra', professor: 'Professor', instrument: 'Guitarrista', modules: [] },
    
  ];

  return (
    <div className="min-h-screen bg-new-bg text-white-text font-poppins flex flex-col md:flex-row">
      <StudentSidebar />

      {/* Conteúdo Principal */}
      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Coluna da Esquerda: Lista de Cursos */}
        <aside className="w-full lg:w-1/3 bg-gray-800 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
          <button className="bg-sidebar-bg w-full py-3 rounded-lg font-bold hover:bg-opacity-80">
            Aprender
          </button>
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </aside>

        {/* Coluna da Direita: Detalhes da Aula */}
        <section className="flex-grow flex flex-col gap-6">
          <div className="relative w-full h-64 md:h-3/5 bg-gray-800 rounded-lg flex items-center justify-center">
            <button className="absolute top-4 left-4 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center">♡</button>
            {/* Placeholder para imagem/video */}
            <div className="w-40 h-40 bg-gray-700 rounded-lg"></div>
          </div>

          <div className="flex-grow bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2">Piano Essencial: Do Zero às Suas Primeiras Melodias</h2>
            <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md mb-4 cursor-pointer hover:bg-gray-600">
              <span>Aula 12: A Mágica dos Acordes - Tocando Três Notas ao Mesmo Tempo</span>
              <span>›</span>
            </div>
            <button className="w-full bg-sidebar-bg py-3 rounded-lg font-bold hover:bg-opacity-80 mb-4">
              Tocar
            </button>
            <div>
              <h4 className="font-bold mb-2">Descrição</h4>
              <p className="text-sm text-gray-300">
                Nesta aula, sua jornada no piano vai ficar ainda mais emocionante. Vamos dar um grande passo e aprender a mágica de tocar várias notas ao mesmo tempo para criar acordes, que são a base de praticamente todas as músicas que você ama. Você vai descobrir como formar os acordes...
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default StudentLessons;