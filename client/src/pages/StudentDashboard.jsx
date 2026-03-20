import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header'; // Ajuste o caminho se necessário

function StudentDashboard() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // Recupera o token salvo no momento do login
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Faz a requisição enviando o token no cabeçalho (Header) de Autorização
        const response = await axios.get(`${API_URL}/api/lessons`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setLessons(response.data);
      } catch (err) {
        console.error('Erro ao buscar aulas:', err);
        setError('Não foi possível carregar a sua agenda de aulas.');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [navigate]);

  // Função para formatar a data que vem do banco (PostgreSQL) para o padrão brasileiro
  const formatarData = (dataIso) => {
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long', 
      day: '2-digit', 
      month: 'long', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins pb-10">
      <Header />
      
      <main className="w-full max-w-5xl mx-auto mt-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Minha Agenda Musical</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-400 text-lg">Carregando suas aulas...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="bg-dark-gray p-8 rounded-lg shadow-lg border border-gray-700 text-center">
            <p className="text-xl text-gray-300 mb-2">Sua agenda está livre!</p>
            <p className="text-gray-500">Você ainda não tem nenhuma aula marcada com nossos professores.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div 
                key={lesson.id} 
                className="bg-dark-gray p-6 rounded-lg shadow-lg border border-gray-700 hover:border-gray-500 transition-colors duration-300 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-purple-600 bg-opacity-20 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-purple-500">
                    {lesson.instrument}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    lesson.status === 'agendada' ? 'bg-green-500 text-green-900' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {lesson.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                <p className="text-gray-400 text-sm mb-4 flex-grow">{lesson.description}</p>
                
                <div className="border-t border-gray-700 pt-4 mt-auto">
                  <p className="text-sm text-gray-300 mb-1">
                    <strong className="text-white">Professor:</strong> {lesson.teacher_name}
                  </p>
                  <p className="text-sm text-purple-300 font-medium capitalize">
                    {formatarData(lesson.lesson_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;