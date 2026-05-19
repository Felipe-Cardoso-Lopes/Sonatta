const express = require('express');
const router = express.Router();
const { createReview, getTeacherReviews } = require('../controllers/reviewController');
const { verifyToken } = require('../middlewares/authMiddleware');

// POST /api/reviews — Apenas alunos autenticados
router.post('/', verifyToken, createReview);

// GET /api/reviews/teacher/:teacherId — Público (exibido no perfil do professor)
router.get('/teacher/:teacherId', getTeacherReviews);

module.exports = router;