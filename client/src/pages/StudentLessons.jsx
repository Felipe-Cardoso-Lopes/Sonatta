import React, { useState, useEffect } from 'react';
import StudentSidebar from '../components/StudentSidebar';

// ... (Mantenha o componente CourseCard igual ao que você já tem) ...
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
    <div className="w-full bg-gray-600 rounded-full h-2 mb-4">
      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
    </div>
    <div>
      <p className="font-semibold mb-2">Módulos</p>
      {modules && modules.map((mod, index) => (
        <div key={index} className="flex items-center gap-2 p-2 rounded hover:bg-gray-600 cursor-pointer">
          <span className="text-gray-400">☆</span>
          <div>
            <p className="text-sm">{mod.label || mod.title}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

function StudentLessons() {
  // ... (Mantenha seus estados e useEffect iguais) ...
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
      // ... (Lógica de busca de dados mantida) ...
      // Apenas para simular visualmente se você ainda não conectou a API:
      setCourses([
          {title: "Piano Básico", professor: "Prof. X", instrument: "Piano", modules: []},
          {title: "Guitarra Rock", professor: "Prof. Y", instrument: "Guitarra", modules: []}
      ]);
      setIsLoading(false);
  }, []);

  const renderCourseList = () => {
    if (isLoading) return <p className="text-gray-400">Carregando...</p>;
    if (error) return <p className="text-red-400">{error}</p>;
    return courses.map((course, index) => (
      <CourseCard key={index} {...course} />
    ));
  };

  return (
    // Mantenha a estrutura flex-col md:flex-row
    <div className="min-h-screen bg-new-bg text-white-text font-poppins flex flex-col md:flex-row">
      
      {/* CORREÇÃO AQUI: Adicione 'shrink-0' para impedir que a barra lateral mude de tamanho */}
      <div className="shrink-0">
        <StudentSidebar />
      </div>

      {/* Conteúdo Principal */}
      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8 overflow-hidden">
        
        {/* Coluna da Esquerda: Lista de Cursos */}
        <aside className="w-full lg:w-1/3 bg-gray-800 rounded-lg p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <button className="bg-sidebar-bg w-full py-3 rounded-lg font-bold hover:bg-opacity-80">
            Aprender
          </button>
          
          <div className="flex flex-col gap-4">
            {renderCourseList()}
          </div>
        </aside>

        {/* Coluna da Direita: Detalhes da Aula */}
        <section className="flex-grow flex flex-col gap-6">
          <div className="relative w-full h-64 md:h-96 bg-gray-800 rounded-lg flex items-center justify-center">
            <button className="absolute top-4 left-4 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center">♡</button>
            <div className="w-40 h-40 bg-gray-700 rounded-lg"></div>
          </div>

          <div className="flex-grow bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2">Piano Essencial: Do Zero às Suas Primeiras Melodias</h2>
            <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md mb-4 cursor-pointer hover:bg-gray-600">
              <span>Aula 12: A Mágica dos Acordes</span>
              <span>›</span>
            </div>
            <button className="w-full bg-sidebar-bg py-3 rounded-lg font-bold hover:bg-opacity-80 mb-4">
              Tocar
            </button>
            <div>
              <h4 className="font-bold mb-2">Descrição</h4>
              <p className="text-sm text-gray-300">
                Descrição da aula aqui...
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default StudentLessons;