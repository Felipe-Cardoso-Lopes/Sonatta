// ==========================================
// IMPORTAÇÕES GLOBAIS
// ==========================================
const db = require('../config/db');
const bcrypt = require('bcryptjs'); // ou 'bcrypt'

// ==========================================
// APROVAÇÃO DE USUÁRIOS
// ==========================================
const approveUser = async (req, res) => {
  const { email, newRole } = req.body;

  if (!email || !newRole) {
    return res.status(400).json({ message: 'E-mail e novo cargo são obrigatórios.' });
  }

  if (newRole !== 'aluno' && newRole !== 'professor') {
    return res.status(400).json({ message: 'Cargo inválido. O usuário deve ser aluno ou professor.' });
  }

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

// ==========================================
// GESTÃO DE PROFESSORES DA INSTITUIÇÃO
// ==========================================

const getTeachers = async (req, res) => {
  const instituicao_id = req.user.id;

  try {
    const result = await db.query(
      `SELECT id, name, email, teacher_type, is_verified, created_at 
       FROM users 
       WHERE role = 'teacher' AND instituicao_id = $1
       ORDER BY created_at DESC`,
      [instituicao_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao listar professores:', error);
    res.status(500).json({ message: 'Erro interno ao buscar professores.' });
  }
};

const createTeacher = async (req, res) => {
  const { name, email, password } = req.body;
  const instituicao_id = req.user.id;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
  }

  try {
    const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Este e-mail já está em uso por outro usuário.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role, teacher_type, instituicao_id, is_verified) 
       VALUES ($1, $2, $3, 'teacher', 'institucional', $4, true) 
       RETURNING id, name, email, role, teacher_type`,
      [name, email, passwordHash, instituicao_id]
    );

    res.status(201).json({
      message: 'Professor cadastrado com sucesso!',
      teacher: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao cadastrar professor:', error);
    res.status(500).json({ message: 'Erro interno ao processar o cadastro.' });
  }
};

// ==========================================
// GESTÃO DO PERFIL PÚBLICO
// ==========================================

const updateProfile = async (req, res) => {
  if (req.user.role !== 'instituicao') {
    return res.status(403).json({ message: 'Acesso negado. Apenas instituições podem alterar este perfil.' });
  }

  const instituicao_id = req.user.id; 
  
  const {
    descricao_longa,
    logo_url,
    banner_url,
    website_url,
    instagram_url,
    linkedin_url,
    facebook_url
  } = req.body;

  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  const urlsParaValidar = { logo_url, banner_url, website_url, instagram_url, linkedin_url, facebook_url };

  for (const [campo, valor] of Object.entries(urlsParaValidar)) {
    if (valor && valor.trim() !== '' && !urlRegex.test(valor)) {
      return res.status(400).json({ message: `O campo ${campo} deve conter uma URL válida.` });
    }
  }

  try {
    const result = await db.query(
      `UPDATE instituicoes 
       SET descricao_longa = COALESCE($1, descricao_longa),
           logo_url = COALESCE($2, logo_url),
           banner_url = COALESCE($3, banner_url),
           website_url = COALESCE($4, website_url),
           instagram_url = COALESCE($5, instagram_url),
           linkedin_url = COALESCE($6, linkedin_url),
           facebook_url = COALESCE($7, facebook_url)
       WHERE id = $8
       RETURNING *`,
      [
        descricao_longa || null,
        logo_url || null,
        banner_url || null,
        website_url || null,
        instagram_url || null,
        linkedin_url || null,
        facebook_url || null,
        instituicao_id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Dados cadastrais da instituição não encontrados.' });
    }

    res.status(200).json({
      message: 'Perfil público atualizado com sucesso!',
      instituicao: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil público da instituição:', error);
    res.status(500).json({ message: 'Erro interno no servidor ao tentar atualizar o perfil.' });
  }
};

module.exports = {
  approveUser,
  getTeachers,
  createTeacher,
  updateProfile
};