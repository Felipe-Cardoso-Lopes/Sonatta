const approveUser = async (req, res) => {
  const { email, newRole } = req.body;
  const db = require('../config/db');

  // 1. Validação de campos obrigatórios
  if (!email || !newRole) {
    return res.status(400).json({ message: 'E-mail e novo cargo são obrigatórios.' });
  }

  // 2. Trava de segurança para impedir cargos inválidos
  if (newRole !== 'aluno' && newRole !== 'professor') {
    return res.status(400).json({ message: 'Cargo inválido. O usuário deve ser aluno ou professor.' });
  }

  // 3. ✅ Bloqueia perfil 'aluno' de executar esta ação
  if (req.user.role === 'aluno') {
    return res.status(403).json({ message: 'Acesso negado. Apenas instituições podem aprovar usuários.' });
  }

  try {
    const userCheck = await db.query('SELECT id, role FROM users WHERE email = $1', [email]);
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Nenhum usuário encontrado com este e-mail.' });
    }

    if (userCheck.rows[0].role === 'super_admin') {
      return res.status(403).json({ message: 'Acesso negado para alterar este perfil.' });
    }

    const result = await db.query(
      'UPDATE users SET role = $1 WHERE email = $2 RETURNING id, name, email, role',
      [newRole, email]
    );

    res.status(200).json({ 
      message: 'Usuário aprovado e vinculado com sucesso!', 
      user: result.rows[0] 
    });

  } catch (error) {
    console.error('Erro ao aprovar usuário:', error);
    res.status(500).json({ message: 'Erro no servidor ao tentar atualizar o status do usuário.' });
  }
};

module.exports = { approveUser }; 