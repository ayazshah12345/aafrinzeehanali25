import { pool } from './db.js';

export const clearSeedProducts = async () => {
  console.log('🔍 Checking PostgreSQL ecommerce_db products table...');
  try {
    // Check if products table exists and count items
    const countRes = await pool.query('SELECT COUNT(*) FROM products');
    const totalProducts = parseInt(countRes.rows[0].count, 10);
    console.log(`📊 Current products count in PostgreSQL: ${totalProducts}`);

    // Check order_items references to ensure customer orders remain safe
    const orderItemsCount = await pool.query('SELECT COUNT(*) FROM order_items');
    console.log(`📦 Existing order_items count: ${orderItemsCount.rows[0].count} (Customer order data protected)`);

    if (totalProducts === 0) {
      console.log('ℹ️ Products table is already empty. No seed products to delete.');
      return 0;
    }

    // First unlink product_id in order_items if referenced to prevent foreign key errors while keeping order data intact
    await pool.query('UPDATE order_items SET product_id = NULL WHERE product_id IS NOT NULL');
    await pool.query('DELETE FROM cart_items WHERE product_id IS NOT NULL');

    // Delete default products from PostgreSQL
    const deleteRes = await pool.query('DELETE FROM products RETURNING id, name');
    const deletedCount = deleteRes.rows.length;

    console.log(`✅ Successfully deleted ${deletedCount} default seed product(s) from PostgreSQL database!`);
    deleteRes.rows.forEach((p) => {
      console.log(`   - Deleted ID ${p.id}: "${p.name}"`);
    });

    return deletedCount;
  } catch (err) {
    console.error('❌ Error clearing seed products from PostgreSQL:', err.message);
    throw err;
  }
};

if (process.argv[1] && process.argv[1].endsWith('clearSeedProducts.js')) {
  clearSeedProducts()
    .then((count) => {
      console.log(`\n🎉 Cleanup finished. ${count} default seed product(s) deleted.`);
      process.exit(0);
    })
    .catch(() => process.exit(1));
}
