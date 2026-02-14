import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login } from '../controllers/authController.js';
// Пример за библиотека за валидация (express-validator)
import { body, validationResult } from 'express-validator';

const router = express.Router();

/**
 * Ограничаваме опитите за логин (Защита от Brute-force)
 * 5 опита на всеки 15 минути за конкретно IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: { success: false, error: "Твърде много опити. Моля, опитайте след 15 минути." }
});

/**
 * Валидация на данни (Middleware)
 */
const validateRegister = [
  body('email').isEmail().withMessage('Невалиден имейл формат'),
  body('password').isLength({ min: 8 }).withMessage('Паролата трябва да е поне 8 символа'),
  body('username').notEmpty().trim().withMessage('Потребителското име е задължително')
];

// Маршрути
router.post('/register', validateRegister, register);
router.post('/login', authLimiter, login);

export default router;