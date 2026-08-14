import { pool } from './db.js';

export const wipeAllSampleData = async () => {
  console.log('🧹 Starting cleanup of all sample products, cart items, and demo orders...');
  try {
    // Delete cart items
    const cartRes = await pool.query('DELETE FROM cart_items');
    console.log(`🗑️ Cleared cart_items (${cartRes.rowCount} rows)`);

    // Delete order items & orders
    const orderItemsRes = await pool.query('DELETE FROM order_items');
    console.log(`🗑️ Cleared order_items (${orderItemsRes.rowCount} rows)`);

    const ordersRes = await pool.query('DELETE FROM orders');
    console.log(`🗑️ Cleared orders (${ordersRes.rowCount} rows)`);

    // Delete products
    const productsRes = await pool.query('DELETE FROM products');
    console.log(`🗑️ Cleared products (${productsRes.rowCount} rows)`);

    // Delete non-admin demo users if any exist
    const usersRes = await pool.query("DELETE FROM users WHERE role != 'admin'");
    console.log(`🗑️ Cleared non-admin users (${usersRes.rowCount} rows)`);

    // Reset sequences where available
    try {
      await pool.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
      await pool.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
      await pool.query('ALTER SEQUENCE order_items_id_seq RESTART WITH 1');
      await pool.query('ALTER SEQUENCE cart_items_id_seq RESTART WITH 1');
      console.log('🔄 Reset auto-increment sequences back to 1.');
    } catch (seqErr) {
      console.log('ℹ️ Sequences reset skipped or handled automatically.');
    }

    console.log('✨ All sample products, orders, cart items, and demo data successfully wiped!');
    return true;
  } catch (err) {
    console.error('❌ Error wiping sample data from database:', err.message);
    throw err;
  }
};

if (process.argv[1] && process.argv[1].endsWith('wipeDatabase.js')) {
  wipeAllSampleData()
    .then(() => {
      console.log('\n🎉 Clean wipe complete! The website is 100% fresh and empty.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
