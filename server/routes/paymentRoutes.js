const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleWebhook, getInstitutionFinancialSummary, getInstitutionTransactions } = require('../controllers/paymentController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// POST /api/payments/checkout — autenticado e restrito
router.post('/checkout', verifyToken, checkRole(['instituicao', 'super_admin']), createCheckoutSession);

// POST /api/payments/webhook — público (chamado pelo Mercado Pago, sem JWT)
router.post('/webhook', handleWebhook);

router.get('/institution/summary', verifyToken, checkRole(['instituicao', 'super_admin']), getInstitutionFinancialSummary);
router.get('/institution/transactions', verifyToken, checkRole(['instituicao', 'super_admin']), getInstitutionTransactions);

module.exports = router;