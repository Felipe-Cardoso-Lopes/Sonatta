import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // 1. Busca notificações não lidas ao montar
  useEffect(() => {
    fetchUnreadNotifications();
  }, []);

  // 2. Integração com Socket.io — incrementa o contador em tempo real
  useEffect(() => {
    if (!userId) return;

    const socket = io(API_URL);

    socket.on('connect', () => {
      socket.emit('user_connected', userId);
    });

    // Ouve eventos que geram novas notificações
    socket.on('new_appointment', (data) => {
      setNotifications(prev => [data, ...prev]);
    });

    socket.on('receive_message', (data) => {
      setNotifications(prev => [
        {
          id: Date.now(), // ID temporário até o próximo fetch
          title: 'Nova mensagem',
          message: data.message || 'Você recebeu uma nova mensagem.',
          created_at: new Date().toISOString(),
        },
        ...prev
      ]);
    });

    return () => socket.disconnect();
  }, [userId]);

  // 3. Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/notifications/unread`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${API_URL}/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Remove visualmente e atualiza o contador de forma reativa
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diff < 60) return 'agora mesmo';
    if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    return `${Math.floor(diff / 86400)}d atrás`;
  };

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Ícone do Sininho */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="relative transition-transform hover:scale-125"
        aria-label="Notificações"
      >
        <span className="text-2xl">🔔</span>

        {/* Badge com contador */}
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-800">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-12 bottom-0 w-72 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden">

          <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Notificações</h3>
            {notifications.length > 0 && (
              <span className="text-xs text-gray-400">{notifications.length} não lidas</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                Nenhuma notificação nova.
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="px-4 py-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors flex flex-col gap-1"
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-semibold text-white leading-tight">
                      {notification.title}
                    </p>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                      {formatTimeAgo(notification.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default NotificationBell;