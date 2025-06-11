// server/config/db.js

const { Pool } = require('pg');
require('dotenv').config(); // Carrega as variáveis do arquivo .env

// Cria uma nova "pool" de conexões com o banco de dados
// A connection string é lida do seu arquivo .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Exporta um objeto com um método query para ser usado em outros arquivos
module.exports = {
  query: (text, params) => pool.query(text, params),
};