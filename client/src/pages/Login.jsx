import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import MusicParticles from "../components/MusicParticles";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Armazena as informações de sessão lendo direto da raiz do 'data'
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userName", data.name);

        localStorage.setItem("userNickname", data.nickname);

        console.log("Login bem-sucedido:", data);

        // Lógica de redirecionamento
        const role = data.role; // <-- Garantindo que não há ".user" aqui!
        
        if (role === 'aluno') { 
          navigate('/student-dashboard');
        } else if (role === 'professor') { 
          navigate('/teacher-dashboard');
        } else if (role === 'instituicao') {
          navigate('/instituicao-dashboard');
          } else if (role === 'super_admin') {
            
          // NOVO: Redireciona a equipe criadora para a torre de controle
          navigate('/super-admin-dashboard');
        } else {
          navigate("/");
        }
      } else {
        alert(data.message || "Credenciais inválidas.");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert(
        "Erro ao conectar com o servidor. Verifique se o backend está rodando.",
      );
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
                <Link
                  to="/forgot-password"
                  className="text-sm text-white-text hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Entrar
              </Button>
            </form>
            <p className="text-center mt-4">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-white-text font-bold hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;
