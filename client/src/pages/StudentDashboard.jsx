import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StudentSidebar from '../components/StudentSidebar';

// URL da API configurada para o seu ambiente local
const API_URL = 'http://localhost:5000'; 

function StudentDashboard() {
  const [displayName, setDisplayName] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedNickname = localStorage.getItem('userNickname');
    const storedName = localStorage.getItem('userName');
    
    // Se o apelido existir, não for nulo e não for vazio, usa ele
    if (storedNickname && storedNickname !== 'null' && storedNickname.trim() !== '') {
      setDisplayName(storedNickname);
    } else if (storedName) {
      // Se não tiver apelido, cai pro nome normal
      setDisplayName(storedName);
    }
  }, []);

  // Função para salvar preferências (perfil musical)
  /* 
    --**Criar a rota "/api/users/preferences"**-- */
  const handleProfileSubmit = async (profileData) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      await axios.post(`${API_URL}/api/users/preferences`, {
        userId,
        ...profileData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowModal(false);
      alert('Perfil musical salvo com sucesso!');
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      alert('Erro ao salvar suas preferências.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex">
      {/* Sidebar Lateral Atualizada */}
      <StudentSidebar />

      {/* Conteúdo Principal */}
      <div className="flex-grow flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          
          {/* Cabeçalho de Boas-Vindas */}
          <div className="text-center w-full mb-12">
            <h1 className="text-4xl font-bold mb-2">Bem-Vindo(a), {displayName}!</h1>
            <h2 className="text-2xl mb-4 text-gray-300">Seu Caminho Musical no Sonatta</h2>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto text-gray-400">
              Continue sua jornada de aprendizado personalizada. Aqui você encontra suas aulas, suas atividades e seu progresso.
            </p>
          </div>
          
          {/* Seção de Navegação por Cards */}
         <section className="flex gap-12">
            
            {/* Card Minhas Aulas */}
            <Link to="/lessons" className="group flex flex-col items-center text-center">
              <div className="w-[260px] h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-xl border-2 border-transparent group-hover:border-purple-500">
                <img 
                  src="/assets/Minhas Aulas.png" 
                  alt="Minhas Aulas" 
                  className="w-56 h-56 object-contain" 
                />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 font-semibold text-xl mt-4 text-white group-hover:text-purple-400">
                Minhas Aulas
              </span>
            </Link>
            
            {/* Card Praticar */}
            <Link to="/practice" className="group flex flex-col items-center text-center">
              <div className="w-[260px] h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-xl border-2 border-transparent group-hover:border-purple-500">
                <img 
                  src="/assets/Praticar.png" 
                  alt="Praticar" 
                  className="w-56 h-56 object-contain" 
                />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 font-semibold text-xl mt-4 text-white group-hover:text-purple-400">
                Praticar
              </span>
            </Link>

          </section>

          {/* Opcional: Botão para abrir modal de preferências no futuro */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              {/* Aqui entraria seu componente de formulário de perfil musical */}
              <div className="bg-dark-bg p-6 rounded-lg border border-white">
                <p>Configurações de Perfil em breve...</p>
                <button onClick={() => setShowModal(false)} className="mt-4 bg-red-500 p-2 rounded">Fechar</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;