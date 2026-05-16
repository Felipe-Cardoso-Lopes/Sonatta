const db = require('../config/db');

// Grava a mensagem e encaminha o payload em tempo real via WebSocket
const sendMessage = async (req, res) => {
  const { receiver_id, message } = req.body;
  const sender_id = req.user.id;

  try {
    const result = await db.query(
      `INSERT INTO messages (sender_id, receiver_id, message, is_read) 
       VALUES ($1, $2, $3, false) 
       RETURNING *, TO_CHAR(created_at, 'HH24:MI') as time`,
      [sender_id, receiver_id, message]
    );
    
    const messagePayload = { ...result.rows[0], isMine: false };
    
    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');
    const receiverSocketId = onlineUsers?.get(Number(receiver_id));
    
    // Dispara a mensagem e o gatilho de notificação se o destinatário estiver ativo
    if (receiverSocketId && io) {
      io.to(receiverSocketId).emit('receive_message', messagePayload);
      io.to(receiverSocketId).emit('message_notification', { 
        sender_id, 
        message: "Você tem uma nova mensagem." 
      });
    }

    res.status(201).json({ ...result.rows[0], isMine: true });
  } catch (error) {
    console.error('Erro ao processar envio de mensagem:', error);
    res.status(500).json({ message: 'Erro ao enviar mensagem.' });
  }
};

// Retorna o histórico e atualiza os registros recebidos como lidos (`is_read: true`)
const getChatHistory = async (req, res) => {
  const { otherUserId } = req.params;
  const userId = req.user.id;

  try {
    await db.query(
      'UPDATE messages SET is_read = true WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false',
      [otherUserId, userId]
    );

    const result = await db.query(
      `SELECT id, sender_id, receiver_id, message, is_read,
              TO_CHAR(created_at, 'HH24:MI') as time 
       FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2) 
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [userId, otherUserId]
    );

    const messages = result.rows.map(msg => ({
      ...msg,
      isMine: msg.sender_id === userId
    }));

    res.json(messages);
  } catch (error) {
    console.error('Erro ao coletar histórico de mensagens:', error);
    res.status(500).json({ message: 'Erro ao buscar histórico.' });
  }
};

// Coleta o agrupamento de mensagens não visualizadas destinadas ao usuário logado
const getUnreadCounts = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(
      `SELECT sender_id, COUNT(*)::int as unread_count 
       FROM messages 
       WHERE receiver_id = $1 AND is_read = false 
       GROUP BY sender_id`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao contabilizar mensagens não lidas:', error);
    res.status(500).json({ message: 'Erro ao processar notificações.' });
  }
};

module.exports = { sendMessage, getChatHistory, getUnreadCounts };