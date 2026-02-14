import express from 'express';
import { getEmotions, createEmotion } from '../controllers/emotionController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Всички маршрути за емоции изискват логнат потребител
router.use(requireAuth);

/**
 * GET /api/emotions/:userId
 * Защитен маршрут - само собственикът може да вижда данните си
 */
router.get('/:userId', getEmotions);

/**
 * POST /api/emotions
 * С вградена валидация на нивата (1-5)
 */
router.post(
  '/',
  [
    body('mood').isInt({ min: 1, max: 5 }).withMessage('Mood must be between 1 and 5'),
    body('energy').isInt({ min: 1, max: 5 }).withMessage('Energy must be between 1 and 5'),
    body('note').optional().isString().trim()
  ],
  createEmotion
);

export default router;