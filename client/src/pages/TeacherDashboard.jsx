import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

function TeacherDashboard() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados do Formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instrument, setInstrument] = useState('');
  const [lessonDate, setLessonDate] = useState('');

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Buscar aulas existentes
  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/api/lessons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLessons(response.data);
    } catch (err) {
      console.error('Erro ao buscar aulas:', err);
      setError('Não foi possível carregar as aulas.');
    } finally {
      setLoading(false);
    }
  };

  // Criar nova aula
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      await axios.post(`${API_URL}/api/lessons`, {
        title,
        description,
        instrument,
        lesson_date: lessonDate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Aula criada com sucesso!');
      
      // Limpar formulário
      setTitle('');
      setDescription('');
      setInstrument('');
      setLessonDate('');
      
      // Atualizar a lista de aulas
      fetchLessons();
    } catch (err) {
      console.error('Erro ao criar aula:', err);
      alert('Erro ao criar aula. Verifique os dados e tente novamente.');
    }
  };

  const formatarData = (dataIso) => {
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins pb-10">
      <Header />
      
      <main className="w-full max-w-5xl mx-auto mt-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Coluna Esquerda: Formulário */}
        <div className="md:col-span-1 bg-dark-gray p-6 rounded-lg shadow-lg border border-gray-700 h-fit">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Agendar Aula</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Título da Aula</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                className="w-full bg-dark-bg border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-purple-500"
                placeholder="Ex: Violão Iniciante"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Instrumento</label>
              <select 
                value={instrument} 
                onChange={(e) => setInstrument(e.target.value)} 
                required
                className="w-full bg-dark-bg border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">Selecione...</option>
                <option value="Violão">Violão</option>
                <option value="Guitarra">Guitarra</option>
                <option value="Piano">Piano</option>
                <option value="Canto">Canto</option>
                <option value="Bateria">Bateria</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Data e Hora</label>
              <input 
                type="datetime-local" 
                value={lessonDate} 
                onChange={(e) => setLessonDate(e.target.value)} 
                required 
                className="w-full bg-dark-bg border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Descrição</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full bg-dark-bg border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-purple-500"
                rows="3"
                placeholder="Tópicos que serão abordados..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 mt-4"
            >
              Criar Aula
            </button>
          </form>
        </div>

        {/* Coluna Direita: Lista de Aulas */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Aulas Agendadas</h2>
          
          {loading ? (
            <p className="text-gray-400">Carregando...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : lessons.length === 0 ? (
            <div className="bg-dark-gray p-8 rounded border border-gray-700 text-center">
              <p className="text-gray-400">Você ainda não agendou nenhuma aula.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map(lesson => (
                <div key={lesson.id} className="bg-dark-gray p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                    <p className="text-sm text-gray-400">{lesson.instrument} • {formatarData(lesson.lesson_date)}</p>
                  </div>
                  <span className="bg-purple-600 bg-opacity-20 text-purple-400 text-xs px-2 py-1 rounded border border-purple-500">
                    {lesson.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default TeacherDashboard;