const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
  createCourse, 
  updateCourse,
  getTeacherCourses, 
  getTeacherStudents, 
  getAllCoursesForStudent, 
  getEnrolledCourses,
  enrollStudent 
} = require('../controllers/courseController');

// Rotas do Professor
router.post('/teacher', protect, createCourse);
router.get('/teacher', protect, getTeacherCourses);
router.get('/teacher/students', protect, getTeacherStudents);
router.put('/:id', protect, updateCourse);

// Rotas do Aluno
router.get('/student', protect, getAllCoursesForStudent);
router.get('/enrolled', protect, getEnrolledCourses);
router.post('/student/enroll', protect, enrollStudent);

module.exports = router;