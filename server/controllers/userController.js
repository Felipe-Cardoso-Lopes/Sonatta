const registerUser = async (req, res) => {
  // Agora recebemos também o inviteCode do frontend
  const { name, email, password, inviteCode } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios.' });
  }

  // O padrão continua sendo 'pending' e sem vínculo (null)
  let userRole = 'pending';
  let instituicao_id = null;

  try {
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Usuário já cadastrado com este e-mail.' });
    }

    // Lógica do Código de Convite
    if (inviteCode && inviteCode.trim() !== '') {
      // Procura a instituição que possui este código exato
      const schoolResult = await db.query(
        'SELECT id, codigo_aluno, codigo_professor FROM instituicoes WHERE codigo_aluno = $1 OR codigo_professor = $1',
        [inviteCode.trim()]
      );

      if (schoolResult.rows.length === 0) {
        return res.status(400).json({ message: 'Código de convite inválido. Verifique com a sua instituição.' });
      }

      const escola = schoolResult.rows[0];
      instituicao_id = escola.id; // Guarda o ID da escola para salvar no usuário

      // Define se o código usado foi o de aluno ou de professor
      if (inviteCode.trim() === escola.codigo_aluno) {
        userRole = 'aluno';
      } else if (inviteCode.trim() === escola.codigo_professor) {
        userRole = 'professor';
      }
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // O INSERT agora envia o instituicao_id para o Supabase
    const newUser = await db.query(
      'INSERT INTO users (name, email, password_hash, role, instituicao_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, instituicao_id',
      [name, email, password_hash, userRole, instituicao_id]
    );

    const user = newUser.rows[0];

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      instituicao_id: user.instituicao_id,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};