import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Converte URL do YouTube para formato embed
const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

// Converte URL do Spotify para formato embed
const getSpotifyEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/spotify\.com\/(artist|track|album|playlist)\/([a-zA-Z0-9]+)/);
  return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}` : null;
};

function SoloTeacherShowcase() {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [reviews, setReviews] = useState({ average_rating: null, total_reviews: 0, reviews: [] });
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, reviewsRes] = await Promise.all([
          axios.get(`${API_URL}/api/users/public/${teacherId}`),
          axios.get(`${API_URL}/api/reviews/teacher/${teacherId}`)
        ]);
        setTeacher(profileRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Erro ao carregar vitrine:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teacherId]);

  const renderStars = (rating, size = 'text-xl') => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={`${size} ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
      ))}
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">
      <p>Carregando vitrine...</p>
    </div>
  );

  if (!teacher) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">
      <p>Professor não encontrado.</p>
    </div>
  );

  const youtubeEmbedUrl = getYoutubeEmbedUrl(teacher.youtube_intro_url);
  const spotifyEmbedUrl = getSpotifyEmbedUrl(teacher.spotify_artist_url);

  return (
    <div className="min-h-screen bg-dark-bg text-white font-poppins">

      {/* Header público */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/sonatta-logo.png" alt="Sonatta" className="w-8 h-8" />
          <span className="text-xl font-bold">Sonatta</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Entrar na plataforma →
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-12">

        {/* Hero — Perfil do Professor */}
        <section className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="w-28 h-28 bg-gradient-to-br from-purple-600 to-purple-900 border-4 border-purple-500 rounded-2xl flex items-center justify-center text-5xl font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] flex-shrink-0">
            {teacher.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-2">
              <h1 className="text-3xl font-bold text-white">{teacher.name}</h1>
              {teacher.nickname && (
                <span className="text-purple-400 text-lg font-medium">"{teacher.nickname}"</span>
              )}
            </div>
            {teacher.specialty && (
              <p className="text-purple-300 font-semibold mb-2">{teacher.specialty}</p>
            )}
            {reviews.average_rating && (
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-3">
                {renderStars(reviews.average_rating)}
                <span className="text-white font-bold">{Number(reviews.average_rating).toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({reviews.total_reviews} avaliações)</span>
              </div>
            )}
            {teacher.bio && (
              <p className="text-gray-300 text-sm leading-relaxed max-w-xl">{teacher.bio}</p>
            )}
          </div>
        </section>

        {/* CTA Principal */}
        {teacher.offers_trial_lesson && (
          <section className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-center shadow-2xl border border-purple-500/30">
            <p className="text-purple-200 text-sm font-semibold uppercase tracking-wider mb-2">Oferta Especial</p>
            <h2 className="text-2xl font-bold text-white mb-3">
              🎁 Aula Experimental Gratuita
            </h2>
            <p className="text-purple-200 mb-6 max-w-md mx-auto">
              Experimente uma aula com {teacher.name} sem compromisso. Descubra se o método dele é perfeito para você!
            </p>
            <button
              onClick={() => navigate(`/schedule?teacherId=${teacherId}&trial=true`)}
              className="bg-white text-purple-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-purple-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
            >
              🗓️ Agendar Minha Aula Gratuita
            </button>
          </section>
        )}

        {/* Vídeo YouTube */}
        {youtubeEmbedUrl && (
          <section>
            <h2 className="text-xl font-bold text-purple-300 border-b border-gray-700 pb-2 mb-6">
              🎬 Conheça meu Trabalho
            </h2>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-700"
              style={{ paddingTop: '56.25%' }}>
              <iframe
                src={youtubeEmbedUrl}
                title="Vídeo de apresentação"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </section>
        )}

        {/* Player Spotify */}
        {spotifyEmbedUrl && (
          <section>
            <h2 className="text-xl font-bold text-purple-300 border-b border-gray-700 pb-2 mb-6">
              🎵 Ouça Minha Música
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
              <iframe
                src={spotifyEmbedUrl}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="block"
              />
            </div>
          </section>
        )}

        {/* Avaliações */}
        {reviews.reviews.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-purple-300 border-b border-gray-700 pb-2 mb-6">
              ⭐ O que dizem meus alunos
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {reviews.reviews.map(review => (
                <div key={review.id} className="min-w-[280px] bg-gray-800 rounded-xl p-5 border border-gray-700 flex flex-col gap-3 flex-shrink-0 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {review.student_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{review.student_name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating, 'text-sm')}
                  {review.comment && (
                    <p className="text-sm text-gray-300 italic leading-relaxed">"{review.comment}"</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Secundário */}
        <section className="text-center py-8 border-t border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-3">Pronto para começar?</h2>
          <p className="text-gray-400 mb-6">Agende uma aula com {teacher.name} e dê o primeiro passo na sua jornada musical.</p>
          <button
            onClick={() => navigate(`/schedule?teacherId=${teacherId}`)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
          >
            🗓️ Agendar uma Aula
          </button>
        </section>

      </main>
    </div>
  );
}

export default SoloTeacherShowcase;