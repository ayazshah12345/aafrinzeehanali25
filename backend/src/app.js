import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js';
import cartRoutes from './routes/cart.routes.js';
import ordersRoutes from './routes/orders.routes.js';

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);

// Admin route aliases matching PROMPT 2 requirements
app.use('/api/admin/products', productsRoutes);
app.use('/api/admin/orders', ordersRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Afsoo Commerce PostgreSQL REST API Server',
    healthCheck: '/api/health',
    documentation: {
      auth: '/api/auth/register, /api/auth/login, /api/auth/me',
      products: '/api/products',
      orders: '/api/orders',
      cart: '/api/cart',
    },
  });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong',
  });
});

export default app;
