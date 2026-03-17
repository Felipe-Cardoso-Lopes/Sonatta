import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Importação obrigatória para usar requisições HTTP
import StudentSidebar from '../components/StudentSidebar';

// Defina sua URL da API (ajuste conforme seu ambiente: .env ou constante)
const API_URL = 'http://localhost:5000'; 

function StudentDashboard() {
  const [userName, setUserName] = useState('');
  const [showModal, setShowModal] = useState(false); // Estado ausente adicionado

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // Função movida para ANTES do return e com sintaxe de crases corrigida
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
      <StudentSidebar />

      {/* Conteúdo Principal */}
      <div className="flex-grow flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="text-center w-full mb-12">
            <h1 className="text-4xl font-bold mb-2">Bem-Vindo(a), {userName}!</h1>
            <h2 className="text-2xl mb-4">Seu Caminho Musical no Sonatta</h2>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto">
              Continue sua jornada de aprendizado personalizada. Aqui você encontra suas aulas, suas atividades e seu progresso.
            </p>
          </div>
          
          <section className="flex gap-12">
            <Link to="/lessons" className="group flex flex-col items-center text-center">
              {/* Card Branco do Botão */}
              <div className="w-[260px] h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                <img 
                    src="/assets/Minhas Aulas.png" 
                    alt="Minhas Aulas" 
                    className="w-56 h-56" 
 main
                />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-white-text">Minhas Aulas</span>
            </Link>
            
            <Link to="/practice" className="group flex flex-col items-center text-center">
              {/* Card Branco do Botão */}
              <div className="w-[260px] h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                <img 
                  src="/assets/Praticar.png" 
                  alt="Praticar" 
                  className="w-56 h-56" // Nota: w-55 não é padrão no Tailwind. Mudei para w-56.
                />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-white-text">Praticar</span>
            </Link>
          </section>

          {/* Exemplo de onde a função poderia ser chamada (Modal) */}
          {/* <button onClick={() => setShowModal(true)}>Configurar Perfil Musical</button> */}

        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;