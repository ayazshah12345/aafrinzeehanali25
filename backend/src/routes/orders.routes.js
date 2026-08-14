import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAdminOrders,
  updateOrderStatus,
} from '../controllers/orders.controller.js';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Public & Admin Order Endpoints
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/admin/all', getAdminOrders);
router.get('/:id', getOrderById);
router.put('/admin/:id/status', updateOrderStatus);
router.put('/:id/status', updateOrderStatus);

export default router;
