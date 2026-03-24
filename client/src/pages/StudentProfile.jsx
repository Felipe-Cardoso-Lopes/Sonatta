import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentSidebar from '../components/StudentSidebar';

function StudentProfile() {
  const [user, setUser] = useState({
    name: '',
    nickname: '',
    email: '',
    birthDate: '',
    gender: ''
  });
  
  // Estado para controlar se estamos no modo de edição
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado para armazenar os dados do formulário temporariamente
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '' // Senha fica em branco, só preenche se for alterar
  });

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

      // Formata a data de nascimento (evitando problemas de fuso horário)
      let dataNascimentoFormatada = 'Não informada';
      if (userData.birth_date) {
        // Usa UTC para evitar que o dia volte 1 dia para trás devido ao fuso do Brasil
        dataNascimentoFormatada = new Date(userData.birth_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
      }

      // Como o backend já devolve "Masculino" ou "Feminino", apenas pegamos o valor direto:
      let generoFormatado = userData.gender || 'Não informado';

      setUser({
        name: userData.name,
        nickname: userData.nickname || '',
        email: userData.email,
        birthDate: dataNascimentoFormatada,
        gender: generoFormatado
      });

      // Popula o formulário de edição com os dados atuais
      setFormData({
        name: userData.name,
        nickname: userData.nickname || '',
        email: userData.email,
        password: '' // Senha vazia por padrão
      });

    } catch (error) {
      console.error('Erro ao buscar dados do perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await axios.put(`${API_URL}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(response.data.message);
      
      // Atualiza o localStorage caso o nome/apelido tenha mudado
      localStorage.setItem('userName', response.data.user.name);
      localStorage.setItem('userNickname', response.data.user.nickname);

      // Desliga o modo de edição e busca os dados atualizados
      setIsEditing(false);
      fetchUserProfile();

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert(error.response?.data?.message || 'Erro ao atualizar perfil.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row">
      <StudentSidebar />

      <main className="flex-grow p-6 md:p-12">
        <div className="w-full h-full flex flex-col gap-8">
          
          <section className="flex flex-col lg:flex-row gap-8">
            {/* Card de Perfil */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                
                {/* Avatar */}
                <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-4xl font-bold shadow-lg">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>

                {/* Informações ou Formulário */}
                <div className="bg-gray-700 p-6 rounded-lg flex-1 w-full shadow-lg">
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs text-gray-400">Nome</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-600 text-white p-2 rounded outline-none focus:ring-2 focus:ring-purple-500" required />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">Apelido</label>
                        <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} className="w-full bg-gray-600 text-white p-2 rounded outline-none focus:ring-2 focus:ring-purple-500" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">E-mail</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-600 text-white p-2 rounded outline-none focus:ring-2 focus:ring-purple-500" required />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">Nova Senha (deixe em branco para não alterar)</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="********" className="w-full bg-gray-600 text-white p-2 rounded outline-none focus:ring-2 focus:ring-purple-500" />
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold transition">Salvar</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition">Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h2 className="font-bold text-2xl">{user.name}</h2>
                      {user.nickname && <p className="text-purple-400 font-medium mb-1">"{user.nickname}"</p>}
                      <p className="text-sm text-gray-300 mb-4">{user.email}</p>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between text-gray-400 text-sm border-t border-gray-600 pt-3 gap-2">
                        <span><strong>Data de Nascimento:</strong> {user.birthDate}</span>
                        <span><strong>Gênero:</strong> {user.gender}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Botão de Editar (some quando já estiver editando) */}
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-purple-600 text-white w-32 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                >
                  Editar Perfil
                </button>
              )}
            </div>

            {/* Card de Medalhas */}
            <div className="w-full lg:w-1/3 bg-gray-700 rounded-lg flex flex-col items-center justify-center p-4 min-h-[200px] shadow-lg">
              <p className="text-lg font-semibold mb-2 text-purple-300">Badges</p>
              <div className="w-full h-full bg-gray-800 rounded-md flex items-center justify-center border border-gray-600">
                <span className="text-gray-400">Nenhuma medalha ainda</span>
              </div>
            </div>
          </section>

          {/* Seção Inferior: Estatísticas */}
          <section className="flex-grow flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/4 flex flex-col gap-8">
              <div className="bg-gray-700 rounded-lg flex-1 flex flex-col items-center justify-center min-h-[150px] shadow-lg">
                <span className="text-3xl font-bold text-green-400">0</span>
                <span className="text-gray-300">Dias de Streak</span>
              </div>
              <div className="bg-gray-700 rounded-lg flex-1 flex flex-col items-center justify-center min-h-[150px] shadow-lg">
                <span className="text-3xl font-bold text-yellow-400">0</span>
                <span className="text-gray-300">Certificados</span>
              </div>
            </div>
            <div className="flex-grow bg-gray-700 rounded-lg flex items-center justify-center min-h-[332px] shadow-lg">
              <p className="text-gray-400">Gráficos de estatísticas em breve</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default StudentProfile;