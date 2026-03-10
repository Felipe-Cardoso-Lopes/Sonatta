const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Usuário já cadastrado' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const dbRole = role === 'student' ? 'aluno' : (role === 'teacher' ? 'professor' : 'aluno');
    const newUser = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, dbRole]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor ao registrar' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: 'E-mail ou senha incorretos' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'E-mail ou senha incorretos' });

    if (!user.is_complete) {
        return res.status(403).json({ 
          message: 'Por favor, conclua seu cadastro primeiro.',
          incomplete: true,
          userId: user.id 
        });
      }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.nickname || user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor ao logar' });
  }
};

// ADICIONE ESTA FUNÇÃO PARA CORRIGIR O ERRO
const updateUserProfile = async (req, res) => {
  try {
    // O 'req.user.id' vem do middleware 'protect'
    const { name, email } = req.body;
    const updatedUser = await db.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role',
      [name, email, req.user.id]
    );
    res.json(updatedUser.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
};

// Função para o formulário About You
const completeRegistration = async (req, res) => {
  const { id } = req.params; // ID que vem da URL
  const { nickname, birth_date, gender } = req.body;

  try {
    await db.query(
      `UPDATE users 
       SET nickname = $1, birth_date = $2, gender = $3, is_complete = true 
       WHERE id = $4`,
      [nickname, birth_date, gender, id]
    );
    res.json({ message: 'Cadastro concluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ATUALIZE O EXPORT PARA INCLUIR A NOVA FUNÇÃO
module.exports = { registerUser, loginUser, updateUserProfile, completeRegistration };