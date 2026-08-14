import pkg from 'pg';
import { initializeDatabase } from './initDb.js';

const { Pool } = pkg;

export const setupPostgresDatabase = async () => {
  console.log('🔍 Checking PostgreSQL Database status...');
  try {
    // 1. Connect to default 'postgres' database to check if 'ecommerce_db' exists
    const sysPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'Ayaz@2006',
      database: 'postgres',
    });

    const sysClient = await sysPool.connect();
    const res = await sysClient.query("SELECT 1 FROM pg_database WHERE datname = 'ecommerce_db'");

    if (res.rows.length === 0) {
      console.log('⚙️ Database "ecommerce_db" does not exist. Creating it now...');
      await sysClient.query('CREATE DATABASE ecommerce_db;');
      console.log('🎉 Database "ecommerce_db" created successfully!');
    } else {
      console.log('✅ Database "ecommerce_db" verified!');
    }
    sysClient.release();
    await sysPool.end();

    // 2. Initialize tables (users, products, orders, cart_items)
    await initializeDatabase();
    return true;
  } catch (err) {
    console.error('❌ Error setting up PostgreSQL database:', err.message);
    return false;
  }
};

if (process.argv[1] && process.argv[1].endsWith('setupPostgres.js')) {
  setupPostgresDatabase().then(() => process.exit(0));
}
