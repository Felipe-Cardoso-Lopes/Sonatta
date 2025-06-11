// client/src/pages/AdminDashboard.jsx
import React from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const userName = "Carlos Administrador"; // Mock de nome do usuário

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col">
      <Header variant="dashboard" />
      
      <main className="flex-grow p-8 pt-20">
        <h1 className="text-4xl font-bold text-center mb-10">Painel Administrativo Sonatta</h1>
        <h2 className="text-3xl font-semibold mb-6 text-center">Bem-vindo(a), {userName}!</h2>
        
        <section className="mb-12 max-w-4xl mx-auto text-center">
          <p className="text-lg leading-relaxed mb-8">
            Controle total sobre usuários, conteúdo e configurações do sistema.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card de Gerenciamento de Usuários */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white-text text-xl">
                <span role="img" aria-label="Usuários">👥</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Gerenciar Usuários</h3>
              <p className="text-sm text-gray-400 mb-4">Adicione, edite ou remova contas de alunos/professores.</p>
              <Link to="/admin/users">
                <Button variant="primary">Gerenciar</Button>
              </Link>
            </div>

            {/* Card de Conteúdo do Curso */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white-text text-xl">
                <span role="img" aria-label="Ajustes">⚙️</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Gerenciar Conteúdo</h3>
              <p className="text-sm text-gray-400 mb-4">Aprove ou edite aulas e materiais de estudo.</p>
              <Link to="/admin/content">
                <Button variant="primary">Gerenciar</Button>
              </Link>
            </div>

            {/* Card de Configurações do Sistema */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white-text text-xl">
                <span role="img" aria-label="Configurações">🛠️</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Configurações</h3>
              <p className="text-sm text-gray-400 mb-4">Ajustes globais do sistema e permissões.</p>
              <Link to="/admin/settings">
                <Button variant="secondary">Configurar</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Adicione outras seções para administradores aqui */}
      </main>
    </div>
  );
}

export default AdminDashboard;