import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Adicionamos a prop 'variant' com um valor padrão 'public'
function Header({ variant = 'public' }) { 
  const navigate = useNavigate();

  // Função para lidar com o logout
  const handleLogout = () => {
    // Futuramente, aqui você limpará o token de autenticação (localStorage, etc.)
    console.log("Usuário deslogado!");
    
    // Redireciona o usuário para a página inicial
    navigate('/'); 
  };

  return (
    <header className="relative z-10 flex justify-between items-center p-5">
       <div className="flex items-center gap-3 transition-transform hover:scale-125">
        <Link to="/">
        <img
          src="../public/assets/sonatta-logo.png"
          alt="Sonatta Logo"
          className="w-12 h-12 scale-150 "
        />
        </Link>
        <Link to="/" className="text-2xl font-bold">
          Sonatta
        </Link>
      </div>


      {/* Navegação que muda com base na 'variant' */}
      <nav>
        {variant === 'dashboard' ? (
          // Se a variant for 'dashboard', mostra a navegação para usuários LOGADOS
          <div className="flex items-center gap-4">
            <Link to="/profile" className="hover:underline">Meu Perfil</Link>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 hover:bg-red-600 transition-colors text-white font-bold py-2 px-4 rounded-md"
            >
              Sair
            </button>
          </div>
        ) : (
          // Senão, mostra a navegação para visitantes (padrão)
          <div className="flex gap-6">
        <Link to="/register" className="text-xl hover:font-bold">
          Cadastrar
        </Link>

        <Link to="/login" className="text-white text-xl hover:font-bold">
          Entrar
        </Link>
      </div>

        )}
      </nav>
    </header>
  );
}

export default Header;