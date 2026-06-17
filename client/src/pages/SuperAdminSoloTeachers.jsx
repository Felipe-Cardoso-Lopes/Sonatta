import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import Input from '../components/Input';

function SuperAdminSoloTeachers() {
  // --- Estados para listagem e busca ---
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // --- Estados para o Modal de criação ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');
  
  // CORREÇÃO AQUI: Alterado de 'role' para 'userRole' para coincidir com o resto do sistema
  const userRole = localStorage.getItem('userRole'); 
  
  const navigate = useNavigate();

  // Validação de acesso estrita para Super Admin
  useEffect(() => {
    // Usamos includes('super') para garantir que tanto 'super_admin' quanto 'super-admin' funcionem
    if (!token || !userRole || !userRole.includes('super')) {
      navigate('/login');
    } else {
      fetchTeachers();
    }
  }, [navigate, token, userRole]);

  // Busca os professores solo na API
  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/super-admin/solo-teachers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
      }
    } catch (error) {
      console.error('Erro ao buscar professores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Envia os dados para criar um novo professor solo
  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/super-admin/solo-teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Professor Solo adicionado com sucesso!');
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '' });
        fetchTeachers(); // Recarrega a listagem imediatamente
      } else {
        alert(data.message || 'Erro ao registrar professor.');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtra a lista com base no termo de pesquisa
  const filteredTeachers = teachers.filter(teacher => 
    teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fallback visual se estiver a carregar o redirecionamento
  if (!token || !userRole || !userRole.includes('super')) return null;

  return (
    <div className="flex h-screen bg-piano-black text-pure-white font-poppins relative">
      <div className="shrink-0 z-20">
        <SuperAdminSidebar />
      </div>
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            
            {/* Cabeçalho */}
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Professores Solo</h1>
                <p className="text-gray-400">Gerencie a rede de professores independentes cadastrados na plataforma.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 font-bold px-6 py-3 rounded-lg transition-colors shadow-lg flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <span>+</span> Cadastrar Professor Solo
              </button>
            </header>

            {/* Barra de Pesquisa */}
            <div className="mb-8 max-w-md">
              <Input
                placeholder="Pesquisar professor pelo nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Listagem de Professores - Modo Card (Grid) */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-gray-500 animate-pulse text-lg">A carregar professores...</p>
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-12 text-center flex flex-col items-center justify-center">
                <span className="text-5xl mb-4">🔍</span>
                <p className="text-gray-400 text-lg">Nenhum professor solo encontrado com este filtro.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTeachers.map((teacher) => (
                  <div 
                    key={teacher.id} 
                    className="bg-[#1a1a1a] rounded-xl border border-gray-700 p-6 flex flex-col gap-4 shadow-lg hover:border-purple-500/50 transition-colors h-full group"
                  >
                    {/* Header do Cartão (Avatar + Info) */}
                    <div className="flex items-center gap-4">
                      {/* Avatar com proporção fixa */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-inner border border-gray-600">
                        {(teacher?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      
                      {/* Textos com Truncate */}
                      <div className="flex-col overflow-hidden w-full">
                        <h3 className="font-bold text-lg text-white truncate" title={teacher?.name || 'Nome não definido'}>
                          {teacher?.name || 'Nome não definido'}
                        </h3>
                        <p className="text-sm text-gray-400 truncate" title={teacher?.email || 'E-mail não definido'}>
                          {teacher?.email || 'E-mail não definido'}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20 inline-block">
                        Ativo na Plataforma
                      </span>
                    </div>

                    {/* Botões de Ação (Empurrados para o fundo via mt-auto) */}
                    <div className="mt-auto pt-5 border-t border-gray-800 flex justify-end gap-3">
                      <button className="text-sm font-semibold text-gray-400 hover:text-white px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700">
                        Detalhes
                      </button>
                      <button className="text-sm font-semibold text-white px-4 py-1.5 rounded bg-purple-600 hover:bg-purple-700 transition-colors shadow-md">
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </main>
      </div>

      {/* Modal de Cadastro (Adaptado visualmente para o Tema Escuro) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors text-xl font-bold"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-purple-300">Cadastrar Professor Solo</h2>
            
            <form onSubmit={handleCreateTeacher} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Nome Completo *</label>
                <Input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ex: João Silva" />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">E-mail *</label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="contato@professor.com" />
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Senha Provisória *</label>
                <Input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Defina uma senha segura" />
              </div>

              <div className="border-t border-gray-700 pt-4 mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed py-3 rounded-lg font-bold text-white transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <span className="animate-spin">⏳</span> : null}
                  {isSubmitting ? 'A guardar...' : 'Confirmar Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminSoloTeachers;