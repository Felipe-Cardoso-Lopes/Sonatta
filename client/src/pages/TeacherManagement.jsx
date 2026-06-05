import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DropZone from '../components/DropZone';
import TeacherSidebar from '../components/TeacherSidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function TeacherManagement() {
  const [activeTab, setActiveTab] = useState('courses'); 
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  
  // Modais e Estados F16-F18
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  
  const [newCourse, setNewCourse] = useState({ title: '', description: '', instrument: '', status: 'draft' });
  const [newModule, setNewModule] = useState({ title: '' });
  const [newClass, setNewClass] = useState({ title: '', video_url: '', module_id: null });

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  // Estados para Edição
  const [editingModule, setEditingModule] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  
  // Estado para saber qual aula está com a área de anexo (DropZone) aberta
  const [activeAttachmentClassId, setActiveAttachmentClassId] = useState(null);
  const [docName, setDocName] = useState('');

// --- Funções de Edição e Exclusão (CORRIGIDAS) ---
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
      <TeacherSidebar />
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <main className="flex-grow p-8 overflow-y-auto">
          
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gerenciamento</h1>
              <p className="text-gray-400">Administre os seus cursos, módulos, aulas e acompanhe os seus alunos.</p>
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
                        <tr key={course.id} className="border-b border-gray-800 hover:bg-[#252525] transition-colors">
                          <td className="py-4 font-semibold text-white">{course.title}</td>
                          <td className="py-4 text-center">
                            <button onClick={() => toggleCourseStatus(course)} className={`px-3 py-1 text-xs rounded-full border cursor-pointer transition ${course.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/30' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/30'}`}>
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
                        <tr key={`${st.id}-${st.course_id}`} className="border-b border-gray-800 hover:bg-[#252525] transition-colors">
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

      {/* MODAL MÓDULOS E AULAS (F17 e F18 com Edição e Drag & Drop) */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl w-full max-w-4xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
              <h3 className="text-2xl font-bold text-white">Gerir: {selectedCourse?.title}</h3>
              <button onClick={() => setIsModuleModalOpen(false)} className="text-gray-400 hover:text-white text-xl">✖</button>
            </div>

            {/* Criar Módulo */}
            <form onSubmit={handleCreateModule} className="flex gap-2 mb-8">
              <input type="text" placeholder="Nome do Novo Módulo" value={newModule.title} onChange={e => setNewModule({title: e.target.value})} className="flex-grow bg-[#252525] border border-gray-600 rounded p-2 text-white" required />
              <button type="submit" className="bg-purple-600 px-4 py-2 rounded text-white font-bold">+ Módulo</button>
            </form>

            <div className="space-y-6">
              {modules.map(mod => (
                <div key={mod.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  {editingModule?.id === mod.id ? (
                    <form onSubmit={(e) => handleUpdateModule(e, mod.id)} className="flex gap-2 mb-3">
                      <input type="text" value={editingModule.title} onChange={e => setEditingModule({...editingModule, title: e.target.value})} className="flex-grow bg-gray-900 border border-gray-600 rounded p-2 text-white text-sm" required />
                      <button type="submit" className="bg-green-600 px-3 py-1 rounded text-white font-bold text-sm">Salvar</button>
                      <button type="button" onClick={() => setEditingModule(null)} className="bg-gray-600 px-3 py-1 rounded text-white font-bold text-sm">X</button>
                    </form>
                  ) : (
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-lg font-bold text-purple-300">{mod.title}</h4>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingModule(mod)} className="text-blue-400 hover:text-blue-300 text-sm font-semibold">✏️ Editar</button>
                        <button onClick={() => handleDeleteModule(mod.id)} className="text-red-400 hover:text-red-300 text-sm font-semibold">🗑️ Excluir</button>
                      </div>
                    </div>
                  )}
                  
                  {/* Aulas do Módulo */}
                  <div className="space-y-3 mb-4">
                    {mod.classes?.map(cls => (
                      <div key={cls.id} className="bg-gray-900 p-3 rounded-lg border border-gray-700 flex flex-col gap-2">
                        {editingClass?.id === cls.id ? (
                          <form onSubmit={(e) => handleUpdateClass(e, cls.id)} className="flex flex-col gap-2">
                            <input type="text" value={editingClass.title} onChange={e => setEditingClass({...editingClass, title: e.target.value})} className="bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm" required />
                            <input type="text" value={editingClass.video_url} onChange={e => setEditingClass({...editingClass, video_url: e.target.value})} className="bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm" required />
                            <div className="flex gap-2">
                              <button type="submit" className="bg-green-600 px-3 py-1 rounded text-white font-bold text-sm">Salvar</button>
                              <button type="button" onClick={() => setEditingClass(null)} className="bg-gray-600 px-3 py-1 rounded text-white font-bold text-sm">Cancelar</button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-gray-200">▶ {cls.title}</span>
                              <div className="flex gap-3">
                                <button onClick={() => setActiveAttachmentClassId(cls.id === activeAttachmentClassId ? null : cls.id)} className="text-green-400 hover:text-green-300 text-xs font-semibold">📎 Anexar Arquivo</button>
                                <button onClick={() => setEditingClass(cls)} className="text-blue-400 hover:text-blue-300 text-xs font-semibold">✏️ Editar</button>
                                <button onClick={() => handleDeleteClass(cls.id)} className="text-red-400 hover:text-red-300 text-xs font-semibold">🗑️</button>
                              </div>
                            </div>

                            {/* Lista de Documentos da Aula */}
                            {cls.documents && cls.documents.length > 0 && (
                              <div className="pl-4 mt-1 border-l border-gray-700 flex flex-col gap-1">
                                {cls.documents.map(doc => (
                                  <div key={doc.id} className="flex justify-between items-center">
                                    <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs text-blue-300 hover:underline">📄 {doc.name}</a>
                                    <button onClick={() => handleDeleteDocument(doc.id)} className="text-red-500 hover:text-red-400 text-xs">✖</button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Área de Drag & Drop para Anexos */}
                            {activeAttachmentClassId === cls.id && (
                              <div className="mt-3 p-4 bg-gray-800 border border-dashed border-purple-500/50 rounded-lg animate-fadeIn">
                                <p className="text-xs text-gray-400 mb-2">Envie PDFs, Documentos, Imagens ou Outros Vídeos</p>
                                <input type="text" placeholder="Nome do arquivo (ex: Material em PDF)" value={docName} onChange={e => setDocName(e.target.value)} className="w-full mb-3 bg-gray-900 border border-gray-600 rounded p-2 text-white text-sm" />
                                <DropZone 
                                  accept="*/*" 
                                  label="Arraste ou Clique para fazer Upload" 
                                  onUploadSuccess={(url) => handleAddDocument(url)} 
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Nova Aula */}
                  <form onSubmit={handleCreateClass} className="flex gap-2 mt-2 pt-3 border-t border-gray-700">
                    <input type="text" placeholder="Título da Aula" value={newClass.module_id === mod.id ? newClass.title : ''} onChange={e => setNewClass({...newClass, title: e.target.value, module_id: mod.id})} className="flex-grow bg-[#252525] text-sm border border-gray-600 rounded p-2 text-white" required />
                    <input type="text" placeholder="Link do Vídeo (YouTube)" value={newClass.module_id === mod.id ? newClass.video_url : ''} onChange={e => setNewClass({...newClass, video_url: e.target.value})} className="flex-grow bg-[#252525] text-sm border border-gray-600 rounded p-2 text-white" required />
                    <button type="submit" disabled={newClass.module_id !== mod.id} className="bg-blue-600 disabled:bg-gray-600 px-4 py-2 rounded text-white text-sm font-bold">+ Nova Aula</button>
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

export default TeacherManagement;