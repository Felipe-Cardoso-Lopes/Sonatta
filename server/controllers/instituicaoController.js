// server/controllers/adminController.js
const db = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    // Conta alunos
    const students = await db.query("SELECT COUNT(*) FROM users WHERE role = 'aluno'");
    
    // Conta professores
    const teachers = await db.query("SELECT COUNT(*) FROM users WHERE role = 'professor'");
    
    // Conta aulas
    const lessons = await db.query("SELECT COUNT(*) FROM lessons");

    res.status(200).json({
      totalStudents: parseInt(students.rows[0].count),
      totalTeachers: parseInt(teachers.rows[0].count),
      totalLessons: parseInt(lessons.rows[0].count),
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do admin:', error);
    res.status(500).json({ message: 'Erro interno ao carregar métricas.' });
  }
};

module.exports = { getDashboardStats };