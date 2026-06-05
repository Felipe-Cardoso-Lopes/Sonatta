const db = require('../config/db');

// Adicionar novo bloco de disponibilidade
exports.addAvailability = async (req, res) => {
  const teacher_id = req.user.id; // Vem do authMiddleware
  const { day_of_week, start_time, end_time } = req.body;

  try {
    // 1. Validação rigorosa de sobreposição de horários (Overlap)
    const overlapCheck = await db.query(
      `SELECT id FROM teacher_availabilities 
       WHERE teacher_id = $1 AND day_of_week = $2 
       AND (
         (start_time < $4 AND end_time > $3) -- A lógica central de colisão
       )`,
      [teacher_id, day_of_week, start_time, end_time]
    );

    if (overlapCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Este horário entra em conflito com uma disponibilidade já cadastrada.' });
    }

    // 2. Inserção do horário livre
    const result = await db.query(
      `INSERT INTO teacher_availabilities (teacher_id, day_of_week, start_time, end_time) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [teacher_id, day_of_week, start_time, end_time]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao adicionar disponibilidade:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// Obter disponibilidade de um professor específico (Aberto para alunos consultarem)
exports.getTeacherAvailability = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const result = await db.query(
      `SELECT id, day_of_week, start_time, end_time 
       FROM teacher_availabilities 
       WHERE teacher_id = $1 
       ORDER BY day_of_week, start_time`,
      [teacherId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar disponibilidade:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// Remover um slot de horário específico
exports.deleteAvailability = async (req, res) => {
  const teacher_id = req.user.id;
  const { id } = req.params;

  try {
    const result = await db.query(
      `DELETE FROM teacher_availabilities WHERE id = $1 AND teacher_id = $2 RETURNING *`,
      [id, teacher_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Horário não encontrado ou sem permissão.' });
    }

    res.status(200).json({ message: 'Horário removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover disponibilidade:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// Agendar uma nova aula (Ação do Aluno)
exports.bookClass = async (req, res) => {
  const student_id = req.user.id; // Vem do token JWT de quem está logado
  const { teacher_id, course_id, appointment_date, start_time, end_time } = req.body;

  try {
    // 1. Verificação de "Double Booking" (Conflito de Horário)
    // Impede que duas pessoas agendem exatamente no mesmo bloco de tempo
    const conflictCheck = await db.query(
      `SELECT id FROM appointments 
       WHERE teacher_id = $1 AND appointment_date = $2 
       AND (start_time < $4 AND end_time > $3) 
       AND status != 'canceled'`,
      [teacher_id, appointment_date, start_time, end_time]
    );

    if (conflictCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Ops! O professor já possui uma aula agendada neste exato horário.' });
    }

    // 2. Confirma a Reserva no Banco de Dados
    const result = await db.query(
      `INSERT INTO appointments (student_id, teacher_id, course_id, appointment_date, start_time, end_time, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'confirmed') RETURNING *`,
      [student_id, teacher_id, course_id, appointment_date, start_time, end_time]
    );

    const newAppointment = result.rows[0];

    // 3. Notificação Instantânea via Socket.io
    // Pega a instância do IO e manda um evento direto para a "sala" privada do professor
    const io = req.app.get('io');
    if (io) {
      io.to(teacher_id.toString()).emit('new_appointment', {
        title: 'Novo Agendamento! 🎵',
        message: `Uma nova aula foi marcada para o dia ${appointment_date} às ${start_time}.`,
        data: newAppointment
      });
    }

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Erro ao processar agendamento:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao tentar agendar a aula.' });
  }
};