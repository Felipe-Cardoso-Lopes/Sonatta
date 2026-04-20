const express = require('express');
const router = express.Router();

// 1. Importações consolidadas do controlador
const { 
  getAllSubscriptions, 
  createSubscription, 
  updateSubscription, 
  deleteSubscription,
  getAllInstitutions,
  getSaaSPlans,
  updateSaaSPlan
} = require('../controllers/superAdminController');

// ==========================================
// 1. RECURSO: ASSINATURAS (SUBSCRIPTIONS)
// ==========================================
router.get('/subscriptions', getAllSubscriptions);
router.post('/subscriptions', createSubscription);
router.put('/subscriptions/:id', updateSubscription);
router.delete('/subscriptions/:id', deleteSubscription);

// ==========================================
// 2. RECURSO: PLANOS SAAS
// ==========================================
router.get('/saas-plans', getSaaSPlans);
router.put('/saas-plans/:id', updateSaaSPlan);

// ==========================================
// 3. RECURSO: INSTITUIÇÕES
// ==========================================
router.get('/institutions', getAllInstitutions);

module.exports = router;