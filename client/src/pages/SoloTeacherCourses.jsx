import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DropZone from '../components/DropZone';
import SoloTeacherSidebar from '../components/SoloTeacherSidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function SoloTeacherCourses() {
  const [activeTab, setActiveTab] = useState('courses'); 
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'builder'
  
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  
  const [newCourse, setNewCourse] = useState({ title: '', description: '', instrument: '', status: 'draft' });
  const [newModule, setNewModule] = useState({ title: '' });
  const [newClass, setNewClass] = useState({ title: '', video_url: '', module_id: null });

  const [editingModule, setEditingModule] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [activeAttachmentClassId, setActiveAttachmentClassId] = useState(null);
  const [docName, setDocName] = useState('');

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

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/courses/teacher`, newCourse, getAuthHeaders());
      alert('Curso criado com sucesso!');
      setIsCourseModalOpen(false);
      setNewCourse({ title: '', description: '', instrument: '', status: 'draft' });
      fetchCourses();
    } catch (err) { 
      alert(err.response?.data?.message || 'Erro ao criar curso'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCourseStatus = async (course) => {
    const updatedStatus = course.status === 'published' ? 'draft' : 'published';
    try {
      await axios.put(`${API_URL}/api/courses/${course.id}`, { ...course, status: updatedStatus }, getAuthHeaders());
      fetchCourses();
    } catch (err) { alert('Erro ao atualizar status'); }
  };

  // Transição para a tela de Construtor (Builder)
  const openModuleManager = async (course) => {
    setSelectedCourse(course);
    try {
      const res = await axios.get(`${API_URL}/api/courses/${course.id}/modules`, getAuthHeaders());
      setModules(res.data);
      setViewMode('builder');
    } catch (err) { console.error(err); }
  };

  const closeModuleManager = () => {
    setViewMode('list');
    setSelectedCourse(null);
    setModules([]);
    setEditingModule(null);
    setEditingClass(null);
    setActiveAttachmentClassId(null);
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if(!newModule.title.trim()) return;
    try {
      await axios.post(`${API_URL}/api/courses/${selectedCourse.id}/modules`, newModule, getAuthHeaders());
      setNewModule({ title: '' });
      openModuleManager(selectedCourse);
    } catch (err) { alert('Erro ao criar módulo'); }
  };

  const handleUpdateModule = async (e, moduleId) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/courses/${selectedCourse.id}/modules/${moduleId}`, { title: editingModule.title }, getAuthHeaders());
      setEditingModule(null);
      openModuleManager(selectedCourse);
    } catch (err) { alert('Erro ao atualizar módulo'); }
  };

  const handleDeleteModule = async (moduleId) => {
    if(window.confirm('Excluir este módulo? Todas as aulas dentro dele serão perdidas.')){
      try {
        await axios.delete(`${API_URL}/api/courses/${selectedCourse.id}/modules/${moduleId}`, getAuthHeaders());
        openModuleManager(selectedCourse);
      } catch (err) { alert('Erro ao excluir'); }
    }
  };

  const handleCreateClass = async (e, modId) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/courses/${selectedCourse.id}/modules/${modId}/classes`, { ...newClass, module_id: modId }, getAuthHeaders());
      setNewClass({ title: '', video_url: '', module_id: null });
      openModuleManager(selectedCourse);
    } catch (err) { alert('Erro ao criar aula'); }
  };

  const handleUpdateClass = async (e, classId) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/courses/${selectedCourse.id}/modules/classes/${classId}`, editingClass, getAuthHeaders());
      setEditingClass(null);
      openModuleManager(selectedCourse);
    } catch (err) { alert('Erro ao atualizar aula'); }
  };

  const handleDeleteClass = async (classId) => {
    if(window.confirm('Excluir esta aula?')){
      try {
        await axios.delete(`${API_URL}/api/courses/${selectedCourse.id}/modules/classes/${classId}`, getAuthHeaders());
        openModuleManager(selectedCourse);
      } catch (err) { alert('Erro ao excluir aula'); }
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await axios.delete(`${API_URL}/api/courses/${selectedCourse.id}/modules/documents/${docId}`, getAuthHeaders());
      openModuleManager(selectedCourse);
    } catch (err) { alert('Erro ao excluir documento'); }
  };

  const handleAddDocument = async (url) => {
    if(!docName.trim()) { alert('Dê um nome ao arquivo primeiro!'); return; }
    try {
      await axios.post(`${API_URL}/api/courses/${selectedCourse.id}/modules/classes/${activeAttachmentClassId}/documents`, { name: docName, url }, getAuthHeaders());
      setActiveAttachmentClassId(null);
      setDocName('');
      openModuleManager(selectedCourse);
    } catch (err) { alert('Erro ao anexar arquivo'); }
  };

  const handleRemoveStudent = async (studentId, courseId) => {
    if(window.confirm('Tem a certeza que deseja desmatricular este aluno?')) {
      try {
        await axios.post(`${API_URL}/api/courses/unenroll`, { student_id: studentId, course_id: courseId }, getAuthHeaders());
        fetchStudents();
      } catch (err) { alert('Erro ao remover aluno'); }
    }
  };

  return (
    <div className="min-h-screen bg-piano-black text-white-text font-poppins flex overflow-x-hidden">
      <SoloTeacherSidebar />
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <main className="flex-grow p-6 md:p-10 overflow-y-auto custom-scrollbar">
          
          {viewMode === 'list' ? (
            // ==================== VIEW: LISTA DE CURSOS ====================
            <div className="animate-fadeIn max-w-7xl mx-auto">
              <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Gerenciamento</h1>
                  <p className="text-gray-400">Administre seus cursos, módulos, aulas e acompanhe seus alunos.</p>
                </div>
                {activeTab === 'courses' && (
                  <button onClick={() => setIsCourseModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg flex items-center gap-2">
                    <span>+</span> Novo Curso
                  </button>
                )}
              </header>

              <div className="flex border-b border-gray-700 mb-8">
                <button className={`px-6 py-3 font-semibold text-lg transition-colors relative ${activeTab === 'courses' ? 'text-purple-400' : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('courses')}>
                  Meus Cursos
                  {activeTab === 'courses' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>}
                </button>
                <button className={`px-6 py-3 font-semibold text-lg transition-colors relative ${activeTab === 'students' ? 'text-purple-400' : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('students')}>
                  Meus Alunos
                  {activeTab === 'students' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>}
                </button>
              </div>

              <div className="bg-[#1a1a1a] rounded-xl border border-gray-700 p-6 shadow-lg min-h-[400px]">
                {activeTab === 'courses' && (
                  <div>
                    {courses.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <span className="text-6xl mb-4">📚</span>
                        <p>Você ainda não criou nenhum curso.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                          <div key={course.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-md flex flex-col hover:border-purple-500/50 transition">
                            <div className="p-5 flex-grow">
                              <h3 className="font-bold text-xl text-white mb-1">{course.title}</h3>
                              <p className="text-xs text-gray-400 mb-4">{course.instrument}</p>
                              
                              <button onClick={() => toggleCourseStatus(course)} className={`px-3 py-1 text-xs rounded-full border transition ${course.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/30' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/30'}`}>
                                {course.status === 'published' ? '🟢 Publicado' : '🟡 Rascunho'}
                              </button>
                            </div>
                            <div className="bg-gray-900 p-4 border-t border-gray-700">
                              <button onClick={() => openModuleManager(course)} className="w-full bg-gray-700 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold transition text-sm">
                                Conteúdo (Grade)
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'students' && (
                  <div>
                    {students.length === 0 ? <p className="text-gray-500 text-center py-10">Nenhum aluno matriculado.</p> : (
                      <div className="w-full overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[500px]">
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
                                <button onClick={() => handleRemoveStudent(st.id, st.course_id)} className="text-red-500 hover:text-red-400 text-sm font-bold bg-red-500/10 px-3 py-1 rounded">Remover</button>
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
            </div>
          ) : (
            // ==================== VIEW: CONSTRUTOR DE CURSO ====================
            <div className="animate-fadeIn max-w-5xl mx-auto flex flex-col gap-6">
              
              {/* Header do Construtor */}
              <div className="bg-[#1a1a1a] rounded-xl border border-gray-700 p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <button onClick={closeModuleManager} className="text-gray-400 hover:text-purple-400 text-sm font-semibold mb-2 flex items-center gap-2 transition">
                    <span>←</span> Voltar aos Cursos
                  </button>
                  <h1 className="text-2xl font-bold text-white leading-tight">Grade Curricular: <span className="text-purple-400">{selectedCourse?.title}</span></h1>
                </div>
              </div>

              {/* Formulário Novo Módulo */}
              <form onSubmit={handleCreateModule} className="bg-gray-800 rounded-xl border border-gray-700 p-5 shadow-lg flex flex-col sm:flex-row gap-3">
                <input type="text" placeholder="Nome do novo módulo (Ex: Módulo 1 - Introdução)" value={newModule.title} onChange={e => setNewModule({title: e.target.value})} className="flex-grow bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none" required />
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-bold transition shrink-0 whitespace-nowrap">
                  + Adicionar Módulo
                </button>
              </form>

              {/* Lista de Módulos (Sanfona) */}
              <div className="flex flex-col gap-5">
                {modules.length === 0 && (
                  <div className="text-center py-10 bg-[#1a1a1a] rounded-xl border border-gray-700 border-dashed text-gray-500">
                    <p>Este curso ainda não possui módulos.</p>
                  </div>
                )}

                {modules.map(mod => (
                  <div key={mod.id} className="bg-[#1a1a1a] rounded-xl border border-gray-700 overflow-hidden shadow-xl shadow-black/50">
                    
                    {/* Cabeçalho do Módulo */}
                    <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center border-l-4 border-l-purple-500">
                      {editingModule?.id === mod.id ? (
                        <form onSubmit={(e) => handleUpdateModule(e, mod.id)} className="flex gap-2 w-full max-w-lg">
                          <input type="text" value={editingModule.title} onChange={e => setEditingModule({...editingModule, title: e.target.value})} className="flex-grow bg-gray-900 border border-gray-600 rounded p-2 text-white text-sm focus:border-purple-500 outline-none" required autoFocus />
                          <button type="submit" className="bg-green-600 hover:bg-green-500 px-3 rounded text-white text-sm font-bold">Salvar</button>
                          <button type="button" onClick={() => setEditingModule(null)} className="bg-gray-600 hover:bg-gray-500 px-3 rounded text-white text-sm font-bold">Cancelar</button>
                        </form>
                      ) : (
                        <>
                          <h3 className="font-bold text-lg text-white">{mod.title}</h3>
                          <div className="flex gap-3">
                            <button onClick={() => setEditingModule(mod)} className="text-gray-400 hover:text-blue-400 transition" title="Editar Módulo">✏️</button>
                            <button onClick={() => handleDeleteModule(mod.id)} className="text-gray-400 hover:text-red-400 transition" title="Excluir Módulo">🗑️</button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Corpo do Módulo (Aulas) */}
                    <div className="p-4 flex flex-col gap-3">
                      {mod.classes?.map(cls => (
                        <div key={cls.id} className="bg-gray-900 rounded-lg border border-gray-700/50 p-3 transition-colors hover:border-gray-600 flex flex-col gap-3">
                          
                          {/* Modo Edição da Aula */}
                          {editingClass?.id === cls.id ? (
                            <form onSubmit={(e) => handleUpdateClass(e, cls.id)} className="flex flex-col sm:flex-row gap-2">
                              <input type="text" value={editingClass.title} onChange={e => setEditingClass({...editingClass, title: e.target.value})} className="w-full sm:w-1/3 bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm outline-none focus:border-blue-500" required />
                              <input type="text" value={editingClass.video_url} onChange={e => setEditingClass({...editingClass, video_url: e.target.value})} className="flex-grow bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm outline-none focus:border-blue-500" required />
                              <div className="flex gap-2 shrink-0">
                                <button type="submit" className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded text-white font-bold text-xs">Salvar</button>
                                <button type="button" onClick={() => setEditingClass(null)} className="bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-white font-bold text-xs">Cancelar</button>
                              </div>
                            </form>
                          ) : (
                            // Modo Visualização da Aula
                            <>
                              <div className="flex justify-between items-center gap-4">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div className="w-8 h-8 rounded bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">▶</div>
                                  <span className="font-semibold text-sm text-gray-200 truncate">{cls.title}</span>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                  <button onClick={() => setActiveAttachmentClassId(cls.id === activeAttachmentClassId ? null : cls.id)} className={`text-xs font-bold px-2 py-1 rounded transition ${activeAttachmentClassId === cls.id ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                                    📎 Anexos {cls.documents?.length > 0 && `(${cls.documents.length})`}
                                  </button>
                                  <div className="flex gap-2 border-l border-gray-700 pl-4">
                                    <button onClick={() => setEditingClass(cls)} className="text-gray-400 hover:text-blue-400 transition">✏️</button>
                                    <button onClick={() => handleDeleteClass(cls.id)} className="text-gray-400 hover:text-red-400 transition">🗑️</button>
                                  </div>
                                </div>
                              </div>

                              {/* Área de Anexos da Aula Específica */}
                              {(cls.documents?.length > 0 || activeAttachmentClassId === cls.id) && (
                                <div className="bg-gray-800/50 rounded p-3 mt-1 border border-gray-700">
                                  
                                  {cls.documents?.length > 0 && (
                                    <div className="flex flex-col gap-2 mb-3">
                                      {cls.documents.map(doc => (
                                        <div key={doc.id} className="flex justify-between items-center bg-gray-800 p-2 rounded border border-gray-700">
                                          <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs text-blue-300 hover:underline flex items-center gap-2">📄 {doc.name}</a>
                                          <button onClick={() => handleDeleteDocument(doc.id)} className="text-red-500 hover:text-red-400 text-xs font-bold bg-red-500/10 px-2 py-1 rounded">X</button>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {activeAttachmentClassId === cls.id && (
                                    <div className="animate-fadeIn mt-2 pt-3 border-t border-gray-700/50">
                                      <input type="text" placeholder="Nome do arquivo (ex: Material em PDF)" value={docName} onChange={e => setDocName(e.target.value)} className="w-full mb-3 bg-gray-900 border border-gray-600 rounded p-2 text-white text-sm outline-none focus:border-purple-500" />
                                      <DropZone accept="*/*" label="Arraste ou Clique para enviar o material" onUploadSuccess={(url) => handleAddDocument(url)} />
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ))}

                      {/* Formulário Nova Aula (Rodapé do Módulo) */}
                      <form onSubmit={(e) => handleCreateClass(e, mod.id)} className="flex flex-col sm:flex-row gap-2 mt-2">
                        <input type="text" placeholder="Título da Nova Aula" value={newClass.module_id === mod.id ? newClass.title : ''} onChange={e => setNewClass({...newClass, title: e.target.value, module_id: mod.id})} className="w-full sm:w-1/3 bg-gray-900 text-sm border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-purple-500" required />
                        <input type="url" placeholder="Link do Vídeo (YouTube)" value={newClass.module_id === mod.id ? newClass.video_url : ''} onChange={e => setNewClass({...newClass, video_url: e.target.value})} className="flex-grow bg-gray-900 text-sm border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-purple-500" required />
                        <button type="submit" disabled={newClass.module_id !== mod.id} className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white text-xs font-bold transition shrink-0">
                          + Adicionar Aula
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL NOVO CURSO (Apenas para criar o curso, limpo e responsivo) */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl mx-4">
            <h3 className="text-2xl font-bold text-white mb-6">Criar Novo Curso</h3>
            <form onSubmit={handleCreateCourse} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Nome do Curso</label>
                <input type="text" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} className="w-full bg-[#252525] border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none" required disabled={isSubmitting} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Instrumento Base</label>
                <input type="text" placeholder="Ex: Violão, Piano, Canto" value={newCourse.instrument} onChange={e => setNewCourse({...newCourse, instrument: e.target.value})} className="w-full bg-[#252525] border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none" required disabled={isSubmitting} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Descrição do Curso (Público)</label>
                <textarea value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} className="w-full bg-[#252525] border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none resize-none" rows="3" disabled={isSubmitting}></textarea>
              </div>
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
                <button type="button" onClick={() => setIsCourseModalOpen(false)} className="text-gray-400 hover:text-white px-4 py-2 font-semibold transition" disabled={isSubmitting}>Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-white font-bold transition disabled:opacity-50 flex items-center gap-2">
                  {isSubmitting ? <span className="animate-spin">⏳</span> : null}
                  {isSubmitting ? 'Criando...' : 'Salvar Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default SoloTeacherCourses;