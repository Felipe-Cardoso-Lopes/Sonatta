import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeacherSidebar from '../components/TeacherSidebar';

function TeacherProfile() {
  const [user, setUser] = useState({
    name: '',
    nickname: '',
    email: '',
    birthDate: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', nickname: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
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
      window.location.href = '/'; 
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
                      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nome" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500" required />
                      <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} placeholder="Apelido" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500" required />
                      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Nova Senha (opcional)" className="w-full bg-gray-600 p-2 rounded outline-none focus:ring-2 focus:ring-purple-500" />
                      
                      <div className="flex gap-2 mt-2">
                        <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold">Salvar</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold">Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-bold text-2xl">{user.name}</h2>
                        <span className="bg-purple-600 text-xs px-2 py-1 rounded text-white font-bold">Professor</span>
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
                  <button onClick={() => setIsEditing(true)} className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors border border-gray-500 font-semibold">
                    Editar Conta
                  </button>
                )}
                <button onClick={handleLogout} className="bg-red-600/20 text-red-500 px-6 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors border border-red-500 font-semibold">
                  Sair da Conta
                </button>
              </div>
            </div>

            {/* Impacto / Hub Educacional */}
            <div className="w-full lg:w-1/3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-purple-500/30 flex flex-col p-6 shadow-lg">
              <p className="text-lg font-semibold mb-4 text-purple-300 border-b border-gray-700 pb-2">Seu Impacto Musical</p>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Especialidades</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-purple-600/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/50">Piano Clássico</span>
                    <span className="bg-purple-600/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-500/50">Teoria Musical</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avaliação Média</p>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-xl">★★★★★</span>
                    <span className="text-white font-bold">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default TeacherProfile;