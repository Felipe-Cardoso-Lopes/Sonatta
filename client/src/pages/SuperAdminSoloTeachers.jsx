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
  const userRole = localStorage.getItem('role');
  const navigate = useNavigate();

  // Validação de acesso estrita para Super Admin
  useEffect(() => {
    if (!token || userRole !== 'super_admin') {
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
        fetchTeachers(); // Recarrega a tabela imediatamente
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
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!token || userRole !== 'super_admin') return null;

  return (
    <div className="flex h-screen bg-piano-black text-pure-white font-poppins">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Cabeçalho */}
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Professores Solo</h1>
                <p className="text-gray-400">Gerencie professores independentes não vinculados a escolas.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 font-bold px-6 py-2.5 rounded-lg transition-colors shadow-lg"
              >
                + Cadastrar Professor Solo
              </button>
            </header>

            {/* Campo de Pesquisa */}
            <div className="mb-6 max-w-md">
              <Input
                placeholder="Pesquisar professor pelo nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Tabela de Professores Solo */}
            <div className="bg-[#1a1a1a] rounded-lg border border-key-divider overflow-hidden">
              {isLoading ? (
                <p className="p-6 text-center text-gray-500">A carregar...</p>
              ) : filteredTeachers.length === 0 ? (
                <p className="p-6 text-center text-gray-500">Nenhum professor solo encontrado.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#2a2a2a] border-b border-key-divider text-sm">
                      <th className="p-4 font-semibold">Nome</th>
                      <th className="p-4 font-semibold">E-mail</th>
                      <th className="p-4 font-semibold text-center">Status</th>
                      <th className="p-4 font-semibold text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map((teacher) => (
                      <tr key={teacher.id} className="border-b border-key-divider hover:bg-[#252525] transition-colors">
                        <td className="p-4 font-medium text-white">{teacher.name}</td>
                        <td className="p-4 text-sm text-gray-400">{teacher.email}</td>
                        <td className="p-4 text-center">
                          <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-green-900/50 text-green-400 border border-green-800">
                            Ativo
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-50">
          <div className="bg-[#1a1a1a] p-8 rounded-xl border border-key-divider w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white font-bold"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold mb-6">Cadastrar Professor Solo</h2>
            
            <form onSubmit={handleCreateTeacher} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1">Nome Completo *</label>
                <Input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ex: João Silva" />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1">E-mail *</label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="contato@professor.com" />
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-1">Senha Provisória *</label>
                <Input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Defina uma senha" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-3 rounded-lg font-bold text-white transition-colors"
              >
                {isSubmitting ? 'A salvar...' : 'Confirmar Cadastro'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminSoloTeachers;