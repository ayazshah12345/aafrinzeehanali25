import { pool } from './db.js';

export const verifyPostgres = async () => {
  console.log('🧪 Testing PostgreSQL insert & read operations...');
  try {
    const insertRes = await pool.query(
      'INSERT INTO products (name, description, price, category, stock, sku) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      ['PostgreSQL Direct Product', 'Tested stored item in PostgreSQL database', 299.99, 'Test', 15, 'PG-TEST-100']
    );
    console.log('✅ INSERT SUCCESSFUL! Created Product ID:', insertRes.rows[0].id);

    const selectRes = await pool.query('SELECT * FROM products');
    console.log(`📊 Total Products stored in PostgreSQL: ${selectRes.rows.length}`);

    // Clean up test product
    await pool.query('DELETE FROM products WHERE id = $1', [insertRes.rows[0].id]);
    console.log('🧹 Cleaned up test item cleanly!');
    return true;
  } catch (err) {
    console.error('❌ PostgreSQL Insert Verification Error:', err.message);
    return false;
  }
};

verifyPostgres().then(() => process.exit(0));
