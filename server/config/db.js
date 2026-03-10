// server/config/db.js

const { Pool } = require('pg');
require('dotenv').config(); // Carrega as variáveis do arquivo .env

// Cria uma nova "pool" de conexões com o banco de dados
// A connection string é lida do seu arquivo .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Necessário para conexões externas com Supabase
});

pool.on('error', (err, client) => {
  console.error('Erro inesperado no banco de dados', err);
  process.exit(-1);
});

// Exporta um objeto com um método query para ser usado em outros arquivos
module.exports = {
  query: (text, params) => pool.query(text, params),
};