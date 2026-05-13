const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/payments/checkout
// Apenas usuários autenticados (escolas) podem gerar um checkout
router.post('/checkout', protect, createCheckoutSession);

module.exports = router;