const db = require('../config/db');

// @desc    Criar uma nova aula
// @route   POST /api/lessons
// @access  Privado (Professores/Admins)
const createLesson = async (req, res) => {
  const { title, description, instrument, lesson_date } = req.body;
  const teacher_id = req.user.id; // Pegamos o ID de quem está logado através do token JWT

  // Aqui poderíamos adicionar uma verificação se req.user.role === 'professor' ou 'admin'

  // ---> VALIDAÇÃO ADICIONADA AQUI <---
  if (!title || !instrument || !lesson_date) {
    return res.status(400).json({ message: 'Os campos título, instrumento e data da aula são obrigatórios.' });
  }
  // -----------------------------------

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

const getCompletedLessons = async (req, res) => {
  const student_id = req.user.id;
  const { teacherId } = req.params;

  try {
    // AQUI ESTÁ A CORREÇÃO:
    // Trocámos o "NOT IN (SELECT lesson_id...)" por "NOT EXISTS" 
    // verificando as novas colunas target_id e target_type
    const result = await db.query(
      `SELECT id, title, lesson_date 
       FROM lessons 
       WHERE student_id = $1 
         AND teacher_id = $2 
         AND status = 'concluida'
         AND NOT EXISTS (
           SELECT 1 FROM reviews 
           WHERE student_id = $1 
             AND target_id = CAST(lessons.id AS VARCHAR) 
             AND target_type = 'lesson'
         )
       ORDER BY lesson_date DESC`,
      [student_id, teacherId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar aulas concluídas:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

module.exports = { createLesson, getLessons, getCompletedLessons };