const express = require('express');
const router = express.Router();
const { createLesson, getLessons, getCompletedLessons } = require('../controllers/lessonController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Rotas para /api/lessons
router.route('/')
  .post(verifyToken, createLesson)
  .get(verifyToken, getLessons);

router.get('/completed/:teacherId', verifyToken, getCompletedLessons);

module.exports = router;