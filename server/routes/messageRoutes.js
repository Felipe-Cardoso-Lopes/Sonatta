const express = require('express');
const router = express.Router();

// 1. IMPORTAÇÃO CORRIGIDA: Usando o nome verdadeiro da função (verifyToken)
const { verifyToken } = require('../middlewares/authMiddleware');
const { sendMessage, getChatHistory, getUnreadCounts } = require('../controllers/messageController');

// 2. USO CORRIGIDO: Trocamos 'protect' por 'verifyToken'
router.post('/', verifyToken, sendMessage);
router.get('/unread-counts', verifyToken, getUnreadCounts);
router.get('/:otherUserId', verifyToken, getChatHistory);

module.exports = router;