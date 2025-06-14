import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'; // 1. Importe o axios para fazer a chamada à API
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import MusicParticles from '../components/MusicParticles';

function Register() {
  const navigate = useNavigate();

  // 2. Usar um único objeto de estado 'formData' é mais prático para enviar para a API
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'aluno', // Perfil padrão
  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  // 3. Uma única função para lidar com todas as mudanças nos inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. A função de submit agora é 'async' para esperar a resposta do backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    if (!acceptTerms) {
      alert("Você deve aceitar os termos de uso!");
      return;
    }

    try {
      // 5. ETAPA DE BACKEND: Envia os dados de autenticação para a API
      const response = await axios.post('http://localhost:5000/api/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      console.log('Usuário base criado com sucesso:', response.data);
      alert("Cadastro inicial realizado! Agora, vamos configurar seu perfil.");

      // 6. ETAPA DE FRONTEND: Redireciona para a próxima etapa do seu fluxo
      // Você pode até passar o ID do novo usuário na rota, se precisar
      navigate(`/about-you/${response.data.id}`);

    } catch (error) {
      // Se der erro no backend (ex: e-mail já existe), mostra o alerta
      console.error('Erro no cadastro:', error.response ? error.response.data.message : error.message);
      alert(`Erro no cadastro: ${error.response ? error.response.data.message : 'Tente novamente.'}`);
    }
  };

  return (
    // 7. Estrutura de layout para o fundo animado funcionar corretamente
    <div className="relative min-h-screen bg-dark-bg text-white-text font-poppins overflow-hidden">
      <MusicParticles />

      <div className="relative z-10 flex flex-col h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center w-full">
          <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-center">Crie sua Conta</h2>
            <form onSubmit={handleSubmit}>
              {/* 8. Inputs atualizados para usar o estado 'formData' e a função 'handleChange' */}
              <Input
                label="Nome Completo" id="name" name="name" type="text"
                placeholder="João da Silva" value={formData.name} onChange={handleChange} required
              />
              <Input
                label="E-mail" id="email" name="email" type="email"
                placeholder="seuemail@exemplo.com" value={formData.email} onChange={handleChange} required
              />
              <Input
                label="Senha" id="password" name="password" type="password"
                placeholder="Crie uma senha forte" value={formData.password} onChange={handleChange} required
              />
              <Input
                label="Confirme a Senha" id="confirmPassword" name="confirmPassword" type="password"
                placeholder="Confirme sua senha" value={formData.confirmPassword} onChange={handleChange} required
              />
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox" id="acceptTerms" checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mr-2 accent-white-text cursor-pointer" required
                />
                <label htmlFor="acceptTerms" className="text-sm text-white-text cursor-pointer">
                  Eu concordo com os Termos de Uso.
                </label>
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Próximo
              </Button>
            </form>
            <p className="text-center mt-4">
              Já tem uma conta? <Link to="/login" className="text-white-text font-bold hover:underline">Entrar</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Register;