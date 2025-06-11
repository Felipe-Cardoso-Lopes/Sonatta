// client/src/pages/TeacherDashboard.jsx
import React from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

function TeacherDashboard() {
  const userName = "Maria Professora"; // Mock de nome do usuário

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col">
      <Header variant="dashboard" />
      
      <main className="flex-grow p-8 pt-20">
        <h1 className="text-4xl font-bold text-center mb-10">Bem-vindo(a), {userName}!</h1>
        
        <section className="mb-12 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Área do Professor Sonatta</h2>
          <p className="text-lg leading-relaxed mb-8">
            Gerencie suas turmas, crie conteúdos e acompanhe o progresso de seus alunos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card de Gerenciar Turmas */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white-text text-xl">
                <span role="img" aria-label="Grupo de pessoas">👨‍🏫</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Minhas Turmas</h3>
              <p className="text-sm text-gray-400 mb-4">Veja e gerencie seus alunos.</p>
              <Link to="/teacher/classes">
                <Button variant="primary">Gerenciar</Button>
              </Link>
            </div>

            {/* Card de Criação de Aulas */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white-text text-xl">
                <span role="img" aria-label="Lousa">📝</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Criar Aulas</h3>
              <p className="text-sm text-gray-400 mb-4">Desenvolva novos conteúdos e exercícios.</p>
              <Link to="/teacher/create-lesson">
                <Button variant="primary">Criar</Button>
              </Link>
            </div>

            {/* Card de Relatórios de Alunos */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white-text text-xl">
                <span role="img" aria-label="Relatório">📈</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Relatórios</h3>
              <p className="text-sm text-gray-400 mb-4">Acompanhe o desempenho detalhado.</p>
              <Link to="/teacher/reports">
                <Button variant="secondary">Ver Relatórios</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Adicione outras seções específicas para professores aqui */}
      </main>
    </div>
  );
}

export default TeacherDashboard;