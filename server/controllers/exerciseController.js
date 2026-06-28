const db = require('../config/db');

// Criar um novo exercício na trilha do curso
const createExercise = async (req, res) => {
  const { course_id, title, type, description, order_index } = req.body;
  
  try {
    const result = await db.query(
      `INSERT INTO exercises (course_id, title, type, description, order_index) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [course_id, title, type || 'Prática', description, order_index || 0]
    );
    
    res.status(201).json({ message: 'Exercício criado com sucesso!', exercise: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar exercício:', error);
    res.status(500).json({ message: 'Erro ao criar exercício.' });
  }
};

// Buscar exercícios de um curso específico
const getExercisesByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const result = await db.query(
      'SELECT * FROM exercises WHERE course_id = $1 ORDER BY order_index ASC, id ASC',
      [courseId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar exercícios:', error);
    res.status(500).json({ message: 'Erro ao buscar exercícios.' });
  }
};

// Buscar progresso dos exercícios para o aluno autenticado
const getStudentExerciseProgress = async (req, res) => {
  const { courseId } = req.params;
  const user_id = req.user.id;

  try {
    // 1. Validar matrícula
    const checkEnrollment = await db.query(
      'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [user_id, courseId]
    );

    if (checkEnrollment.rows.length === 0) {
      return res.status(403).json({ message: 'Aluno não matriculado neste curso.' });
    }

    // 2. Buscar todos os exercícios do curso ordenados
    const exercisesResult = await db.query(
      'SELECT * FROM exercises WHERE course_id = $1 ORDER BY order_index ASC, id ASC',
      [courseId]
    );
    const exercises = exercisesResult.rows;

    // 3. Buscar respostas do aluno
    const progressResult = await db.query(
      'SELECT exercise_id, answer_text, completed FROM student_exercise_progress WHERE student_id = $1 AND course_id = $2',
      [user_id, courseId]
    );
    const progressMap = {};
    progressResult.rows.forEach(p => {
      progressMap[p.exercise_id] = p;
    });

    // 4. Montar resposta unificada
    const trail = exercises.map(ex => ({
      ...ex,
      answer_text: progressMap[ex.id]?.answer_text || '',
      completed: progressMap[ex.id]?.completed || false
    }));

    res.json(trail);
  } catch (error) {
    console.error('Erro ao buscar progresso dos exercícios:', error);
    res.status(500).json({ message: 'Erro ao buscar progresso dos exercícios.' });
  }
};

// Submeter resposta do exercício
const submitExercise = async (req, res) => {
  const { exerciseId } = req.params;
  const { courseId, answer_text } = req.body;
  const user_id = req.user.id;

  if (!courseId) {
    return res.status(400).json({ message: 'O ID do curso é obrigatório.' });
  }

  try {
    // 1. Validar matrícula
    const checkEnrollment = await db.query(
      'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [user_id, courseId]
    );

    if (checkEnrollment.rows.length === 0) {
      return res.status(403).json({ message: 'Aluno não matriculado neste curso.' });
    }

    // 2. Validar se o exercício pertence ao curso
    const exerciseCheck = await db.query(
      'SELECT id FROM exercises WHERE id = $1 AND course_id = $2',
      [exerciseId, courseId]
    );

    if (exerciseCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Exercício não encontrado neste curso.' });
    }

    // 3. Inserir ou Atualizar progresso (Idempotente)
    await db.query(
      `INSERT INTO student_exercise_progress (student_id, course_id, exercise_id, answer_text, completed)
       VALUES ($1, $2, $3, $4, TRUE)
       ON CONFLICT (student_id, exercise_id) DO UPDATE 
       SET answer_text = EXCLUDED.answer_text, completed = TRUE, completed_at = CURRENT_TIMESTAMP`,
      [user_id, courseId, exerciseId, answer_text || '']
    );

    res.json({ message: 'Exercício concluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao submeter exercício:', error);
    res.status(500).json({ message: 'Erro ao submeter exercício.' });
  }
};

module.exports = { createExercise, getExercisesByCourse, getStudentExerciseProgress, submitExercise };