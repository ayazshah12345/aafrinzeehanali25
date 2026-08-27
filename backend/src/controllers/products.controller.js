import { query } from '../config/db.js';

const formatProduct = (row) => ({
  ...row,
  id: String(row.id),
  price: parseFloat(row.price),
  image: row.image_url || row.image || '',
  image_url: row.image_url || row.image || '',
});

export const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    sql += ' ORDER BY id DESC';

    const result = await query(sql, params);
    const products = result.rows.map(formatProduct);

    return res.json({
      status: 'success',
      count: products.length,
      data: { products },
    });
  } catch (err) {
    console.error('getAllProducts error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
      return res.status(404).json({ error: 'Not Found', message: `Product with ID ${id} not found` });
    }

    const result = await query('SELECT * FROM products WHERE id = $1', [parseInt(id, 10)]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: `Product with ID ${id} not found` });
    }

    return res.json({
      status: 'success',
      data: { product: formatProduct(result.rows[0]) },
    });
  } catch (err) {
    console.error('getProductById error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, image_url, category, stock, sku } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Validation Error', message: 'Product name is required' });
    }

    const parsedPrice = parseFloat(price);
    const numericPrice = isNaN(parsedPrice) ? 0 : parsedPrice;
    const parsedStock = parseInt(stock, 10);
    const numericStock = isNaN(parsedStock) ? 0 : parsedStock;

    const finalImageUrl = image_url || image || '';
    const generatedSku = sku && sku.trim() !== '' ? sku : `SKU-${Math.floor(100 + Math.random() * 900)}`;

    const result = await query(
      'INSERT INTO products (name, description, price, image_url, category, stock, sku) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name.trim(), description || '', numericPrice, finalImageUrl, category || 'General', numericStock, generatedSku]
    );

    return res.status(201).json({
      status: 'success',
      message: 'Product created successfully in PostgreSQL database',
      data: { product: formatProduct(result.rows[0]) },
    });
  } catch (err) {
    console.error('createProduct error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
      return res.status(404).json({ error: 'Not Found', message: `Product with ID ${id} not found` });
    }

    const numericId = parseInt(id, 10);
    const { name, description, price, image, image_url, category, stock, sku } = req.body;

    const finalImageUrl = image_url || image;
    const numericPrice = price !== undefined ? parseFloat(price) : undefined;
    const numericStock = stock !== undefined ? parseInt(stock, 10) : undefined;

    const result = await query(
      `UPDATE products 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           image_url = COALESCE($4, image_url),
           category = COALESCE($5, category),
           stock = COALESCE($6, stock),
           sku = COALESCE($7, sku),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`,
      [name, description, numericPrice, finalImageUrl, category, numericStock, sku, numericId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: `Product with ID ${id} not found` });
    }

    return res.json({
      status: 'success',
      message: 'Product updated successfully in PostgreSQL database',
      data: { product: formatProduct(result.rows[0]) },
    });
  } catch (err) {
    console.error('updateProduct error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
      return res.status(404).json({ error: 'Not Found', message: `Product with ID ${id} not found` });
    }

    const numericId = parseInt(id, 10);

    // First clear foreign key references in order_items / cart_items
    await query('UPDATE order_items SET product_id = NULL WHERE product_id = $1', [numericId]);
    await query('DELETE FROM cart_items WHERE product_id = $1', [numericId]);

    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id', [numericId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: `Product with ID ${id} not found` });
    }

    return res.json({
      status: 'success',
      message: `Product with ID ${id} deleted successfully from PostgreSQL database`,
    });
  } catch (err) {
    console.error('deleteProduct error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};
