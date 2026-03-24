const express = require('express');
const router = express.Router();
const { getGlobalStats } = require('../controllers/superAdminController');

// Define a rota GET para buscar as métricas globais
router.get('/stats', getGlobalStats);

module.exports = router;