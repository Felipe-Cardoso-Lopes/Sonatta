const db = require('../config/db');

// @desc    Criar uma nova aula
// @route   POST /api/lessons
// @access  Privado (Professores/Admins)
const createLesson = async (req, res) => {
  const { title, description, instrument, lesson_date } = req.body;
  const teacher_id = req.user.id; // Pegamos o ID de quem está logado através do token JWT

  // Aqui poderíamos adicionar uma verificação se req.user.role === 'professor' ou 'admin'

  try {
    const result = await db.query(
      'INSERT INTO lessons (teacher_id, title, description, instrument, lesson_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [teacher_id, title, description, instrument, lesson_date]
    );
    res.status(201).json({ message: 'Aula criada com sucesso!', lesson: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor ao criar a aula.' });
  }
};

// @desc    Listar todas as aulas com o nome do professor
// @route   GET /api/lessons
// @access  Privado (Alunos/Professores/Admins)
const getLessons = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT l.*, u.name as teacher_name 
       FROM lessons l 
       JOIN users u ON l.teacher_id = u.id 
       ORDER BY l.lesson_date ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar as aulas.' });
  }
};

module.exports = { createLesson, getLessons };