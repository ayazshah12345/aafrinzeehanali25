import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDatabase = async () => {
  console.log('🔄 Initializing PostgreSQL database tables...');
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    // Split SQL by statement to execute safely
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      try {
        await pool.query(stmt);
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.warn(`Statement notice: ${err.message}`);
        }
      }
    }

    // Ensure email column on orders table
    try {
      await pool.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS email VARCHAR(255)');
    } catch (e) {}

    console.log('✅ Database schema tables created/verified successfully!');

    // Seed / Ensure Admin user credentials
    const adminEmail = 'afuzee0324@yahoo.com';
    const adminPass = 'Aafrinzeeshan@25';
    const passwordHash = await bcrypt.hash(adminPass, 10);

    const existingAdmin = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
    if (existingAdmin.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['Aafrin Zeeshan Admin', adminEmail, passwordHash, 'admin']
      );
      console.log(`👤 Seeded Admin User: ${adminEmail}`);
    } else {
      await pool.query(
        'UPDATE users SET password_hash = $1, role = $2 WHERE email = $3',
        [passwordHash, 'admin', adminEmail]
      );
      console.log(`👤 Updated Admin Credentials for: ${adminEmail}`);
    }

    console.log('✨ PostgreSQL Initialization Completed Cleanly!');
    return true;
  } catch (err) {
    console.error('❌ Error during PostgreSQL initialization:', err.message);
    return false;
  }
};

if (process.argv[1] && process.argv[1].endsWith('initDb.js')) {
  initializeDatabase().then(() => process.exit(0));
}
