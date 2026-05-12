// 1. CARREGAMENTO DAS VARIÁVEIS DE AMBIENTE (SEMPRE NO TOPO)
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const http = require('http'); // Novo: Módulo HTTP nativo do Node
const { Server } = require('socket.io'); // Novo: Importação do Socket.io

// 2. Importação de todas as rotas
const userRoutes = require('./routes/userRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const adminRoutes = require('./routes/adminRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const instituicaoRoutes = require('./routes/instituicaoRoutes');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const messageRoutes = require('./routes/messageRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 3. Configuração do Servidor HTTP e Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Na produção, limite isso à URL do seu frontend (ex: http://localhost:5173)
    methods: ["GET", "POST"]
  }
});

// 4. Middlewares Globais
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 5. Mapeamento das Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/instituicao', instituicaoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('API do Sonatta está no ar com WebSocket!');
});

// 6. Lógica de WebSockets (Task 5.1 - Salas por Usuário)
io.on('connection', (socket) => {
  console.log(`🟢 Novo cliente conectado via WebSocket: ${socket.id}`);

  // Ouve o evento do frontend quando um usuário loga
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`👤 Usuário [${userId}] entrou na sala privada: ${userId}`);
  });

  // (Opcional) Listener para sair da sala ao fazer logout
  socket.on('leave_room', (userId) => {
    socket.leave(userId);
    console.log(`👋 Usuário [${userId}] saiu da sala privada.`);
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Cliente desconectado: ${socket.id}`);
  });
});

// 7. Inicialização do Servidor (Usando o 'server' do HTTP em vez do 'app')
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

// Exporta o app e o server para uso em testes ou em outros arquivos
module.exports = { app, server };