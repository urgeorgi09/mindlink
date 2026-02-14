import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Защита от Brute-force:
 * Ограничаваме опитите за логин/регистрация от едно IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минути
  max: 10, // Максимум 10 опита
  message: { success: false, error: 'Твърде много опити. Моля, опитайте по-късно.' }
});

// Публични маршрути с вградена защита
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

/**
 * Защитени маршрути:
 * requireAuth проверява JWT токена и закача потребителя към req.user
 */
router.get('/me', requireAuth, getMe);

export default router;