import React from "react";
import SoloTeacherSidebar from "../components/SoloTeacherSidebar";

function SoloTeacherShowcase() {
  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row">
      <SoloTeacherSidebar />
      <main className="flex-grow p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-2">Minha Vitrine</h1>
        <p className="text-gray-400 mb-8">
          Configure sua página pública de vendas e captação de alunos.
        </p>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 h-96 flex items-center justify-center text-gray-500">
          Configuração de Perfil Público e Link de Vendas virá aqui.
        </div>
      </main>
    </div>
  );
}
export default SoloTeacherShowcase;
