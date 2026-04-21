import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import MusicParticles from '../components/MusicParticles';

function AboutYou() {
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // Pega os dados que vieram da tela Register (nome, email, senha)
  const registerData = location.state || {};


 const handleSubmit = (e) => {
    e.preventDefault();

    // Repassa os dados anteriores + os novos (apelido e data) para a última tela
    navigate('/musical-profile', { 
      state: { 
        ...registerData, 
        nickname, 
        birthDate      
      } 
    }); 
    alert("Etapa concluída! Vamos configurar seu Perfil Musical agora.");
  };

  return (
    <div className="h-screen bg-dark-bg text-white-text">
      <MusicParticles />
      <Header />
      <main className="relative z-10 flex-grow flex items-center justify-center w-full pt-20">
         <div className="bg-dark-gray p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-center">Sobre Você</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <Input
              label="Apelido"
              id="nickname"
              type="text"
              placeholder="Como quer ser chamado no sistema?"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />

            <div className="flex flex-col">
              <label className="text-sm font-bold mb-2">Data de Nascimento</label>
              <input 
                type="date"
                className="w-full p-2 rounded bg-dark-bg border border-gray-600 text-white-text focus:outline-none focus:border-purple-500 outline-none transition-colors"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>


            <Button type="submit" variant="primary" className="w-full mt-6">
              Concluir Cadastro
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AboutYou;