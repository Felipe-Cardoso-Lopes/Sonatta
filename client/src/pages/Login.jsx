// felipe-cardoso-lopes/sonatta/Sonatta-d63186ec006a2e56cd14b87d9cb8564ef4006ca1/client/src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import MusicParticles from '../components/MusicParticles';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });
      const { name, token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', name);
      console.log('Login bem-sucedido:', response.data);
      if (role === 'aprender') {
        navigate('/student-dashboard');
      } else if (role === 'ensinar') {
        navigate('/teacher-dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Erro no login:', error.response ? error.response.data.message : error.message);
      alert(`Erro no login: ${error.response ? error.response.data.message : 'Verifique suas credenciais.'}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-dark-bg text-white-text font-poppins overflow-hidden">
      <MusicParticles />
      <div className="relative z-10 flex flex-col h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center w-full">
          <div className="bg-dark-gray p-8 rounded-lg shadow-lg w-full max-w-md">
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
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-400">ou</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>
            <div className="flex flex-col gap-4">
              <Button variant="secondary" className="w-full">
                Entrar com Google
              </Button>
              <Button variant="secondary" className="w-full">
                Entrar com Microsoft
              </Button>
            </div>
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