import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeacherSidebar from '../components/TeacherSidebar';

function TeacherManagement() {
  const [activeTab, setActiveTab] = useState('courses'); 
  const [myCourses, setMyCourses] = useState([]);
  const [myStudents, setMyStudents] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourseData, setNewCourseData] = useState({ title: '', instrument: '', description: '' });

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const headers = { Authorization: `Bearer ${token}` };

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

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await axios.post(`${API_URL}/api/courses/teacher`, newCourseData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(response.data.message);
      setIsModalOpen(false);
      setNewCourseData({ title: '', instrument: '', description: '' });
      fetchTeacherData(); // Atualiza a lista com o curso novo
    } catch (error) {
      alert("Erro ao criar curso. Verifique sua conexão.");
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
              <p className="text-gray-400">Administre seus cursos, módulos e turmas.</p>
            </div>
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
                    <span className="text-xs px-2 py-1 rounded font-bold bg-green-500/20 text-green-400">
                      Ativo
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{course.title}</h3>
                  <div className="text-sm text-gray-400 flex justify-between mb-4">
                    <span>{course.students_count || 0} Alunos</span>
                  </div>
                  <button className="w-full bg-gray-700 group-hover:bg-purple-600 py-2 rounded text-sm font-semibold transition">
                    Editar Conteúdo
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
                    <th className="p-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {myStudents.map(student => (
                    <tr key={student.id} className="border-t border-gray-700 hover:bg-gray-750">
                      <td className="p-4 font-bold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          {student.name.charAt(0)}
                        </div>
                        {student.name} {student.nickname && `(${student.nickname})`}
                      </td>
                      <td className="p-4 text-gray-300">{student.course_title}</td>
                      <td className="p-4">
                        <div className="w-full bg-gray-700 h-2 rounded">
                          <div className="bg-purple-500 h-2 rounded" style={{width: `${student.progress || 0}%`}}></div>
                        </div>
                      </td>
                      <td className="p-4"><button className="text-purple-400 hover:underline">Ver ficha</button></td>
                    </tr>
                  ))}
                  {myStudents.length === 0 && (
                    <tr><td colSpan="4" className="p-4 text-center text-gray-500">Nenhum aluno matriculado ainda.</td></tr>
                  )}
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
                  rows="3" required
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
                <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-bold transition text-white">
                  Criar Curso
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