import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import MusicParticles from '../components/MusicParticles';

function Experience() {
  const [anosAtuacao, setAnosAtuacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [certificados, setCertificados] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para salvar os dados e futuramente redirecionar para o dashboard do professor
    console.log({ anosAtuacao, descricao, certificados });
    alert('Cadastro de experiência concluído! Redirecionando para a home.'); // Placeholder
    navigate('/');
  };

  return (
    <div className="h-screen">
      <MusicParticles />
      <Header />
      <main className="relative z-10 flex-grow flex items-center justify-center w-full pt-20">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Experiência</h2>
          <form onSubmit={handleSubmit}>
            <Input
              label="Anos de atuação"
              id="anosAtuacao"
              type="text"
              placeholder="Ex: 5 anos"
              value={anosAtuacao}
              onChange={(e) => setAnosAtuacao(e.target.value)}
            />
            <div className="mb-4">
              <label htmlFor="descricao" className="block text-white-text text-sm font-bold mb-2">
                Experiência
              </label>
              <textarea
                id="descricao"
                placeholder="Faça uma breve descrição da sua jornada musical"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-white-text leading-tight focus:outline-none focus:ring-2 focus:ring-white-text focus:border-transparent bg-gray-800 h-24"
              />
            </div>
            <Input
              label="Certificados"
              id="certificados"
              type="text"
              placeholder="Anexe links ou nomes de certificados"
              value={certificados}
              onChange={(e) => setCertificados(e.target.value)}
            />
            <Button type="submit" variant="primary" className="w-full mt-4">
              Finalizar
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Experience;