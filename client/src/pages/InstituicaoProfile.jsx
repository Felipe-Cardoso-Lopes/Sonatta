import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InstituicaoSidebar from '../components/InstituicaoSidebar';

function InstituicaoProfile() {
  const [profile, setProfile] = useState({ name: '', nickname: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    setProfile({
      name: localStorage.getItem('userName') || '',
      nickname: localStorage.getItem('userNickname') || '',
      email: ''
    });
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await axios.put(`${API_URL}/api/users/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem('userName', profile.name);
      localStorage.setItem('userNickname', profile.nickname);
      alert("Informações atualizadas com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar informações do perfil.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsSavingPassword(true);
    try {
      await axios.put(`${API_URL}/api/users/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Senha alterada com sucesso!");
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error) {
      alert("Erro ao redefinir credenciais.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  // FUNCIONALIDADE: SAIR DA CONTA (LOGOUT COMPLETO)
  const handleLogout = () => {
    if (window.confirm("Deseja realmente encerrar sua sessão administrativa?")) {
      localStorage.clear(); // Limpa token, id, role e dados de sessão de forma segura
      navigate('/login');   // Roteia de volta para a tela de login pública
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row relative">
      <div className="shrink-0 z-20">
        <InstituicaoSidebar />
      </div>

      <main className="flex-grow p-6 md:p-10 flex flex-col h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meu Perfil de Administrador</h1>
            <p className="text-gray-400">Controle suas credenciais de segurança e gerenciamento individual.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* FORMULÁRIO DE INFORMAÇÕES BÁSICAS */}
            <form onSubmit={handleUpdateProfile} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col gap-4">
              <h2 className="text-xl font-bold text-purple-400">Dados do Usuário</h2>
              
              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-2">Nome do Administrador</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-semibold mb-2">Apelido / Nickname</label>
                <input 
                  type="text" 
                  value={profile.nickname}
                  onChange={e => setProfile({ ...profile, nickname: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500"
                />
              </div>

              <button type="submit" disabled={isSavingProfile} className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-bold py-2.5 rounded-lg shadow-md transition text-sm mt-2">
                {isSavingProfile ? 'Atualizando...' : 'Atualizar Perfil'}
              </button>
            </form>

            <div className="flex flex-col gap-8">
              {/* FORMULÁRIO DE ALTERAÇÃO DE SENHA */}
              <form onSubmit={handleChangePassword} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col gap-4">
                <h2 className="text-xl font-bold text-blue-400">Segurança da Conta</h2>

                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-2">Senha Atual</label>
                  <input 
                    type="password" 
                    value={passwordData.currentPassword}
                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="********"
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-2">Nova Senha</label>
                  <input 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <button type="submit" disabled={isSavingPassword} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-2.5 rounded-lg shadow-md transition text-sm mt-2">
                  {isSavingPassword ? 'Modificando...' : 'Alterar Senha de Acesso'}
                </button>
              </form>

              {/* SEÇÃO INDEPENDENTE PARA DISPARAR O LOGOUT */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col gap-3">
                <h2 className="text-xl font-bold text-red-400">Encerrar Sessão</h2>
                <p className="text-xs text-gray-400 leading-normal">Desconecte-se de forma segura deste dispositivo. Suas preferências e dados jurídicos salvos não serão afetados.</p>
                <button 
                  onClick={handleLogout}
                  className="w-full bg-red-600/10 hover:bg-red-600 border border-red-500/30 hover:border-transparent text-red-400 hover:text-white font-bold py-2.5 rounded-lg shadow-md transition-all text-sm mt-2"
                >
                  🚪 Sair da Conta Administrativa
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InstituicaoProfile;