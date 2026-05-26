const express = require('express');
const router = express.Router();

const { 
  getGlobalStats,
  getAllSubscriptions, 
  createSubscription, 
  updateSubscription, 
  deleteSubscription,
  getAllInstitutions,
  createInstitution,
  approveInstitution,
  getSaaSPlans,
  updateSaaSPlan
} = require('../controllers/superAdminController');

router.get('/stats', getGlobalStats);
router.get('/subscriptions', getAllSubscriptions);
router.post('/subscriptions', createSubscription);
router.put('/subscriptions/:id', updateSubscription);
router.delete('/subscriptions/:id', deleteSubscription);
router.get('/saas-plans', getSaaSPlans);
router.put('/saas-plans/:id', updateSaaSPlan);
router.get('/institutions', getAllInstitutions);
router.post('/institutions', createInstitution);
router.put('/institutions/:id/approve', approveInstitution);

module.exports = router;