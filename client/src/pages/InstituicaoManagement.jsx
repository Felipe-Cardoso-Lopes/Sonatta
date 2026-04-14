import React, { useState, useEffect } from 'react';
import InstituicaoSidebar from '../components/InstituicaoSidebar';
import Header from '../components/Header';

function InstituicaoManagement() {
  const [schoolData, setSchoolData] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca inicial dos dados
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token') || ''; // Ajuste conforme sua lógica de auth
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // Busca dados e códigos da escola
      const dataRes = await fetch(`${API_URL}/api/instituicao/data`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataJson = await dataRes.json();
      
      // Busca a lista de alunos e professores
      const usersRes = await fetch(`${API_URL}/api/instituicao/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersJson = await usersRes.json();

      if (dataRes.ok && usersRes.ok) {
        setSchoolData(dataJson.escola);
        setStats(dataJson.stats);
        setUsers(usersJson);
      }
    } catch (error) {
      console.error("Erro ao carregar o painel de gestão:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = async (userId, userName) => {
    const confirm = window.confirm(`Tem certeza que deseja revogar o acesso de ${userName}? O usuário perderá o vínculo com a instituição.`);
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token') || '';
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(`${API_URL}/api/instituicao/users/${userId}/revoke`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert("Acesso revogado com sucesso.");
        // Atualiza a lista na tela removendo o usuário expulso
        setUsers(users.filter(user => user.id !== userId));
        
        // Atualiza os contadores
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.message || "Erro ao revogar acesso.");
      }
    } catch (error) {
      console.error("Erro ao revogar:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Código "${text}" copiado para a área de transferência!`);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-piano-black text-pure-white items-center justify-center">
        <p className="text-xl">Carregando dados da instituição...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-piano-black text-pure-white font-poppins">
      <InstituicaoSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Gestão da Comunidade</h1>
              <p className="text-gray-400">Gerencie seus códigos de convite e os usuários vinculados à {schoolData?.nome}.</p>
            </header>

            {/* Secção de Códigos de Convite */}
            <section className="mb-12">
              <h2 className="text-xl font-bold mb-4 border-b border-key-divider pb-2">Seus Códigos de Convite</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Card Aluno */}
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-key-divider flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-300">Código para Alunos</h3>
                    <p className="text-sm text-gray-500 mb-4">Compartilhe este código com os alunos matriculados.</p>
                  </div>
                  <div className="flex items-center justify-between bg-dark-bg p-3 rounded border border-gray-700">
                    <span className="font-mono text-purple-400 text-lg">{schoolData?.codigo_aluno}</span>
                    <button 
                      onClick={() => copyToClipboard(schoolData?.codigo_aluno)}
                      className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                {/* Card Professor */}
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-key-divider flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-300">Código para Professores</h3>
                    <p className="text-sm text-gray-500 mb-4">Compartilhe este código EXCLUSIVAMENTE com o seu corpo docente.</p>
                  </div>
                  <div className="flex items-center justify-between bg-dark-bg p-3 rounded border border-gray-700">
                    <span className="font-mono text-blue-400 text-lg">{schoolData?.codigo_professor}</span>
                    <button 
                      onClick={() => copyToClipboard(schoolData?.codigo_professor)}
                      className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* Secção de Usuários Vinculados */}
            <section>
              <div className="flex justify-between items-center mb-4 border-b border-key-divider pb-2">
                <h2 className="text-xl font-bold">Membros Ativos</h2>
                <div className="text-sm text-gray-400 space-x-4">
                  <span>Alunos: <strong className="text-white">{stats?.total_alunos || 0}</strong></span>
                  <span>Professores: <strong className="text-white">{stats?.total_professores || 0}</strong></span>
                </div>
              </div>

              <div className="bg-[#1a1a1a] rounded-lg border border-key-divider overflow-hidden">
                {users.length === 0 ? (
                  <p className="p-6 text-center text-gray-500">Nenhum usuário vinculado a esta instituição ainda.</p>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#2a2a2a] border-b border-key-divider text-sm">
                        <th className="p-4 font-semibold">Nome</th>
                        <th className="p-4 font-semibold">Email</th>
                        <th className="p-4 font-semibold">Cargo</th>
                        <th className="p-4 font-semibold text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-key-divider hover:bg-[#252525] transition-colors">
                          <td className="p-4">{user.name}</td>
                          <td className="p-4 text-gray-400">{user.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                              user.role === 'professor' ? 'bg-blue-900 text-blue-300' : 'bg-purple-900 text-purple-300'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleRevokeAccess(user.id, user.name)}
                              className="text-red-500 hover:text-red-400 hover:underline text-sm font-semibold"
                            >
                              Revogar Acesso
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

export default InstituicaoManagement;