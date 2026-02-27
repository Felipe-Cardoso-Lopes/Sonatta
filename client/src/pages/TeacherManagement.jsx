import React from 'react';
import TeacherSidebar from '../components/TeacherSidebar';

// Componente para o Card do Curso na grade de gerenciamento
const CourseManagementCard = ({ title, status }) => {
  // Define a cor do selo com base no status
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Publicado':
        return 'bg-green-200 text-green-800';
      case 'Novo':
        return 'bg-blue-200 text-blue-800';
      case 'Em breve':
        return 'bg-gray-300 text-gray-800';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300">
      <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
        {/* Placeholder para a imagem do curso */}
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </div>
      <div className="p-4">
        <p className="font-semibold mb-3 text-gray-800 truncate">{title}</p>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusClasses(status)}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

function TeacherManagement() {
  // Dados de exemplo para os cursos
  const courses = [
    { title: 'Violão do Zero: Primeiros Acordes', status: 'Publicado' },
    { title: 'Piano para Iniciantes', status: 'Novo' },
    { title: 'Fundamentos da Guitarra Rock', status: 'Publicado' },
    { title: 'Harmonia Funcional Aplicada', status: 'Publicado' },
    { title: 'Violão do Zero: Primeiros Acordes', status: 'Novo' },
    { title: 'Piano para Iniciantes', status: 'Novo' },
    { title: 'Fundamentos da Guitarra Rock', status: 'Em breve' },
    { title: 'Harmonia Funcional Aplicada', status: 'Em breve' },
  ];

  return (
    <div className="min-h-screen bg-new-bg text-white-text font-poppins flex flex-col md:flex-row">
      <TeacherSidebar />

      {/* Conteúdo Principal */}
      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Coluna de Menu Secundária */}
        <aside className="w-full lg:w-1/4 lg:max-w-xs bg-gray-800 rounded-lg p-4 flex flex-col gap-4">
          <button className="bg-sidebar-bg w-full py-3 rounded-lg font-bold">
            Gerenciamento
          </button>
          <button className="bg-white text-dark-bg w-full py-3 rounded-lg font-semibold shadow-md">
            Cursos
          </button>
          <button className="bg-gray-700 w-full py-3 rounded-lg font-semibold hover:bg-gray-600">
            Alunos
          </button>
        </aside>

        {/* Coluna Principal: Grade de Cursos */}
        <section className="flex-grow flex flex-col bg-white rounded-lg p-6 text-black">
          {/* Barra de Busca */}
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>

          {/* Grade de Cursos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <CourseManagementCard key={index} {...course} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default TeacherManagement;