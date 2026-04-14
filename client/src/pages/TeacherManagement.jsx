import React, { useState } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';

function TeacherManagement() {
  const [activeTab, setActiveTab] = useState('courses'); 

  // Transformado em useState para permitir a adição de novos cursos na tela
  const [myCourses, setMyCourses] = useState([
    { id: 1, title: 'Piano Essencial', instrument: 'Piano', modules: 12, students: 45, status: 'Ativo' },
    { id: 2, title: 'Teoria Musical na Prática', instrument: 'Teoria', modules: 8, students: 112, status: 'Ativo' },
    { id: 3, title: 'Masterclass de Harmonia', instrument: 'Teclado', modules: 4, students: 0, status: 'Rascunho' },
  ]);

  // Estados para o Modal de Novo Curso
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourseData, setNewCourseData] = useState({ title: '', instrument: '', description: '' });

  // Função para simular a criação do curso
  const handleCreateCourse = (e) => {
    e.preventDefault();
    
    const newCourse = {
      id: Date.now(), // ID falso provisório
      title: newCourseData.title,
      instrument: newCourseData.instrument,
      modules: 0,
      students: 0,
      status: 'Rascunho' // Todo novo curso começa como rascunho
    };

    setMyCourses([newCourse, ...myCourses]); // Adiciona no início da lista
    setNewCourseData({ title: '', instrument: '', description: '' }); // Limpa o form
    setIsModalOpen(false); // Fecha o modal
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row relative">
      <div className="shrink-0 z-20">
        <TeacherSidebar />
      </div>

      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gerenciamento</h1>
              <p className="text-gray-400">Administre seus cursos, módulos e turmas.</p>
            </div>
            {/* Botão que abre o Modal */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition"
            >
              + Criar Novo Curso
            </button>
          </div>

          <div className="flex gap-4 border-b border-gray-700 pb-2">
            <button 
              onClick={() => setActiveTab('courses')}
              className={`pb-2 font-semibold transition ${activeTab === 'courses' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Meus Cursos
            </button>
            <button 
              onClick={() => setActiveTab('students')}
              className={`pb-2 font-semibold transition ${activeTab === 'students' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Meus Alunos
            </button>
          </div>

          {activeTab === 'courses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map(course => (
                <div key={course.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg group hover:border-purple-500 transition">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-gray-900 text-gray-400 text-xs px-2 py-1 rounded">{course.instrument}</span>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${course.status === 'Ativo' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {course.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{course.title}</h3>
                  <div className="text-sm text-gray-400 flex justify-between mb-4">
                    <span>{course.modules} Módulos</span>
                    <span>{course.students} Alunos</span>
                  </div>
                  <button className="w-full bg-gray-700 group-hover:bg-purple-600 py-2 rounded text-sm font-semibold transition">
                    Editar Conteúdo
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-gray-400 text-sm">
                    <th className="p-4 font-medium">Nome do Aluno</th>
                    <th className="p-4 font-medium">Curso Matriculado</th>
                    <th className="p-4 font-medium">Progresso</th>
                    <th className="p-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">L</div>
                      Lucas Mendes
                    </td>
                    <td className="p-4 text-gray-300">Piano Essencial</td>
                    <td className="p-4"><div className="w-full bg-gray-700 h-2 rounded"><div className="bg-purple-500 h-2 rounded w-1/2"></div></div></td>
                    <td className="p-4"><button className="text-purple-400 hover:underline">Ver ficha</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Criar Curso */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 w-full max-w-md p-6 rounded-xl border border-gray-600 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Criar Novo Curso</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Título do Curso</label>
                <input 
                  type="text" required
                  placeholder="Ex: Introdução ao Violão"
                  value={newCourseData.title}
                  onChange={(e) => setNewCourseData({...newCourseData, title: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Instrumento Principal</label>
                <input 
                  type="text" required
                  placeholder="Ex: Violão"
                  value={newCourseData.instrument}
                  onChange={(e) => setNewCourseData({...newCourseData, instrument: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Descrição Curta</label>
                <textarea 
                  rows="3"
                  placeholder="Sobre o que é este curso?"
                  value={newCourseData.description}
                  onChange={(e) => setNewCourseData({...newCourseData, description: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-purple-500"
                ></textarea>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold transition">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-bold transition">
                  Criar Rascunho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherManagement;