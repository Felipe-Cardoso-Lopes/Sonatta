// client/src/pages/AboutYou.jsx
import React, { useState, /*useEffect*/ } from 'react'; // Importe useEffect
import { useNavigate, useParams } from 'react-router-dom'; // Importe useParams
import axios from 'axios'; // Importe axios
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
  const { id: userId } = useParams(); // Obtenha o ID do usuário da URL

  // Opcional: Carregar dados existentes do usuário (nome, etc.) se necessário
  // useEffect(() => {
  //   if (userId) {
  //     // Lógica para buscar dados do usuário com base no userId
  //     // Ex: const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
  //     // setNome(response.data.name);
  //     // setObjetivo(response.data.role); // Se você quiser pré-selecionar
  //   }
  // }, [userId]);

  const handleSubmit = async (e) => { // Torne a função assíncrona
    e.preventDefault();
    
    // Validação básica da data
    if (dia && mes && ano) {
      const dataNascimento = `${ano}-${mes}-${dia}`;
      // Você pode adicionar mais validações aqui, como se a data é válida
      console.log('Data de Nascimento:', dataNascimento);
    }

    try {
      // 1. Enviar a role (objetivo) para o backend para atualizar o usuário
      // Você precisará de um novo endpoint no backend para isso.
      const response = await axios.put(`http://localhost:5000/api/users/${userId}/profile`, {
        name: nome, // Você pode enviar o nome também, se quiser atualizar
        role: objetivo,
        // birthDate: dataNascimento // Se você for armazenar a data de nascimento
      });

      console.log('Perfil do usuário atualizado com sucesso:', response.data);

      // 2. Redirecionar com base no objetivo (role) selecionado
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