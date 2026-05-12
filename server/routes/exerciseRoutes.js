const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { createExercise, getExercisesByCourse } = require('../controllers/exerciseController');

router.post('/', protect, createExercise);
router.get('/course/:courseId', protect, getExercisesByCourse);

module.exports = router;