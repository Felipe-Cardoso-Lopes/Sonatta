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

module.exports = { createExercise, getExercisesByCourse };