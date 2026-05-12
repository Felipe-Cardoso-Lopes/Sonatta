const express = require('express');
const router = express.Router();
const { approveUser } = require('../controllers/instituicaoController');
const { verifyToken } = require('../middlewares/authMiddleware'); // Seu middleware de JWT

// Rota protegida: Apenas usuários logados (instituições) podem acessar
router.put('/approve-user', verifyToken, approveUser);

module.exports = router;