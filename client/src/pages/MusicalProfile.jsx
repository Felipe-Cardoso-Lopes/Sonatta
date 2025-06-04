import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import MusicParticles from '../components/MusicParticles';

function MusicalProfile() {
  const [nivelMusical, setNivelMusical] = useState(''); // iniciante, intermediario, avancado
  const [instrumentoExperiente, setInstrumentoExperiente] = useState('');
  const [instrumentoInteresse, setInstrumentoInteresse] = useState('');
  const [generoMusical, setGeneroMusical] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para salvar os dados e futuramente redirecionar para o dashboard do aluno
    console.log({ nivelMusical, instrumentoExperiente, instrumentoInteresse, generoMusical });
    alert('Perfil Musical salvo! Redirecionando para a home.'); // Placeholder
    navigate('/');
  };

  return (
    <div className="h-screen">
      <MusicParticles />
      <Header />
      <main className="relative z-10 flex-grow flex items-center justify-center w-full pt-20">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Perfil Musical</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-white-text text-sm font-bold mb-2">Nível musical</label>
              <div className="flex justify-between">
                <Button type="button" variant={nivelMusical === 'iniciante' ? 'primary' : 'secondary'} onClick={() => setNivelMusical('iniciante')}>Iniciante</Button>
                <Button type="button" variant={nivelMusical === 'intermediario' ? 'primary' : 'secondary'} onClick={() => setNivelMusical('intermediario')}>Intermediário</Button>
                <Button type="button" variant={nivelMusical === 'avancado' ? 'primary' : 'secondary'} onClick={() => setNivelMusical('avancado')}>Avançado</Button>
              </div>
            </div>
            <Input label="Instrumento Experiente" id="instrumentoExperiente" type="text" placeholder="Ex: Violão" value={instrumentoExperiente} onChange={(e) => setInstrumentoExperiente(e.target.value)} />
            <Input label="Instrumento de Interesse" id="instrumentoInteresse" type="text" placeholder="Ex: Guitarra" value={instrumentoInteresse} onChange={(e) => setInstrumentoInteresse(e.target.value)} />
            <Input label="Gênero musical preferido" id="generoMusical" type="text" placeholder="Ex: Rock" value={generoMusical} onChange={(e) => setGeneroMusical(e.target.value)} />
            <Button type="submit" variant="primary" className="w-full mt-4">
              Avançar
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default MusicalProfile;