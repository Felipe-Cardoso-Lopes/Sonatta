import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeacherSidebar from '../components/TeacherSidebar';

function TeacherManagement() {
  const [activeTab, setActiveTab] = useState('courses'); 
  const [myCourses, setMyCourses] = useState([]);
  const [myStudents, setMyStudents] = useState([]);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCourseData, setNewCourseData] = useState({ title: '', instrument: '', description: '' });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCourseData, setEditCourseData] = useState({ id: null, title: '', instrument: '', description: '' });
  const [courseExercises, setCourseExercises] = useState([]);

  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  // Quando o modal de edição abrir, tenta buscar os exercícios do curso
  useEffect(() => {
    if (isEditModalOpen && editCourseData.id) {
      fetchExercises(editCourseData.id);
    }
  }, [isEditModalOpen, editCourseData.id]);

  const fetchTeacherData = async () => {
    try {
      const [coursesRes, studentsRes] = await Promise.all([
        axios.get(`${API_URL}/api/courses/teacher`, { headers }),
        axios.get(`${API_URL}/api/courses/teacher/students`, { headers })
      ]);
      setMyCourses(coursesRes.data);
      setMyStudents(studentsRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados do professor", error);
    }
  };

  const fetchExercises = async (courseId) => {
    try {
      // Prepara o terreno para a API de exercícios que vamos criar no backend
      const res = await axios.get(`${API_URL}/api/exercises/course/${courseId}`, { headers });
      setCourseExercises(res.data);
    } catch (err) {
      console.warn("Rota de exercícios ainda não existe no backend. Exibindo vazio.");
      setCourseExercises([]);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/courses/teacher`, newCourseData, { headers });
      alert(response.data.message || "Curso criado!");
      setIsCreateModalOpen(false);
      setNewCourseData({ title: '', instrument: '', description: '' });
      fetchTeacherData();
    } catch (error) {
      alert("Erro ao criar curso. Verifique sua conexão.");
    }
  };

  const openEditModal = (course) => {
    setEditCourseData(course);
    setIsEditModalOpen(true);
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/courses/${editCourseData.id}`, editCourseData, { headers });
      alert("Curso atualizado com sucesso!");
      setIsEditModalOpen(false);
      fetchTeacherData();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar o curso.");
    }
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
              <p className="text-gray-400">Administre seus cursos e acompanhe as turmas.</p>
            </div>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
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
                    <span className="text-xs px-2 py-1 rounded font-bold bg-green-500/20 text-green-400">Ativo</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{course.title}</h3>
                  <div className="text-sm text-gray-400 flex justify-between mb-4">
                    <span>{course.students_count || 0} Alunos</span>
                  </div>
                  <button 
                    onClick={() => openEditModal(course)}
                    className="w-full bg-gray-700 group-hover:bg-purple-600 py-2 rounded text-sm font-semibold transition"
                  >
                    Editar Curso e Trilhas
                  </button>
                </div>
              ))}
              {myCourses.length === 0 && (
                <p className="text-gray-500 col-span-full">Nenhum curso criado. Clique em "Criar Novo Curso".</p>
              )}
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
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {myStudents.map(student => (
                    <tr key={student.id} className="border-t border-gray-700 hover:bg-gray-750">
                      <td className="p-4 font-bold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          {student.name.charAt(0)}
                        </div>
                        {student.name}
                      </td>
                      <td className="p-4 text-gray-300">{student.course_title}</td>
                      <td className="p-4">
                        <div className="w-full bg-gray-700 h-2 rounded">
                          <div className="bg-purple-500 h-2 rounded" style={{width: `${student.progress || 0}%`}}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal Criar Curso (Permanece igual) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 w-full max-w-md p-6 rounded-xl border border-gray-600 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Criar Novo Curso</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white text-xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Título do Curso</label>
                <input 
                  type="text" required
                  value={newCourseData.title}
                  onChange={(e) => setNewCourseData({...newCourseData, title: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Instrumento Principal</label>
                <input 
                  type="text" required
                  value={newCourseData.instrument}
                  onChange={(e) => setNewCourseData({...newCourseData, instrument: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Descrição</label>
                <textarea 
                  rows="3" required
                  value={newCourseData.description}
                  onChange={(e) => setNewCourseData({...newCourseData, description: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white outline-none focus:border-purple-500"
                ></textarea>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold">Cancelar</button>
                <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-bold text-white">Criar Curso</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Curso e Aulas */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 w-full max-w-2xl p-6 rounded-xl border border-gray-600 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Editar Curso e Trilhas</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white text-xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleEditCourse} className="space-y-4 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Título do Curso</label>
                  <input 
                    type="text" required
                    value={editCourseData.title}
                    onChange={(e) => setEditCourseData({...editCourseData, title: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Instrumento</label>
                  <input 
                    type="text" required
                    value={editCourseData.instrument}
                    onChange={(e) => setEditCourseData({...editCourseData, instrument: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Descrição</label>
                <textarea 
                  rows="2" required
                  value={editCourseData.description}
                  onChange={(e) => setEditCourseData({...editCourseData, description: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white outline-none focus:border-purple-500"
                ></textarea>
              </div>

              {/* Lista Dinâmica de Exercícios da Trilha */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-purple-400">Aulas / Exercícios na Trilha</h3>
                  <button type="button" className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"> + Adicionar Exercício</button>
                </div>
                <div className="bg-gray-900 p-4 rounded border border-gray-700 flex flex-col gap-2">
                  {courseExercises.length > 0 ? (
                    courseExercises.map((exercise, idx) => (
                      <div key={exercise.id} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                        <span className="text-sm">{idx + 1}. {exercise.title} <span className="text-xs text-gray-500 ml-2">({exercise.type})</span></span>
                        <div className="flex gap-2">
                           <button type="button" className="text-purple-400 text-xs hover:underline">Editar</button>
                           <button type="button" className="text-red-400 text-xs hover:underline">Excluir</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 text-center">Nenhum exercício cadastrado. Eles aparecerão na trilha do aluno.</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-700 mt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold">Cancelar</button>
                <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-bold text-white">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherManagement;