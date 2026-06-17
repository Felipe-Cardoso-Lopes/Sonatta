const db = require('../config/db');

// @desc    Obter a lista de alunos do professor
// @route   GET /api/teachers/students
// @access  Privado (Apenas Professores)
const getTeacherStudents = async (req, res) => {
  const teacher_id = req.user.id;

  try {
    // Busca alunos únicos através de agendamentos confirmados ou concluídos com esse professor
    const result = await db.query(
      `SELECT DISTINCT u.id, u.name, u.nickname, u.email, u.avatar_url 
       FROM users u
       JOIN appointments a ON a.student_id = u.id
       WHERE a.teacher_id = $1 AND a.status IN ('confirmed', 'completed')`,
      [teacher_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar alunos do professor:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao buscar alunos.' });
  }
};

// @desc    Atualizar a vitrine pública do professor (Showcase)
// @route   PUT /api/teachers/showcase
// @access  Privado (Apenas Professores)
const updateTeacherShowcase = async (req, res) => {
  const teacher_id = req.user.id;
  const { specialty, bio, youtube_intro_url, spotify_artist_url, offers_trial_lesson } = req.body;

  try {
    const result = await db.query(
      `UPDATE users 
       SET specialty = $1, bio = $2, youtube_intro_url = $3, spotify_artist_url = $4, offers_trial_lesson = $5 
       WHERE id = $6 AND role = 'professor'
       RETURNING id, name, specialty, bio, youtube_intro_url, spotify_artist_url, offers_trial_lesson`,
      [specialty, bio, youtube_intro_url, spotify_artist_url, offers_trial_lesson, teacher_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Professor não encontrado ou permissão negada.' });
    }

    res.status(200).json({ message: 'Vitrine atualizada com sucesso!', data: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar vitrine:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao atualizar vitrine.' });
  }
};

module.exports = { getTeacherStudents, updateTeacherShowcase };