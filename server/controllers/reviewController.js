const db = require('../config/db');

// POST /api/reviews — Criar uma avaliação
const createReview = async (req, res) => {
  const student_id = req.user.id;
  const { lesson_id, rating, comment } = req.body;

  // 1. Validação básica
  if (!lesson_id || !rating) {
    return res.status(400).json({ message: 'lesson_id e rating são obrigatórios.' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'A nota deve ser entre 1 e 5.' });
  }

  try {
    // 2. Busca a aula e valida se pertence ao aluno e está concluída
    const lessonResult = await db.query(
      `SELECT * FROM lessons WHERE id = $1`,
      [lesson_id]
    );

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ message: 'Aula não encontrada.' });
    }

    const lesson = lessonResult.rows[0];

    if (lesson.student_id !== student_id) {
      return res.status(403).json({ message: 'Você não pode avaliar uma aula que não é sua.' });
    }

    if (lesson.status !== 'concluida') {
      return res.status(400).json({ message: 'Só é possível avaliar aulas concluídas.' });
    }

    // 3. Insere a avaliação
    const reviewResult = await db.query(
      `INSERT INTO reviews (student_id, teacher_id, lesson_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [student_id, lesson.teacher_id, lesson_id, rating, comment || null]
    );

    // 4. Recalcula a média do professor (Task 10.2)
    await db.query(
      `UPDATE users
       SET average_rating = (
         SELECT ROUND(AVG(rating)::numeric, 2)
         FROM reviews
         WHERE teacher_id = $1
       )
       WHERE id = $1`,
      [lesson.teacher_id]
    );

    return res.status(201).json({
      message: 'Avaliação enviada com sucesso!',
      review: reviewResult.rows[0]
    });

  } catch (error) {
    // Trata tentativa de avaliação duplicada (constraint UNIQUE)
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Você já avaliou esta aula.' });
    }
    console.error('[createReview] Erro:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// GET /api/reviews/teacher/:teacherId — Buscar avaliações de um professor
const getTeacherReviews = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const result = await db.query(
      `SELECT 
         r.id,
         r.rating,
         r.comment,
         r.created_at,
         u.name AS student_name,
         u.nickname AS student_nickname
       FROM reviews r
       JOIN users u ON r.student_id = u.id
       WHERE r.teacher_id = $1
       ORDER BY r.created_at DESC`,
      [teacherId]
    );

    // Busca a média atual do professor
    const teacherResult = await db.query(
      `SELECT average_rating FROM users WHERE id = $1`,
      [teacherId]
    );

    return res.status(200).json({
      average_rating: teacherResult.rows[0]?.average_rating || null,
      total_reviews: result.rows.length,
      reviews: result.rows
    });

  } catch (error) {
    console.error('[getTeacherReviews] Erro:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

module.exports = { createReview, getTeacherReviews };