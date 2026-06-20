const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

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
  updateSaaSPlan,
  getSoloTeachers,
  createSoloTeacher
} = require('../controllers/superAdminController');

// Apenas super_admin pode aceder a qualquer rota deste router.
// O verifyToken valida o JWT; o checkRole impede escalada de privilégios.
router.use(verifyToken, checkRole(['super_admin']));

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

// --- Rotas de Gestão de Professores Solo ---
router.get('/solo-teachers', getSoloTeachers);
router.post('/solo-teachers', createSoloTeacher);

module.exports = router;