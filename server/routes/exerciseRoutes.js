const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { createExercise, getExercisesByCourse, getStudentExerciseProgress, submitExercise } = require('../controllers/exerciseController');

// Criação restrita
router.post('/', verifyToken, checkRole(['professor', 'admin', 'super_admin']), createExercise);

// Rotas do aluno
router.get('/course/:courseId/progress', verifyToken, checkRole(['aluno']), getStudentExerciseProgress);
router.post('/:exerciseId/submit', verifyToken, checkRole(['aluno']), submitExercise);

// Antiga (apenas listagem estrita - mantida para fallback ou uso por profs)
router.get('/course/:courseId', verifyToken, getExercisesByCourse);

module.exports = router;