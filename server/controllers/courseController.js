const db = require('../config/db');

// ================= ÁREA DO PROFESSOR =================

// 1. Criar um novo curso
const createCourse = async (req, res) => {
  const { title, description, instrument } = req.body;
  const teacher_id = req.user.id; // Pegamos o ID do token de autenticação

  try {
    const result = await db.query(
      'INSERT INTO courses (title, description, instrument, teacher_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, instrument, teacher_id]
    );
    res.status(201).json({ message: 'Curso criado com sucesso!', course: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    res.status(500).json({ message: 'Erro ao criar curso.' });
  }
};

// 2. Buscar cursos do professor (com contagem de alunos)
const getTeacherCourses = async (req, res) => {
  const teacher_id = req.user.id;
  try {
    const result = await db.query(`
      SELECT c.*, 
             (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as students_count
      FROM courses c
      WHERE c.teacher_id = $1
      ORDER BY c.created_at DESC
    `, [teacher_id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar seus cursos.' });
  }
};

// 3. Buscar alunos matriculados nos cursos do professor
const getTeacherStudents = async (req, res) => {
  const teacher_id = req.user.id;
  try {
    const result = await db.query(`
      SELECT u.id, u.name, u.nickname, c.title as course_title, e.progress, e.enrolled_at
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      WHERE c.teacher_id = $1
      ORDER BY e.enrolled_at DESC
    `, [teacher_id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar alunos.' });
  }
};


// ================= ÁREA DO ALUNO =================

// 4. Buscar todos os cursos para o aluno (mostrando se ele já está matriculado)
const getAllCoursesForStudent = async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await db.query(`
      SELECT c.*, u.name as professor,
             EXISTS(SELECT 1 FROM enrollments e WHERE e.course_id = c.id AND e.user_id = $1) as is_enrolled
      FROM courses c
      JOIN users u ON c.teacher_id = u.id
      ORDER BY c.created_at DESC
    `, [user_id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar catálogo de cursos.' });
  }
};

// 5. Matricular o aluno em um curso
const enrollStudent = async (req, res) => {
  const { course_id } = req.body;
  const user_id = req.user.id;

  try {
    await db.query(
      'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2)',
      [user_id, course_id]
    );
    res.status(201).json({ message: 'Matrícula realizada com sucesso!' });
  } catch (error) {
    // Código 23505 é violação de chave única no Postgres (Aluno já matriculado)
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Você já está matriculado neste curso.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Erro ao realizar matrícula.' });
  }
};

module.exports = { createCourse, getTeacherCourses, getTeacherStudents, getAllCoursesForStudent, enrollStudent };