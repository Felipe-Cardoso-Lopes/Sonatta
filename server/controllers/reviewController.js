const db = require('../config/db');

const createReview = async (req, res) => {
  const studentId = req.user.id;
  const { target_id, target_type, rating, comment } = req.body;

  try {
    const query = `
      INSERT INTO reviews (student_id, target_id, target_type, rating, comment)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (student_id, target_id, target_type) 
      DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, created_at = NOW()
      RETURNING *;
    `;
    const result = await db.query(query, [studentId, target_id, target_type, rating, comment]);
    
    // ========================================================
    // 🔔 SISTEMA DE NOTIFICAÇÃO AO PROFESSOR
    // ========================================================
    let teacherIdToNotify = null;
    let messageToNotify = '';

    if (target_type === 'teacher') {
      teacherIdToNotify = target_id;
      messageToNotify = `Recebeu uma nova avaliação de ⭐ ${rating} no seu perfil!`;
    } else if (target_type === 'lesson') {
      const getTeacher = await db.query(`SELECT teacher_id FROM lessons WHERE id = $1`, [target_id]);
      if(getTeacher.rows.length > 0) teacherIdToNotify = getTeacher.rows[0].teacher_id;
      messageToNotify = `A sua aula ao vivo recebeu uma avaliação de ⭐ ${rating}!`;
    } else if (target_type === 'course_class') {
      // CORREÇÃO: Alterado de "FROM classes" para "FROM module_classes"
      const getTeacher = await db.query(`
        SELECT co.teacher_id 
        FROM module_classes c 
        JOIN modules m ON c.module_id = m.id 
        JOIN courses co ON m.course_id = co.id 
        WHERE c.id = CAST($1 AS INTEGER)
      `, [target_id]);
      if(getTeacher.rows.length > 0) teacherIdToNotify = getTeacher.rows[0].teacher_id;
      messageToNotify = `Uma aula do seu curso gravado recebeu uma avaliação de ⭐ ${rating}!`;
    }

    if (teacherIdToNotify) {
      try {
        await db.query(`
          INSERT INTO notifications (user_id, title, message, type, read, created_at)
          VALUES ($1, 'Nova Avaliação! 🎉', $2, 'review', false, NOW())
        `, [teacherIdToNotify, messageToNotify]);
      } catch (err) {
        console.log('Notificação ignorada: A tabela de notificações não existe ou a estrutura é diferente.');
      }
    }

    res.status(201).json({ message: 'Avaliação guardada com sucesso!', review: result.rows[0] });
  } catch (error) {
    console.error('Erro ao salvar review:', error);
    res.status(500).json({ message: 'Erro interno ao salvar a avaliação.' });
  }
};

const getTargetReviews = async (req, res) => {
  const { target_type, target_id } = req.params;

  try {
    let aggregateQuery;
    let commentsQuery;
    let queryParams = [target_id];

    if (target_type === 'teacher') {
      // CORREÇÃO: Alterado de "FROM classes" para "FROM module_classes" nas subqueries
      aggregateQuery = `
        SELECT ROUND(AVG(rating), 1) as average_rating, COUNT(*) as total_reviews 
        FROM reviews 
        WHERE (target_type = 'teacher' AND target_id = CAST($1 AS VARCHAR))
           OR (target_type = 'lesson' AND target_id IN (
                SELECT CAST(id AS VARCHAR) FROM lessons WHERE teacher_id = CAST($1 AS INTEGER)
           ))
           OR (target_type = 'course_class' AND target_id IN (
                SELECT CAST(c.id AS VARCHAR) 
                FROM module_classes c
                JOIN modules m ON c.module_id = m.id
                JOIN courses co ON m.course_id = co.id
                WHERE co.teacher_id = CAST($1 AS INTEGER)
           ))
      `;

      commentsQuery = `
        SELECT r.rating, r.comment, r.created_at, u.name as student_name
        FROM reviews r
        JOIN users u ON r.student_id = u.id
        WHERE (
             (r.target_type = 'teacher' AND r.target_id = CAST($1 AS VARCHAR))
          OR (r.target_type = 'lesson' AND r.target_id IN (
                SELECT CAST(id AS VARCHAR) FROM lessons WHERE teacher_id = CAST($1 AS INTEGER)
             ))
          OR (r.target_type = 'course_class' AND r.target_id IN (
                SELECT CAST(c.id AS VARCHAR) 
                FROM module_classes c
                JOIN modules m ON c.module_id = m.id
                JOIN courses co ON m.course_id = co.id
                WHERE co.teacher_id = CAST($1 AS INTEGER)
             ))
        )
        AND r.comment IS NOT NULL AND r.comment != '' 
        ORDER BY r.created_at DESC LIMIT 5
      `;
    } else {
      aggregateQuery = `
        SELECT ROUND(AVG(rating), 1) as average_rating, COUNT(*) as total_reviews 
        FROM reviews WHERE target_type = $1 AND target_id = CAST($2 AS VARCHAR)
      `;
      commentsQuery = `
        SELECT r.rating, r.comment, r.created_at, u.name as student_name
        FROM reviews r
        JOIN users u ON r.student_id = u.id
        WHERE r.target_type = $1 AND r.target_id = CAST($2 AS VARCHAR) AND r.comment IS NOT NULL AND r.comment != '' 
        ORDER BY r.created_at DESC LIMIT 5
      `;
      queryParams = [target_type, target_id];
    }

    const aggResult = await db.query(aggregateQuery, queryParams);
    const commentsResult = await db.query(commentsQuery, queryParams);

    res.json({
      summary: {
        average: aggResult.rows[0].average_rating || 0,
        total: parseInt(aggResult.rows[0].total_reviews) || 0
      },
      recent_comments: commentsResult.rows
    });
  } catch (error) {
    console.error('Erro ao buscar reviews:', error);
    res.status(500).json({ message: 'Erro ao carregar avaliações.' });
  }
};

module.exports = { createReview, getTargetReviews };