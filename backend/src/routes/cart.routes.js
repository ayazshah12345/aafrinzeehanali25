import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../controllers/cart.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeCartItem);

export default router;
