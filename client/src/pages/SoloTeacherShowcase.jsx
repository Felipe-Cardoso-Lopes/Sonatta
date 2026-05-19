import React, { useState, useEffect } from "react";
import axios from "axios";
import SoloTeacherSidebar from "../components/SoloTeacherSidebar";

function SoloTeacherShowcase() {
  const [reviews, setReviews] = useState({ average_rating: null, total_reviews: 0, reviews: [] });
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Professor";

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/reviews/teacher/${userId}`);
        setReviews(res.data);
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderStars = (rating, size = "text-xl") => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={`${size} ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-600"}`}>
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col md:flex-row">
      <SoloTeacherSidebar />
      <main className="flex-grow p-6 md:p-10 flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Minha Vitrine</h1>
          <p className="text-gray-400">
            Configure sua página pública de vendas e captação de alunos.
          </p>
        </div>

        {/* Card de Reputação */}
        <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-purple-500/30 p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* Avatar */}
            <div className="w-24 h-24 bg-gray-700 border-4 border-purple-500 rounded-xl flex items-center justify-center text-4xl font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">{userName}</h2>
              <span className="bg-purple-600 text-xs px-3 py-1 rounded-full text-white font-bold">
                Professor Solo
              </span>

              {/* Média */}
              <div className="mt-4">
                {loading ? (
                  <p className="text-gray-500 text-sm">Carregando avaliações...</p>
                ) : reviews.average_rating ? (
                  <div className="flex items-center gap-3">
                    {renderStars(reviews.average_rating, "text-2xl")}
                    <span className="text-white text-2xl font-bold">
                      {Number(reviews.average_rating).toFixed(1)}
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({reviews.total_reviews} avaliações)
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mt-2">Nenhuma avaliação ainda.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Carrossel de Depoimentos */}
        {reviews.reviews.length > 0 && (
          <section className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-purple-300 border-b border-gray-700 pb-2 mb-4">
              O que meus alunos dizem ⭐
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {reviews.reviews.map(review => (
                <div key={review.id} className="min-w-[280px] bg-gray-700 rounded-xl p-4 border border-gray-600 flex flex-col gap-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                      {review.student_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white leading-tight">{review.student_name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating, "text-sm")}
                  {review.comment && (
                    <p className="text-sm text-gray-300 italic leading-relaxed">
                      "{review.comment}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Placeholder para features futuras (Feature 12) */}
        <section className="bg-gray-900 border border-dashed border-gray-700 rounded-xl p-6 flex items-center justify-center text-gray-500 min-h-[120px]">
          🎬 Links de mídia e CTA de agendamento virão aqui (Feature 12)
        </section>

      </main>
    </div>
  );
}

export default SoloTeacherShowcase;