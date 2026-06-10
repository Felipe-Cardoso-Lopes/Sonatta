const db = require('../config/db');

// ================= ÁREA DO PROFESSOR =================

const createCourse = async (req, res) => {
  const { title, description, instrument } = req.body;
  const teacher_id = req.user.id; 

  try {
    const result = await db.query(
      'INSERT INTO courses (title, description, instrument, teacher_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, instrument, teacher_id]
    );
    res.status(201).json({ message: 'Curso criado com sucesso!', course: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    res.status(500).json({ message: 'Erro ao criar curso no banco de dados.' });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, instrument } = req.body;
  const teacher_id = req.user.id; 

  try {
    const checkOwnership = await db.query('SELECT * FROM courses WHERE id = $1 AND teacher_id = $2', [id, teacher_id]);
    
    if (checkOwnership.rows.length === 0) {
      return res.status(403).json({ message: 'Curso não encontrado ou sem permissão para editá-lo.' });
    }

    const result = await db.query(
      'UPDATE courses SET title = $1, description = $2, instrument = $3 WHERE id = $4 RETURNING *',
      [title, description, instrument, id]
    );

    res.json({ message: 'Curso atualizado com sucesso!', course: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
    res.status(500).json({ message: 'Erro ao atualizar curso.' });
  }
};

const getTeacherCourses = async (req, res) => {
  const teacher_id = req.user.id;
  try {
    const result = await db.query(
      `SELECT c.*, COUNT(e.user_id) as students_count 
       FROM courses c 
       LEFT JOIN enrollments e ON c.id = e.course_id 
       WHERE c.teacher_id = $1 
       GROUP BY c.id`, 
      [teacher_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar cursos.' });
  }
};

const getTeacherStudents = async (req, res) => {
  const teacher_id = req.user.id;
  try {
    const result = await db.query(
      `SELECT DISTINCT u.id, u.name, u.email, c.title as course_title, e.progress
       FROM users u
       JOIN enrollments e ON u.id = e.user_id
       JOIN courses c ON e.course_id = c.id
       WHERE c.teacher_id = $1`, 
      [teacher_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar alunos do professor:', error);
    res.status(500).json({ message: 'Erro ao buscar alunos.' });
  }
};

// ================= ÁREA DO ALUNO =================

const getAllCoursesForStudent = async (req, res) => {
  const student_id = req.user.id; // Pega o ID do aluno que está acessando
  try {
    const result = await db.query(
      `SELECT 
        c.id, c.title, c.instrument, c.description, c.teacher_id, 
        u.name as teacher_name,
        EXISTS(SELECT 1 FROM enrollments e WHERE e.course_id = c.id AND e.user_id = $1) as is_enrolled
       FROM courses c 
       JOIN users u ON c.teacher_id = u.id`,
       [student_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar todos os cursos:', error);
    res.status(500).json({ message: 'Erro interno ao buscar cursos.' });
  }
};

const getEnrolledCourses = async (req, res) => {
  const student_id = req.user.id;
  try {
    const result = await db.query(
      `SELECT c.id, c.title, c.instrument, c.description, u.name as teacher_name, e.progress
       FROM courses c 
       JOIN enrollments e ON c.id = e.course_id 
       JOIN users u ON c.teacher_id = u.id
       WHERE e.user_id = $1`,
      [student_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar cursos matriculados:', error);
    res.status(500).json({ message: 'Erro interno ao buscar matrículas.' });
  }
};

// F16/F19 - Matricular aluno num curso
// F16/F19 - Matricular aluno num curso
const enrollStudent = async (req, res) => {
  const { course_id } = req.body;
  const user_id = req.user.id; // ID do utilizador que vem do verifyToken

  if (!course_id) {
    return res.status(400).json({ message: 'O ID do curso é obrigatório.' });
  }

  try {
    // 1. Verifica se o aluno tem um vínculo com instituição
    const userCheck = await db.query(
      'SELECT instituicao_id FROM users WHERE id = $1',
      [user_id]
    );

    if (userCheck.rows.length === 0 || !userCheck.rows[0].instituicao_id) {
      return res.status(403).json({ message: 'Apenas alunos vinculados a uma instituição podem se matricular em cursos.' });
    }

    // 2. Verifica se o aluno já está matriculado
    const check = await db.query(
      'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [user_id, course_id]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({ message: 'Você já está matriculado neste curso.' });
    }

    // 3. Realiza a matrícula
    await db.query(
      'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2)',
      [user_id, course_id]
    );

    res.status(201).json({ message: 'Matrícula realizada com sucesso!' });
  } catch (error) {
    console.error('Erro na matrícula:', error);
    res.status(500).json({ message: 'Erro interno ao realizar matrícula.' });
  }
};

const unenrollStudent = async (req, res) => {
  const { course_id, student_id } = req.body; // Aceita desmatricular o próprio aluno ou o professor remover o aluno
  const targetId = student_id || req.user.id;

  try {
    await db.query('DELETE FROM enrollments WHERE user_id = $1 AND course_id = $2', [targetId, course_id]);
    res.json({ message: 'Matrícula cancelada com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao desmatricular.' });
  }
};


module.exports = { 
  createCourse, 
  updateCourse, 
  getTeacherCourses, 
  getTeacherStudents, 
  getAllCoursesForStudent, 
  getEnrolledCourses,
  enrollStudent,
  unenrollStudent
};