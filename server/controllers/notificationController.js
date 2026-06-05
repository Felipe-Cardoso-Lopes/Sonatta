const db = require('../config/db');

// Buscar notificações não lidas do usuário logado
exports.getUnreadNotifications = async (req, res) => {
  const user_id = req.user.id; // Vem do middleware de autenticação (JWT)

  try {
    const result = await db.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 AND is_read = FALSE 
       ORDER BY created_at DESC 
       LIMIT 20`, // Limita para não sobrecarregar a interface
      [user_id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao buscar notificações.' });
  }
};

// Marcar uma notificação específica como lida
exports.markAsRead = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE notifications SET is_read = TRUE 
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Notificação não encontrada ou sem permissão.' });
    }

    res.status(200).json({ message: 'Notificação marcada como lida com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar notificação:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};