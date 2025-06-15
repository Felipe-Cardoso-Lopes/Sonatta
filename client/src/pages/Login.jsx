// client/src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importe useNavigate
import axios from 'axios'; // Importe axios
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import MusicParticles from '../components/MusicParticles';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Inicialize useNavigate

  const handleSubmit = async (e) => { // Tornar a função assíncrona
    e.preventDefault();
    console.log('Login attempt:', { email, password });

    try {
      // Chamada à API de login
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      const { token, role } = response.data; // Obter o token e a role da resposta

      // Salvar o token no localStorage (boa prática para autenticação)
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role); // Salvar a role para futuras verificações

      console.log('Login bem-sucedido:', response.data);

      // Redirecionar com base na role
      if (role === 'aprender') {
        navigate('/student-dashboard'); // Redireciona para o painel do estudante
      } else if (role === 'ensinar') {
        navigate('/teacher-dashboard'); // Redireciona para o painel do professor
      } else if (role === 'admin') { // Adicione um caso para admin, se aplicável
        navigate('/admin-dashboard'); // Redireciona para o painel do administrador
      } else {
        // Caso a role não seja reconhecida ou para um fallback
        navigate('/'); // Redireciona para a home ou uma página de erro
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
          <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
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