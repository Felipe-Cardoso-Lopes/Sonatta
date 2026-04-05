const express = require('express');
const router = express.Router();
const { approveUser } = require('../controllers/instituicaoController');
const { protect } = require('../middlewares/authMiddleware'); // Seu middleware de JWT

// Rota protegida: Apenas usuários logados (instituições) podem acessar
router.put('/approve-user', protect, approveUser);

module.exports = router;