const { Pool } = require('pg');
require('dotenv').config({ path: __dirname + '/.env' });

const isProduction = process.env.NODE_ENV === 'production';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database!');
});

pool.on('error', (err) => {
  console.error('Error connecting to PostgreSQL database:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};