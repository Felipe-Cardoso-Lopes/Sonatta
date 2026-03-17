// server/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API do Sonatta está no ar!');
});

// Usa as rotas de usuário para qualquer URL que comece com /api/users
app.use('/api/users', userRoutes);

// Apenas inicia o servidor se o ambiente não for de teste
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

// Exporta o app para o Jest e o Supertest
module.exports = app;