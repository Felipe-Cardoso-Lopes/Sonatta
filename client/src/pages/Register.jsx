import React, { useState } from "react";
import Header from "../components/Header"; // Importa o Header
import Input from "../components/Input"; // Importa o componente Input
import Button from "../components/Button"; // Importa o componente Button
import { Link } from "react-router-dom";
import MusicParticles from '../components/MusicParticles';

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    if (!acceptTerms) {
      alert("Você deve aceitar os termos de uso!");
      return;
    }
    console.log("Register attempt:", { name, email, password, acceptTerms });
    // Futura lógica de cadastro com o backend Node.js aqui
    alert("Função de cadastro ainda não implementada!");
  };

  return (
    <div className="h-screen">
      <MusicParticles /> 
      <Header />

      <main className="relative z-10 flex-grow flex items-center justify-center w-full pt-20">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Cadastre-se</h2>
          <form onSubmit={handleSubmit}>
            <Input
              label="Nome Completo"
              id="name"
              type="text"
              placeholder="João da Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            <Input
              label="Confirme a Senha"
              id="confirmPassword"
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mr-2 accent-white-text cursor-pointer"
                required
              />
              <label
                htmlFor="acceptTerms"
                className="text-sm text-white-text cursor-pointer"
              >
                Eu concordo com os{" "}
                <Link to="/terms" className="hover:underline">
                  Termos de Uso
                </Link>{" "}
                e{" "}
                <Link to="/privacy" className="hover:underline">
                  Política de Privacidade
                </Link>
                .
              </label>
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Cadastrar-se
            </Button>
          </form>
          <p className="text-center mt-4">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="text-white-text font-bold hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;
