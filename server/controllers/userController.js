// server/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  // Verifica se o header de autorização existe e começa com a palavra 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrai apenas o token da string "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Decodifica e verifica o token utilizando a chave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Anexa o payload decodificado (ID e role) à requisição
      req.user = { id: decoded.id, role: decoded.role };

      // Passa o controle para a próxima função (encerra a execução deste middleware)
      return next(); 
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Não autorizado, token inválido ou expirado.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, nenhum token fornecido.' });
  }
};

module.exports = { protect };