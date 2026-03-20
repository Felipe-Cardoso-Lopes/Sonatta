const express = require('express');
const router = express.Router();
const { createLesson, getLessons } = require('../controllers/lessonController');
const { protect } = require('../middlewares/authMiddleware');

// Rotas para /api/lessons
router.route('/')
  .post(protect, createLesson)
  .get(protect, getLessons);

module.exports = router;