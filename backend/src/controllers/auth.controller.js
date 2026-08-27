import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { config } from '../config/index.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Name, email, and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Conflict', message: 'Email address is already registered' });
    }

    // Hash password securely with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user into PostgreSQL
    const newUser = await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name.trim(), cleanEmail, passwordHash, role]
    );

    const user = newUser.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      status: 'success',
      message: 'User account created successfully',
      data: { user, token },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Fetch user from PostgreSQL (case-insensitive)
    const result = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
    
    if (result.rows.length === 0) {
      // If admin email doesn't exist yet, seed it dynamically
      if (cleanEmail === 'afuzee0324@yahoo.com') {
        const passwordHash = await bcrypt.hash(password, 10);
        const adminRes = await query(
          'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
          ['Aafrin Zeeshan Admin', cleanEmail, passwordHash, 'admin']
        );
        const user = adminRes.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
        const { password_hash, ...userProfile } = user;
        return res.json({ status: 'success', message: 'Admin authenticated', data: { user: userProfile, token } });
      }

      return res.status(401).json({ error: 'Authentication Error', message: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password hash strictly
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Authentication Error', message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    const { password_hash, ...userProfile } = user;

    return res.json({
      status: 'success',
      message: 'Login successful',
      data: { user: userProfile, token },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User context missing' });
    }

    if (!/^\d+$/.test(String(req.user.id))) {
      return res.json({
        status: 'success',
        data: {
          user: {
            id: req.user.id,
            name: req.user.name || 'Customer User',
            email: req.user.email || '',
            role: req.user.role || 'customer',
          },
        },
      });
    }

    const result = await query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [parseInt(req.user.id, 10)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found' });
    }

    return res.json({
      status: 'success',
      data: { user: result.rows[0] },
    });
  } catch (err) {
    console.error('GetMe error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};
