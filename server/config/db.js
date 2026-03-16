// server/config/db.js

const { Pool } = require('pg');
require('dotenv').config(); 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SOLUÇÃO: Configuração de SSL ativada para permitir a conexão com serviços em nuvem
  ssl: {
    rejectUnauthorized: false, 
  },
});

pool.on('error', (err, client) => {
  console.error('Erro inesperado no banco de dados', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};