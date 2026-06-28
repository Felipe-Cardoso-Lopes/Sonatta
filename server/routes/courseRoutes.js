const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { 
  createCourse, 
  updateCourse,
  getTeacherCourses, 
  getTeacherStudents, 
  getAllCoursesForStudent, 
  getEnrolledCourses,
  enrollStudent,
  unenrollStudent,
  updateCourseProgress,
  getCompletedClassesForCourse,
  markClassAsCompleted
} = require('../controllers/courseController');

// Rotas do Professor (Permite 'professor' e 'admin' ou super admin, mas para o escopo do teste focaremos no 'professor')
router.post('/teacher', verifyToken, checkRole(['professor']), createCourse);
router.get('/teacher', verifyToken, checkRole(['professor']), getTeacherCourses);
router.get('/teacher/students', verifyToken, checkRole(['professor']), getTeacherStudents);
router.put('/:id', verifyToken, checkRole(['professor']), updateCourse);  

// Rotas do Aluno
router.get('/student', verifyToken, checkRole(['aluno']), getAllCoursesForStudent);
router.get('/enrolled', verifyToken, checkRole(['aluno']), getEnrolledCourses);
router.post('/student/enroll', verifyToken, checkRole(['aluno']), enrollStudent);
router.post('/unenroll', verifyToken, checkRole(['aluno']), unenrollStudent);
router.put('/:courseId/progress', verifyToken, checkRole(['aluno']), updateCourseProgress);
router.get('/:courseId/progress/classes', verifyToken, checkRole(['aluno']), getCompletedClassesForCourse);
router.post('/:courseId/classes/:classId/complete', verifyToken, checkRole(['aluno']), markClassAsCompleted);

module.exports = router;