import React, { useState, useEffect } from 'react';
import SuperAdminSidebar from '../components/SuperAdminSidebar';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';

function SuperAdminSchools() {
  const [schools, setSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Nota: Esta rota deve retornar todas as instituições cadastradas
      const response = await fetch(`${API_URL}/api/super-admin/institutions`);
      const data = await response.json();
      
      if (response.ok) {
        setSchools(data);
      }
    } catch (error) {
      console.error('Erro ao procurar instituições:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = schools.filter(school => 
    school.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-piano-black text-pure-white font-poppins">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Instituições Parceiras</h1>
                <p className="text-gray-400">Gerencie todas as escolas de música conectadas à plataforma.</p>
              </div>
              <Button variant="primary">Cadastrar Nova Escola</Button>
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
    </div>
  );
}

export default SuperAdminSchools;