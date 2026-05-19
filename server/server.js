// 1. CARREGAMENTO DAS VARIÁVEIS DE AMBIENTE
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// 2. Importação de todas as rotas
const userRoutes = require("./routes/userRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const adminRoutes = require("./routes/adminRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");
const instituicaoRoutes = require("./routes/instituicaoRoutes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const messageRoutes = require("./routes/messageRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const reportRoutes = require("./routes/reportRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const scheduleRoutes = require('./routes/scheduleRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 3. Configuração do Servidor HTTP e Socket.io
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Disponibiliza o Socket.io para todas as rotas do Express
app.set('io', io);

// 4. Middlewares Globais
app.use(cors());
app.use(express.json());

// Compartilhando o mapa de conexões
const onlineUsers = new Map();
app.set("io", io);
app.set("onlineUsers", onlineUsers);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 5. Mapeamento das Rotas da API
app.use("/api/users", userRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/instituicao", instituicaoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/payments", paymentRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/reviews', reviewRoutes);

app.get("/", (req, res) => {
  res.send("API do Sonatta está no ar com WebSocket!");
});

// 6. Lógica Centralizada de WebSockets
io.on('connection', (socket) => {
  
  socket.on('user_connected', (userId) => {
    const idNum = Number(userId);
    onlineUsers.set(idNum, socket.id);
    socket.join(String(userId)); // Mantém a sala privada da sua Task 5.1
    io.emit('user_status_changed', { userId: idNum, status: 'online' });
    console.log(`🟢 [ONLINE] Usuário ${idNum} conectou! Total online na plataforma: ${onlineUsers.size}`);
  });

  socket.on('check_online', (userId) => {
    const idNum = Number(userId);
    const isOnline = onlineUsers.has(idNum);
    console.log(`🔍 [CHECK] Consultando se usuário ${idNum} está online -> Resposta: ${isOnline ? 'SIM' : 'NÃO'}`);
    socket.emit('online_status', { userId: idNum, isOnline });
  });

  socket.on('typing', ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(Number(receiverId));
    if (receiverSocketId) io.to(receiverSocketId).emit('user_typing', { senderId: Number(senderId) });
  });

  socket.on('stop_typing', ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(Number(receiverId));
    if (receiverSocketId) io.to(receiverSocketId).emit('user_stop_typing', { senderId: Number(senderId) });
  });

  socket.on('leave_room', (userId) => {
    socket.leave(userId);
  });

  socket.on('disconnect', () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit('user_status_changed', { userId, status: 'offline' });
        console.log(`🔴 [OFFLINE] Usuário ${userId} desconectou. Total online: ${onlineUsers.size}`);
        break;
      }
    }
  });
});
// 7. Inicialização do Servidor
if (process.env.NODE_ENV !== "test") {
  httpServer.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

// Exportação para testes
module.exports = { app, httpServer };