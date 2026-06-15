import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import InstituicaoSidebar from '../components/InstituicaoSidebar';
import DropZone from '../components/DropZone';

function InstituicaoProfile() {
  // --- Estados de Navegação ---
  const [activeTab, setActiveTab] = useState('public'); // 'public' | 'admin'

  // --- Estados de Dados ---
  const [profile, setProfile] = useState({ name: '', nickname: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [publicProfile, setPublicProfile] = useState({
    descricao_longa: '', logo_url: '', banner_url: '', website_url: '', instagram_url: '', linkedin_url: '', facebook_url: ''
  });

  // --- Estados de Carregamento ---
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
  }, []);

  // ==========================================
  // FUNÇÕES DE SUBMISSÃO
  // ==========================================
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const toastId = toast.loading('Atualizando dados...');
    try {
      await axios.put(`${API_URL}/api/users/profile`, profile, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem('userName', profile.name);
      localStorage.setItem('userNickname', profile.nickname);
      toast.success("Informações atualizadas com sucesso!", { id: toastId });
    } catch (error) {
      toast.error("Erro ao atualizar informações do perfil.", { id: toastId });
    } finally { setIsSavingProfile(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsSavingPassword(true);
    const toastId = toast.loading('Alterando senha...');
    try {
      await axios.put(`${API_URL}/api/users/change-password`, passwordData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Senha alterada com sucesso!", { id: toastId });
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error) {
      toast.error("Erro ao redefinir credenciais.", { id: toastId });
    } finally { setIsSavingPassword(false); }
  };

  const handleUpdatePublicProfile = async (e) => {
    e.preventDefault();
    setIsSavingPublic(true);
    const toastId = toast.loading('Salvando perfil público...');
    try {
      await axios.put(`${API_URL}/api/instituicoes/profile`, publicProfile, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Perfil público atualizado com sucesso!", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao atualizar o perfil.", { id: toastId });
    } finally { setIsSavingPublic(false); }
  };

  const handleLogout = () => {
    if (window.confirm("Deseja realmente encerrar sua sessão administrativa?")) {
      localStorage.clear();
      navigate('/login');
    }
  };

  // ==========================================
  // PADRONIZAÇÃO DE CLASSES CSS (Clean Code)
  // ==========================================
  const cardClass = "bg-[#1a1a1a] p-6 md:p-8 rounded-2xl border border-gray-700 shadow-xl flex flex-col gap-6 w-full";
  const labelClass = "block text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider";
  const inputClass = "w-full bg-[#252525] border border-gray-600 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-purple-500 transition-colors";
  const btnClass = "text-white font-bold py-3 rounded-lg shadow-md transition flex items-center justify-center gap-2";

  return (
    <div className="min-h-screen bg-piano-black text-white-text font-poppins flex flex-col md:flex-row relative">
      <Toaster position="top-right" toastOptions={{ style: { background: '#252525', color: '#fff', border: '1px solid #374151' } }} />

      <div className="shrink-0 z-20">
        <InstituicaoSidebar />
      </div>

      <main className="flex-grow p-6 md:p-10 h-screen overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-8 pb-10">
          
          <header>
            <h1 className="text-3xl font-bold mb-2">Meu Perfil Institucional</h1>
            <p className="text-gray-400">Faça a gestão da montra pública da sua instituição e credenciais administrativas.</p>
          </header>

          {/* NAVEGAÇÃO POR ABAS (Melhor Usabilidade) */}
          <div className="flex gap-6 border-b border-gray-700 pb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('public')}
              className={`pb-3 font-bold text-sm transition-all whitespace-nowrap relative ${activeTab === 'public' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Identidade Pública
              {activeTab === 'public' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>}
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`pb-3 font-bold text-sm transition-all whitespace-nowrap relative ${activeTab === 'admin' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Conta Administrativa
              {activeTab === 'admin' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>}
            </button>
          </div>

          {/* ========================================================
              ABA 1: IDENTIDADE PÚBLICA
          ======================================================== */}
          {activeTab === 'public' && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              
              {/* Pré-visualização Real */}
              <section className="flex flex-col w-full shadow-2xl rounded-2xl overflow-hidden">
                <div className="relative w-full h-40 md:h-64 bg-[#252525] border-x border-t border-gray-700">
                  {publicProfile.banner_url ? (
                    <img src={publicProfile.banner_url} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-900 to-purple-900/30 flex items-center justify-center text-gray-500 text-sm">Banner não definido</div>
                  )}
                </div>

                <div className="px-6 md:px-10 pb-8 bg-[#1a1a1a] border-x border-b border-gray-700 relative">
                  <div className="absolute -top-12 md:-top-16 left-6 md:left-10 w-24 h-24 md:w-32 md:h-32 bg-[#252525] rounded-full border-4 border-[#1a1a1a] overflow-hidden shadow-xl flex items-center justify-center">
                    {publicProfile.logo_url ? (
                      <img src={publicProfile.logo_url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-500 text-xs">Sem Logo</span>
                    )}
                  </div>

                  <div className="mt-14 md:mt-20">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{profile.name || 'Nome da Instituição'}</h2>
                    {publicProfile.descricao_longa ? (
                      <p className="text-sm md:text-base text-gray-300 max-w-3xl leading-relaxed mb-6">{publicProfile.descricao_longa}</p>
                    ) : (
                      <p className="text-sm text-gray-500 italic mb-6">Adicione uma descrição na edição abaixo para que os alunos a vejam aqui.</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                      {publicProfile.website_url && <a href={publicProfile.website_url} target="_blank" rel="noreferrer" className="text-purple-400 flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20 hover:bg-purple-500/20 transition">🌐 Website Oficial</a>}
                      {publicProfile.instagram_url && <a href={publicProfile.instagram_url} target="_blank" rel="noreferrer" className="text-pink-400 flex items-center gap-2 bg-pink-500/10 px-4 py-2 rounded-full border border-pink-500/20 hover:bg-pink-500/20 transition">📸 Instagram</a>}
                      {publicProfile.linkedin_url && <a href={publicProfile.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-400 flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition">💼 LinkedIn</a>}
                    </div>
                  </div>
                </div>
              </section>

              {/* Formulário de Edição Pública */}
              <form onSubmit={handleUpdatePublicProfile} className={cardClass}>
                <div>
                  <h2 className="text-xl font-bold text-green-400">Editar Informações Públicas</h2>
                  <p className="text-sm text-gray-400">As imagens e descrições definidas aqui constroem a página principal da sua escola.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-2">
                  <div className="flex flex-col gap-6">
                    <div>
                      <label className={labelClass}>Logótipo da Instituição</label>
                      <DropZone accept="image/*" label="Recomendado: 400x400px" onUploadSuccess={(url) => setPublicProfile({ ...publicProfile, logo_url: url })} />
                    </div>
                    <div>
                      <label className={labelClass}>Banner de Fundo</label>
                      <DropZone accept="image/*" label="Recomendado: 1200x400px" onUploadSuccess={(url) => setPublicProfile({ ...publicProfile, banner_url: url })} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div>
                      <label className={labelClass}>Sobre a Escola (Descrição)</label>
                      <textarea 
                        value={publicProfile.descricao_longa}
                        onChange={e => setPublicProfile({ ...publicProfile, descricao_longa: e.target.value })}
                        rows="5"
                        placeholder="Conte um pouco sobre a metodologia..."
                        className={`${inputClass} resize-none custom-scrollbar`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Website Oficial</label>
                      <input type="url" value={publicProfile.website_url} onChange={e => setPublicProfile({ ...publicProfile, website_url: e.target.value })} placeholder="https://suaescola.com.pt" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Instagram</label>
                        <input type="url" value={publicProfile.instagram_url} onChange={e => setPublicProfile({ ...publicProfile, instagram_url: e.target.value })} placeholder="Link do perfil" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>LinkedIn</label>
                        <input type="url" value={publicProfile.linkedin_url} onChange={e => setPublicProfile({ ...publicProfile, linkedin_url: e.target.value })} placeholder="Link da página" className={inputClass} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 mt-2 pt-6 flex justify-end">
                  <button type="submit" disabled={isSavingPublic} className={`bg-green-600 hover:bg-green-700 disabled:bg-gray-700 w-full md:w-auto px-8 ${btnClass}`}>
                    {isSavingPublic ? <span className="animate-spin">⏳</span> : null}
                    {isSavingPublic ? 'A guardar...' : 'Salvar Identidade Pública'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================
              ABA 2: CONTA ADMINISTRATIVA & SEGURANÇA
          ======================================================== */}
          {activeTab === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-fadeIn">
              
              <form onSubmit={handleUpdateProfile} className={cardClass}>
                <div>
                  <h2 className="text-xl font-bold text-purple-400">Dados Pessoais</h2>
                  <p className="text-xs text-gray-400">Informações visíveis apenas para a plataforma.</p>
                </div>
                <div>
                  <label className={labelClass}>Nome do Administrador</label>
                  <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Apelido / Nickname</label>
                  <input type="text" value={profile.nickname} onChange={e => setProfile({ ...profile, nickname: e.target.value })} className={inputClass} />
                </div>
                <button type="submit" disabled={isSavingProfile} className={`bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 mt-2 ${btnClass}`}>
                  {isSavingProfile ? <span className="animate-spin">⏳</span> : null} Atualizar Administrador
                </button>
              </form>

              <div className="flex flex-col gap-8">
                <form onSubmit={handleChangePassword} className={cardClass}>
                  <div>
                    <h2 className="text-xl font-bold text-blue-400">Segurança de Acesso</h2>
                  </div>
                  <div>
                    <label className={labelClass}>Senha Atual</label>
                    <input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })} placeholder="********" className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Nova Senha</label>
                    <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} placeholder="Mínimo 6 caracteres" className={`${inputClass} focus:border-blue-500`} required />
                  </div>
                  <button type="submit" disabled={isSavingPassword} className={`bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 mt-2 ${btnClass}`}>
                    {isSavingPassword ? <span className="animate-spin">⏳</span> : null} Alterar Senha
                  </button>
                </form>

                <div className={`${cardClass} !border-red-500/30 !bg-red-500/5`}>
                  <div>
                    <h2 className="text-xl font-bold text-red-400">Encerrar Sessão</h2>
                    <p className="text-sm text-gray-400 mt-1">Desconecte-se de forma segura deste dispositivo.</p>
                  </div>
                  <button onClick={handleLogout} type="button" className={`bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 hover:border-transparent ${btnClass}`}>
                    🚪 Sair da Conta Administrativa
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default InstituicaoProfile;