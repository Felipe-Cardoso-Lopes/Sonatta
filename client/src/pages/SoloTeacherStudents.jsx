import React from 'react';
import SoloTeacherSidebar from '../components/SoloTeacherSidebar';

function SoloTeacherStudents() {
  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row">
      <SoloTeacherSidebar />
      <main className="flex-grow p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-2">Alunos (CRM)</h1>
        <p className="text-gray-400 mb-8">Gestão de alunos ativos, inativos e interessados (leads).</p>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 h-96 flex items-center justify-center text-gray-500">
          Tabela de Alunos e funil de CRM virá aqui.
        </div>
      </main>
    </div>
  );
}
export default SoloTeacherStudents;