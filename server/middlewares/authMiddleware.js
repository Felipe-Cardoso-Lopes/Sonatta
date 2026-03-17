// server/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = { id: decoded.id, role: decoded.role };

      // SOLUÇÃO: 'return' adicionado para encerrar o fluxo após o sucesso
      return next(); 
    } catch (error) {
      console.error(error);
      // SOLUÇÃO: 'return' adicionado para evitar ERR_HTTP_HEADERS_SENT
      return res.status(401).json({ message: 'Não autorizado, token inválido ou expirado.' });
    }
  }

  if (!token) {
    // SOLUÇÃO: 'return' adicionado aqui também
    return res.status(401).json({ message: 'Não autorizado, nenhum token fornecido.' });
  }
};

module.exports = { protect };