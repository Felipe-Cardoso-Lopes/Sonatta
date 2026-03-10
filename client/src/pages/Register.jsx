import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

    // Validações básicas
    if (formData.password !== formData.confirmPassword) {
      return alert("As senhas não coincidem!");
    }
    if (!acceptTerms) {
      return alert("Você deve aceitar os termos de uso!");
    }

    try {
      // Integração sugerida com o Banco de Dados (Backend)
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro inicial realizado! Agora, vamos configurar seu perfil.");
        // Redireciona para a configuração de perfil usando o ID retornado pelo banco
        navigate(`/about-you/${data.id}`);
      } else {
        alert(data.message || "Erro ao realizar cadastro.");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Erro ao conectar com o servidor. Verifique se o backend está rodando.");
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