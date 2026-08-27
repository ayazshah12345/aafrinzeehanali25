import { query } from '../config/db.js';

export const getCart = async (req, res) => {
  try {
    const rawUserId = req.user?.id;
    if (!rawUserId || !/^\d+$/.test(String(rawUserId))) {
      return res.json({ status: 'success', count: 0, data: { cart: [] } });
    }
    const userId = parseInt(rawUserId, 10);

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
    const rawUserId = req.user?.id;
    const { product_id, quantity = 1 } = req.body;

    if (!rawUserId || !/^\d+$/.test(String(rawUserId)) || !product_id || !/^\d+$/.test(String(product_id))) {
      return res.status(400).json({ error: 'Validation Error', message: 'Valid numeric user_id and product_id are required' });
    }

    const userId = parseInt(rawUserId, 10);
    const numericProductId = parseInt(product_id, 10);
    const numericQuantity = isNaN(parseInt(quantity, 10)) ? 1 : parseInt(quantity, 10);

    const result = await query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, numericProductId, numericQuantity]
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
    const rawUserId = req.user?.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!rawUserId || !/^\d+$/.test(String(rawUserId)) || !itemId || !/^\d+$/.test(String(itemId))) {
      return res.status(404).json({ error: 'Not Found', message: `Cart item ${itemId} not found` });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Validation Error', message: 'Quantity must be at least 1' });
    }

    const userId = parseInt(rawUserId, 10);
    const numericItemId = parseInt(itemId, 10);

    const result = await query(
      `UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *`,
      [quantity, numericItemId, userId]
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
    const rawUserId = req.user?.id;
    const { itemId } = req.params;

    if (!rawUserId || !/^\d+$/.test(String(rawUserId)) || !itemId || !/^\d+$/.test(String(itemId))) {
      return res.status(404).json({ error: 'Not Found', message: `Cart item ${itemId} not found` });
    }

    const userId = parseInt(rawUserId, 10);
    const numericItemId = parseInt(itemId, 10);

    const result = await query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id', [numericItemId, userId]);

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

export const clearCart = async (req, res) => {
  try {
    const rawUserId = req.user?.id;
    if (rawUserId && /^\d+$/.test(String(rawUserId))) {
      const userId = parseInt(rawUserId, 10);
      await query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    }

    return res.json({
      status: 'success',
      message: 'Cart cleared successfully',
    });
  } catch (err) {
    console.error('clearCart error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};
