import React, { useState } from 'react';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import MusicParticles from '../components/MusicParticles'; // Supondo que você criará este componente

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // Futura lógica de autenticação com o backend Node.js aqui
    alert('Função de login ainda não implementada!');
  };

  return (
    // 1. Container principal: Adicionamos 'relative', 'overflow-hidden' e as classes de estilo padrão
    <div className="relative min-h-screen bg-dark-bg text-white-text font-poppins overflow-hidden">
      
      {/* 2. Fundo animado: Fica com posicionamento absoluto, atrás de tudo */}
      <MusicParticles /> 

      {/* 3. Conteúdo principal: Header e Main ficam com z-index para garantir que fiquem na frente */}
      <div className="relative z-10 flex flex-col h-screen">
        <Header /> 
        
        <main className="flex-grow flex items-center justify-center w-full"> 
          <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md"> {/* Opcional: Efeito de vidro com backdrop-blur */}
            <h2 className="text-3xl font-bold mb-6 text-center">Entrar</h2>
            <form onSubmit={handleSubmit}>
              <Input
                label="E-mail"
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Senha"
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="mb-6 text-right">
                <Link to="/forgot-password" className="text-sm text-white-text hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Entrar
              </Button>
            </form>
            <p className="text-center mt-4">
              Não tem uma conta? <Link to="/register" className="text-white-text font-bold hover:underline">Cadastre-se</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;