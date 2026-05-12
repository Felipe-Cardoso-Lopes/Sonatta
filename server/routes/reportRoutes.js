const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Protege as rotas para que apenas o super_admin tenha acesso a esses dados consolidados
router.use(verifyToken);
router.use(checkRole(['super_admin']));

// Endpoint: /api/reports/revenue
router.get('/revenue', reportController.getRevenueReport);

// Endpoint: /api/reports/teachers
router.get('/teachers', reportController.getTeacherPerformanceReport);

module.exports = router;