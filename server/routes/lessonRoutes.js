const express = require('express');
const router = express.Router();
const { createLesson, getLessons } = require('../controllers/lessonController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Rotas para /api/lessons
router.route('/')
  .post(verifyToken, createLesson)
  .get(verifyToken, getLessons);

module.exports = router;