import React from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

function AdminDashboard() {
  const userName = "Administrador";

  return (
    <div className="min-h-screen bg-new-bg text-white-text font-poppins flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Conteúdo Principal */}
      <div className="flex-grow flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="text-center w-full mb-12">
            <h1 className="text-4xl font-bold mb-2">Bem-Vindo(a), {userName}!</h1>
            <h2 className="text-2xl mb-4">Painel Administrativo Sonatta</h2>
            <p className="text-lg leading-relaxed max-w-3xl mx-auto">
              Acompanhe o crescimento do negócio, gerencie o conteúdo e administre os professores da plataforma.
            </p>
          </div>
          <section className="flex flex-col xl:flex-row flex-wrap justify-center gap-8 md:gap-12 w-full px-4 md:px-0">

            <Link to="/admin/overview" className="group flex flex-col items-center text-center w-full md:w-auto max-w-[260px] md:max-w-none">
              <div className="w-full md:w-[260px] h-[300px] md:h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                <img src="/assets/Overview.png" alt="Visão Geral" className="w-32 h-32" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-white-text">Visão Geral</span>
            </Link>
            
            <Link to="/admin/management" className="group flex flex-col items-center text-center w-full md:w-auto max-w-[260px] md:max-w-none">
              <div className="w-full md:w-[260px] h-[300px] md:h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                <img src="/assets/Gerenciamento.png" alt="Gerenciamento" className="w-32 h-32" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-white-text">Gerenciamento</span>
            </Link>

            <Link to="/admin/financial" className="group flex flex-col items-center text-center w-full md:w-auto max-w-[260px] md:max-w-none">
              <div className="w-full md:w-[260px] h-[300px] md:h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                <img src="/assets/Financeiro.png" alt="Financeiro" className="w-32 h-32" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-white-text">Financeiro</span>
            </Link>

            <Link to="/admin/settings" className="group flex flex-col items-center text-center w-full md:w-auto max-w-[260px] md:max-w-none">
              <div className="w-full md:w-[260px] h-[300px] md:h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-transform group-hover:scale-105">
                <img src="/assets/Escola.png" alt="Configurações da Escola" className="w-32 h-32" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg mt-4 text-white-text">Configurações da Escola</span>
            </Link>

          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;