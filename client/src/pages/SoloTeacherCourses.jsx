import React, { useState } from 'react';
import SoloTeacherSidebar from '../components/SoloTeacherSidebar';

function SoloTeacherCourses() {
  // Controle das abas: 'courses' ou 'students'
  const [activeTab, setActiveTab] = useState('courses'); 
  
  // Dados simulados para o layout (No futuro será state preenchido por API)
  const [courses, setCourses] = useState([
    { id: 1, title: 'Violão para Iniciantes', students: 15, status: 'Publicado' },
    { id: 2, title: 'Teoria Musical Aplicada', students: 8, status: 'Publicado' },
    { id: 3, title: 'Masterclass de Guitarra', students: 0, status: 'Rascunho' },
  ]);

  const [students, setStudents] = useState([
    { id: 1, name: 'Lucas Gabriel', email: 'lucas@email.com', course: 'Violão para Iniciantes', status: 'Em dia' },
    { id: 2, name: 'Mariana Costa', email: 'mariana@email.com', course: 'Teoria Musical', status: 'Inadimplente' },
  ]);

  return (
    <div className="min-h-screen bg-piano-black text-white-text font-poppins flex">
      <SoloTeacherSidebar />
      
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <main className="flex-grow p-8 overflow-y-auto">
          
          {/* Cabeçalho */}
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gerenciamento</h1>
              <p className="text-gray-400">Administre seus cursos, conteúdos e acompanhe seus alunos no mesmo lugar.</p>
            </div>
            {/* O botão muda dependendo da aba ativa */}
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg">
              {activeTab === 'courses' ? '+ Novo Curso' : '+ Convidar Aluno'}
            </button>
          </header>

          {/* Navegação por Abas (Tabs) */}
          <div className="flex border-b border-gray-700 mb-8">
            <button
              className={`px-6 py-3 font-semibold text-lg transition-colors relative ${
                activeTab === 'courses' ? 'text-purple-400' : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('courses')}
            >
              Meus Cursos
              {activeTab === 'courses' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>}
            </button>
            <button
              className={`px-6 py-3 font-semibold text-lg transition-colors relative ${
                activeTab === 'students' ? 'text-purple-400' : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('students')}
            >
              Meus Alunos (CRM)
              {activeTab === 'students' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>}
            </button>
          </div>

          {/* Área de Conteúdo Renderizada dinamicamente */}
          <div className="bg-[#1a1a1a] rounded-lg border border-key-divider p-6 shadow-lg min-h-[400px]">
            
            {/* ====== ABA: MEUS CURSOS ====== */}
            {activeTab === 'courses' && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span>📚</span> Cursos Cadastrados
                </h2>
                {courses.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">Você ainda não possui cursos cadastrados.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-gray-700 text-gray-400 text-sm">
                          <th className="pb-3 font-medium">Nome do Curso</th>
                          <th className="pb-3 font-medium text-center">Alunos Inscritos</th>
                          <th className="pb-3 font-medium text-center">Status</th>
                          <th className="pb-3 font-medium text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map(course => (
                          <tr key={course.id} className="border-b border-gray-800 hover:bg-[#252525] transition-colors">
                            <td className="py-4 font-semibold text-white">{course.title}</td>
                            <td className="py-4 text-center text-gray-300">{course.students}</td>
                            <td className="py-4 text-center">
                              <span className={`px-3 py-1 text-xs rounded-full border ${
                                course.status === 'Publicado' 
                                  ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                              }`}>
                                {course.status}
                              </span>
                            </td>
                            <td className="py-4 text-center">
                              <button className="text-purple-400 hover:text-purple-300 font-medium text-sm mr-4 transition-colors">Módulos</button>
                              <button className="text-gray-400 hover:text-white font-medium text-sm transition-colors">Editar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ====== ABA: ALUNOS (CRM) ====== */}
            {activeTab === 'students' && (
              <div className="animate-fadeIn">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span>👨‍🎓</span> Acompanhamento de Alunos
                </h2>
                {students.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">Nenhum aluno matriculado no momento.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-gray-700 text-gray-400 text-sm">
                          <th className="pb-3 font-medium">Nome do Aluno</th>
                          <th className="pb-3 font-medium">E-mail</th>
                          <th className="pb-3 font-medium">Curso Matriculado</th>
                          <th className="pb-3 font-medium text-center">Financeiro</th>
                          <th className="pb-3 font-medium text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <tr key={student.id} className="border-b border-gray-800 hover:bg-[#252525] transition-colors">
                            <td className="py-4 font-semibold text-white">{student.name}</td>
                            <td className="py-4 text-gray-400 text-sm">{student.email}</td>
                            <td className="py-4 text-sm text-gray-300">{student.course}</td>
                            <td className="py-4 text-center">
                              <span className={`px-3 py-1 text-xs rounded-full border ${
                                student.status === 'Em dia' 
                                  ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                  : 'bg-red-500/10 text-red-400 border-red-500/20'
                              }`}>
                                {student.status}
                              </span>
                            </td>
                            <td className="py-4 text-center">
                              <button className="text-blue-400 hover:text-blue-300 font-medium text-sm mr-3 transition-colors">Evolução</button>
                              <button className="text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors">Chat</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default SoloTeacherCourses;