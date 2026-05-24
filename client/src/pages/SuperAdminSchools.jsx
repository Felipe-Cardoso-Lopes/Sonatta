import React, { useState, useEffect } from 'react';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import Button from '../components/Button';
import Input from '../components/Input';

function SuperAdminSchools() {
  const [schools, setSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: '', email: '', telefone: '', cidade: '',
    codigo_aluno: '', codigo_professor: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await fetch(`${API_URL}/api/super-admin/institutions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setSchools(data);
    } catch (error) {
      console.error('Erro ao procurar instituições:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSchool = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.email) {
      alert('Nome e e-mail são obrigatórios.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/super-admin/institutions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Instituição cadastrada com sucesso!');
        setIsModalOpen(false);
        setFormData({ nome: '', email: '', telefone: '', cidade: '', codigo_aluno: '', codigo_professor: '' });
        fetchSchools();
      } else {
        alert(data.message || 'Erro ao cadastrar instituição.');
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSchools = schools.filter(school =>
    school.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-piano-black text-pure-white font-poppins">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">

            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Instituições Parceiras</h1>
                <p className="text-gray-400">Gerencie todas as escolas de música conectadas à plataforma.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-lg transition-colors shadow-lg"
              >
                + Cadastrar Nova Escola
              </button>
            </header>

            <div className="mb-6 max-w-md">
              <Input
                placeholder="Pesquisar escola pelo nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-[#1a1a1a] rounded-lg border border-key-divider overflow-hidden">
              {loading ? (
                <p className="p-6 text-center text-gray-500">A carregar instituições...</p>
              ) : filteredSchools.length === 0 ? (
                <p className="p-6 text-center text-gray-500">Nenhuma instituição encontrada.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#2a2a2a] border-b border-key-divider text-sm">
                      <th className="p-4 font-semibold">Nome da Instituição</th>
                      <th className="p-4 font-semibold">Localização</th>
                      <th className="p-4 font-semibold text-center">Status</th>
                      <th className="p-4 font-semibold text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchools.map((school) => (
                      <tr key={school.id} className="border-b border-key-divider hover:bg-[#252525] transition-colors">
                        <td className="p-4 font-medium text-white">{school.nome}</td>
                        <td className="p-4 text-gray-400">{school.cidade || 'Não informada'}</td>
                        <td className="p-4 text-center">
                          <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-green-900 text-green-300">
                            Ativa
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button className="text-purple-400 hover:text-purple-300 text-sm font-semibold mr-4">
                            Editar
                          </button>
                          <button className="text-gray-500 hover:text-white text-sm font-semibold">
                            Relatórios
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 w-full max-w-lg p-6 rounded-xl border border-gray-600 shadow-2xl">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Cadastrar Nova Escola</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">Nome *</label>
                  <input
                    type="text" name="nome" required
                    value={formData.nome} onChange={handleChange}
                    placeholder="Ex: Escola Harmonia"
                    className="w-full bg-gray-900 border border-gray-700 p-2.5 rounded-lg text-white text-sm outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">E-mail *</label>
                  <input
                    type="email" name="email" required
                    value={formData.email} onChange={handleChange}
                    placeholder="contato@escola.com"
                    className="w-full bg-gray-900 border border-gray-700 p-2.5 rounded-lg text-white text-sm outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">Telefone</label>
                  <input
                    type="text" name="telefone"
                    value={formData.telefone} onChange={handleChange}
                    placeholder="(61) 99999-9999"
                    className="w-full bg-gray-900 border border-gray-700 p-2.5 rounded-lg text-white text-sm outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">Cidade</label>
                  <input
                    type="text" name="cidade"
                    value={formData.cidade} onChange={handleChange}
                    placeholder="Ex: Brasília"
                    className="w-full bg-gray-900 border border-gray-700 p-2.5 rounded-lg text-white text-sm outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">Código do Aluno</label>
                  <input
                    type="text" name="codigo_aluno"
                    value={formData.codigo_aluno} onChange={handleChange}
                    placeholder="Ex: ALU-XYZ01"
                    className="w-full bg-gray-900 border border-gray-700 p-2.5 rounded-lg text-white text-sm outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-1">Código do Professor</label>
                  <input
                    type="text" name="codigo_professor"
                    value={formData.codigo_professor} onChange={handleChange}
                    placeholder="Ex: PRF-XYZ01"
                    className="w-full bg-gray-900 border border-gray-700 p-2.5 rounded-lg text-white text-sm outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-2.5 rounded-lg font-bold text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 py-2.5 rounded-lg font-bold text-white text-sm transition-colors"
                >
                  {isSaving ? 'Salvando...' : 'Cadastrar Escola'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminSchools;