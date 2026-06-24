import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeacherSidebar from '../components/TeacherSidebar';
import StarRating from '../components/StarRating';

function TeacherProfile() {
  const [user, setUser] = useState({
    name: '', nickname: '', email: '', birthDate: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', nickname: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  
  // Estado para Avaliações (Tópico 4)
  const [reviews, setReviews] = useState({ summary: { average: 0, total: 0 }, recent_comments: [] });

  useEffect(() => {
    fetchUserProfile();
    fetchReviews();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = response.data;
      let dataNascimentoFormatada = 'Não informada';
      if (userData.birth_date) {
        dataNascimentoFormatada = new Date(userData.birth_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
      }

      setUser({
        name: userData.name,
        nickname: userData.nickname || '',
        email: userData.email,
        birthDate: dataNascimentoFormatada,
      });

      setFormData({
        name: userData.name,
        nickname: userData.nickname || '',
        email: userData.email,
        password: '' 
      });

    } catch (error) {
      console.error('Erro ao buscar dados do perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const teacherId = localStorage.getItem('userId');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${API_URL}/api/reviews/teacher/${teacherId}`);
      setReviews(res.data);
    } catch (error) {
      console.error('Nenhuma avaliação encontrada:', error);
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

      alert(response.data.message);
      localStorage.setItem('userName', response.data.user.name);
      localStorage.setItem('userNickname', response.data.user.nickname);

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

  if (loading) return <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">Carregando...</div>;

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row">
      <div className="shrink-0 z-20">
        <TeacherSidebar />
      </div>

      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        <div className="w-full h-full flex flex-col gap-8 max-w-6xl mx-auto">
          
          <section className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                
                {/* Avatar Professor */}
                <div className="w-32 h-32 bg-gray-800 border-4 border-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 text-5xl font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'P'}
                </div>

                <div className="bg-gray-700 p-6 rounded-xl flex-1 w-full shadow-lg">
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="flex flex-col gap-3">
                      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white" required />
                      <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} placeholder="Apelido" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white" required />
                      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Nova Senha (opcional)" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500 text-white" />
                      
                      <div className="flex gap-2 mt-2">
                        <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold text-white">Salvar</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold text-white">Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-bold text-2xl">{user.name}</h2>
                        <span className="bg-purple-600 text-xs px-2 py-1 rounded text-white font-bold">Professor Institucional</span>
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

            {/* Impacto / Avaliações */}
            <div className="w-full lg:w-1/3 bg-gray-800 rounded-xl border border-gray-700 flex flex-col p-6 shadow-lg h-full">
              <p className="text-lg font-semibold mb-4 text-purple-300 border-b border-gray-700 pb-2">Seu Impacto Musical</p>
              
              <div className="flex flex-col gap-6 flex-grow">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Especialidades Lecionadas</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-purple-600/20 text-purple-300 text-xs font-bold px-3 py-1.5 rounded border border-purple-500/30">Ensino Híbrido</span>
                    <span className="bg-blue-600/20 text-blue-300 text-xs font-bold px-3 py-1.5 rounded border border-blue-500/30">Turmas</span>
                  </div>
                </div>
                
                <div className="mt-auto bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Avaliação Média dos Alunos</p>
                  {reviews.summary.total > 0 ? (
                    <div className="flex items-center gap-3">
                      <StarRating rating={Math.round(reviews.summary.average)} readonly={true} />
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-xl leading-none">{Number(reviews.summary.average).toFixed(1)}</span>
                        <span className="text-gray-400 text-xs">({reviews.summary.total} avaliações)</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">As suas aulas ainda não receberam avaliações.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* SECÇÃO DE COMENTÁRIOS DA COMUNIDADE */}
          {!isEditing && reviews.recent_comments.length > 0 && (
            <section className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg mt-4">
              <h3 className="text-lg font-semibold text-purple-300 border-b border-gray-700 pb-2 mb-4">
                O que os alunos dizem sobre as aulas
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

export default TeacherProfile;