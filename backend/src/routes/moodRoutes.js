import express from 'express';
import { getEmotions, createEmotion } from '../controllers/emotionController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Всички маршрути за емоции изискват логнат потребител
router.use(requireAuth);

/**
 * GET /api/emotions
 * Забележка: Вече не предаваме userId в URL. 
 * Контролерът ще вземе ID-то от req.user.id (сигурност).
 */
router.get('/', getEmotions);

/**
 * POST /api/emotions
 * Валидираме нивата на настроение, енергия и тревожност (1-5)
 */
router.post(
  '/',
  [
    body('mood').isInt({ min: 1, max: 5 }).withMessage('Mood must be between 1 and 5'),
    body('energy').isInt({ min: 1, max: 5 }).withMessage('Energy must be between 1 and 5'),
    body('anxiety').isInt({ min: 1, max: 5 }).withMessage('Anxiety must be between 1 and 5'),
    body('date').optional().isDate().withMessage('Invalid date format')
  ],
  createEmotion
);

export default router;