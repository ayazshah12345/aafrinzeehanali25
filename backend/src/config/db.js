import pkg from 'pg';
import { config } from './index.js';

const { Pool } = pkg;

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

export const query = (text, params) => pool.query(text, params);

export const checkDbConnection = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as current_time, current_database() as db_name');
    client.release();
    return {
      connected: true,
      time: res.rows[0].current_time,
      database: res.rows[0].db_name,
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
    };
  }
};

export default pool;
