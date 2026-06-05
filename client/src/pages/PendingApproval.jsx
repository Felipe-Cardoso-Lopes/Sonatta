import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import MusicParticles from '../components/MusicParticles';

function PendingApproval() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpa o token para garantir que não haja sessões presas
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-full min-h-screen bg-piano-black text-pure-white font-poppins flex flex-col">
      <MusicParticles />
      <div className="relative z-10 flex flex-col h-full flex-grow">
        <Header />
        
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="bg-[#1a1a1a] border border-key-divider p-10 rounded-lg shadow-2xl max-w-lg w-full text-center">
            
            <div className="mb-6 flex justify-center">
              {/* Ícone simples de relógio/espera usando SVG */}
              <svg className="w-20 h-20 text-purple-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold mb-4 text-white">Conta em Análise</h1>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Sua conta foi criada com sucesso! No entanto, para acessar os painéis de aulas ou ensino, 
              <strong className="text-white"> sua instituição precisa liberar o seu acesso</strong>.
            </p>

            <div className="bg-dark-bg border border-gray-700 p-4 rounded text-sm text-gray-300 text-left mb-8">
              <h3 className="font-bold text-white mb-2">O que fazer agora?</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Aguarde o gestor da sua escola aprovar seu perfil.</li>
                <li>Se você possui um <strong>Código de Convite</strong>, peça para a escola revogar este cadastro e crie um novo informando o código.</li>
              </ul>
            </div>

            <Button onClick={handleLogout} variant="primary" className="w-full py-3">
              Voltar para o Login
            </Button>
            
          </div>
        </main>
      </div>
    </div>
  );
}

export default PendingApproval;