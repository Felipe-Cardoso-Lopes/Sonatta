// client/src/pages/AboutYou.jsx
import React, { useState, /*useEffect*/ } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import MusicParticles from '../components/MusicParticles';

function AboutYou() {
  const [apelido, setApelido] = useState(''); // 1. Alterado de 'nome' para 'apelido'
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [objetivo, setObjetivo] = useState('aprender');
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (dia && mes && ano) {
      const dataNascimento = `${ano}-${mes}-${dia}`;
      console.log('Data de Nascimento:', dataNascimento);
    }

    try {
      // 2. Enviamos o 'apelido' no campo 'name' que o backend espera
      const response = await axios.put(`http://localhost:5000/api/users/${userId}/profile`, {
        name: apelido, // Enviando o estado 'apelido'
        role: objetivo,
      });

      console.log('Perfil do usuário atualizado com sucesso:', response.data);

      if (objetivo === 'aprender') {
        navigate('/musical-profile');
      } else {
        navigate('/professional-profile');
      }

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
            {/* 3. Todos os atributos foram atualizados para 'apelido' */}
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
            <div className="mb-6">
              <label className="block text-white-text text-sm font-bold mb-2">Objetivo</label>
              <div className="flex justify-around">
                <Button type="button" variant={objetivo === 'aprender' ? 'primary' : 'secondary'} onClick={() => setObjetivo('aprender')}>
                  Aprender
                </Button>
                <Button type="button" variant={objetivo === 'ensinar' ? 'primary' : 'secondary'} onClick={() => setObjetivo('ensinar')}>
                  Ensinar
                </Button>
              </div>
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Avançar
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AboutYou; 