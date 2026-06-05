import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
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
  const location = useLocation();

  // Pega TODOS os dados acumulados nas telas anteriores (Register + About You)
  const accumulatedData = location.state || {};

  const toggleSelecao = (item, listaAtual, setLista) => {
    if (listaAtual.includes(item)) {
      setLista(listaAtual.filter(i => i !== item));
    } else {
      setLista([...listaAtual, item]);
    }
  };

 const handleFinishProfile = async (e) => {
    e.preventDefault();

    if (!nivelSelecionado || instrumentosSelecionados.length === 0 || generosSelecionados.length === 0) {
      return alert("Por favor, selecione seu nível e pelo menos um instrumento e um gênero.");
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // 1. Cria o usuário no banco de dados (Equivalente ao Register)
      const registerResponse = await axios.post(`${API_URL}/api/users/register`, {
        name: accumulatedData.name,
        email: accumulatedData.email,
        password: accumulatedData.password,
      });

      // O backend retorna os dados do usuário criado, incluindo o novo ID
      const newUserId = registerResponse.data.id;

      // 2. Atualiza o cadastro com os dados do About You
      await axios.put(`${API_URL}/api/users/complete/${newUserId}`, {
        nickname: accumulatedData.nickname,
        birth_date: accumulatedData.birthDate,
      });

      // 3. Salva as Preferências Musicais
      await axios.post(`${API_URL}/api/users/preferences`, {
        userId: newUserId,
        nivel: nivelSelecionado,
        instrumentos: instrumentosSelecionados,
        generos: generosSelecionados
      });

      // Sucesso total! Redireciona para o login.
      alert("Cadastro finalizado com sucesso! Agora você pode fazer o login.");
      navigate('/login');

    } catch (error) {
      console.error('Erro ao finalizar cadastro:', error);
      // Pega a mensagem de erro específica do backend, se houver
      const errorMsg = error.response?.data?.message || "Erro ao salvar seus dados no banco. Tente novamente.";
      alert(errorMsg);
    }
  };

  // Componente visual para as Tags
  const TagButton = ({ label, isSelected, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 m-1 rounded-full text-sm font-semibold transition-all duration-300 border ${
        isSelected 
          ? 'bg-white-text text-dark-bg border-white-text  hover:border-purple-500 scale-105 shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
          : 'bg-dark-bg border border-gray-600 text-white-text focus:outline-none hover:border-purple-500'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins pb-10">
      <MusicParticles />
      <Header />
      <div className="relative z-10 flex flex-col items-center">
        
        <main className="w-full max-w-2xl mt-10 px-4">
          <div className="bg-dark-gray p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-2 text-center">Seu Perfil Musical</h2>
            <p className="text-gray-400 text-center mb-8">Conte-nos o que você curte para personalizarmos sua experiência.</p>
            
            <form onSubmit={handleFinishProfile} className="space-y-8"> {/* Alterado para handleFinishProfile */}
              
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