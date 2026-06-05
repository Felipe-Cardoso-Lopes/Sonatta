import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';

function InstituicaoManagement() {
  // --- Estados da Interface ---
  const [activeTab, setActiveTab] = useState('professores'); // 'alunos' ou 'professores'
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Estados do Modal de Criação ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Validação de segurança inicial e carregamento de dados
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTeachers();
  }, [token, navigate]);

  // ==========================================
  // READ: Obter lista de Professores
  // ==========================================
  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/instituicao/teachers`, {
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

  // Atualiza dinamicamente os valores do formulário
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==========================================
  // CREATE: Adicionar novo Professor
  // ==========================================
  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/instituicao/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // O token injeta a segurança de vínculo no backend
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Professor adicionado com sucesso!');
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '' }); // Limpa o formulário
        fetchTeachers(); // Atualiza a tabela imediatamente
      } else {
        alert(data.message || 'Erro ao registar professor.');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-piano-black text-white font-poppins p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestão da Instituição</h1>
            <p className="text-gray-400">Gira a sua equipa de professores e os alunos associados.</p>
          </div>
          {activeTab === 'professores' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 font-bold px-6 py-2 rounded-lg transition-colors"
            >
              + Adicionar Professor
            </button>
          )}
        </header>

        {/* Sistema de Abas */}
        <div className="flex gap-6 mb-6 border-b border-key-divider pb-2">
          <button
            onClick={() => setActiveTab('professores')}
            className={`pb-2 font-bold text-sm transition-all ${activeTab === 'professores' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Corpo Docente ({teachers.length})
          </button>
          <button
            onClick={() => setActiveTab('alunos')}
            className={`pb-2 font-bold text-sm transition-all ${activeTab === 'alunos' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Lista de Alunos
          </button>
        </div>

        {/* Tabela de Professores */}
        {activeTab === 'professores' && (
          <div className="bg-[#1a1a1a] rounded-lg border border-key-divider overflow-hidden shadow-lg">
            {isLoading ? (
              <p className="p-6 text-center text-gray-500">A carregar dados...</p>
            ) : teachers.length === 0 ? (
              <p className="p-6 text-center text-gray-500">Nenhum professor registado até ao momento.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#2a2a2a] border-b border-key-divider text-sm text-gray-300">
                    <th className="p-4 font-semibold">Nome</th>
                    <th className="p-4 font-semibold">E-mail de Acesso</th>
                    <th className="p-4 font-semibold text-center">Status</th>
                    <th className="p-4 font-semibold text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="border-b border-key-divider hover:bg-[#252525] transition-colors">
                      <td className="p-4 font-medium">{teacher.name}</td>
                      <td className="p-4 text-sm text-gray-400">{teacher.email}</td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-green-900/50 text-green-400 border border-green-800">
                          Ativo
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button className="text-purple-400 hover:text-purple-300 text-sm font-semibold mx-2">
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Espaço reservado para a listagem de Alunos */}
        {activeTab === 'alunos' && (
          <div className="bg-[#1a1a1a] rounded-lg border border-key-divider p-6 text-center text-gray-500">
            A gestão de alunos será implementada na próxima fase.
          </div>
        )}

        {/* Modal de Criação de Professor */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-50">
            <div className="bg-[#1a1a1a] p-8 rounded-xl border border-key-divider w-full max-w-md shadow-2xl relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                ✕
              </button>
              
              <h2 className="text-2xl font-bold mb-6">Registar Novo Professor</h2>
              
              <form onSubmit={handleCreateTeacher} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">Nome Completo *</label>
                  <Input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ex: Maria Silva" />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">E-mail *</label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="professor@escola.com" />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">Senha de Acesso (Provisória) *</label>
                  <Input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Defina uma senha" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-3 rounded-lg font-bold transition-colors"
                >
                  {isSubmitting ? 'A registar...' : 'Confirmar Registo'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default InstituicaoManagement;