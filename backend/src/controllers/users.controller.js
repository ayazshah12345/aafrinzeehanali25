import { query } from '../config/db.js';

export const getAllUsers = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return res.json({
      status: 'success',
      count: result.rows.length,
      data: { users: result.rows },
    });
  } catch (err) {
    console.error('getAllUsers error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
      return res.status(404).json({ error: 'Not Found', message: `User ${id} not found` });
    }

    const result = await query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [parseInt(id, 10)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: `User ${id} not found` });
    }

    return res.json({
      status: 'success',
      data: { user: result.rows[0] },
    });
  } catch (err) {
    console.error('getUserById error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
      return res.status(404).json({ error: 'Not Found', message: `User ${id} not found` });
    }

    const { name, email, role } = req.body;
    const cleanEmail = email ? email.trim().toLowerCase() : undefined;

    const result = await query(
      `UPDATE users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           role = COALESCE($3, role)
       WHERE id = $4
       RETURNING id, name, email, role, created_at`,
      [name ? name.trim() : null, cleanEmail || null, role || null, parseInt(id, 10)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: `User ${id} not found` });
    }

    return res.json({
      status: 'success',
      message: 'User updated successfully',
      data: { user: result.rows[0] },
    });
  } catch (err) {
    console.error('updateUser error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
      return res.status(404).json({ error: 'Not Found', message: `User ${id} not found` });
    }

    const numericId = parseInt(id, 10);
    // Disallow deleting the primary admin
    const checkRes = await query('SELECT email FROM users WHERE id = $1', [numericId]);
    if (checkRes.rows.length > 0 && checkRes.rows[0].email === 'afuzee0324@yahoo.com') {
      return res.status(400).json({ error: 'Bad Request', message: 'Cannot delete primary admin account' });
    }

    await query('UPDATE orders SET user_id = NULL WHERE user_id = $1', [numericId]);
    await query('DELETE FROM cart_items WHERE user_id = $1', [numericId]);
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [numericId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: `User ${id} not found` });
    }

    return res.json({
      status: 'success',
      message: `User ${id} deleted successfully`,
    });
  } catch (err) {
    console.error('deleteUser error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};
