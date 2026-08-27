import { query } from '../config/db.js';

export const createOrder = async (req, res) => {
  try {
    const {
      shipping_name,
      shipping_phone,
      shipping_address,
      email,
      user_id,
      product_id,
      quantity = 1,
      total_amount,
      payment_status = 'Paid via 9629217907',
      items = [],
    } = req.body;

    if (!shipping_name || !shipping_phone || !shipping_address) {
      return res.status(400).json({ error: 'Validation Error', message: 'Shipping name, phone, and address are required' });
    }

    const customerEmail = email || (req.user ? req.user.email : null);
    
    // Safely parse numeric IDs for PostgreSQL
    const numericUserId = user_id && !isNaN(parseInt(user_id, 10))
      ? parseInt(user_id, 10)
      : (req.user && req.user.id && !isNaN(parseInt(req.user.id, 10)) ? parseInt(req.user.id, 10) : null);

    const numericProductId = product_id && !isNaN(parseInt(product_id, 10)) ? parseInt(product_id, 10) : null;
    const numericQuantity = isNaN(parseInt(quantity, 10)) ? 1 : parseInt(quantity, 10);
    const parsedTotal = parseFloat(total_amount);
    let calculatedTotal = isNaN(parsedTotal) ? 0 : parsedTotal;
    let productPrice = 0;

    if (numericProductId && (!items || items.length === 0)) {
      const prodRes = await query('SELECT price FROM products WHERE id = $1', [numericProductId]);
      if (prodRes.rows.length > 0) {
        productPrice = parseFloat(prodRes.rows[0].price);
        calculatedTotal = calculatedTotal || productPrice * numericQuantity;
      }
    }

    const order_ref = req.body.order_ref && String(req.body.order_ref).startsWith('AFS-')
      ? req.body.order_ref
      : `AFS-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderRes = await query(
      `INSERT INTO orders (order_ref, user_id, email, total_amount, status, payment_status, shipping_name, shipping_phone, shipping_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        order_ref,
        numericUserId,
        customerEmail,
        calculatedTotal || 1999.00,
        'Pending',
        payment_status,
        shipping_name.trim(),
        shipping_phone.trim(),
        shipping_address.trim(),
      ]
    );

    const order = orderRes.rows[0];

    // Process multiple items array if provided
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const itemPid = item.product_id && !isNaN(parseInt(item.product_id, 10)) ? parseInt(item.product_id, 10) : null;
        const itemQty = isNaN(parseInt(item.quantity, 10)) ? 1 : parseInt(item.quantity, 10);
        const itemPrice = parseFloat(item.price || 0);
        if (itemPid) {
          await query(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
            [order.id, itemPid, itemQty, itemPrice]
          );
        }
      }
    } else if (numericProductId) {
      await query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, numericProductId, numericQuantity, productPrice || calculatedTotal]
      );
    }

    return res.status(201).json({
      status: 'success',
      message: 'Order placed successfully in PostgreSQL database with Pending status',
      data: { order },
    });
  } catch (err) {
    console.error('createOrder error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';
    const explicitUserId = req.query.user_id
      ? parseInt(req.query.user_id, 10)
      : (!isAdmin && req.user && req.user.id && /^\d+$/.test(String(req.user.id)) ? parseInt(req.user.id, 10) : null);
    const explicitEmail = req.query.email
      ? req.query.email.trim().toLowerCase()
      : (!isAdmin && req.user && req.user.email ? req.user.email.trim().toLowerCase() : null);

    let sql = `
      SELECT o.*, p.name AS product_name, p.image_url AS product_image
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON oi.product_id = p.id
    `;
    const params = [];
    const conditions = [];

    if (explicitUserId && !isNaN(explicitUserId)) {
      params.push(explicitUserId);
      conditions.push(`o.user_id = $${params.length}`);
    }

    if (explicitEmail) {
      params.push(explicitEmail);
      conditions.push(`LOWER(o.email) = $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' OR ')}`;
    }

    sql += ` ORDER BY o.created_at DESC`;

    const result = await query(sql, params);
    return res.json({
      status: 'success',
      count: result.rows.length,
      data: { orders: result.rows },
    });
  } catch (err) {
    console.error('getUserOrders error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const isNumeric = /^\d+$/.test(id);

    const orderRes = isNumeric
      ? await query('SELECT * FROM orders WHERE id = $1 OR order_ref = $2', [parseInt(id, 10), id])
      : await query('SELECT * FROM orders WHERE order_ref = $1', [id]);

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: `Order ${id} not found` });
    }

    const order = orderRes.rows[0];
    const itemsRes = await query(
      `SELECT oi.*, p.name as product_name, p.image_url
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order.id]
    );

    return res.json({
      status: 'success',
      data: {
        order,
        items: itemsRes.rows,
      },
    });
  } catch (err) {
    console.error('getOrderById error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const sql = `
      SELECT o.*, p.name AS product_name, p.image_url AS product_image
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON oi.product_id = p.id
      ORDER BY o.created_at DESC
    `;
    const result = await query(sql);
    return res.json({
      status: 'success',
      count: result.rows.length,
      data: { orders: result.rows },
    });
  } catch (err) {
    console.error('getAdminOrders error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Order Confirmed', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const isNumeric = /^\d+$/.test(id);
    const result = isNumeric
      ? await query(
          'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 OR order_ref = $3 RETURNING *',
          [status, parseInt(id, 10), id]
        )
      : await query(
          'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_ref = $2 RETURNING *',
          [status, id]
        );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: `Order ${id} not found` });
    }

    return res.json({
      status: 'success',
      message: `Order status updated to '${status}'`,
      data: { order: result.rows[0] },
    });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const clearAllOrders = async (req, res) => {
  try {
    await query('DELETE FROM order_items');
    await query('DELETE FROM orders');
    return res.json({
      status: 'success',
      message: 'All sales information and order records have been cleared successfully.',
    });
  } catch (err) {
    console.error('clearAllOrders error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

