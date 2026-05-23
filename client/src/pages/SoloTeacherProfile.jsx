import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SoloTeacherSidebar from '../components/SoloTeacherSidebar';

function SoloTeacherProfile() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    name: '',
    nickname: '',
    email: '',
    birthDate: '',
    specialty: '',
    bio: '',
    videoUrl: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', nickname: '', email: '', password: '', birthDate: '', specialty: '', bio: '', videoUrl: '' 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trava de Segurança
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const teacherType = localStorage.getItem('teacherType');

    if (!token) {
      navigate('/login');
      return;
    } else if (role !== 'professor' || teacherType !== 'independente') {
      navigate('/');
      return;
    }

    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = response.data;
      let dataNascimentoFormatada = 'Não informada';
      let dataInputFormat = '';

      if (userData.birth_date) {
        dataNascimentoFormatada = new Date(userData.birth_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        dataInputFormat = userData.birth_date.split('T')[0]; // Formato YYYY-MM-DD para o input type="date"
      }

      setUser({
        name: userData.name,
        nickname: userData.nickname || '',
        email: userData.email,
        birthDate: dataNascimentoFormatada,
        specialty: userData.specialty || '',
        bio: userData.bio || '',
        videoUrl: userData.video_url || '',
      });

      setFormData({
        name: userData.name,
        nickname: userData.nickname || '',
        email: userData.email,
        password: '',
        birthDate: dataInputFormat,
        specialty: userData.specialty || '',
        bio: userData.bio || '',
        videoUrl: userData.video_url || '',
      });

    } catch (error) {
      console.error('Erro ao buscar dados do perfil:', error);
      // Fallback para exibir dados locais caso a API ainda não tenha as rotas novas
      const fallbackName = localStorage.getItem('userName') || '';
      const fallbackNick = localStorage.getItem('userNickname') || '';
      setUser(prev => ({ ...prev, name: fallbackName, nickname: fallbackNick, email: 'professor.solo@sonatta.com' }));
      setFormData(prev => ({ ...prev, name: fallbackName, nickname: fallbackNick, email: 'professor.solo@sonatta.com' }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await axios.put(`${API_URL}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(response.data.message || 'Perfil atualizado com sucesso!');
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userNickname', formData.nickname);

      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao atualizar perfil.');
    }
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      localStorage.clear();
      window.location.href = '/login'; 
    }
  };

  if (loading) return <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">A carregar...</div>;

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row">
      <div className="shrink-0 z-20">
        <SoloTeacherSidebar />
      </div>

      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        <div className="w-full h-full flex flex-col gap-12 max-w-6xl mx-auto">
          
          <section className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* ====== COLUNA ESQUERDA: DADOS PESSOAIS ====== */}
            <div className="flex-1 flex flex-col gap-4 w-full">
              <h3 className="text-xl font-semibold text-purple-300 border-b border-gray-700 pb-2 mb-2">Dados Pessoais</h3>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                
                {/* Avatar Professor */}
                <div className="w-32 h-32 bg-gray-800 border-4 border-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 text-5xl font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'P'}
                </div>

                {/* Box de Informações */}
                <div className="bg-gray-700 p-6 rounded-xl flex-1 w-full shadow-lg">
                  {isEditing ? (
                    // O id "profileForm" permite que os inputs da Vitrine submetam este form
                    <form id="profileForm" onSubmit={handleUpdateProfile} className="flex flex-col gap-3">
                      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome Completo" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white" required />
                      <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} placeholder="Apelido" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white" required />
                      <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-gray-300" />
                      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Nova Senha (opcional)" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white" />
                      
                      <div className="flex gap-2 mt-2">
                        <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold text-white transition-colors">Salvar Alterações</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold text-white transition-colors">Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-bold text-2xl">{user.name}</h2>
                        <span className="bg-purple-600 text-xs px-2 py-1 rounded text-white font-bold">Professor Solo</span>
                      </div>
                      {user.nickname && <p className="text-purple-400 font-medium mb-1">"{user.nickname}"</p>}
                      <p className="text-sm text-gray-300 mb-4">{user.email}</p>
                      
                      <div className="text-gray-400 text-sm border-t border-gray-600 pt-3">
                        <span><strong>Data de Nascimento:</strong> {user.birthDate}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-4 mt-2">
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors border border-gray-500 font-semibold shadow-lg">
                    Editar Conta
                  </button>
                )}
                <button onClick={handleLogout} className="bg-red-600/20 text-red-500 px-6 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors border border-red-500 font-semibold shadow-lg">
                  Sair da Conta
                </button>
              </div>
            </div>

            {/* ====== COLUNA DIREITA: VITRINE (SHOWCASE) ====== */}
            <div className="flex-1 flex flex-col gap-4 w-full">
              <h3 className="text-xl font-semibold text-purple-300 border-b border-gray-700 pb-2 mb-2">A Minha Vitrine (Showcase)</h3>
              
              <div className="bg-gray-700 p-6 rounded-xl flex-1 w-full shadow-lg h-full">
                {isEditing ? (
                  <div className="flex flex-col gap-4">
                    {/* O form="profileForm" vincula estes inputs ao form da coluna esquerda! */}
                    <div>
                      <label className="text-gray-400 text-xs font-semibold uppercase mb-1 block">Especialidade Principal</label>
                      <input form="profileForm" type="text" name="specialty" value={formData.specialty} onChange={handleChange} placeholder="Ex: Aulas de Violão e Teoria" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-semibold uppercase mb-1 block">Biografia / Sobre mim</label>
                      <textarea form="profileForm" name="bio" value={formData.bio} onChange={handleChange} placeholder="Apresente-se aos seus futuros alunos..." rows="4" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white resize-none" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-semibold uppercase mb-1 block">Link do Vídeo de Apresentação (YouTube)</label>
                      <input form="profileForm" type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-start gap-4">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Especialidade Principal</p>
                      <p className="text-white text-lg font-medium">{user.specialty || 'Não informada'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Biografia</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{user.bio || 'Nenhuma biografia adicionada até ao momento.'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Vídeo de Apresentação</p>
                      {user.videoUrl ? (
                        <a href={user.videoUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 hover:underline text-sm truncate block font-medium">
                          {user.videoUrl}
                        </a>
                      ) : (
                        <p className="text-gray-500 text-sm">Nenhum vídeo associado.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}

export default SoloTeacherProfile;