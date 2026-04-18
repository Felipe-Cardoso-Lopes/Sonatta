const express = require('express');
const router = express.Router();

// Importamos as funções do motor CRUD que você acabou de criar
const { 
  getAllSubscriptions, 
  createSubscription, 
  updateSubscription, 
  deleteSubscription 
} = require('../controllers/superAdminController');

// ==========================================
// ENDPOINTS DE ASSINATURAS (SUPER ADMIN)
// ==========================================

// GET /api/super-admin/subscriptions -> Lista todas
router.get('/subscriptions', getAllSubscriptions);

// POST /api/super-admin/subscriptions -> Cria uma nova
router.post('/subscriptions', createSubscription);

// PUT /api/super-admin/subscriptions/:id -> Atualiza uma existente
router.put('/subscriptions/:id', updateSubscription);

// DELETE /api/super-admin/subscriptions/:id -> Cancela/Remove
router.delete('/subscriptions/:id', deleteSubscription);

module.exports = router;