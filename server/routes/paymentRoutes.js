const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/authMiddleware');

// POST /api/payments/checkout
// Apenas usuários autenticados (escolas) podem gerar um checkout
router.post('/checkout', verifyToken, createCheckoutSession);

module.exports = router;