import { Router } from 'express';
import { checkDbConnection } from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
  const dbStatus = await checkDbConnection();

  res.status(dbStatus.connected ? 200 : 500).json({
    status: dbStatus.connected ? 'success' : 'error',
    message: dbStatus.connected
      ? 'Backend API and PostgreSQL database are healthy and connected'
      : 'Backend is running, but PostgreSQL connection failed',
    backend: 'healthy',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  });
});

export default router;
