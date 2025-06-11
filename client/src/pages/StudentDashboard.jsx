import React from 'react';
import Header from '../components/Header'; // A importação continua a mesma
import Button from '../components/Button';
import { Link } from 'react-router-dom';

function StudentDashboard() {
  const userName = "João Estudante";

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col">
      {/* A única mudança é aqui: adicionamos a prop 'variant' */}
      <Header variant="dashboard" />
      
      <main className="flex-grow p-8 pt-20">
        <h1 className="text-4xl font-bold text-center mb-10">Bem-vindo(a), {userName}!</h1>
        
        {/* O resto do seu código da dashboard continua igual... */}
        <section className="mb-12 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Seu Caminho Musical no Sonatta</h2>
          <p className="text-lg leading-relaxed mb-8">
            Continue sua jornada de aprendizado personalizada. Aqui você encontra suas aulas, suas práticas e seu progresso.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white-text text-xl">
                <span role="img" aria-label="Livro">📚</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Minhas Aulas</h3>
              <p className="text-sm text-gray-400 mb-4">Acesse o conteúdo do seu curso.</p>
              <Link to="/lessons">
                <Button variant="primary">Ver Aulas</Button>
              </Link>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white-text text-xl">
                <span role="img" aria-label="Piano">🎹</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Praticar</h3>
              <p className="text-sm text-gray-400 mb-4">Receba feedback em tempo real com nossa IA.</p>
              <Link to="/practice">
                <Button variant="primary">Iniciar Prática</Button>
              </Link>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white-text text-xl">
                <span role="img" aria-label="Gráfico">📊</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Meu Progresso</h3>
              <p className="text-sm text-gray-400 mb-4">Acompanhe sua evolução e conquistas.</p>
              <Link to="/progress">
                <Button variant="secondary">Ver Progresso</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;