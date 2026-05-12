const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { createExercise, getExercisesByCourse } = require('../controllers/exerciseController');

router.post('/', verifyToken, createExercise);
router.get('/course/:courseId', verifyToken, getExercisesByCourse);

module.exports = router;