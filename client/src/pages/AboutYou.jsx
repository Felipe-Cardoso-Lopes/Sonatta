import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import MusicParticles from '../components/MusicParticles';

function AboutYou() {
  const [nome, setNome] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [objetivo, setObjetivo] = useState('aprender'); // 'aprender' ou 'ensinar'
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para salvar os dados (futuramente)
    console.log({ nome, dia, mes, ano, objetivo });

    if (objetivo === 'aprender') {
      navigate('/musical-profile');
    } else {
      navigate('/professional-profile');
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
              label="Nome"
              id="nome"
              type="text"
              placeholder="Como prefere ser chamado?"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
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