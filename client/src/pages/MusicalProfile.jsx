import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Button from '../components/Button';
import MusicParticles from '../components/MusicParticles';

const NIVEIS = ['Iniciante', 'Intermediário', 'Avançado'];
const INSTRUMENTOS = ['Violão', 'Guitarra', 'Teclado', 'Piano', 'Bateria', 'Canto', 'Baixo', 'Violino', 'Ukulele'];
const GENEROS = ['Rock', 'Pop', 'Sertanejo', 'MPB', 'Gospel', 'Jazz', 'Clássico', 'Blues', 'Eletrônica', 'Samba'];

function MusicalProfile() {
  const [nivelSelecionado, setNivelSelecionado] = useState('');
  const [instrumentosSelecionados, setInstrumentosSelecionados] = useState([]);
  const [generosSelecionados, setGenerosSelecionados] = useState([]);
  
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const toggleSelecao = (item, listaAtual, setLista) => {
    if (listaAtual.includes(item)) {
      setLista(listaAtual.filter(i => i !== item));
    } else {
      setLista([...listaAtual, item]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nivelSelecionado || instrumentosSelecionados.length === 0 || generosSelecionados.length === 0) {
      return alert("Por favor, selecione seu nível e pelo menos um instrumento e um gênero.");
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      await axios.post(`${API_URL}/api/users/preferences`, {
        userId: userId,
        nivel: nivelSelecionado,
        instrumentos: instrumentosSelecionados,
        generos: generosSelecionados
      });

      alert("Perfil musical criado com sucesso! Faça seu login.");
      navigate('/login');
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      alert("Erro ao salvar suas preferências. Tente novamente.");
    }
  };

  // Componente visual para as Tags
  const TagButton = ({ label, isSelected, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 m-1 rounded-full text-sm font-semibold transition-all duration-300 border ${
        isSelected 
          ? 'bg-white-text text-dark-bg border-white-text scale-105 shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
          : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins pb-10">
      <MusicParticles />
      <div className="relative z-10 flex flex-col items-center">
        <Header />
        
        <main className="w-full max-w-2xl mt-10 px-4">
          <div className="bg-dark-gray p-8 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-3xl font-bold mb-2 text-center">Seu Perfil Musical</h2>
            <p className="text-gray-400 text-center mb-8">Conte-nos o que você curte para personalizarmos sua experiência.</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Seção: Nível */}
              <section>
                <h3 className="text-xl font-semibold mb-3">Qual o seu nível atual?</h3>
                <div className="flex flex-wrap">
                  {NIVEIS.map(nivel => (
                    <TagButton 
                      key={nivel} 
                      label={nivel} 
                      isSelected={nivelSelecionado === nivel} 
                      onClick={() => setNivelSelecionado(nivel)} 
                    />
                  ))}
                </div>
              </section>

              {/* Seção: Instrumentos */}
              <section>
                <h3 className="text-xl font-semibold mb-3">Quais instrumentos você quer dominar?</h3>
                <div className="flex flex-wrap">
                  {INSTRUMENTOS.map(inst => (
                    <TagButton 
                      key={inst} 
                      label={inst} 
                      isSelected={instrumentosSelecionados.includes(inst)} 
                      onClick={() => toggleSelecao(inst, instrumentosSelecionados, setInstrumentosSelecionados)} 
                    />
                  ))}
                </div>
              </section>

              {/* Seção: Gêneros */}
              <section>
                <h3 className="text-xl font-semibold mb-3">Quais gêneros você mais ouve?</h3>
                <div className="flex flex-wrap">
                  {GENEROS.map(genero => (
                    <TagButton 
                      key={genero} 
                      label={genero} 
                      isSelected={generosSelecionados.includes(genero)} 
                      onClick={() => toggleSelecao(genero, generosSelecionados, setGenerosSelecionados)} 
                    />
                  ))}
                </div>
              </section>

              <Button type="submit" variant="primary" className="w-full mt-8 text-lg py-3">
                Finalizar Jornada
              </Button>
            </form>

          </div>
        </main>
      </div>
    </div>
  );
}

export default MusicalProfile;