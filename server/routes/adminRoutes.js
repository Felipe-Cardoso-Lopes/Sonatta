const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { getDashboardStats } = require('../controllers/adminController');

// Apenas super_admin pode aceder às métricas administrativas globais.
router.get('/stats', verifyToken, checkRole(['super_admin']), getDashboardStats);

module.exports = router;