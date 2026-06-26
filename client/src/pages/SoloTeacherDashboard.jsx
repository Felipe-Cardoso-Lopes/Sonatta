import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SoloTeacherSidebar from "../components/SoloTeacherSidebar";

function SoloTeacherDashboard() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Trava de segurança para garantir que apenas o Professor Independente acesse
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    const teacherType = localStorage.getItem("teacherType");

    if (!token) {
      navigate("/login");
    } else if (role !== "professor" || teacherType !== "independente") {
      navigate("/");
    }

    // 2. Recupera o nome para as boas-vindas
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, [navigate]);
return (
    // Alterado para flex-col md:flex-row para alinhar responsividade com a Instituição
    <div className="min-h-screen bg-piano-black text-white-text font-poppins flex flex-col md:flex-row overflow-x-hidden">
      {/* Menu Lateral do Professor Independente */}
      <SoloTeacherSidebar />

      {/* Conteúdo Principal */}
      <div className="flex-grow flex flex-col">
        <main className="flex-grow flex flex-col items-center justify-center p-8 overflow-y-auto">
          {/* Cabeçalho de Boas-Vindas */}
          <div className="text-center w-full mb-12 mt-4">
            <h1 className="text-4xl font-bold mb-2">
              Bem-Vindo(a), {userName}!
            </h1>
            <h2 className="text-2xl mb-4 text-gray-300">
              Área do Professor Independente
            </h2>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto text-gray-400">
              Gerencie seus cursos, acompanhe o progresso de seus alunos e
              controle suas finanças de forma centralizada.
            </p>
          </div>

          {/* Seção de Navegação por Cards (Alinhamento atualizado) */}
          <section className="flex flex-col xl:flex-row flex-wrap justify-center gap-8 md:gap-12 w-full px-4 md:px-0">

             {/* Card Gerenciamento Cursos e Alunos */}
            <Link
              to="/solo-teacher/courses"
              className="group flex flex-col items-center text-center"
            >
              <div className="w-[260px] h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-xl border-2 border-transparent group-hover:border-purple-500">
                <img
                  src="/assets/Gerenciamento.png"
                  alt="Gerenciamento"
                  className="w-32 h-32 object-contain"
                />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 font-semibold text-xl mt-4 text-white group-hover:text-purple-400">
                Gerenciamento
              </span>
            </Link>
            
            {/* Card Visão Geral */}
            <Link
              to="/solo-teacher/overview"
              className="group flex flex-col items-center text-center"
            >
              <div className="w-[260px] h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-xl border-2 border-transparent group-hover:border-purple-500">
                <img
                  src="/assets/Overview.png"
                  alt="Visão Geral"
                  className="w-32 h-32 object-contain"
                />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 font-semibold text-xl mt-4 text-white group-hover:text-purple-400">
                Visão Geral
              </span>
            </Link>

            {/* Card Agenda */}
            <Link
              to="/solo-teacher/schedule"
              className="group flex flex-col items-center text-center"
            >
              <div className="w-[260px] h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-xl border-2 border-transparent group-hover:border-purple-500">
                <img
                  src="/assets/Agenda.png"
                  alt="Agenda"
                  className="w-32 h-32 object-contain"
                />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 font-semibold text-xl mt-4 text-white group-hover:text-purple-400">
                Agenda
              </span>
            </Link>

           

            {/* Card Financeiro */}
            <Link
              to="/solo-teacher/financial"
              className="group flex flex-col items-center text-center"
            >
              <div className="w-[260px] h-[390px] rounded-[15px] bg-white flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-xl border-2 border-transparent group-hover:border-purple-500">
                <img
                  src="/assets/Financeiro.png"
                  alt="Financeiro"
                  className="w-32 h-32 object-contain"
                />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 font-semibold text-xl mt-4 text-white group-hover:text-purple-400">
                Financeiro
              </span>
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}

export default SoloTeacherDashboard;