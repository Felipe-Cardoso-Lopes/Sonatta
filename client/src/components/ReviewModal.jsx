import React, { useState } from 'react';
import axios from 'axios';
import StarRating from './StarRating';

function ReviewModal({ targetId, targetType, title = "Avalie este conteúdo", onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Por favor, selecione uma nota nas estrelas.");
    
    setIsSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/reviews`, {
        target_id: targetId.toString(),
        target_type: targetType,
        rating,
        comment
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      onSuccess();
    } catch (error) {
      alert("Erro ao enviar avaliação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#1a1a1a] rounded-2xl border border-gray-700 w-full max-w-md p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        
        <h2 className="text-xl font-bold text-white mb-4 text-center">{title}</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-400 text-center">Sua opinião ajuda outros alunos e professores a melhorarem.</p>
          
          <StarRating rating={rating} setRating={setRating} />

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Deixe um comentário (opcional)..."
            className="w-full bg-[#252525] border border-gray-600 rounded-lg p-3 text-white text-sm outline-none focus:border-purple-500 mt-2 resize-none"
            rows="3"
          />

          <button 
            type="submit" 
            disabled={isSubmitting || rating === 0}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors mt-2"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewModal;