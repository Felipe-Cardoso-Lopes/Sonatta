// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');

// Rota GET: /api/admin/stats
router.get('/stats', getDashboardStats);

module.exports = router;