import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import MusicParticles from '../components/MusicParticles';

function AboutYou() {
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Chamada para a nova rota de conclusão
      const response = await axios.put(`${API_URL}/api/users/complete/${userId}`, {
        nickname: nickname,
        birth_date: birthDate,
        gender: gender
      });

      console.log('Cadastro finalizado:', response.data);
      alert("Cadastro concluído com sucesso! Agora você pode entrar.");
      navigate(`/musical-profile/${userId}`); // Nova tela de tags
    } catch (error) {
      console.error('Erro ao finalizar cadastro:', error);
      alert(error.response?.data?.message || "Erro ao salvar seu perfil.");
    }
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
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:border-white outline-none transition-colors"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-bold mb-2">Sexo</label>
              <select 
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:border-white outline-none transition-colors"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="" disabled hidden>Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Prefiro não dizer">Prefiro não dizer</option>
                
              </select>
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