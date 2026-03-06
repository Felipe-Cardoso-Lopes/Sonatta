// server/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Se houver uma URL no .env, usamos ela. Caso contrário, usamos o modo local.
const isProduction = process.env.DATABASE_URL ? true : false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // O SSL é OBRIGATÓRIO para conectar ao Supabase remotamente
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('Conectado ao banco de dados Supabase com sucesso!');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};