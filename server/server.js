const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// 1. Importação de todas as rotas
const userRoutes = require('./routes/userRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const adminRoutes = require('./routes/adminRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const instituicaoRoutes = require('./routes/instituicaoRoutes');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const messageRoutes = require('./routes/messageRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middlewares Globais
app.use(cors());
app.use(express.json());

// Middleware simples para registrar os acessos no log do Render
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 3. Mapeamento das Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/instituicao', instituicaoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/exercises', exerciseRoutes);

// 4. Rota raiz de verificação
app.get('/', (req, res) => {
  res.send('API do Sonatta está no ar!');
});

// 5. Inicialização do Servidor (Blindado para testes)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

// Exporta o app para o Jest e o Supertest
module.exports = app;