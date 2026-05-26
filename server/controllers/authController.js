const db = require('../config/db');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Configuração do serviço de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Adicionado nickname na busca do banco de dados
    const query = 'SELECT id, name, nickname, email, password_hash, role, is_verified, teacher_type FROM users WHERE email = $1';
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }

    const user = result.rows[0];

    // Comparação de senha com bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Por favor, confirme seu e-mail antes de acessar.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secreta_super_segura',
      { expiresIn: '1d' }
    );

    // Chaves de resposta ajustadas para combinar com o que o Login.jsx espera
    res.status(200).json({
      token,
      id: user.id,
      role: user.role,
      name: user.name,
      nickname: user.nickname,
      teacherType: user.teacher_type || 'institucional'
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// VERIFICAÇÃO DE EMAIL
const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'E-mail é obrigatório.' });
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expirationTime = new Date(Date.now() + 15 * 60000);

  try {
    const userExists = await db.query('SELECT id, is_verified FROM users WHERE email = $1', [email]);
    
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (userExists.rows[0].is_verified) {
      return res.status(400).json({ message: 'Este e-mail já está verificado.' });
    }

    await db.query(
      'UPDATE users SET verification_code = $1, verification_expires = $2 WHERE email = $3',
      [verificationCode, expirationTime, email]
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Sonatta - Seu código de verificação',
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px; background-color: #121212; color: #ffffff;">
          <h2>Bem-vindo à Sonatta!</h2>
          <p style="color: #a3a3a3;">Aqui está o seu código de verificação. Ele expira em 15 minutos.</p>
          <h1 style="background: #1a1a1a; border: 1px solid #333; padding: 15px; letter-spacing: 8px; color: #a855f7; border-radius: 8px;">
            ${verificationCode}
          </h1>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Código enviado com sucesso.' });

  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ message: 'Erro no servidor ao enviar o e-mail.' });
  }
};

const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'E-mail e código são obrigatórios.' });
  }

  try {
    const result = await db.query(
      'SELECT id, verification_code, verification_expires FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const user = result.rows[0];

    if (user.verification_code !== code) {
      return res.status(400).json({ message: 'Código inválido.' });
    }

    if (new Date() > new Date(user.verification_expires)) {
      return res.status(400).json({ message: 'Código expirado. Solicite um novo.' });
    }

    await db.query(
      'UPDATE users SET is_verified = true, verification_code = NULL, verification_expires = NULL WHERE email = $1',
      [email]
    );

    res.status(200).json({ message: 'E-mail verificado com sucesso!' });
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

const registerInstituicao = async (req, res) => {
  const { nome, email, senha, telefone, cidade } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
  }

  try {
    // 1. Verifica se já existe usuário com este email
    const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Já existe uma conta com este e-mail.' });
    }

    // 2. Cria a escola com status 'pendente'
    const schoolResult = await db.query(
      `INSERT INTO instituicoes (nome, email, telefone, cidade, status)
       VALUES ($1, $2, $3, $4, 'pendente') RETURNING *`,
      [nome, email, telefone || null, cidade || null]
    );

    const school = schoolResult.rows[0];

    // 3. Cria o usuário administrador vinculado à escola
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(senha, salt);

    const userResult = await db.query(
      `INSERT INTO users (name, email, password_hash, role, instituicao_id, is_verified)
       VALUES ($1, $2, $3, 'instituicao', $4, false) RETURNING id, name, email, role`,
      [nome, email, password_hash, school.id]
    );

    res.status(201).json({
      message: 'Cadastro realizado! Aguarde a aprovação da equipe Sonatta para acessar a plataforma.',
      institution: { id: school.id, nome: school.nome, status: school.status }
    });

  } catch (error) {
    console.error('Erro ao cadastrar instituição:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

module.exports = { login, sendVerificationEmail, verifyEmailCode, registerInstituicao };