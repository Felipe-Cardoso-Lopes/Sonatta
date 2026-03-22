// server/config/db.js
const { Pool } = require('pg');
require('dotenv').config(); 

// O Render define a variável NODE_ENV como 'production' automaticamente na nuvem
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Usa SSL na nuvem, mas desativa no localhost para o Pooler do Supabase funcionar
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err, client) => {
  console.error('Erro inesperado no banco de dados', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};