const db = require('../config/db');

// Enviar uma nova mensagem
const sendMessage = async (req, res) => {
  const { receiver_id, message } = req.body;
  const sender_id = req.user.id; // Pegamos do token autenticado

  try {
    const result = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *',
      [sender_id, receiver_id, message]
    );
    
    // Retorna a mensagem formatada para o front-end
    const novaMensagem = { ...result.rows[0], isMine: true };
    res.status(201).json(novaMensagem);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ message: 'Erro ao enviar mensagem.' });
  }
};

// Buscar histórico de chat com um usuário específico
const getChatHistory = async (req, res) => {
  const { otherUserId } = req.params;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT id, sender_id, receiver_id, message, 
              TO_CHAR(created_at, 'HH24:MI') as time 
       FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2) 
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [userId, otherUserId]
    );

    // Mapeia as mensagens para dizer se foram enviadas pelo usuário logado
    const messages = result.rows.map(msg => ({
      ...msg,
      isMine: msg.sender_id === userId
    }));

    res.json(messages);
  } catch (error) {
    console.error('Erro ao buscar chat:', error);
    res.status(500).json({ message: 'Erro ao buscar histórico.' });
  }
};

module.exports = { sendMessage, getChatHistory };