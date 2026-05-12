const express = require('express');
const router = express.Router();
const { createLesson, getLessons } = require('../controllers/lessonController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Rotas para /api/lessons
router.route('/')
  .post(protect, createLesson)
  .get(protect, getLessons);

module.exports = router;