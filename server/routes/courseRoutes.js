const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
  createCourse, 
  getTeacherCourses, 
  getTeacherStudents, 
  getAllCoursesForStudent, 
  enrollStudent 
} = require('../controllers/courseController');

// Rotas do Professor
router.post('/teacher', protect, createCourse);
router.get('/teacher', protect, getTeacherCourses);
router.get('/teacher/students', protect, getTeacherStudents);

// Rotas do Aluno
router.get('/student', protect, getAllCoursesForStudent);
router.post('/student/enroll', protect, enrollStudent);

module.exports = router;