import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import MusicParticles from '../components/MusicParticles';

function VerifyEmail() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Recupera o e-mail passado pela tela de registro
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('E-mail verificado com sucesso! Faça login para continuar.');
        navigate('/login');
      } else {
        alert(data.message || 'Código inválido ou expirado.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${API_URL}/api/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      alert('Novo código enviado para o seu e-mail!');
    } catch (error) {
      alert('Erro ao reenviar o código.');
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-piano-black text-pure-white flex items-center justify-center">
        <p>Sessão inválida. Volte ao cadastro.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-piano-black text-pure-white font-poppins flex flex-col">
      <MusicParticles />
      <div className="relative z-10 flex flex-col h-full flex-grow">
        <Header />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="bg-[#1a1a1a] border border-key-divider p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
            
            <h1 className="text-2xl font-bold mb-2">Verifique seu E-mail</h1>
            <p className="text-gray-400 mb-6 text-sm">
              Enviamos um código de 6 dígitos para <strong className="text-white">{email}</strong>. Ele expira em 15 minutos.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Código de Verificação"
                id="code"
                type="text"
                placeholder="Ex: 123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength="6"
                required
              />
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Verificando...' : 'Confirmar Código'}
              </Button>
            </form>

            <div className="mt-6 text-sm">
              <span className="text-gray-400">Não recebeu o e-mail? </span>
              <button onClick={handleResend} className="text-purple-400 hover:text-purple-300 font-bold underline">
                Reenviar
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default VerifyEmail;