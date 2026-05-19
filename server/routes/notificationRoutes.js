const express = require('express');
const router = express.Router();
const { getUnreadNotifications, markAsRead } = require('../controllers/notificationController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Rota para buscar as notificações (GET /api/notifications/unread)
router.get('/unread', verifyToken, getUnreadNotifications);

// Rota para marcar como lida quando o usuário clicar (PUT /api/notifications/:id/read)
router.put('/:id/read', verifyToken, markAsRead);

module.exports = router;