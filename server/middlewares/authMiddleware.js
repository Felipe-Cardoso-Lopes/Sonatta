const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = { id: decoded.id, role: decoded.role };

      // SOLUÇÃO: 'return' adicionado para encerrar o fluxo após o sucesso
      return next(); 
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('Falha na verificação do token:', error.message);
      }
      // SOLUÇÃO: 'return' adicionado para evitar ERR_HTTP_HEADERS_SENT
      return res.status(401).json({ message: 'Não autorizado, token inválido ou expirado.' });
    }
  }

  // Se o loop terminou e nenhum token foi encontrado:
  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, nenhum token fornecido.' });
  }
}; // <-- A CHAVE DO verifyToken FECHA AQUI!

// A função checkRole fica de fora, isolada
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado: privilégios insuficientes.' });
    }
    next();
  };
};

module.exports = { verifyToken, checkRole };