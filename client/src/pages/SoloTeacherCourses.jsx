import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SoloTeacherSidebar from '../components/SoloTeacherSidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function SoloTeacherCourses() {
  const [activeTab, setActiveTab] = useState('courses'); 
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  
  // Modais e Estados F16-F19
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  
  const [newCourse, setNewCourse] = useState({ title: '', description: '', instrument: '', status: 'draft' });
  const [newModule, setNewModule] = useState({ title: '' });
  const [newClass, setNewClass] = useState({ title: '', video_url: '', module_id: null });

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses/teacher`, getAuthHeaders());
      setCourses(res.data);
    } catch (err) { console.error('Erro ao buscar cursos', err); }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses/teacher/students`, getAuthHeaders());
      setStudents(res.data);
    } catch (err) { console.error('Erro ao buscar alunos', err); }
  };

  // --- F16: Criar Curso & Mudar Status ---
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/courses/teacher`, newCourse, getAuthHeaders());
      setIsCourseModalOpen(false);
      setNewCourse({ title: '', description: '', instrument: '', status: 'draft' });
      fetchCourses();
    } catch (err) { alert('Erro ao criar curso'); }
  };

  const toggleCourseStatus = async (course) => {
    const updatedStatus = course.status === 'published' ? 'draft' : 'published';
    try {
      await axios.put(`${API_URL}/api/courses/${course.id}`, { ...course, status: updatedStatus }, getAuthHeaders());
      fetchCourses();
    } catch (err) { alert('Erro ao atualizar status'); }
  };

  // --- F17/F18: Gerenciar Módulos e Aulas ---
  const openModuleManager = async (course) => {
    setSelectedCourse(course);
    try {
      const res = await axios.get(`${API_URL}/api/courses/${course.id}/modules`, getAuthHeaders());
      setModules(res.data);
      setIsModuleModalOpen(true);
    } catch (err) { console.error(err); }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/courses/${selectedCourse.id}/modules`, newModule, getAuthHeaders());
      setNewModule({ title: '' });
      openModuleManager(selectedCourse); // Recarrega os módulos
    } catch (err) { alert('Erro ao criar módulo'); }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/courses/${selectedCourse.id}/modules/${newClass.module_id}/classes`, newClass, getAuthHeaders());
      setNewClass({ title: '', video_url: '', module_id: null });
      openModuleManager(selectedCourse);
    } catch (err) { alert('Erro ao criar aula'); }
  };

  // --- F19: Remover Aluno do Curso ---
  const handleRemoveStudent = async (studentId, courseId) => {
    if(window.confirm('Tem a certeza que deseja desmatricular este aluno?')) {
      try {
        await axios.post(`${API_URL}/api/courses/unenroll`, { student_id: studentId, course_id: courseId }, getAuthHeaders());
        fetchStudents();
      } catch (err) { alert('Erro ao remover aluno'); }
    }
  };

  return (
    <div className="min-h-screen bg-piano-black text-white-text font-poppins flex">
      <SoloTeacherSidebar />
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <main className="flex-grow p-8 overflow-y-auto">
          
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gerenciamento</h1>
              <p className="text-gray-400">Administre seus cursos, módulos, aulas e acompanhe seus alunos.</p>
            </div>
            {activeTab === 'courses' && (
              <button onClick={() => setIsCourseModalOpen(true)} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-lg">
                + Novo Curso
              </button>
            )}
          </header>

          {/* Abas */}
          <div className="flex border-b border-gray-700 mb-8">
            <button className={`px-6 py-3 font-semibold text-lg transition-colors relative ${activeTab === 'courses' ? 'text-purple-400' : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('courses')}>
              Meus Cursos
              {activeTab === 'courses' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>}
            </button>
            <button className={`px-6 py-3 font-semibold text-lg transition-colors relative ${activeTab === 'students' ? 'text-purple-400' : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('students')}>
              Meus Alunos (CRM)
              {activeTab === 'students' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>}
            </button>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg border border-key-divider p-6 shadow-lg min-h-[400px]">
            {activeTab === 'courses' && (
              <div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><span>📚</span> Cursos Cadastrados</h2>
                {courses.length === 0 ? <p className="text-gray-500 text-center py-10">Você não possui cursos.</p> : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-700 text-gray-400 text-sm">
                        <th className="pb-3 font-medium">Nome do Curso</th>
                        <th className="pb-3 font-medium text-center">Status</th>
                        <th className="pb-3 font-medium text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(course => (
                        <tr key={course.id} className="border-b border-gray-800 hover:bg-[#252525]">
                          <td className="py-4 font-semibold text-white">{course.title}</td>
                          <td className="py-4 text-center">
                            <button onClick={() => toggleCourseStatus(course)} className={`px-3 py-1 text-xs rounded-full border ${course.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                              {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                            </button>
                          </td>
                          <td className="py-4 text-center">
                            <button onClick={() => openModuleManager(course)} className="text-purple-400 hover:text-purple-300 font-medium text-sm">Gerir Módulos & Aulas</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><span>👨‍🎓</span> Acompanhamento</h2>
                {students.length === 0 ? <p className="text-gray-500 text-center py-10">Nenhum aluno matriculado.</p> : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-700 text-gray-400 text-sm">
                        <th className="pb-3 font-medium">Aluno</th>
                        <th className="pb-3 font-medium">Curso</th>
                        <th className="pb-3 font-medium text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(st => (
                        <tr key={`${st.id}-${st.course_id}`} className="border-b border-gray-800 hover:bg-[#252525]">
                          <td className="py-4 font-semibold text-white">{st.name}</td>
                          <td className="py-4 text-gray-300 text-sm">{st.course_title}</td>
                          <td className="py-4 text-center">
                            <button onClick={() => handleRemoveStudent(st.id, st.course_id)} className="text-red-500 hover:text-red-400 text-sm font-medium">Remover Aluno</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL CURSO */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Novo Curso</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <input type="text" placeholder="Título" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} className="w-full bg-[#252525] border border-gray-600 rounded p-3 text-white" required />
              <input type="text" placeholder="Instrumento (ex: Violão)" value={newCourse.instrument} onChange={e => setNewCourse({...newCourse, instrument: e.target.value})} className="w-full bg-[#252525] border border-gray-600 rounded p-3 text-white" required />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsCourseModalOpen(false)} className="text-gray-400 hover:text-white">Cancelar</button>
                <button type="submit" className="bg-purple-600 px-4 py-2 rounded text-white font-bold">Criar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MÓDULOS E AULAS (F17 e F18) */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl w-full max-w-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
              <h3 className="text-2xl font-bold text-white">Gerir: {selectedCourse?.title}</h3>
              <button onClick={() => setIsModuleModalOpen(false)} className="text-gray-400 hover:text-white text-xl">✖</button>
            </div>

            {/* Criar Módulo */}
            <form onSubmit={handleCreateModule} className="flex gap-2 mb-8">
              <input type="text" placeholder="Nome do Novo Módulo" value={newModule.title} onChange={e => setNewModule({title: e.target.value})} className="flex-grow bg-[#252525] border border-gray-600 rounded p-2 text-white" required />
              <button type="submit" className="bg-purple-600 px-4 py-2 rounded text-white font-bold">+ Módulo</button>
            </form>

            {/* Lista de Módulos e Aulas */}
            <div className="space-y-6">
              {modules.map(mod => (
                <div key={mod.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-bold text-purple-300 mb-3">{mod.title}</h4>
                  
                  {/* Aulas do Módulo */}
                  <div className="space-y-2 mb-4">
                    {mod.classes?.map(cls => (
                      <div key={cls.id} className="bg-gray-900 p-3 rounded border border-gray-700 flex justify-between items-center">
                        <span className="text-sm text-gray-200">▶ {cls.title}</span>
                      </div>
                    ))}
                  </div>

                  {/* Add Nova Aula */}
                  <form onSubmit={handleCreateClass} className="flex gap-2 mt-2">
                    <input type="text" placeholder="Título da Aula" value={newClass.module_id === mod.id ? newClass.title : ''} onChange={e => setNewClass({...newClass, title: e.target.value, module_id: mod.id})} className="flex-grow bg-[#252525] text-sm border border-gray-600 rounded p-2 text-white" required />
                    <input type="text" placeholder="Link (YouTube)" value={newClass.module_id === mod.id ? newClass.video_url : ''} onChange={e => setNewClass({...newClass, video_url: e.target.value})} className="flex-grow bg-[#252525] text-sm border border-gray-600 rounded p-2 text-white" required />
                    <button type="submit" disabled={newClass.module_id !== mod.id} className="bg-blue-600 disabled:bg-gray-600 px-3 py-1 rounded text-white text-sm font-bold">+ Aula</button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SoloTeacherCourses;