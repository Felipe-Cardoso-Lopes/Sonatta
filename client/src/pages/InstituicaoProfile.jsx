import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // <-- Importação do Toast
import InstituicaoSidebar from '../components/InstituicaoSidebar';
import DropZone from '../components/DropZone';

function InstituicaoProfile() {
  const [profile, setProfile] = useState({ name: '', nickname: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  
  const [publicProfile, setPublicProfile] = useState({
    descricao_longa: '',
    logo_url: '',
    banner_url: '',
    website_url: '',
    instagram_url: '',
    linkedin_url: '',
    facebook_url: ''
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingPublic, setIsSavingPublic] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    setProfile({
      name: localStorage.getItem('userName') || '',
      nickname: localStorage.getItem('userNickname') || '',
      email: ''
    });
    // Opcional: GET para preencher publicProfile ao carregar a tela
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const toastId = toast.loading('Atualizando dados...');
    try {
      await axios.put(`${API_URL}/api/users/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem('userName', profile.name);
      localStorage.setItem('userNickname', profile.nickname);
      toast.success("Informações atualizadas com sucesso!", { id: toastId });
    } catch (error) {
      toast.error("Erro ao atualizar informações do perfil.", { id: toastId });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsSavingPassword(true);
    const toastId = toast.loading('Alterando senha...');
    try {
      await axios.put(`${API_URL}/api/users/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Senha alterada com sucesso!", { id: toastId });
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error) {
      toast.error("Erro ao redefinir credenciais.", { id: toastId });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleUpdatePublicProfile = async (e) => {
    e.preventDefault();
    setIsSavingPublic(true);
    // Feedback visual de carregamento
    const toastId = toast.loading('Salvando perfil público...');
    
    try {
      await axios.put(`${API_URL}/api/instituicoes/profile`, publicProfile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Substitui o loading pela notificação de sucesso
      toast.success("Perfil público atualizado com sucesso!", { id: toastId });
    } catch (error) {
      console.error(error);
      // Substitui o loading pela notificação de erro
      toast.error(error.response?.data?.message || "Erro ao atualizar o perfil público.", { id: toastId });
    } finally {
      setIsSavingPublic(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Deseja realmente encerrar sua sessão administrativa?")) {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row relative">
      {/* Componente que renderiza os toasts na tela */}
      <Toaster position="top-right" reverseOrder={false} toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '8px',
        },
      }} />

      <div className="shrink-0 z-20">
        <InstituicaoSidebar />
      </div>

      <main className="flex-grow p-6 md:p-10 flex flex-col h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 pb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meu Perfil de Administrador</h1>
            <p className="text-gray-400">Controle suas credenciais de segurança e gerenciamento individual.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col gap-3">
                <h2 className="text-xl font-bold text-red-400">Encerrar Sessão</h2>
                <p className="text-xs text-gray-400 leading-normal">Desconecte-se de forma segura deste dispositivo.</p>
                <button 
                  onClick={handleLogout}
                  type="button"
                  className="w-full bg-red-600/10 hover:bg-red-600 border border-red-500/30 hover:border-transparent text-red-400 hover:text-white font-bold py-2.5 rounded-lg shadow-md transition-all text-sm mt-2"
                >
                  🚪 Sair da Conta Administrativa
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdatePublicProfile} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col gap-6 w-full">
            <h2 className="text-xl font-bold text-green-400">Perfil Público da Escola</h2>
            <p className="text-sm text-gray-400 -mt-4">Estas informações serão exibidas para visitantes e alunos na plataforma.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-2">Logotipo da Instituição</label>
                  {publicProfile.logo_url && (
                    <img src={publicProfile.logo_url} alt="Logo" className="h-16 w-16 rounded-full object-cover mb-3 border border-gray-600" />
                  )}
                  <DropZone 
                    accept="image/*" 
                    label="Tamanho recomendado: 400x400px" 
                    onUploadSuccess={(url) => setPublicProfile({ ...publicProfile, logo_url: url })}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-2">Banner de Fundo</label>
                  {publicProfile.banner_url && (
                    <img src={publicProfile.banner_url} alt="Banner" className="h-24 w-full object-cover rounded-lg mb-3 border border-gray-600" />
                  )}
                  <DropZone 
                    accept="image/*" 
                    label="Tamanho recomendado: 1200x400px" 
                    onUploadSuccess={(url) => setPublicProfile({ ...publicProfile, banner_url: url })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-2">Sobre a Escola (Descrição)</label>
                  <textarea 
                    value={publicProfile.descricao_longa}
                    onChange={e => setPublicProfile({ ...publicProfile, descricao_longa: e.target.value })}
                    rows="4"
                    placeholder="Conte um pouco sobre a metodologia e história da instituição..."
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-green-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 font-semibold mb-2">Website</label>
                  <input 
                    type="url" 
                    value={publicProfile.website_url}
                    onChange={e => setPublicProfile({ ...publicProfile, website_url: e.target.value })}
                    placeholder="https://suaescola.com.br"
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 font-semibold mb-2">Instagram</label>
                    <input 
                      type="url" 
                      value={publicProfile.instagram_url}
                      onChange={e => setPublicProfile({ ...publicProfile, instagram_url: e.target.value })}
                      placeholder="URL do perfil"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 font-semibold mb-2">LinkedIn</label>
                    <input 
                      type="url" 
                      value={publicProfile.linkedin_url}
                      onChange={e => setPublicProfile({ ...publicProfile, linkedin_url: e.target.value })}
                      placeholder="URL da página"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSavingPublic} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg shadow-md transition text-sm mt-4 md:w-1/3 md:self-end">
              {isSavingPublic ? 'Processando...' : 'Salvar Perfil Público'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default InstituicaoProfile;