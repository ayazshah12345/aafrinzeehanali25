import { pool } from './db.js';

export const wipeProducts = async () => {
  try {
    await pool.query('TRUNCATE TABLE order_items, cart_items, products RESTART IDENTITY CASCADE;');
    console.log('✅ All products cleared from PostgreSQL database.');
  } catch (err) {
    console.warn('PostgreSQL DB offline or not running:', err.message);
  }
};

wipeProducts().then(() => process.exit(0));
