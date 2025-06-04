import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import MusicParticles from '../components/MusicParticles';

function ProfessionalProfile() {
  const [instrumentoEspecializado, setInstrumentoEspecializado] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ instrumentoEspecializado, portfolio });
    navigate('/experience');
  };

  return (
    <div className="h-screen">
      <MusicParticles />
      <Header />
      <main className="relative z-10 flex-grow flex items-center justify-center w-full pt-20">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Perfil Profissional</h2>
          <form onSubmit={handleSubmit}>
            <Input
              label="Instrumento Especializado"
              id="instrumentoEspecializado"
              type="text"
              placeholder="Qual sua especialidade?"
              value={instrumentoEspecializado}
              onChange={(e) => setInstrumentoEspecializado(e.target.value)}
              required
            />
            <Input
              label="Portfólio"
              id="portfolio"
              type="text"
              placeholder="Link para seu trabalho, se tiver"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
            />
            <Button type="submit" variant="primary" className="w-full mt-4">
              Avançar
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ProfessionalProfile;