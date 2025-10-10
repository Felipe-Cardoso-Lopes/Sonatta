// felipe-cardoso-lopes/sonatta/Sonatta-d63186ec006a2e56cd14b87d9cb8564ef4006ca1/client/src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import MusicParticles from '../components/MusicParticles';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'aluno',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      const response = await axios.post('http://localhost:5000/api/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      console.log('Usuário base criado com sucesso:', response.data);
      alert("Cadastro inicial realizado! Agora, vamos configurar seu perfil.");
      navigate(`/about-you/${response.data.id}`);
    } catch (error) {
      console.error('Erro no cadastro:', error.response ? error.response.data.message : error.message);
      alert(`Erro no cadastro: ${error.response ? error.response.data.message : 'Tente novamente.'}`);
    }
  };

  return (
    <div>
      <MusicParticles />
      <div className="relative z-10 flex flex-col h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center w-full">
          <div className="bg-dark-gray p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-center">Crie sua Conta</h2>
            <form onSubmit={handleSubmit}>
              <Input
                label="Nome Completo" id="name" name="name" type="text"
                placeholder="Nome Completo" value={formData.name} onChange={handleChange} required
              />
              <Input
                label="E-mail" id="email" name="email" type="email"
                placeholder="email@exemplo.com" value={formData.email} onChange={handleChange} required
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
              Já tem uma conta? <Link to="/login" className="text-white-text font-bold hover:underline">Entrar</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Register;