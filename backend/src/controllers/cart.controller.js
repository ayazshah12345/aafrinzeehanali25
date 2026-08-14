import { query } from '../config/db.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await query(
      `SELECT c.id as cart_item_id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, p.category, p.sku
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
      [userId]
    );

    return res.json({
      status: 'success',
      count: result.rows.length,
      data: { cart: result.rows },
    });
  } catch (err) {
    console.error('getCart error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Validation Error', message: 'product_id is required' });
    }

    const result = await query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, product_id, quantity]
    );

    return res.status(201).json({
      status: 'success',
      message: 'Item added to cart successfully',
      data: { cartItem: result.rows[0] },
    });
  } catch (err) {
    console.error('addToCart error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Validation Error', message: 'Quantity must be at least 1' });
    }

    const result = await query(
      `UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *`,
      [quantity, itemId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: `Cart item ${itemId} not found` });
    }

    return res.json({
      status: 'success',
      message: 'Cart item updated',
      data: { cartItem: result.rows[0] },
    });
  } catch (err) {
    console.error('updateCartItem error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const result = await query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id', [itemId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: `Cart item ${itemId} not found` });
    }

    return res.json({
      status: 'success',
      message: 'Cart item removed successfully',
    });
  } catch (err) {
    console.error('removeCartItem error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};
