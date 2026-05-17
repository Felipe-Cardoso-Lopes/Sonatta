import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InstituicaoSidebar from '../components/InstituicaoSidebar';

function InstituicaoManagement() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [teachersRes, studentsRes] = await Promise.all([
        axios.get(`${API_URL}/api/instituicao/teachers`, { headers }),
        axios.get(`${API_URL}/api/instituicao/students`, { headers })
      ]);
      setTeachers(teachersRes.data);
      setStudents(studentsRes.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar dados de gerenciamento", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row relative">
      <div className="shrink-0 z-20">
        <InstituicaoSidebar />
      </div>

      <main className="flex-grow p-6 md:p-10 flex flex-col h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerenciamento da Instituição</h1>
            <p className="text-gray-400">Administre o corpo docente e os alunos vinculados à sua escola.</p>
          </div>

          {isLoading ? (
            <p className="text-gray-400">Carregando dados...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* TABELA DE PROFESSORES */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col">
                <h2 className="text-xl font-bold text-purple-400 mb-4">Professores Cadastrados</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-700 text-gray-400 text-sm">
                        <th className="pb-3 font-semibold">Nome</th>
                        <th className="pb-3 font-semibold">E-mail</th>
                        <th className="pb-3 font-semibold">Especialidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="pt-4 text-gray-500 text-sm text-center">Nenhum professor vinculado.</td>
                        </tr>
                      ) : (
                        teachers.map((teacher) => (
                          <tr key={teacher.id} className="border-b border-gray-700/50 text-sm text-gray-200 hover:bg-gray-700/30 transition-colors">
                            <td className="py-3 font-medium">{teacher.name}</td>
                            <td className="py-3 text-gray-400">{teacher.email}</td>
                            <td className="py-3">{teacher.instrument || 'Geral'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TABELA DE ALUNOS */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col">
                <h2 className="text-xl font-bold text-blue-400 mb-4">Alunos Matriculados</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-700 text-gray-400 text-sm">
                        <th className="pb-3 font-semibold">Nome</th>
                        <th className="pb-3 font-semibold">E-mail</th>
                        <th className="pb-3 font-semibold">Curso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="pt-4 text-gray-500 text-sm text-center">Nenhum aluno matriculado.</td>
                        </tr>
                      ) : (
                        students.map((student) => (
                          <tr key={student.id} className="border-b border-gray-700/50 text-sm text-gray-200 hover:bg-gray-700/30 transition-colors">
                            <td className="py-3 font-medium">{student.name}</td>
                            <td className="py-3 text-gray-400">{student.email}</td>
                            <td className="py-3">{student.course_title || 'Nenhum'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default InstituicaoManagement;