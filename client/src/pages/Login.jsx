import React, { useState } from 'react';
import Header from '../components/Header'; // Importa o Header
import Input from '../components/Input'; // Importa o componente Input
import Button from '../components/Button'; // Importa o componente Button
import { Link } from 'react-router-dom';
import MusicParticles from '../components/MusicParticles';

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
    <div className='h-screen'>
      <MusicParticles /> 
      <Header /> 
      
      <main className="relative z-10 flex-grow flex items-center justify-center w-full pt-20"> 
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
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
  );
}

export default Login;