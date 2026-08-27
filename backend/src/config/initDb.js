import bcrypt from 'bcryptjs';
import { pool } from './db.js';

const SCHEMA_SQL_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,

  `CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category VARCHAR(100),
    stock INT DEFAULT 0,
    sku VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`,

  `CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_product_cart UNIQUE(user_id, product_id)
  )`,

  `CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_ref VARCHAR(100) UNIQUE NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    email VARCHAR(255),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    payment_status VARCHAR(100) DEFAULT 'Paid via 9629217907',
    payment_screenshot_url TEXT,
    shipping_name VARCHAR(255) NOT NULL,
    shipping_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email)`,
  `CREATE INDEX IF NOT EXISTS idx_orders_order_ref ON orders(order_ref)`,

  `CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`,
];

export const initializeDatabase = async () => {
  console.log('🔄 Initializing PostgreSQL database tables...');
  try {
    for (const stmt of SCHEMA_SQL_STATEMENTS) {
      try {
        await pool.query(stmt);
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.warn(`Statement notice: ${err.message}`);
        }
      }
    }

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
