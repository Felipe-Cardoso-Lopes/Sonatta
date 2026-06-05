const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleWebhook } = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/authMiddleware');

// POST /api/payments/checkout — autenticado
router.post('/checkout', verifyToken, createCheckoutSession);

// POST /api/payments/webhook — público (chamado pelo Mercado Pago, sem JWT)
router.post('/webhook', handleWebhook);

module.exports = router;