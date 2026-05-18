const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas exclusivas do Professor (Requerem token JWT)
router.post('/availability', authMiddleware, scheduleController.addAvailability);
router.delete('/availability/:id', authMiddleware, scheduleController.deleteAvailability);

// Rota de consulta (Aberta para os alunos poderem ver os horários antes de agendar)
router.get('/availability/:teacherId', authMiddleware, scheduleController.getTeacherAvailability);

module.exports = router;