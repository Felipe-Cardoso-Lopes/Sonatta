const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { 
  createCourse, 
  updateCourse,
  getTeacherCourses, 
  getTeacherStudents, 
  getAllCoursesForStudent, 
  getEnrolledCourses,
  enrollStudent,
  unenrollStudent
} = require('../controllers/courseController');

// Rotas do Professor
router.post('/teacher', verifyToken, createCourse);
router.get('/teacher', verifyToken, getTeacherCourses);
router.get('/teacher/students', verifyToken, getTeacherStudents);
router.put('/:id', verifyToken, updateCourse);  



// Rotas do Aluno
router.get('/student', verifyToken, getAllCoursesForStudent);
router.get('/enrolled', verifyToken, getEnrolledCourses);
router.post('/student/enroll', verifyToken, enrollStudent);
router.post('/unenroll', verifyToken, unenrollStudent);

module.exports = router;