import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SoloTeacherSidebar from '../components/SoloTeacherSidebar';
import StarRating from '../components/StarRating';

function SoloTeacherProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '', nickname: '', email: '', birthDate: '',
    specialty: '', bio: '', videoUrl: '',
    youtubeIntroUrl: '', spotifyArtistUrl: '', offersTrialLesson: false,
  });

  const [formData, setFormData] = useState({
    name: '', nickname: '', email: '', password: '',
    birthDate: '', specialty: '', bio: '', videoUrl: '',
    youtubeIntroUrl: '', spotifyArtistUrl: '', offersTrialLesson: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({ summary: { average: 0, total: 0 }, recent_comments: [] });

  useEffect(() => {
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
    fetchTeacherReviews();
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
        dataInputFormat = userData.birth_date.split('T')[0];
      }

      setUser({
        name: userData.name,
        nickname: userData.nickname || '',
        email: userData.email,
        birthDate: dataNascimentoFormatada,
        specialty: userData.specialty || '',
        bio: userData.bio || '',
        videoUrl: userData.video_url || '',
        youtubeIntroUrl: userData.youtube_intro_url || '',
        spotifyArtistUrl: userData.spotify_artist_url || '',
        offersTrialLesson: userData.offers_trial_lesson || false,
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
        youtubeIntroUrl: userData.youtube_intro_url || '',
        spotifyArtistUrl: userData.spotify_artist_url || '',
        offersTrialLesson: userData.offers_trial_lesson || false,
      });

    } catch (error) {
      console.error('Erro ao buscar dados do perfil:', error);
      const fallbackName = localStorage.getItem('userName') || '';
      const fallbackNick = localStorage.getItem('userNickname') || '';
      setUser(prev => ({ ...prev, name: fallbackName, nickname: fallbackNick, email: 'professor.solo@sonatta.com' }));
      setFormData(prev => ({ ...prev, name: fallbackName, nickname: fallbackNick, email: 'professor.solo@sonatta.com' }));
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherReviews = async () => {
    try {
      const teacherId = localStorage.getItem('userId');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${API_URL}/api/reviews/teacher/${teacherId}`);
      setReviews(res.data);
    } catch (error) {
      console.error('Nenhuma avaliação encontrada ou erro de conexão:', error);
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
        <div className="w-full h-full flex flex-col gap-10 max-w-6xl mx-auto">

          <section className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* ====== COLUNA ESQUERDA: DADOS PESSOAIS E SEGURANÇA ====== */}
            <div className="flex-1 flex flex-col gap-4 w-full">
              <h3 className="text-xl font-semibold text-purple-300 border-b border-gray-700 pb-2 mb-2">Dados Pessoais</h3>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-32 h-32 bg-gray-800 border-4 border-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 text-5xl font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'P'}
                </div>

                <div className="bg-gray-700 p-6 rounded-xl flex-1 w-full shadow-lg">
                  {isEditing ? (
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
                  <div className="flex flex-col gap-4 animate-fadeIn">
                    <div>
                      <label className="text-gray-400 text-xs font-semibold uppercase mb-1 block">Especialidade Principal</label>
                      <input form="profileForm" type="text" name="specialty" value={formData.specialty} onChange={handleChange} placeholder="Ex: Aulas de Violão e Teoria" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-semibold uppercase mb-1 block">Biografia / Sobre mim</label>
                      <textarea form="profileForm" name="bio" value={formData.bio} onChange={handleChange} placeholder="Apresente-se aos seus futuros alunos..." rows="4" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white resize-none" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-semibold uppercase mb-1 block">Link do Vídeo de Apresentação</label>
                      <input form="profileForm" type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-semibold uppercase mb-1 block">🎬 Link do YouTube</label>
                      <input form="profileForm" type="url" name="youtubeIntroUrl" value={formData.youtubeIntroUrl} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs font-semibold uppercase mb-1 block">🎵 Link do Spotify</label>
                      <input form="profileForm" type="url" name="spotifyArtistUrl" value={formData.spotifyArtistUrl} onChange={handleChange} placeholder="https://open.spotify.com/artist/..." className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white" />
                    </div>
                    <div className="flex items-center gap-3 bg-gray-600 p-3 rounded-lg">
                      <input form="profileForm" type="checkbox" id="offersTrialLesson" name="offersTrialLesson" checked={formData.offersTrialLesson} onChange={(e) => setFormData({ ...formData, offersTrialLesson: e.target.checked })} className="w-5 h-5 accent-purple-500 cursor-pointer" />
                      <label htmlFor="offersTrialLesson" className="text-white text-sm cursor-pointer">
                        Oferecer <strong>aula experimental gratuita</strong> na vitrine
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-start gap-4">
                    
                    {/* Badge de Reputação integrado na Vitrine */}
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600 flex items-center justify-between shadow-inner">
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Reputação Pública</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl text-yellow-400 font-bold">★ {Number(reviews.summary.average).toFixed(1)}</span>
                          <span className="text-sm text-gray-400">({reviews.summary.total} avaliações)</span>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <StarRating rating={Math.round(reviews.summary.average)} readonly={true} />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Especialidade Principal</p>
                      <p className="text-white text-lg font-medium">{user.specialty || 'Não informada'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Biografia</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{user.bio || 'Nenhuma biografia adicionada até ao momento.'}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user.youtubeIntroUrl && (
                        <a href={user.youtubeIntroUrl} target="_blank" rel="noopener noreferrer" className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 px-3 py-2 rounded-lg text-sm truncate flex items-center gap-2 transition">
                          🎬 YouTube
                        </a>
                      )}
                      {user.spotifyArtistUrl && (
                        <a href={user.spotifyArtistUrl} target="_blank" rel="noopener noreferrer" className="bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 px-3 py-2 rounded-lg text-sm truncate flex items-center gap-2 transition">
                          🎵 Spotify Artista
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-600">
                      <span className={`w-3 h-3 rounded-full ${user.offersTrialLesson ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-gray-600'}`}></span>
                      <p className="text-sm text-gray-300 font-semibold">
                        {user.offersTrialLesson ? 'Disponível para aula experimental gratuita' : 'Aulas experimentais indisponíveis'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </section>

          {/* ====== SECÇÃO DE COMENTÁRIOS / PROVA SOCIAL ====== */}
          {!isEditing && reviews.recent_comments.length > 0 && (
            <section className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-purple-300 border-b border-gray-700 pb-2 mb-4">
                Feedback dos Alunos
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {reviews.recent_comments.map((review, idx) => (
                  <div key={idx} className="min-w-[300px] bg-gray-700 rounded-xl p-5 border border-gray-600 flex flex-col gap-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {review.student_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white truncate max-w-[120px]">{review.student_name}</p>
                          <p className="text-[10px] text-gray-400">{new Date(review.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} readonly={true} />
                    </div>
                    <p className="text-sm text-gray-300 italic leading-relaxed line-clamp-3">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}

export default SoloTeacherProfile;