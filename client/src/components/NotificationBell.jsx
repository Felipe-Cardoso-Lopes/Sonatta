import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  // 1. Busca as notificações não lidas assim que o sininho é renderizado
  useEffect(() => {
    fetchNotifications();
    
    // (Opcional) Polling a cada 30 segundos para manter o sininho atualizado
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/api/notifications/unread`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Marca a notificação como lida e remove do dropdown
  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Atualiza o estado local reativamente (faz o número da badge cair instantaneamente)
      setNotifications(notifications.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  return (
    <div className="relative">
      {/* Botão do Sininho */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
      >
        <span className="text-xl">🔔</span>
        
        {/* Badge Vermelha Dinâmica */}
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/4 -translate-y-1/4">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Menu Suspenso (Dropdown) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Notificações</h3>
            <span className="text-xs text-gray-400">{notifications.length} não lidas</span>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <p className="p-4 text-sm text-center text-gray-400">A carregar...</p>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-sm text-center text-gray-400">Não há novas notificações.</p>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className="p-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => handleMarkAsRead(notif.id)}
                >
                  <p className="text-sm font-semibold text-white mb-1">{notif.title}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{notif.message}</p>
                  <p className="text-[10px] text-gray-500 mt-2 text-right">
                    {new Date(notif.created_at).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;