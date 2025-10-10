// felipe-cardoso-lopes/sonatta/Sonatta-d63186ec006a2e56cd14b87d9cb8564ef4006ca1/client/src/pages/AboutYou.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import MusicParticles from '../components/MusicParticles';

function AboutYou() {
  const [apelido, setApelido] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dia && mes && ano) {
      const dataNascimento = `${ano}-${mes}-${dia}`;
      console.log('Data de Nascimento:', dataNascimento);
    }
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${userId}/profile`, {
        name: apelido,
        role: 'aprender', // Definido como 'aprender' por padrão
      });
      console.log('Perfil do usuário atualizado com sucesso:', response.data);
      navigate('/musical-profile');
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error.response ? error.response.data.message : error.message);
      alert(`Erro ao salvar seu perfil: ${error.response ? error.response.data.message : 'Tente novamente.'}`);
    }
  };

  return (
    <div className="h-screen">
      <MusicParticles />
      <Header />
      <main className="relative z-10 flex-grow flex items-center justify-center w-full pt-20">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Sobre Você</h2>
          <form onSubmit={handleSubmit}>
            <Input
              label="Apelido"
              id="apelido"
              name="apelido"
              type="text"
              placeholder="Como prefere ser chamado?"
              value={apelido}
              onChange={(e) => setApelido(e.target.value)}
              required
            />
            <div className="mb-4">
              <label className="block text-white-text text-sm font-bold mb-2">Data de Nascimento</label>
              <div className="flex gap-4">
                <Input type="text" placeholder="Dia" value={dia} onChange={(e) => setDia(e.target.value)} className="w-1/3" />
                <Input type="text" placeholder="Mês" value={mes} onChange={(e) => setMes(e.target.value)} className="w-1/3" />
                <Input type="text" placeholder="Ano" value={ano} onChange={(e) => setAno(e.target.value)} className="w-1/3" />
              </div>
            </div>
            <Button type="submit" variant="primary" className="w-full mt-4">
              Avançar
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AboutYou;