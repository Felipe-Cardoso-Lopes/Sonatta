const express = require('express');
const router = express.Router();

const { 
  getGlobalStats,
  getAllSubscriptions, 
  createSubscription, 
  updateSubscription, 
  deleteSubscription,
  getAllInstitutions,
  getSaaSPlans,
  updateSaaSPlan
} = require('../controllers/superAdminController');

// ==========================================
// 1. RECURSO: ESTATÍSTICAS GLOBAIS
// ==========================================
router.get('/stats', getGlobalStats);

// ==========================================
// 2. RECURSO: ASSINATURAS (SUBSCRIPTIONS)
// ==========================================
router.get('/subscriptions', getAllSubscriptions);
router.post('/subscriptions', createSubscription);
router.put('/subscriptions/:id', updateSubscription);
router.delete('/subscriptions/:id', deleteSubscription);

// ==========================================
// 3. RECURSO: PLANOS SAAS
// ==========================================
router.get('/saas-plans', getSaaSPlans);
router.put('/saas-plans/:id', updateSaaSPlan);

// ==========================================
// 4. RECURSO: INSTITUIÇÕES
// ==========================================
router.get('/institutions', getAllInstitutions);

module.exports = router;