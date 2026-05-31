const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const { 
  getGlobalStats,
  getAllSubscriptions, 
  createSubscription, 
  updateSubscription, 
  deleteSubscription,
  getAllInstitutions,
  createInstitution,
  approveInstitution,
  rejectInstitution,
  getSaaSPlans,
  updateSaaSPlan
} = require('../controllers/superAdminController');

// Protege todas as rotas deste arquivo, exigindo token JWT válido
router.use(authMiddleware);

// --- Rotas de Estatísticas ---
router.get('/stats', getGlobalStats);

// --- Rotas de Gestão de Instituições ---
router.get('/institutions', getAllInstitutions);
router.post('/institutions', createInstitution);
router.put('/institutions/:id/approve', approveInstitution);
router.delete('/institutions/:id/reject', rejectInstitution);

// --- Rotas de Gestão de Assinaturas (Subscriptions) ---
router.get('/subscriptions', getAllSubscriptions);
router.post('/subscriptions', createSubscription);
router.put('/subscriptions/:id', updateSubscription);
router.delete('/subscriptions/:id', deleteSubscription);

// --- Rotas de Configuração de Planos SaaS ---
router.get('/saas-plans', getSaaSPlans);
router.put('/saas-plans/:id', updateSaaSPlan);

module.exports = router;