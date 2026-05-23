import React, { useEffect } from 'react';
import SoloTeacherSidebar from '../components/SoloTeacherSidebar';
import { useNavigate } from 'react-router-dom';

function SoloTeacherCourses() {
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const teacherType = localStorage.getItem('teacherType');

    if (!token) {
      navigate('/login');
    } else if (role !== 'professor' || teacherType !== 'independente') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row">
      <SoloTeacherSidebar />
      <main className="flex-grow p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-2">Meus Cursos</h1>
        <p className="text-gray-400 mb-8">Crie e edite seus cursos gravados ou materiais de apoio.</p>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 h-96 flex items-center justify-center text-gray-500">
          Lista de Cursos e Módulos virá aqui.
        </div>
      </main>
    </div>
  );
}
export default SoloTeacherCourses;